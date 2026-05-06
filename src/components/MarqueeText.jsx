const MarqueeText = () => {
  const text = "MUESTRA — ";
  const repeated = text.repeat(10);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 18s linear infinite",
        }}
      >
        <span
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 800,
            letterSpacing: "0.05em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          {repeated}
        </span>
        <span
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 800,
            letterSpacing: "0.05em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          {repeated}
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
