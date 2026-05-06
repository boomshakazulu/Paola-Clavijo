import { useEffect, useRef } from "react";

const SIM_SIZE = 256;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "Shader compilation failed");
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log || "Program link failed");
  }
  return program;
}

function createRenderTarget(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  return { texture, framebuffer, width, height };
}

export default function FogWebGL() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return undefined;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const simFragmentSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_prev;
      uniform vec2 u_texel;
      uniform float u_dt;

      vec2 decodeVel(vec4 c) { return (c.rg - 0.5) * 2.0; }
      vec4 encodeState(vec2 vel, float clear) {
        return vec4(vel * 0.5 + 0.5, clear, 1.0);
      }

      void main() {
        vec4 prev = texture2D(u_prev, v_uv);
        vec2 vel = decodeVel(prev);
        float clear = prev.b;

        vec2 backUv = clamp(v_uv - vel * u_dt * 0.8, vec2(0.001), vec2(0.999));
        vec4 advected = texture2D(u_prev, backUv);
        vec2 advVel = decodeVel(advected);
        float advClear = advected.b;

        vec2 n = decodeVel(texture2D(u_prev, v_uv + vec2(0.0, u_texel.y)));
        vec2 s = decodeVel(texture2D(u_prev, v_uv - vec2(0.0, u_texel.y)));
        vec2 e = decodeVel(texture2D(u_prev, v_uv + vec2(u_texel.x, 0.0)));
        vec2 w = decodeVel(texture2D(u_prev, v_uv - vec2(u_texel.x, 0.0)));

        vel = mix(advVel, (n + s + e + w) * 0.25, 0.18);
        vel *= 0.985;

        float cN = texture2D(u_prev, v_uv + vec2(0.0, u_texel.y)).b;
        float cS = texture2D(u_prev, v_uv - vec2(0.0, u_texel.y)).b;
        float cE = texture2D(u_prev, v_uv + vec2(u_texel.x, 0.0)).b;
        float cW = texture2D(u_prev, v_uv - vec2(u_texel.x, 0.0)).b;
        clear = mix(prev.b, (cN + cS + cE + cW) * 0.25, 0.08);
        clear *= 0.93;
        clear = clamp(clear, 0.0, 1.0);

        vel = clamp(vel, vec2(-1.0), vec2(1.0));
        gl_FragColor = encodeState(vel, clear);
      }
    `;

    const renderFragmentSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_state;
      uniform float u_time;
      uniform vec2 u_aspect;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amp * noise(p);
          p = p * 2.03 + vec2(9.7, 6.3);
          amp *= 0.5;
        }
        return value;
      }

      void main() {
        vec4 state = texture2D(u_state, v_uv);
        vec2 flow = (state.rg - 0.5) * 2.0;
        float clear = state.b;

        vec2 uv = v_uv;
        uv.x *= u_aspect.x / max(u_aspect.y, 0.0001);

        vec2 driftA = vec2(u_time * 0.09, -u_time * 0.038);
        vec2 driftB = vec2(-u_time * 0.06,  u_time * 0.075);
        vec2 warpUv = uv + flow * 0.1;

        float n1 = fbm(warpUv * 2.2 + driftA);
        float n2 = fbm(warpUv * 3.6 + driftB);
        float fog = smoothstep(0.45, 0.84, mix(n1, n2, 0.45));
        float alpha = fog * 0.52;
        alpha *= (1.0 - clear * 0.65);

        gl_FragColor = vec4(vec3(1.0), alpha);
      }
    `;

    const simProgram = createProgram(gl, vertexSource, simFragmentSource);
    const renderProgram = createProgram(gl, vertexSource, renderFragmentSource);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const simA = createRenderTarget(gl, SIM_SIZE, SIM_SIZE);
    const simB = createRenderTarget(gl, SIM_SIZE, SIM_SIZE);
    let readTarget = simA;
    let writeTarget = simB;

    gl.bindFramebuffer(gl.FRAMEBUFFER, readTarget.framebuffer);
    gl.viewport(0, 0, SIM_SIZE, SIM_SIZE);
    gl.clearColor(0.5, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let rafId = 0;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const drawFullscreen = (program) => {
      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "a_position");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const animate = (time) => {
      resize();

      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;
      gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.framebuffer);
      gl.viewport(0, 0, SIM_SIZE, SIM_SIZE);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, readTarget.texture);
      gl.useProgram(simProgram);
      gl.uniform1i(gl.getUniformLocation(simProgram, "u_prev"), 0);
      gl.uniform2f(
        gl.getUniformLocation(simProgram, "u_texel"),
        1 / SIM_SIZE,
        1 / SIM_SIZE,
      );
      gl.uniform1f(gl.getUniformLocation(simProgram, "u_dt"), dt * 60.0);
      drawFullscreen(simProgram);

      const temp = readTarget;
      readTarget = writeTarget;
      writeTarget = temp;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, readTarget.texture);
      gl.useProgram(renderProgram);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "u_state"), 0);
      gl.uniform1f(
        gl.getUniformLocation(renderProgram, "u_time"),
        time * 0.001,
      );
      gl.uniform2f(
        gl.getUniformLocation(renderProgram, "u_aspect"),
        canvas.width,
        canvas.height,
      );
      drawFullscreen(renderProgram);
      gl.disable(gl.BLEND);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteFramebuffer(simA.framebuffer);
      gl.deleteFramebuffer(simB.framebuffer);
      gl.deleteTexture(simA.texture);
      gl.deleteTexture(simB.texture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(simProgram);
      gl.deleteProgram(renderProgram);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-[2] h-full w-full"
    />
  );
}
