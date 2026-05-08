export const TOTAL_STEPS = 5;

export const STEP_LABELS: Record<number, string> = {
  1: "基础信息",
  2: "身体数据",
  3: "运动频率",
  4: "分析中",
  5: "你的报告",
};

export function getStepFromPath(pathname: string): number | null {
  const match = pathname.match(/\/quiz\/step-(\d+)/);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) ? n : null;
}
