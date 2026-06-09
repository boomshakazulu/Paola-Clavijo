import { useEffect, useState } from "react";
import Showreel from "../components/Showreel";
import MarqueeText from "../components/MarqueeText";
import ScrollIndicator from "../components/ScrollIndicator";
import { sanityQuery } from "../lib/sanity";

export default function ShowcasePage() {
  const [videoSrc, setVideoSrc] = useState("/videos/ShowreelVideo.webm");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await sanityQuery(`
  *[_type == "showreelVideo"] | order(_updatedAt desc)[0]{
    "videoUrl": video.asset->url
  }
`);

        if (data?.videoUrl) {
          setVideoSrc(data.videoUrl);
        }
      } catch (err) {
        console.error("Failed to load showreel video:", err);
      }
    };

    loadVideo();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <MarqueeText />

      <section className="flex flex-col absolute inset-0 z-10 items-center justify-center pointer-events-none">
        <div className="h-[360px] w-[92vw] max-w-6xl sm:h-[460px] lg:h-[58vh]">
          <Showreel src={videoSrc} />
        </div>
      </section>

      <ScrollIndicator className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" />
    </main>
  );
}
