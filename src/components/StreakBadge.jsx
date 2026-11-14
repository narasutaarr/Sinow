import { useStore } from '../store.jsx'

export default function StreakBadge() {
  const { user } = useStore()
  return (
    <span className="flex items-center gap-1.5 rounded-xl bg-periwinkle px-2.5 py-1.5 text-[10px] font-semibold">
      🔥 {user.streak} <span>Streak</span>
    </span>
  )
}
