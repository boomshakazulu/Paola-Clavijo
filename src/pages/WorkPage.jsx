import FluidBackground from "../components/FluidBackground";

export default function WorkPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FluidBackground />
      <section className="pointer-events-none absolute inset-0 z-10 max-w-5xl px-4 pb-8 pt-28 sm:px-7 sm:pt-32">
        <h2 className="mb-4 text-2xl font-medium uppercase tracking-[0.14em] sm:text-3xl">
          Work
        </h2>
        <p className="max-w-[60ch] leading-7 text-neutral-300">
          Selected series and commissioned projects.
        </p>
      </section>
    </main>
  );
}
