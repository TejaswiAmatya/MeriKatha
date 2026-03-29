import { useRef, useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import { THEMES } from "../../data/themes";
import type { ThemeValue } from "../../data/themes";
import { circles } from "../../data/mockStories";
import { AudioPlayer } from "../ui/AudioPlayer";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const MAX_RECORDING_SECONDS = 120;

export function StoryInput({
  onSubmit,
  circleId,
  open: controlledOpen,
  onOpenChange,
}: {
  onSubmit: (text: string, theme: ThemeValue, audioBase64?: string) => void;
  circleId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (controlledOpen === undefined) setInternalOpen(next);
  };
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<ThemeValue | "">("");
  const [selectedCircle, setSelectedCircle] = useState<string>(circleId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [flagWarning, setFlagWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio state
  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptHint, setTranscriptHint] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function execCmd(cmd: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  }

  function handleImageInsert(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      document.execCommand("insertImage", false, reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function close() {
    setOpen(false);
    setTitle("");
    setTheme("");
    setSelectedCircle(circleId ?? "");
    setError(null);
    setShowResources(false);
    setFlagWarning(null);
    setAudioBase64(null);
    setElapsedSeconds(0);
    setMicError(null);
    setTranscriptHint(null);
    if (editorRef.current) editorRef.current.innerHTML = "";
  }

  // --- Audio recording ---

  function startTranscription() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setTranscriptHint("Auto-transcript yo browser ma support chaina.");
      return;
    }

    setTranscriptHint(null);
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += `${result[0]?.transcript || ""} `;
        }
      }
      const clean = finalChunk.trim();
      if (!clean || !editorRef.current) return;
      editorRef.current.focus();
      document.execCommand("insertText", false, clean + " ");
    };

    recognition.onerror = () => {
      setTranscriptHint("Auto-transcript stop bhayo. Recording continues.");
      setTranscribing(false);
    };

    recognition.onend = () => {
      setTranscribing(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscribing(true);
  }

  function stopTranscription() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    recognitionRef.current = null;
    setTranscribing(false);
  }

  const startRecording = useCallback(async () => {
    setMicError(null);
    setTranscriptHint(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);

        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      startTranscription();
      setRecording(true);
      setAudioBase64(null);
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setMicError("Mic access dina parcha — browser le permission maagcha");
    }
  }, []);

  const stopRecording = useCallback(() => {
    stopTranscription();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
  }, []);

  function removeAudio() {
    setAudioBase64(null);
    setElapsedSeconds(0);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // --- Submit ---

  async function handleSubmit() {
    const body = editorRef.current?.innerText?.trim() ?? "";

    if (!title.trim()) {
      setError(
        lang === "en"
          ? "Please add a title."
          : "Title lekhnus — aawashyak cha.",
      );
      return;
    }
    const fullContent = `${title.trim()}\n\n${body}`;

    if (fullContent.length < 10 && !audioBase64) {
      setError("Ali lambo lekhnus na — kamti ma 10 akshar chaincha");
      return;
    }
    if (!theme) {
      setError(
        lang === "en"
          ? "Please select a theme before sharing."
          : "Theme छान्नुस् — share garna aghi.",
      );
      return;
    }

    setError(null);
    setShowResources(false);
    setFlagWarning(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: fullContent,
          theme,
          ...(selectedCircle ? { circleId: selectedCircle } : {}),
          ...(audioBase64 ? { audioBase64 } : {}),
        }),
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        setError("Server bata unexpected response ayo. Feri try garnus.");
        return;
      }

      if (!res.ok || !data?.success) {
        setError(data?.error || "Request fail bhayo. Feri try garnus.");
        if (data?.showResources) setShowResources(true);
        return;
      }

      if (data.flags?.includes("clinical_language")) {
        setFlagWarning(
          "Tapaaiko kura suneko chha. Yaha hami clinical shabda bhanda mann ko bhasa maa bolchhau — tara tapaaiko feelings valid chhan.",
        );
        return; // keep modal open to show nudge
      }

      onSubmit(fullContent, theme as ThemeValue, audioBase64 ?? undefined);
      close();
      navigate("/feed");
    } catch {
      setError("Server sanga connect huna sakena. Feri try garnus.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Collapsed trigger bar */}
      <button
        id="story-input"
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full flex items-center gap-3 bg-pageBg border border-sand rounded-xl px-4 py-3 text-left hover:border-sand/80 hover:bg-cardWhite transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-himalayan/35 focus-visible:ring-offset-2 focus-visible:ring-offset-pageBg"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-pageBg text-lg font-light leading-none shadow-sm group-hover:opacity-95 transition-opacity"
          aria-hidden
        >
          +
        </span>
        <span className="text-sm text-textMuted font-sans group-hover:text-textBody transition-colors">
          {lang === "en"
            ? "What's on your mind?"
            : "Tapaiko katha share garnuhos..."}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog card */}
          <div className="relative w-full max-w-lg bg-cardWhite rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-sand/40">
              <span className="font-serif text-base text-ink">
                Aafno katha...
              </span>
              <button
                onClick={close}
                className="w-6 h-6 flex items-center justify-center rounded-full text-textMuted hover:text-ink hover:bg-sand/40 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Title input — required */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                lang === "en" ? "Title — required" : "Title — aawashyak cha"
              }
              maxLength={120}
              className="px-5 py-3 text-sm font-sans text-ink placeholder:text-textMuted/60 bg-transparent border-b border-sand/30 outline-none"
            />

            {/* Theme + Circle selectors row */}
            <div className="flex border-b border-sand/30">
              {/* Theme — required */}
              <div className="flex-1 px-4 py-2.5 flex items-center gap-2 border-r border-sand/30">
                <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider shrink-0">
                  {lang === "en" ? "Theme *" : "विषय *"}
                </span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeValue | "")}
                  className={`flex-1 bg-transparent text-xs font-sans outline-none cursor-pointer ${
                    theme ? "text-ink" : "text-textMuted"
                  }`}
                >
                  <option value="" disabled>
                    {lang === "en" ? "— pick one —" : "— छान्नुस् —"}
                  </option>
                  {THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {lang === "en" ? t.en : t.ne}
                    </option>
                  ))}
                </select>
              </div>
              {/* Circle — optional */}
              <div className="flex-1 px-4 py-2.5 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider shrink-0">
                  {lang === "en" ? "Circle" : "सर्कल"}
                </span>
                <select
                  value={selectedCircle}
                  onChange={(e) => setSelectedCircle(e.target.value)}
                  className={`flex-1 bg-transparent text-xs font-sans outline-none cursor-pointer ${
                    selectedCircle ? "text-ink" : "text-textMuted"
                  }`}
                >
                  <option value="">
                    {lang === "en" ? "— none —" : "— छैन —"}
                  </option>
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      c/{c.id} · {lang === "en" ? c.enName : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-4 py-2 border-b border-sand/30 bg-feedBg/60">
              <ToolBtn
                onMouseDown={() => execCmd("bold")}
                title="Bold"
                className="font-bold text-sm"
              >
                B
              </ToolBtn>
              <ToolBtn
                onMouseDown={() => execCmd("italic")}
                title="Italic"
                className="italic text-sm"
              >
                I
              </ToolBtn>

              <div className="w-px h-4 bg-sand/60 mx-1" />

              <ToolBtn
                onMouseDown={() => execCmd("insertUnorderedList")}
                title="Bullet list"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                >
                  <circle cx="2" cy="4" r="1.5" />
                  <rect x="5" y="3" width="10" height="2" rx="1" />
                  <circle cx="2" cy="8" r="1.5" />
                  <rect x="5" y="7" width="10" height="2" rx="1" />
                  <circle cx="2" cy="12" r="1.5" />
                  <rect x="5" y="11" width="10" height="2" rx="1" />
                </svg>
              </ToolBtn>
              <ToolBtn
                onMouseDown={() => execCmd("insertOrderedList")}
                title="Numbered list"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                >
                  <text x="0.5" y="5.5" fontSize="5" fontFamily="monospace">
                    1.
                  </text>
                  <rect x="5" y="3" width="10" height="2" rx="1" />
                  <text x="0.5" y="9.5" fontSize="5" fontFamily="monospace">
                    2.
                  </text>
                  <rect x="5" y="7" width="10" height="2" rx="1" />
                  <text x="0.5" y="13.5" fontSize="5" fontFamily="monospace">
                    3.
                  </text>
                  <rect x="5" y="11" width="10" height="2" rx="1" />
                </svg>
              </ToolBtn>

              <div className="w-px h-4 bg-sand/60 mx-1" />

              <ToolBtn
                onMouseDown={() => fileInputRef.current?.click()}
                title="Insert image"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="2" width="14" height="12" rx="2" />
                  <circle cx="5.5" cy="6" r="1.5" />
                  <path d="M1 11l4-3 3 3 2-2 4 4" />
                </svg>
              </ToolBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageInsert}
              />

              <div className="w-px h-4 bg-sand/60 mx-1" />

              {/* Mic button in toolbar */}
              {!recording && !audioBase64 && (
                <ToolBtn
                  onMouseDown={startRecording}
                  title={lang === "en" ? "Record audio" : "Awaaz record garnus"}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </ToolBtn>
              )}
              {recording && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    stopRecording();
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-sindoor font-semibold hover:bg-sindoor/10 transition-colors"
                >
                  <span className="w-2 h-2 bg-sindoor rounded-full animate-pulse" />
                  {formatTime(elapsedSeconds)} — Roka
                </button>
              )}
            </div>

            {/* Audio preview inside modal */}
            {audioBase64 && !recording && (
              <div className="flex items-center gap-2 px-5 py-2 border-b border-sand/30 bg-feedBg/40">
                <div className="flex-1 min-w-0">
                  <AudioPlayer src={audioBase64} compact />
                </div>
                <button
                  type="button"
                  onClick={removeAudio}
                  title="Audio hataunus"
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-sand/40 text-textMuted hover:bg-sindoor/15 hover:text-sindoor transition-colors text-sm leading-none shrink-0"
                >
                  ×
                </button>
              </div>
            )}

            {/* Transcription / mic hints */}
            {(transcribing || transcriptHint || micError) && (
              <div className="px-5 py-1.5 border-b border-sand/30 bg-feedBg/30">
                {transcribing && (
                  <span className="text-[11px] text-himalayan font-medium">
                    Auto-transcript chaliracha...
                  </span>
                )}
                {transcriptHint && (
                  <span className="text-[11px] text-textMuted">
                    {transcriptHint}
                  </span>
                )}
                {micError && (
                  <span className="text-[11px] text-sindoor">{micError}</span>
                )}
              </div>
            )}

            {/* Rich text editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Aaja mann maa ke chha? Yahaa lekhnus — koi judge gardaina..."
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              className="min-h-[140px] max-h-[260px] overflow-y-auto px-5 py-4 text-sm font-sans text-ink outline-none leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:mt-2 [&_b]:font-bold [&_i]:italic"
            />

            {/* Feedback messages */}
            {(error || showResources || flagWarning) && (
              <div className="px-5 pb-1 space-y-2">
                {error && (
                  <div className="p-2.5 rounded-lg bg-sindoor/10 border border-sindoor/20 text-sindoor text-xs font-sans">
                    {error}
                  </div>
                )}
                {showResources && (
                  <div className="p-3 rounded-lg bg-peach/50 border border-marigold/30 text-ink text-xs font-sans space-y-1">
                    <p className="font-medium">
                      Sahara chahiyo? Yahaa sampark garnus:
                    </p>
                    <ul className="space-y-0.5 text-textBody">
                      <li>
                        Saathi Nepal: <strong>01-4268474</strong>
                      </li>
                      <li>
                        TPO Nepal: <strong>01-4423596</strong>
                      </li>
                      <li>
                        Emergency: <strong>100</strong>
                      </li>
                    </ul>
                    <Link
                      to="/sahara"
                      className="inline-block text-himalayan underline"
                    >
                      Sahara page ma janus →
                    </Link>
                  </div>
                )}
                {flagWarning && (
                  <div className="p-2.5 rounded-lg bg-marigold/10 border border-marigold/20 text-textBody text-xs font-sans">
                    {flagWarning}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[9px] text-textMuted">
                {audioBase64
                  ? lang === "en"
                    ? "audio attached"
                    : "audio jodiyeko"
                  : ""}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={close}
                  className="text-xs text-textMuted hover:text-ink font-sans transition-colors"
                >
                  Chodnus
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-ink text-pageBg rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {submitting ? "Pathaaudai..." : "Share gara"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Small toolbar button helper
function ToolBtn({
  children,
  onMouseDown,
  title,
  className = "",
}: {
  children: React.ReactNode;
  onMouseDown: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      title={title}
      className={`w-7 h-7 rounded flex items-center justify-center text-textBody hover:bg-sand/60 hover:text-ink transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
