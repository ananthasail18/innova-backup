// Unused React import removed

interface RadarDimension {
  label: string;
  value: number; // 0 to 1
}

export function TasteRadarChart({ dimensions }: { dimensions: RadarDimension[] }) {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const total = dimensions.length;

  // Calculate coordinates for polygon
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = radius * val;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const levels = [0.25, 0.5, 0.75, 1.0];

  const points = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(i, Math.max(0.05, d.value));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-card border border-border rounded-2xl">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Taste DNA Radar</h4>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Concentric Circles/Polygons */}
        {levels.map((level, idx) => {
          const levelPoints = dimensions.map((_, i) => {
            const { x, y } = getCoordinates(i, level);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={idx}
              points={levelPoints}
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
              strokeDasharray={idx === levels.length - 1 ? 'none' : '2 2'}
            />
          );
        })}

        {/* Axis Lines */}
        {dimensions.map((d, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          const labelCoords = getCoordinates(i, 1.25);
          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[10px] font-semibold uppercase tracking-wider"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Taste DNA Polygon */}
        <polygon
          points={points}
          className="fill-primary/25 stroke-primary"
          strokeWidth="2.5"
        />

        {/* Dimension Data Dots */}
        {dimensions.map((d, i) => {
          const { x, y } = getCoordinates(i, Math.max(0.05, d.value));
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-primary stroke-background"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}
