const placeholderImage = "/images/6261721a88480c276d3e17f3d76add8e82d0c1db.png";

export default function PortfolioShowcasePage({ albums = [] }) {
  if (!Array.isArray(albums) || albums.length === 0) {
    return <div />;
  }

  return (
    <>
      <style>{`
        .album-vibrate:hover {
          animation: albumBlurVibrate 0.55s linear infinite;
        }

        @keyframes albumBlurVibrate {
          0% { filter: blur(0px); transform: scale(1); }
          15% { filter: blur(2px); transform: scale(1.05); }
          30% { filter: blur(0px); transform: scale(1.02); }
          45% { filter: blur(2.5px); transform: scale(1.06); }
          60% { filter: blur(0px); transform: scale(1.03); }
          75% { filter: blur(2px); transform: scale(1.05); }
          100% { filter: blur(0px); transform: scale(1.04); }
        }
      `}</style>

      <main className="relative z-10 min-h-screen px-4 pb-16 pt-24 text-neutral-100 sm:px-10 lg:px-44 sm:pt-28">
        <div className="w-full">
          <h2 className="mb-10 text-2xl font-medium uppercase tracking-[0.14em] sm:text-3xl">
            Portfolio
          </h2>

          <div className="space-y-0 pt-4 sm:pt-8">
            {albums.map((album, index) => {
              const imageOnRight = index % 2 !== 0;

              return (
                <article
                  key={album._id || index}
                  className={`flex w-full justify-center ${
                    index === 0 ? "" : "sm:-mt-[9rem]"
                  }`}
                >
                  <div
                    className={`w-full overflow-hidden sm:min-w-[45%] sm:max-w-[45%] ${
                      imageOnRight ? "sm:ml-auto" : "sm:mr-auto"
                    }`}
                  >
                    <div className="aspect-[9/10] w-full overflow-hidden">
                      <img
                        src={album.coverPhotoUrl || placeholderImage}
                        alt={album.name}
                        className="album-vibrate h-full w-full object-cover transition duration-150"
                      />
                    </div>

                    <div className="mt-2 flex justify-between gap-4 py-1 text-neutral-100">
                      <div className="w-full py-1">
                        <p className="text-2xl uppercase tracking-[0.14em] sm:text-3xl">
                          {album.name}
                        </p>

                        <div className="mt-1 flex w-full items-center gap-3">
                          <p className="text-[0.8rem] uppercase tracking-[0.18em] text-neutral-400">
                            {album.subtitle}
                          </p>

                          <span className="ml-auto text-[0.82rem] font-medium uppercase tracking-[0.18em] text-neutral-200">
                            {album.yearTaken}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
