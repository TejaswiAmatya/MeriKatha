export function DhakaBand({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-2 rounded-full my-5 opacity-65 ${className}`}
      style={{
        background:
          'repeating-linear-gradient(90deg, #C0392B 0px, #C0392B 6px, #E8A020 6px, #E8A020 12px, #2D6A4F 12px, #2D6A4F 18px, #D4C5A9 18px, #D4C5A9 24px)',
      }}
    />
  )
}
