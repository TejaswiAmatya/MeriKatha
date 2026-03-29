import { useNavigate } from "react-router-dom";

export function DiyoBaln() {
  const navigate = useNavigate();

  return (
    <div className="bg-cardWhite border border-sand rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.5)]" />
        <h3 className="text-[11px] uppercase tracking-wider font-semibold text-textMuted">
          Diyo
        </h3>
      </div>

      {/* Big diyo button */}
      <button
        onClick={() => navigate("/diyo")}
        className="relative w-full rounded-xl p-6 text-center cursor-pointer overflow-hidden bg-feedBg border border-transparent hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(217,119,6,0.2)] transition-all duration-300 group"
      >
        <span className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="text-6xl inline-block leading-none diyo-idle relative z-10">
          🪔
        </span>

        <div className="relative z-10 mt-2">
          <p className="text-[11px] text-textMuted group-hover:text-amber-600 transition-colors duration-300">
            Light a diyo
          </p>
        </div>
      </button>

      <style>{`
        .diyo-idle {
          animation: flickerIdle 2.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 3px rgba(217,119,6,0.3));
        }
        @keyframes flickerIdle {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          25% { transform: scale(1.03) rotate(0.5deg); }
          50% { transform: scale(0.97) rotate(-0.5deg); }
          75% { transform: scale(1.02) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
