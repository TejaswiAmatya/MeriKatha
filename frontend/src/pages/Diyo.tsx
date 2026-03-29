import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Affirmation = {
  id: string;
  text: string;
  author: string;
};

const SEED_COUNT = 4;

const DIYOS = [
  {
    id: "sexual-harassment",
    label: "Sexual harassment",
    affirmations: [
      {
        id: "sh1",
        text: "Timro galti hoina — kabhi thiena. Timi brave chau bolna sakera.",
        author: "Sita, Kathmandu",
      },
      {
        id: "sh2",
        text: "Timilai vishwas garchhu. Timro awaz matter garchha.",
        author: "Priya, Virginia",
      },
      {
        id: "sh3",
        text: "Jo bhayo tyo timro parichay hoina. Timi usko bhanda badi ho.",
        author: "Anita, Pokhara",
      },
      {
        id: "sh4",
        text: "Bolna saknu nai himmat ho. Proud chhu timilai.",
        author: "Maya, New York",
      },
    ] as Affirmation[],
    pos: { top: "14%", left: "16%" },
    rotate: "-6deg",
  },
  {
    id: "postpartum",
    label: "Postpartum",
    affirmations: [
      {
        id: "pp1",
        text: "Ramri aama banna lai perfect huna pardaina. Timi afaile enough ho.",
        author: "Kamala, Lalitpur",
      },
      {
        id: "pp2",
        text: "Rest linu galat hoina — timro baby lai healthy aama chahieko ho.",
        author: "Binita, Canada",
      },
      {
        id: "pp3",
        text: "Help maagna weakness hoina, wisdom ho. Sab aama help maagchhan.",
        author: "Sabina, Chitwan",
      },
      {
        id: "pp4",
        text: "Timro feelings real chan, valid chan. Koi judge gardaina yahaan.",
        author: "Laxmi, Sydney",
      },
    ] as Affirmation[],
    pos: { top: "14%", left: "42%" },
    rotate: "4deg",
  },
  {
    id: "domestic",
    label: "Domestic",
    affirmations: [
      {
        id: "d1",
        text: "Timro safety ra peace matter garchha. Timi akelo hoina.",
        author: "Rupa, Boston",
      },
      {
        id: "d2",
        text: "Boundaries rakhnu self-respect ho, rude hoina.",
        author: "Mina, Kathmandu",
      },
      {
        id: "d3",
        text: "Bhitra ko jhagada le timro worth decide gardaina.",
        author: "Sneha, Dallas",
      },
      {
        id: "d4",
        text: "Reach out garnu — kasaiko haat ma basna pardaina.",
        author: "Isha, Melbourne",
      },
    ] as Affirmation[],
    pos: { top: "14%", left: "68%" },
    rotate: "-3deg",
  },
  {
    id: "career-pressure",
    label: "Career pressure",
    affirmations: [
      {
        id: "cp1",
        text: "Timro life timro definition ho. Kasaiko expectations timro story hoina.",
        author: "Deepa, London",
      },
      {
        id: "cp2",
        text: "Log ke sochcha — tyo timle control garna sakdinas, ani garna pardaina pani.",
        author: "Rima, Kathmandu",
      },
      {
        id: "cp3",
        text: "Promotion nai sabai hoina — timro pace pani career ho.",
        author: "Sunita, Texas",
      },
      {
        id: "cp4",
        text: "Afno pace ma hidnu thik ho. Timro khushi ko permission kasaile dina hudaina.",
        author: "Puja, Melbourne",
      },
    ] as Affirmation[],
    pos: { top: "56%", left: "27%" },
    rotate: "5deg",
  },
  {
    id: "diaspora",
    label: "Diaspora",
    affirmations: [
      {
        id: "di1",
        text: "Dui thau ko mann — dui sides ko strength ho. Timi afno place banauchan.",
        author: "Nisha, Seattle",
      },
      {
        id: "di2",
        text: "Ghar tada bhaye pani, aafu sanga hunu ghar jasto ho.",
        author: "Anjali, Bhaktapur",
      },
      {
        id: "di3",
        text: "Accent ra identity ko story timro power ho.",
        author: "Saru, Biratnagar",
      },
      {
        id: "di4",
        text: "Missing lagcha — tyo maya ko sign ho, weakness hoina.",
        author: "Kriti, Toronto",
      },
    ] as Affirmation[],
    pos: { top: "56%", left: "63%" },
    rotate: "-5deg",
  },
];

const AMBIENT = [
  { id: "a1", pos: { top: "38%", left: "44%" }, rotate: "-2deg", size: "sm" },
  { id: "a2", pos: { top: "80%", left: "45%" }, rotate: "4deg", size: "xs" },
  { id: "a3", pos: { top: "5%", left: "40%" }, rotate: "-5deg", size: "xs" },
  { id: "a4", pos: { top: "75%", left: "8%" }, rotate: "3deg", size: "xs" },
  { id: "a5", pos: { top: "72%", left: "82%" }, rotate: "-4deg", size: "xs" },
];

type Phase = "idle" | "lit";

export function Diyo() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msgDiyo, setMsgDiyo] = useState<(typeof DIYOS)[number] | null>(null);
  const [communityAffirmations, setCommunityAffirmations] = useState<
    Record<string, Affirmation[]>
  >({});
  const [newText, setNewText] = useState("");
  const [posting, setPosting] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init: Record<string, Affirmation[]> = {};
    DIYOS.forEach((d) => {
      init[d.id] = [...d.affirmations];
    });
    setCommunityAffirmations(init);
  }, []);

  useEffect(() => {
    if (phase === "lit") {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [communityAffirmations, phase]);

  // How many user-added affirmations exist beyond the seed (per diyo and total)
  const extraPerDiyo: Record<string, number> = {};
  let totalExtra = 0;
  DIYOS.forEach((d) => {
    const extra = Math.max(
      0,
      (communityAffirmations[d.id]?.length ?? SEED_COUNT) - SEED_COUNT,
    );
    extraPerDiyo[d.id] = extra;
    totalExtra += extra;
  });

  // glowBoost: 0 → 1 as totalExtra goes 0 → 16
  // Reaches full brightness after just 5 added affirmations
  const glowBoost = Math.min(totalExtra / 5, 1);

  // Emoji font-size grows per extra affirmation — all start equal at 6rem
  function getDiyoFontSize(id: string): string {
    const extra = extraPerDiyo[id] ?? 0;
    return `${Math.min(6 + extra * 1.4, 16)}rem`;
  }

  // Drop-shadow intensity grows with size
  function getDiyoGlow(id: string, active = false): string {
    const extra = extraPerDiyo[id] ?? 0;
    const base = active ? 20 : 6 + extra * 2;
    return `drop-shadow(0 0 ${base}px rgba(217,119,6,${active ? 0.9 : 0.45 + extra * 0.05}))`;
  }

  function handleDiyoClick(diyo: (typeof DIYOS)[number]) {
    if (activeId === diyo.id && phase === "lit") return;

    setActiveId(diyo.id);
    setMsgDiyo(diyo);
    setNewText("");
    setPhase("lit");
  }

  function handleClose() {
    setActiveId(null);
    setPhase("idle");
    setMsgDiyo(null);
    setNewText("");
  }

  function handlePost() {
    if (!newText.trim() || !activeId) return;
    setPosting(true);
    const newAff: Affirmation = {
      id: `u-${Date.now()}`,
      text: newText.trim(),
      author: "Timi",
    };
    setCommunityAffirmations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newAff],
    }));
    setNewText("");
    setTimeout(() => setPosting(false), 400);
  }

  const isLit = phase === "lit";
  const anyActive = activeId !== null;
  const currentAffirmations = activeId
    ? (communityAffirmations[activeId] ?? [])
    : [];

  const baseGlowOpacity = isLit ? 1 : 0.4 + glowBoost * 0.6;
  // Core gradient intensity grows from dim to vivid
  const coreIntensity = 0.18 + glowBoost * 0.42; // 0.18 → 0.60
  // Warm fill spreads outward as community grows
  const fillIntensity = glowBoost * 0.3; // 0 → 0.30

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: "#0e0c09",
        transition: "background-color 1.5s ease",
      }}
    >
      {/* Base ambient glow — core intensity scales with affirmations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,${coreIntensity.toFixed(2)}) 0%, transparent 70%)`,
          opacity: baseGlowOpacity,
          transition: "background 1.2s ease, opacity 0.9s ease",
        }}
      />

      {/* Wide warm fill — spreads out as community grows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 110% 90% at 50% 50%, rgba(217,119,6,${fillIntensity.toFixed(2)}) 0%, rgba(180,80,0,0.06) 55%, transparent 85%)`,
          opacity: 1,
          transition: "background 1.2s ease",
        }}
      />

      {/* Hot center burst — only at high glowBoost */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,160,0,0.18) 0%, transparent 60%)",
          opacity: glowBoost,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate("/feed")}
        className="absolute top-4 left-4 z-30 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500 cursor-pointer text-xl text-[#9a8870] border-[#3a2a18] hover:text-amber-400 hover:border-amber-600/50 hover:bg-amber-900/20"
      >
        ←
      </button>

      {/* Page title */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-700 ${
            isLit
              ? "bg-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.9)]"
              : "bg-amber-600 shadow-[0_0_5px_rgba(217,119,6,0.4)]"
          }`}
        />
        <h1
          className={`text-base uppercase tracking-widest font-semibold transition-colors duration-700 ${
            isLit ? "text-amber-400" : "text-[#6a5a48]"
          }`}
        >
          Diyo
        </h1>
      </div>

      {/* Hint text — only idle */}
      {!anyActive && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-base text-[#5a4a38] text-center">
          Yo diyo baln — affirmation paunus
        </p>
      )}

      {/* Ambient decorative diyos */}
      {AMBIENT.map((a) => (
        <div
          key={a.id}
          className="absolute pointer-events-none select-none"
          style={{
            top: a.pos.top,
            left: a.pos.left,
            transform: `rotate(${a.rotate})`,
          }}
        >
          <span
            className={`inline-block transition-all duration-700 ${
              a.size === "xs" ? "text-5xl" : "text-6xl"
            } ${anyActive ? "opacity-10" : "opacity-25 diyo-ambient"}`}
          >
            🪔
          </span>
        </div>
      ))}

      {/* Themed diyos */}
      {DIYOS.map((diyo) => {
        const isActive = activeId === diyo.id;
        const isOther = anyActive && !isActive;
        const fontSize = getDiyoFontSize(diyo.id);

        return (
          <button
            key={diyo.id}
            onClick={() => handleDiyoClick(diyo)}
            className="absolute z-10 flex flex-col items-center gap-0 cursor-pointer group"
            style={{
              top: diyo.pos.top,
              left: diyo.pos.left,
              transform: `rotate(${diyo.rotate})`,
            }}
          >
            <span
              className={`inline-block leading-none ${
                isActive
                  ? "diyo-flame-active scale-110"
                  : isOther
                    ? "opacity-20 scale-90"
                    : "diyo-flame group-hover:scale-110"
              }`}
              style={{
                fontSize,
                filter: isActive || isOther ? undefined : getDiyoGlow(diyo.id),
                transition:
                  "font-size 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              🪔
            </span>
            <span
              className={`text-base sm:text-lg font-normal leading-tight text-center max-w-[min(160px,28vw)] transition-all duration-500 ${
                isActive
                  ? "text-amber-300"
                  : isOther
                    ? "opacity-0"
                    : "text-[#9a8870] group-hover:text-amber-400"
              }`}
            >
              {diyo.label}
            </span>
            {/* Affirmation count badge */}
            {!anyActive && extraPerDiyo[diyo.id] > 0 && (
              <span className="text-xs text-amber-700/60 mt-0.5">
                +{extraPerDiyo[diyo.id]} naya
              </span>
            )}
          </button>
        );
      })}

      {/* Community affirmations panel */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 z-20 w-[min(560px,92vw)] transition-all duration-500 ease-out ${
          isLit
            ? "top-1/2 -translate-y-1/2 opacity-100"
            : "top-[55%] -translate-y-1/2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-b from-[#3a2a0e] to-[#261c08] border-2 border-amber-600/70 rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(217,119,6,0.45),inset_0_0_40px_rgba(217,119,6,0.08)]">
          {/* Card header */}
          <div className="bg-gradient-to-r from-[#4a3010] to-[#3a2408] px-5 py-4 flex items-center justify-between border-b-2 border-amber-600/70">
            <span className="text-base font-normal text-amber-200">
              🪔 {msgDiyo?.label}
            </span>
            <button
              onClick={handleClose}
              className="text-amber-600 hover:text-amber-300 text-base px-2 py-1 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Affirmations list */}
          <div className="px-5 pt-4 pb-2 max-h-[260px] overflow-y-auto flex flex-col gap-3 scrollbar-thin">
            {currentAffirmations.length === 0 && (
              <p className="text-center text-amber-500/80 text-sm py-4 font-normal font-sans">
                Pahilo affirmation timi lekhnus — diyera suru garnus 🪔
              </p>
            )}
            {currentAffirmations.map((aff) => (
              <div
                key={aff.id}
                className="bg-[#3a2808] border border-[#5a3e10] rounded-xl px-4 py-3"
              >
                <p className="text-sm text-amber-100 leading-relaxed font-normal font-sans">
                  {aff.text}
                </p>
              </div>
            ))}
            <div ref={listEndRef} />
          </div>

          {/* Write your affirmation */}
          <div className="px-5 pt-2 pb-4 border-t border-[#5a3e10] mt-2">
            <p className="text-sm text-amber-400 mb-2 font-normal font-sans">
              Timi pani affirmation lekhnus — arko lai help garchha 🕯
            </p>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Aafno mann le ke bhancha… (Nenglish ma thik cha)"
              maxLength={200}
              rows={2}
              className="w-full bg-[#2a1e08] border border-[#6a4a18] rounded-xl px-3 py-2.5 text-sm font-normal font-sans text-amber-100 placeholder:text-amber-400/80 resize-none focus:outline-none focus:border-amber-500 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-amber-600/80 font-normal">
                {newText.length}/200
              </span>
              <button
                onClick={handlePost}
                disabled={!newText.trim() || posting}
                className="px-4 py-1.5 rounded-lg text-sm font-normal bg-amber-700/50 text-amber-200 border border-amber-600/60 hover:bg-amber-600/70 hover:text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {posting ? "Pathaidai…" : "Pathau 🪔"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        .diyo-flame {
          animation: flicker 2.5s ease-in-out infinite alternate;
        }
        .diyo-ambient {
          animation: flicker 3.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 3px rgba(217,119,6,0.2));
        }
        .diyo-flame-active {
          animation: flickerActive 1.8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 24px rgba(217,119,6,0.95)) !important;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          25% { transform: scale(1.04) rotate(0.5deg); }
          50% { transform: scale(0.97) rotate(-0.5deg); }
          75% { transform: scale(1.03) rotate(1deg); }
        }
        @keyframes flickerActive {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 24px rgba(217,119,6,0.95)); }
          25% { transform: scale(1.12) rotate(1deg); filter: drop-shadow(0 0 36px rgba(217,119,6,1)); }
          50% { transform: scale(0.95) rotate(-1deg); filter: drop-shadow(0 0 14px rgba(217,119,6,0.6)); }
          75% { transform: scale(1.08) rotate(0.5deg); filter: drop-shadow(0 0 28px rgba(217,119,6,0.95)); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}
