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

      const dispatchPointer = (type, { x, y }, pointerType = "mouse") => {
        canvas.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            clientX: x,
            clientY: y,
            pointerId: pointerType === "touch" ? 2 : 1,
            pointerType,
            isPrimary: true,
            buttons: pointerType === "touch" ? 1 : 0,
            pressure: pointerType === "touch" ? 0.5 : 0,
          })
        );
      };

      const handleMouseMove = (event) => {
        setCursor({ x: event.clientX, y: event.clientY, visible: true });
        dispatchPointer("pointermove", {
          x: event.clientX,
          y: event.clientY,
        });
      };

      const handleMouseLeave = () => {
        setCursor((prev) => ({ ...prev, visible: false }));
        dispatchPointer("pointerleave", { x: 0, y: 0 });
      };

      const getTouchPoint = (event) => {
        const touch = event.touches[0] || event.changedTouches[0];
        return touch ? { x: touch.clientX, y: touch.clientY } : null;
      };

      const handleTouchStart = (event) => {
        const point = getTouchPoint(event);
        if (!point) return;

        setCursor({ ...point, visible: true });
        dispatchPointer("pointerdown", point, "touch");
        dispatchPointer("pointermove", point, "touch");
      };

      const handleTouchMove = (event) => {
        const point = getTouchPoint(event);
        if (!point) return;

        setCursor({ ...point, visible: true });
        dispatchPointer("pointermove", point, "touch");
      };

      const handleTouchEnd = (event) => {
        const point = getTouchPoint(event) || { x: 0, y: 0 };
        setCursor((prev) => ({ ...prev, visible: false }));
        dispatchPointer("pointerup", point, "touch");
        dispatchPointer("pointerleave", point, "touch");
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseout", handleMouseLeave);
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

      cleanup = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseout", handleMouseLeave);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
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
