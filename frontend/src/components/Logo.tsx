type LogoSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 28, text: 'text-base', gap: 'gap-1.5' },
  md: { icon: 36, text: 'text-xl',  gap: 'gap-2'   },
  lg: { icon: 48, text: 'text-2xl', gap: 'gap-2.5' },
};

interface LogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
}

export default function Logo({ size = 'md', showWordmark = true }: LogoProps) {
  const { icon, text, gap } = SIZE_MAP[size];

  return (
    <div className={`flex items-center ${gap} select-none`}>
      {/* SVG 아이콘: Teal 3중 아크 + Green 새싹 */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SmartFarmNews logo"
      >
        {/* Teal 3중 아크 — 신호/연결성 상징 */}
        <path
          d="M 5 34 A 15 15 0 0 1 35 34"
          stroke="#0891B2"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 10 34 A 10 10 0 0 1 30 34"
          stroke="#0891B2"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 15 34 A 5 5 0 0 1 25 34"
          stroke="#0891B2"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Green 새싹 — 성장/농업 상징 */}
        {/* 줄기 */}
        <path
          d="M 20 34 L 20 18"
          stroke="#4ADE80"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* 왼쪽 잎 */}
        <path
          d="M 20 24 Q 14 20 13 13"
          stroke="#4ADE80"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* 오른쪽 잎 */}
        <path
          d="M 20 27 Q 26 23 27 16"
          stroke="#4ADE80"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 워드마크 */}
      {showWordmark && (
        <span className={`font-bold tracking-tight leading-none ${text}`}>
          <span className="text-white">Smart</span>
          <span style={{ color: '#0891B2' }}>Farm</span>
          <span className="text-white">News</span>
        </span>
      )}
    </div>
  );
}
