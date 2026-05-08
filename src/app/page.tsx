import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-20%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--color-accent-soft)_0%,_transparent_70%)] opacity-70"
      />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          一个快速·简单·便捷的健康测评
        </span>

        <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-[44px]">
          三分钟<br />
          找到属于你的方案
        </h1>

        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">
          仅需回答几个简单问题，我们将基于你的身体数据生成个性化的建议。
        </p>

        <Link
          href="/quiz/step-1"
          className="group mt-10 inline-flex h-14 w-full items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(234,179,8,0.6)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_10px_32px_-8px_rgba(234,179,8,0.7)] active:scale-[0.985]"
        >
          开始
          <svg
            className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>

        <p className="mt-4 text-xs text-subtle">无需注册 · 数据不会被分享</p>
      </div>
    </main>
  );
}