"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useT, type I18nKey } from "@/lib/i18n";

interface Plan {
  id: string;
  titleKey: I18nKey;
  totalPrice: number;
  perMonth: number;
  badgeKey?: I18nKey;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  { id: "monthly", titleKey: "price.monthly", totalPrice: 98, perMonth: 98 },
  {
    id: "quarter",
    titleKey: "price.quarter",
    totalPrice: 168,
    perMonth: 56,
    badgeKey: "price.badgePopular",
    highlight: true,
  },
  { id: "yearly", titleKey: "price.yearly", totalPrice: 298, perMonth: 25, badgeKey: "price.badgeSave" },
];

interface PriceModalProps {
  open: boolean;
  onClose: () => void;
}

export function PriceModal({ open, onClose }: PriceModalProps) {
  const t = useT();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const handlePick = (plan: Plan) => {
    setToast(t("price.toastSelected", { plan: t(plan.titleKey) }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="price-modal"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label={t("price.closeAria")}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="price-modal-title"
            className="relative z-10 w-full max-w-xl rounded-t-[2rem] bg-background px-5 pb-7 pt-5 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.18)] sm:m-4 sm:rounded-[2rem] sm:pt-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border-strong sm:hidden" />

            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X size={18} strokeWidth={2.2} />
            </button>

            <div className="space-y-2 text-center">
              <h2
                id="price-modal-title"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                {t("price.title")}
              </h2>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">
                {t("price.subtitle")}
              </p>
            </div>

            <ul className="mt-7 space-y-3">
              {PLANS.map((plan) => (
                <li key={plan.id}>
                  <motion.button
                    type="button"
                    onClick={() => handlePick(plan)}
                    whileTap={{ scale: 0.985 }}
                    className={`relative flex w-full cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-200 ease-out hover:shadow-[var(--shadow-card-hover)] ${
                      plan.highlight
                        ? "border-accent bg-accent-soft/50 shadow-[var(--shadow-card)]"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    {plan.badgeKey && (
                      <span
                        className={`absolute -top-2 left-5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          plan.highlight
                            ? "bg-accent text-accent-foreground"
                            : "bg-foreground text-background"
                        }`}
                      >
                        {t(plan.badgeKey)}
                      </span>
                    )}
                    <div>
                      <div className="text-base font-semibold text-foreground">
                        {t(plan.titleKey)}
                      </div>
                      <div className="mt-0.5 text-xs text-muted">
                        {t("price.perMonth", { price: plan.perMonth })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-foreground">
                        {t("price.totalPrice", { price: plan.totalPrice })}
                      </div>
                      <div className="text-[11px] text-subtle">{t("price.totalLabel")}</div>
                    </div>
                  </motion.button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-center gap-3 text-[11px] text-subtle">
              <span className="inline-flex items-center gap-1">
                <Check size={12} strokeWidth={2.6} /> {t("price.benefit7d")}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="inline-flex items-center gap-1">
                <Check size={12} strokeWidth={2.6} /> {t("price.benefitCancel")}
              </span>
            </div>
          </motion.div>

          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none fixed left-1/2 top-6 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
                role="status"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}