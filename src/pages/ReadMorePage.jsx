export default function ReadMorePage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 text-white sm:px-7">
      <div className="w-full max-w-5xl">
        <h2 className="text-left text-4xl font-medium uppercase tracking-[0.08em] sm:text-6xl">
          Stories In Motion. This will be all sorts of shit you want to right
          about yourself of methods or whatever you want.
        </h2>

        <div className="mt-32 flex w-full max-w-4xl items-center justify-center gap-12">
          <button className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-white text-base font-medium uppercase tracking-[0.14em] transition-transform duration-500 hover:rotate-180">
            Read
            <br />
            More
          </button>
          <div className="ml-12 w-full max-w-[68ch] border-b-4 border-white pb-8">
            <p className="text-sm uppercase tracking-[0.14em] text-neutral-200">
              This is a kind of sub text. again whatever you want can go here.
              About yourself your work whatever you think is best. The read more
              button will go to about me page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
