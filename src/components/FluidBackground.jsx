import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

export default function FluidBackground() {
  const rootRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    let retryId;
    let cleanup = () => {};

    const attach = () => {
      const canvas = rootRef.current?.querySelector("canvas");
      if (!canvas) {
        retryId = window.setTimeout(attach, 50);
        return;
      }

      const handleMouseMove = (event) => {
        setCursor({ x: event.clientX, y: event.clientY, visible: true });
        canvas.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            clientX: event.clientX,
            clientY: event.clientY,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
          })
        );
      };

      const handleMouseLeave = () => {
        setCursor((prev) => ({ ...prev, visible: false }));
        canvas.dispatchEvent(
          new PointerEvent("pointerleave", {
            bubbles: true,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
          })
        );
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseout", handleMouseLeave);

      cleanup = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseout", handleMouseLeave);
      };
    };

    attach();

    return () => {
      if (retryId) window.clearTimeout(retryId);
      cleanup();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-full w-full cursor-none">
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
