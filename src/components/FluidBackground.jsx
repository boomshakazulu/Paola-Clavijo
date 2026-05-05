import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

export default function FluidBackground() {
  return (
    <div className="h-screen w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ height: "100vh", width: "100%" }}
      >
        <EffectComposer>
          <Fluid
            fluidColor="#9cc9ff"
            force={1.2}
            radius={0.38}
            curl={12}
            swirl={20}
            intensity={8}
            distortion={1}
            velocityDissipation={0.96}
            densityDissipation={0.92}
            pressure={0.8}
            rainbow={false}
            showBackground={false}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
