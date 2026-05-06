import { useEffect, useRef } from "react";
import HomePage from "./HomePage";
import ShowcasePage from "./ShowcasePage";

export default function LandingPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.location.hash !== "#showcase") return;
    const showcaseSection = containerRef.current.querySelector("#showcase");
    if (!showcaseSection) return;
    showcaseSection.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return (
    <>
      <style>{`
        .snap-container::-webkit-scrollbar { display: none; }
        .snap-container { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div
        ref={containerRef}
        className="snap-container h-screen snap-y snap-mandatory overflow-y-scroll"
        style={{ scrollBehavior: "auto" }}
      >
        <section id="home" className="h-screen snap-start overflow-hidden">
          <HomePage />
        </section>
        <section id="showcase" className="h-screen snap-start overflow-hidden">
          <ShowcasePage />
        </section>
      </div>
    </>
  );
}
