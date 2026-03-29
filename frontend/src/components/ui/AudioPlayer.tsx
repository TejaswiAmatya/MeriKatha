import { useState, useRef, useEffect } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface AudioPlayerProps {
  src: string
  compact?: boolean // smaller variant for StoryInput preview
}

export function AudioPlayer({ src, compact = false }: AudioPlayerProps) {
  const waveContainerRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveSurfer | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!waveContainerRef.current) return

    const wave = WaveSurfer.create({
      container: waveContainerRef.current,
      url: src,
      height: compact ? 26 : 34,
      waveColor: '#D8BFA8',
      progressColor: '#B03A2E',
      cursorColor: '#7A4A2B',
      cursorWidth: 2,
      barWidth: compact ? 2 : 3,
      barGap: compact ? 1.5 : 2,
      barRadius: 999,
      normalize: true,
      dragToSeek: true,
      hideScrollbar: true,
    })

    waveRef.current = wave

    wave.on('ready', () => {
      setDuration(wave.getDuration())
      setCurrentTime(0)
    })

    wave.on('audioprocess', () => {
      setCurrentTime(wave.getCurrentTime())
    })

    wave.on('interaction', () => {
      setCurrentTime(wave.getCurrentTime())
    })

    wave.on('finish', () => {
      setPlaying(false)
      setCurrentTime(wave.getDuration())
    })

    return () => {
      wave.destroy()
      waveRef.current = null
    }
  }, [src, compact])

  useEffect(() => {
    const wave = waveRef.current
    if (!wave) return

    if (playing) {
      void wave.play()
    } else {
      wave.pause()
    }
  }, [playing])

  function togglePlay() {
    const wave = waveRef.current
    if (!wave) return
    setPlaying((prev) => !prev)
  }

  function formatTime(seconds: number) {
    if (!isFinite(seconds) || seconds < 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const h = compact ? 'h-9' : 'h-12'
  const iconSize = compact ? 14 : 18

  return (
    <div className={`flex items-center gap-2.5 bg-feedBg rounded-xl px-3 border border-sand/60 ${h} w-full`}>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={togglePlay}
        className="shrink-0 text-ink hover:text-sindoor transition-colors"
      >
        {playing ? (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l14 8-14 8V4z" />
          </svg>
        )}
      </button>

      {/* Time current */}
      <span className="text-[10px] text-textMuted tabular-nums w-8 text-right shrink-0">
        {formatTime(currentTime)}
      </span>

      {/* Waveform */}
      <div className="flex-1 min-w-0">
        <div ref={waveContainerRef} className="w-full" />
      </div>

      {/* Time total */}
      <span className="text-[10px] text-textMuted tabular-nums w-8 shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  )
}
