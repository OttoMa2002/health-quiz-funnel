export const TOTAL_STEPS = 5;

export const STEP_LABELS: Record<number, string> = {
  1: "性别",
  2: "健身目标",
  3: "身体数据",
  4: "运动频率",
  5: "你的报告",
};

export function getStepFromPath(pathname: string): number | null {
  const match = pathname.match(/\/quiz\/step-(\d+)/);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) ? n : null;
}
