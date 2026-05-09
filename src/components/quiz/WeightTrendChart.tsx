"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export interface ChartPoint {
  x: number; // days from start (gets normalized internally)
  y: number; // weight in displayed unit
  date: Date;
}

interface WeightTrendChartProps {
  points: ChartPoint[];
  unitLabel: string;
  startWeight: number;
  endWeight: number;
}

const VIEW_W = 320;
const VIEW_H = 200;
const PAD_LEFT = 38;
const PAD_RIGHT = 16;
const PAD_TOP = 36;
const PAD_BOTTOM = 28;

function catmullRomToBezier(pts: Array<[number, number]>): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
  if (pts.length === 2) {
    return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const fmt = (n: number) =>
  Number.isInteger(n) ? `${n}` : n.toFixed(1).replace(/\.0$/, "");

const fmtShortDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

// d3-style nice ticks: round numbers strictly inside (min, max).
function niceTicks(min: number, max: number, target = 3): number[] {
  const range = max - min;
  if (range <= 0) return [];
  const rough = range / (target + 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const stepBase =
    normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
  const step = stepBase * magnitude;
  const eps = step * 0.001;
  const ticks: number[] = [];
  const first = Math.ceil((min + eps) / step) * step;
  for (let v = first; v < max - eps; v += step) {
    ticks.push(Number(v.toFixed(6)));
  }
  return ticks;
}

export function WeightTrendChart({
  points,
  unitLabel,
  startWeight,
  endWeight,
}: WeightTrendChartProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ys = points.map((p) => p.y);
  const minW = points.length ? Math.min(...ys) : 0;
  const maxW = points.length ? Math.max(...ys) : 0;
  const pad = Math.max(1, (maxW - minW) * 0.35);
  const yMin = minW - pad;
  const yMax = maxW + pad;

  const xMax = points.length ? points[points.length - 1].x || 1 : 1;
  const innerW = VIEW_W - PAD_LEFT - PAD_RIGHT;
  const innerH = VIEW_H - PAD_TOP - PAD_BOTTOM;

  const xy = points.map<[number, number]>((p) => {
    const x = PAD_LEFT + (p.x / xMax) * innerW;
    const y = PAD_TOP + innerH - ((p.y - yMin) / (yMax - yMin)) * innerH;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });

  const yToScreen = (val: number) =>
    PAD_TOP + innerH - ((val - yMin) / (yMax - yMin)) * innerH;

  const yTicks = niceTicks(minW, maxW).map((value) => ({
    value,
    y: yToScreen(value),
  }));

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || xy.length === 0) return;
      const clientX = e.clientX;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = svg.getBoundingClientRect();
        const vbX = ((clientX - rect.left) / rect.width) * VIEW_W;
        let nearest = 0;
        let minDist = Infinity;
        for (let i = 0; i < xy.length; i++) {
          const d = Math.abs(xy[i][0] - vbX);
          if (d < minDist) {
            minDist = d;
            nearest = i;
          }
        }
        setHoverIdx((prev) => (prev === nearest ? prev : nearest));
      });
    },
    [xy],
  );

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHoverIdx(null);
  }, []);

  if (points.length < 2) return null;

  const pathD = catmullRomToBezier(xy);
  const fillD = `${pathD} L ${xy[xy.length - 1][0]} ${VIEW_H - PAD_BOTTOM} L ${xy[0][0]} ${VIEW_H - PAD_BOTTOM} Z`;

  const start = xy[0];
  const end = xy[xy.length - 1];
  const baselineY = VIEW_H - PAD_BOTTOM;

  // Place each endpoint label on the side AWAY from the curve, so the
  // line never crosses the text. Compare neighbor's screen-y: if the
  // neighbor sits below the endpoint (larger y), curve descends from
  // here → label goes above; otherwise curve ascends → label goes below.
  const startLabelAbove = xy[1][1] >= start[1];
  const endLabelAbove = xy[xy.length - 2][1] >= end[1];
  const startLabelY = startLabelAbove ? start[1] - 12 : start[1] + 18;
  const endLabelY = endLabelAbove ? end[1] - 14 : end[1] + 20;

  const hoverPoint = hoverIdx != null ? xy[hoverIdx] : null;
  const hoverData = hoverIdx != null ? points[hoverIdx] : null;

  const TOOLTIP_W = 78;
  const TOOLTIP_H = 38;
  const TOOLTIP_GAP = 12;
  let tooltipX = 0;
  let tooltipY = 0;
  if (hoverPoint) {
    tooltipX = Math.max(
      PAD_LEFT,
      Math.min(VIEW_W - PAD_RIGHT - TOOLTIP_W, hoverPoint[0] - TOOLTIP_W / 2),
    );
    tooltipY = Math.max(PAD_TOP - TOOLTIP_H - 4, hoverPoint[1] - TOOLTIP_H - TOOLTIP_GAP);
  }

  const isHovering = hoverIdx != null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="block h-auto w-full touch-pan-y select-none"
      role="img"
      aria-label="体重变化趋势图"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline */}
      <line
        x1={PAD_LEFT}
        x2={VIEW_W - PAD_RIGHT}
        y1={baselineY}
        y2={baselineY}
        stroke="var(--color-border)"
        strokeWidth="1"
      />

      {/* Y-axis grid + labels (nice round values, strictly interior) */}
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line
            x1={PAD_LEFT}
            x2={VIEW_W - PAD_RIGHT}
            y1={tick.y}
            y2={tick.y}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity={0.6}
          />
          <text
            x={PAD_LEFT - 8}
            y={tick.y + 3}
            textAnchor="end"
            className="fill-muted"
            fontSize="10"
          >
            {fmt(tick.value)}
          </text>
        </g>
      ))}

      {/* fill under curve */}
      <motion.path
        d={fillD}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      />

      {/* curve */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* start dot + label (fade out while hovering) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: isHovering ? 0 : 1, scale: 1 }}
        transition={{
          opacity: isHovering
            ? { duration: 0.12 }
            : { delay: 0.15, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
          scale: { delay: 0.15, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ transformOrigin: `${start[0]}px ${start[1]}px` }}
      >
        <circle
          cx={start[0]}
          cy={start[1]}
          r="5"
          fill="var(--color-surface)"
          stroke="var(--color-foreground)"
          strokeWidth="2"
        />
        <text
          x={start[0]}
          y={startLabelY}
          textAnchor="start"
          className="fill-foreground"
          fontSize="11"
          fontWeight="600"
        >
          今天 · {fmt(startWeight)}
          {unitLabel}
        </text>
      </motion.g>

      {/* end dot + label (fade out while hovering) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: isHovering ? 0 : 1, scale: 1 }}
        transition={{
          opacity: isHovering
            ? { duration: 0.12 }
            : { delay: 1.0, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
          scale: { delay: 1.0, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ transformOrigin: `${end[0]}px ${end[1]}px` }}
      >
        <circle
          cx={end[0]}
          cy={end[1]}
          r="6"
          fill="var(--color-accent)"
          stroke="var(--color-foreground)"
          strokeWidth="2"
        />
        <text
          x={end[0]}
          y={endLabelY}
          textAnchor="end"
          className="fill-foreground"
          fontSize="11"
          fontWeight="600"
        >
          目标 · {fmt(endWeight)}
          {unitLabel}
        </text>
      </motion.g>

      {/* hover crosshair + dot + tooltip */}
      {hoverPoint && hoverData && (
        <g>
          <line
            x1={hoverPoint[0]}
            x2={hoverPoint[0]}
            y1={hoverPoint[1] + 6}
            y2={baselineY}
            stroke="var(--color-foreground)"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <circle
            cx={hoverPoint[0]}
            cy={hoverPoint[1]}
            r="5.5"
            fill="var(--color-accent)"
            stroke="var(--color-surface)"
            strokeWidth="2.5"
          />
          <g>
            <rect
              x={tooltipX}
              y={tooltipY}
              width={TOOLTIP_W}
              height={TOOLTIP_H}
              rx="8"
              fill="var(--color-foreground)"
              opacity="0.94"
            />
            <text
              x={tooltipX + TOOLTIP_W / 2}
              y={tooltipY + 14}
              textAnchor="middle"
              className="fill-surface"
              fontSize="9.5"
              opacity="0.7"
            >
              {fmtShortDate(hoverData.date)}
            </text>
            <text
              x={tooltipX + TOOLTIP_W / 2}
              y={tooltipY + 29}
              textAnchor="middle"
              className="fill-surface"
              fontSize="12"
              fontWeight="600"
            >
              {fmt(hoverData.y)} {unitLabel}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}