export default function Step1Page() {
  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Step 1 / 5
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        基础信息
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">
        基建占位页 — 下一轮迭代会补全：性别选择 + 健身目标卡片。
      </p>

      <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">
          这是一张样卡。它用 <code className="font-mono text-foreground">bg-surface</code> /{" "}
          <code className="font-mono text-foreground">border-border</code> /
          <code className="font-mono text-foreground">shadow-card</code> 这些语义化 token 渲染。
          配色策略后续可以一键替换。
        </p>
      </div>
    </section>
  );
}