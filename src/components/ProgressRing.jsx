export default function ProgressRing({ pct }) {
  const r = 40
  const c = 2 * Math.PI * r
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="size-24 sm:size-28 lg:size-32 -rotate-90" role="img" aria-label={`Progres ${pct} persen`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f3f3" strokeWidth="14" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2f8f7d" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-semibold">{pct}%</span>
    </div>
  )
}
