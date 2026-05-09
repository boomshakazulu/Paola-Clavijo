import { useEffect, useRef, useState } from "react";
import HomePage from "./HomePage";
import ShowcasePage from "./ShowcasePage";
import ReadMorePage from "./ReadMorePage";
import PortfolioShowcasePage from "./PortfolioShowcasePage";
import FluidBackground from "../components/FluidBackground";

export default function LandingPage() {
  const containerRef = useRef(null);
  const [showFluid, setShowFluid] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.location.hash !== "#showcase") return;
    const showcaseSection = containerRef.current.querySelector("#showcase");
    if (!showcaseSection) return;
    showcaseSection.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateFluidVisibility = () => {
      setShowFluid(container.scrollTop >= window.innerHeight - 2);
      setSnapEnabled(container.scrollTop < window.innerHeight - 2);
    };

    updateFluidVisibility();
    container.addEventListener("scroll", updateFluidVisibility, { passive: true });
    window.addEventListener("resize", updateFluidVisibility);

    return () => {
      container.removeEventListener("scroll", updateFluidVisibility);
      window.removeEventListener("resize", updateFluidVisibility);
    };
  }, []);

  return (
    <>
      <style>{`
        .snap-container::-webkit-scrollbar { display: none; }
        .snap-container { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {showFluid && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <FluidBackground />
        </div>
      )}
      <div
        ref={containerRef}
        className={`snap-container relative z-10 h-screen overflow-y-scroll ${
          snapEnabled ? "snap-y snap-mandatory" : ""
        }`}
        style={{ scrollBehavior: "auto" }}
      >
        <section id="home" className="h-screen snap-start overflow-hidden">
          <HomePage />
        </section>

        <section id="showcase" className="h-screen snap-start overflow-hidden">
          <ShowcasePage />
        </section>
        <section id="read-more">
          <ReadMorePage />
        </section>
        <section id="portfolio" className="snap-start">
          <PortfolioShowcasePage />
        </section>
      </div>
    </>
  );
}
