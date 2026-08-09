import { motion } from 'framer-motion';

export function SafetyScoreGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color = clamped >= 75 ? '#22C55E' : clamped >= 45 ? '#F59E0B' : '#EF4444';
  const label = clamped >= 75 ? 'Excellent' : clamped >= 45 ? 'Moderate' : 'At Risk';

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#1E293B" strokeWidth="12" />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight">{Math.round(clamped)}</span>
          <span className="text-xs text-muted mt-1">Safety Score</span>
        </div>
      </div>
      <span
        className="mt-4 text-sm font-medium px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        {label}
      </span>
    </div>
  );
}
