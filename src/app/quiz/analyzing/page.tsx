"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnalyzeLoader } from "@/components/quiz/AnalyzeLoader";

export default function AnalyzingPage() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    router.push("/quiz/step-5");
  }, [router]);

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accent-soft)_0%,_transparent_60%)]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative">
        <AnalyzeLoader onComplete={handleComplete} />
      </div>
    </section>
  );
}