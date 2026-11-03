import React, { useState } from 'react';

interface CartesianGraphProps {
  eq1: { a: number; b: number; c: number };
  eq2: { a: number; b: number; c: number };
  correctX: number;
  correctY: number;
  labelX: string;
  labelY: string;
  isSolved?: boolean;
}

export const CartesianGraph: React.FC<CartesianGraphProps> = ({
  eq1,
  eq2,
  correctX,
  correctY,
  labelX,
  labelY,
  isSolved = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);

  // SVG viewport
  const width = 460;
  const height = 300;
  const padding = 50;

  // Determine scale maximums with margin
  const maxX = Math.max(correctX * 2, 20000);
  const maxY = Math.max(correctY * 2, 25000);

  // Coordinate transforms
  const toSvgX = (valX: number) => padding + (valX / maxX) * (width - padding * 2);
  const toSvgY = (valY: number) => height - padding - (valY / maxY) * (height - padding * 2);

  // Calculate endpoints for Line 1: a1*x + b1*y = c1
  // when x=0: y = c1/b1; when y=0: x = c1/a1
  const x1_interceptY0 = eq1.a > 0 ? eq1.c / eq1.a : maxX;
  const y1_interceptX0 = eq1.b > 0 ? eq1.c / eq1.b : maxY;

  const line1_p1 = { x: toSvgX(0), y: toSvgY(y1_interceptX0) };
  const line1_p2 = { x: toSvgX(x1_interceptY0), y: toSvgY(0) };

  // Calculate endpoints for Line 2: a2*x + b2*y = c2
  const x2_interceptY0 = eq2.a > 0 ? eq2.c / eq2.a : maxX;
  const y2_interceptX0 = eq2.b > 0 ? eq2.c / eq2.b : maxY;

  const line2_p1 = { x: toSvgX(0), y: toSvgY(y2_interceptX0) };
  const line2_p2 = { x: toSvgX(x2_interceptY0), y: toSvgY(0) };

  const interSvgX = toSvgX(correctX);
  const interSvgY = toSvgY(correctY);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200">
      <div className="flex flex-wrap items-center justify-between mb-3 text-xs sm:text-sm gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3.5 h-1 bg-amber-400 rounded-full inline-block"></span>
            Garis (1): {eq1.a}x + {eq1.b}y = {eq1.c.toLocaleString('id-ID')}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3.5 h-1 bg-cyan-400 rounded-full inline-block"></span>
            Garis (2): {eq2.a}x + {eq2.b}y = {eq2.c.toLocaleString('id-ID')}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs border ${
          isSolved
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
            : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
        }`}>
          {isSolved
            ? `Titik Potong: (${correctX.toLocaleString('id-ID')}, ${correctY.toLocaleString('id-ID')})`
            : 'Titik Potong Solusi: (x = ?, y = ?)'}
        </span>
      </div>

      <div className="relative overflow-hidden bg-slate-950/80 rounded-lg border border-slate-800 flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px] h-auto select-none"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const gx = padding + frac * (width - padding * 2);
            const gy = height - padding - frac * (height - padding * 2);
            return (
              <g key={idx} stroke="#334155" strokeDasharray="3 3" strokeWidth="1">
                <line x1={gx} y1={padding} x2={gx} y2={height - padding} />
                <line x1={padding} y1={gy} x2={width - padding} y2={gy} />
              </g>
            );
          })}

          {/* X and Y Main Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding + 20}
            y2={height - padding}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={padding}
            y2={padding - 20}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={width - padding + 15}
            y={height - padding + 18}
            fill="#cbd5e1"
            fontSize="11"
            textAnchor="end"
            fontWeight="bold"
          >
            X ({labelX})
          </text>
          <text
            x={padding - 10}
            y={padding - 25}
            fill="#cbd5e1"
            fontSize="11"
            textAnchor="start"
            fontWeight="bold"
          >
            Y ({labelY})
          </text>

          {/* Line 1 */}
          <line
            x1={line1_p1.x}
            y1={line1_p1.y}
            x2={line1_p2.x}
            y2={line1_p2.y}
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Line 2 */}
          <line
            x1={line2_p1.x}
            y1={line2_p1.y}
            x2={line2_p2.x}
            y2={line2_p2.y}
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dashed projection to axes for intersection */}
          <line
            x1={interSvgX}
            y1={interSvgY}
            x2={interSvgX}
            y2={height - padding}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1={interSvgX}
            y1={interSvgY}
            x2={padding}
            y2={interSvgY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Intersection Point */}
          <circle
            cx={interSvgX}
            cy={interSvgY}
            r="7"
            fill={isSolved ? '#10b981' : '#f59e0b'}
            stroke="#ffffff"
            strokeWidth="2.5"
            className="cursor-pointer transition-transform hover:scale-125"
          />

          {/* Coordinate label at intersection */}
          <rect
            x={interSvgX - 44}
            y={interSvgY - 30}
            width="88"
            height="20"
            rx="4"
            fill="#0f172a"
            stroke={isSolved ? '#10b981' : '#f59e0b'}
            strokeWidth="1"
          />
          <text
            x={interSvgX}
            y={interSvgY - 16}
            fill={isSolved ? '#4ade80' : '#fbbf24'}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isSolved ? `(${correctX.toLocaleString('id-ID')}, ${correctY.toLocaleString('id-ID')})` : '(x=?, y=?)'}
          </text>
        </svg>
      </div>

      <p className="text-xs text-slate-400 mt-2.5 text-center">
        💡 <strong className="text-amber-300">Konsep SPLDV:</strong> Titik perpotongan kedua garis adalah satu-satunya pasangan nilai $(x, y)$ yang memenuhi kedua persamaan sekaligus!
      </p>
    </div>
  );
};
