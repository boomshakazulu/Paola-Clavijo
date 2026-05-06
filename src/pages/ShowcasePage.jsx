import FluidBackground from "../components/FluidBackground";
import Showreel from "../components/Showreel";
import MarqueeText from "../components/MarqueeText";

export default function ShowcasePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FluidBackground />
      <MarqueeText />
      <section className="flex flex-col absolute inset-0 z-10 items-center justify-center pointer-events-none">
        <div className="w-full max-w-4xl h-[400px]">
          <Showreel src="/videos/ShowreelVideo.webm" />
        </div>
      </section>
    </main>
  );
}
