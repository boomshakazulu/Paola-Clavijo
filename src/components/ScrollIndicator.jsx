export default function ScrollIndicator({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <style>{`
        @keyframes chevronFade {
          0%   { opacity: 0; transform: translateY(-6px); }
          50%  { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(6px); }
        }
        .chev:nth-child(1) { animation-delay: 0s; }
        .chev:nth-child(2) { animation-delay: 0.18s; }
        .chev:nth-child(3) { animation-delay: 0.36s; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="chev"
            width="28"
            height="14"
            viewBox="0 0 28 14"
            fill="none"
            style={{ animation: "chevronFade 1.6s ease-in-out infinite" }}
          >
            <polyline
              points="2,2 14,12 26,2"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
