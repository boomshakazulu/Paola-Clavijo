import { useEffect, useRef, useState } from "react";
import HomePage from "./HomePage";
import ShowcasePage from "./ShowcasePage";
import ReadMorePage from "./ReadMorePage";
import PortfolioShowcasePage from "./PortfolioShowcasePage";
import FluidBackground from "../components/FluidBackground";
import { sanityQuery } from "../lib/sanity";

const fallbackHomeImage =
  "/images/6261721a88480c276d3e17f3d76add8e82d0c1db.png";

const fallbackShowreel = "/videos/ShowreelVideo.webm";

export default function LandingPage() {
  const containerRef = useRef(null);

  const [showFluid, setShowFluid] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);

  const [homeImage, setHomeImage] = useState(fallbackHomeImage);
  const [showFog, setShowFog] = useState(true);

  const [showreelVideo, setShowreelVideo] = useState(fallbackShowreel);
  const [albums, setAlbums] = useState([]);

  // ----------------------------
  // Scroll / UI behavior
  // ----------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    if (window.location.hash !== "#showcase") return;

    const showcaseSection = containerRef.current.querySelector("#showcase");

    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateFluidVisibility = () => {
      setShowFluid(container.scrollTop >= window.innerHeight - 2);
      setSnapEnabled(container.scrollTop < window.innerHeight - 2);
    };

    updateFluidVisibility();
    container.addEventListener("scroll", updateFluidVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateFluidVisibility);

    return () => {
      container.removeEventListener("scroll", updateFluidVisibility);
      window.removeEventListener("resize", updateFluidVisibility);
    };
  }, []);

  // ----------------------------
  // Sanity: homepage image + fog
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadHomepage = async () => {
      try {
        const data = await sanityQuery(`
          *[_type == "homepageImage"] | order(_updatedAt desc)[0]{
            "imageUrl": photo.asset->url,
            fog
          }
        `);

        if (!mounted || !data) return;

        setHomeImage(data.imageUrl || fallbackHomeImage);
        setShowFog(data.fog !== false);
      } catch (err) {
        console.error("Failed to load homepage image:", err);
        if (!mounted) return;

        setHomeImage(fallbackHomeImage);
        setShowFog(true);
      }
    };

    loadHomepage();

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------
  // Sanity: showreel video
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadShowreel = async () => {
      try {
        const data = await sanityQuery(`
          *[_type == "showreelVideo"] | order(_updatedAt desc)[0]{
            "videoUrl": video.asset->url
          }
        `);

        if (!mounted) return;

        if (data?.videoUrl) {
          setShowreelVideo(data.videoUrl);
        }
      } catch (err) {
        console.error("Failed to load showreel:", err);
        if (!mounted) return;

        setShowreelVideo(fallbackShowreel);
      }
    };

    loadShowreel();

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------
  // Sanity: Albums for portfolio
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadAlbums = async () => {
      try {
        const data = await sanityQuery(`
  *[_type == "album"] | order(yearTaken desc){
    _id,
    name,
    yearTaken,
    "coverPhotoUrl": coverPhoto.asset->url,
    photos[]{
      "url": asset->url
    }
  }
`);

        if (!mounted) return;

        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          setAlbums([]);
        }
      } catch (err) {
        console.error("Failed to load albums:", err);
        if (!mounted) return;
        setAlbums([]);
      }
    };

    loadAlbums();

    return () => {
      mounted = false;
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
          <HomePage homeImage={homeImage} showFog={showFog} />
        </section>

        <section id="showcase" className="h-screen snap-start overflow-hidden">
          <ShowcasePage videoSrc={showreelVideo} />
        </section>

        <section id="read-more">
          <ReadMorePage />
        </section>

        <section id="portfolio" className="snap-start">
          <PortfolioShowcasePage albums={albums} />
        </section>
      </div>
    </>
  );
}
