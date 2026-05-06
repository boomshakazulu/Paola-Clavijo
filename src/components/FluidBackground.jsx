import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

export default function FluidBackground() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  return (
    <div
      className="relative h-screen w-full cursor-none"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          visible: true,
        });
      }}
      onMouseEnter={() => setCursor((prev) => ({ ...prev, visible: true }))}
      onMouseLeave={() => setCursor((prev) => ({ ...prev, visible: false }))}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ height: "100vh", width: "100%" }}
      >
        <EffectComposer>
          <Fluid
            fluidColor="#9cc9ff"
            force={1.2}
            radius={0.2}
            curl={12}
            swirl={20}
            intensity={8}
            distortion={1}
            velocityDissipation={0.98}
            densityDissipation={0.95}
            pressure={0.8}
            rainbow={true}
            showBackground={false}
          />
        </EffectComposer>
      </Canvas>
      {cursor.visible && (
        <div
          className="pointer-events-none absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-white/20"
          style={{ left: cursor.x, top: cursor.y }}
        />
      )}
    </div>
  );
}
