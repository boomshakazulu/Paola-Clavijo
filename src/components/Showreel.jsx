import { useEffect, useRef } from "react";

const Showreel = ({ src, poster }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;

    const SLICE = 0.18; // ← was 0.18, now a tighter strip
    const GAP = 20;
    const INSET = 2; // px narrower each side than the video

    const resize = () => {
      const elW = video.clientWidth;
      const elH = video.clientHeight;
      const videoAR = video.videoWidth / video.videoHeight;
      const elAR = elW / elH;

      // Actual rendered size inside the contain box
      let renderedW, renderedH;
      if (videoAR > elAR) {
        // letterboxed top/bottom
        renderedW = elW;
        renderedH = elW / videoAR;
      } else {
        // pillarboxed left/right
        renderedH = elH;
        renderedW = elH * videoAR;
      }

      const offsetX = (elW - renderedW) / 2;
      const offsetY = (elH - renderedH) / 2;
      const sliceH = Math.round(renderedH * SLICE);

      canvas.width = renderedW - INSET * 2;
      canvas.height = sliceH;
      canvas.style.width = renderedW - INSET * 2 + "px";
      canvas.style.height = sliceH + "px";
      canvas.style.top = offsetY + renderedH + GAP + "px";
      canvas.style.left = offsetX + INSET + "px";
    };

    const draw = () => {
      if (!video.videoWidth) return;
      const w = canvas.width;
      const h = canvas.height;

      // Source: bottom SLICE of the video
      const srcH = video.videoHeight * SLICE;
      const srcY = video.videoHeight - srcH;
      const dstH = srcH * (w / video.videoWidth);

      ctx.clearRect(0, 0, w, h);

      // Draw flipped
      ctx.save();
      ctx.translate(0, dstH);
      ctx.scale(1, -1);
      ctx.drawImage(video, 0, srcY, video.videoWidth, srcH, 0, 0, w, dstH);
      ctx.restore();

      // destination-out
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(0,0,0,0.3)"); //
      grad.addColorStop(0.5, "rgba(0,0,0,0.9)"); // nearly gone halfway
      grad.addColorStop(1, "rgba(0,0,0,1)"); // fully erased at bottom
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      resize();
      draw();
    };

    video.addEventListener("loadeddata", start);
    window.addEventListener("resize", resize);

    // Horizontal-only tilt
    let targetY = 0,
      currentY = 0;
    const MAX_TILT = 6;

    const onMouseMove = (e) => {
      targetY = -((e.clientX / window.innerWidth) * 2 - 1) * MAX_TILT;
    };
    const onMouseLeave = () => {
      targetY = 0;
    };

    const tilt = () => {
      currentY += (targetY - currentY) * 0.08;
      wrap.style.transform = `perspective(900px) rotateY(${currentY}deg)`;
      requestAnimationFrame(tilt);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    tilt();

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadeddata", start);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", willChange: "transform", height: "100%" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          pointerEvents: "none",
          filter: "blur(6px)",
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export default Showreel;
