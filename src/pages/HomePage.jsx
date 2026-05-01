const homeImage = "/images/6261721a88480c276d3e17f3d76add8e82d0c1db.png";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${homeImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/55" />
      <div className="absolute bottom-5 left-4 z-10 sm:bottom-8 sm:left-8">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-neutral-300">
          Fine Art Photography
        </p>
        <h1 className="m-0 text-4xl font-light tracking-[0.04em] sm:text-6xl">
          Paola Clavijo
        </h1>
      </div>
    </main>
  );
}
