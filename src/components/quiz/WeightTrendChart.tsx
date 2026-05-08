"use client";

import { motion } from "framer-motion";
import { useId } from "react";

export interface ChartPoint {
  x: number; // 0..1 progress along x-axis
  y: number; // weight in displayed unit
}

interface WeightTrendChartProps {
  points: ChartPoint[];
  unitLabel: string;
  startWeight: number;
  endWeight: number;
}

const VIEW_W = 320;
const VIEW_H = 180;
const PAD_X = 24;
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

export function WeightTrendChart({
  points,
  unitLabel,
  startWeight,
  endWeight,
}: WeightTrendChartProps) {
  const gradientId = useId();

  if (points.length < 2) return null;

  const ys = points.map((p) => p.y);
  const minW = Math.min(...ys);
  const maxW = Math.max(...ys);
  // Pad y-range so endpoints don't touch the edges.
  const pad = Math.max(1, (maxW - minW) * 0.35);
  const yMin = minW - pad;
  const yMax = maxW + pad;

  const xMax = points[points.length - 1].x || 1;
  const innerW = VIEW_W - PAD_X * 2;
  const innerH = VIEW_H - PAD_TOP - PAD_BOTTOM;

  const xy = points.map<[number, number]>((p) => {
    const x = PAD_X + (p.x / xMax) * innerW;
    const y = PAD_TOP + innerH - ((p.y - yMin) / (yMax - yMin)) * innerH;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });

  const pathD = catmullRomToBezier(xy);
  const fillD = `${pathD} L ${xy[xy.length - 1][0]} ${VIEW_H - PAD_BOTTOM} L ${xy[0][0]} ${VIEW_H - PAD_BOTTOM} Z`;

  const start = xy[0];
  const end = xy[xy.length - 1];
  const baselineY = VIEW_H - PAD_BOTTOM;

  // Display weights on labels — round to 1 decimal but drop ".0".
  const fmt = (n: number) =>
    Number.isInteger(n) ? `${n}` : n.toFixed(1).replace(/\.0$/, "");

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="block h-auto w-full"
      role="img"
      aria-label="体重变化趋势图"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline */}
      <line
        x1={PAD_X}
        x2={VIEW_W - PAD_X}
        y1={baselineY}
        y2={baselineY}
        stroke="var(--color-border)"
        strokeWidth="1"
      />

      {/* target dashed line */}
      <line
        x1={PAD_X}
        x2={VIEW_W - PAD_X}
        y1={end[1]}
        y2={end[1]}
        stroke="var(--color-border-strong)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

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

      {/* start dot + label */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${start[0]}px ${start[1]}px` }}
      >
        <circle cx={start[0]} cy={start[1]} r="5" fill="var(--color-surface)" stroke="var(--color-foreground)" strokeWidth="2" />
        <text
          x={start[0]}
          y={start[1] - 12}
          textAnchor="start"
          className="fill-foreground"
          fontSize="11"
          fontWeight="600"
        >
          今天 · {fmt(startWeight)}{unitLabel}
        </text>
      </motion.g>

      {/* end dot + label */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${end[0]}px ${end[1]}px` }}
      >
        <circle cx={end[0]} cy={end[1]} r="6" fill="var(--color-accent)" stroke="var(--color-foreground)" strokeWidth="2" />
        <text
          x={end[0]}
          y={end[1] - 14}
          textAnchor="end"
          className="fill-foreground"
          fontSize="11"
          fontWeight="600"
        >
          目标 · {fmt(endWeight)}{unitLabel}
        </text>
      </motion.g>
    </svg>
  );
}