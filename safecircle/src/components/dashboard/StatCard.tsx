import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: "primary" | "safe" | "warning" | "danger" | "ai";
  trend?: string;
  delay?: number;
}

const accentStyles = {
  primary: {
    strip: "from-primary to-ai",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconColor: "text-primary",
    glow: "bg-primary/20",
    trend: "text-primary bg-primary/10 border-primary/20",
  },

  safe: {
    strip: "from-safe to-primary",
    iconBg: "bg-safe/10",
    iconBorder: "border-safe/20",
    iconColor: "text-safe",
    glow: "bg-safe/20",
    trend: "text-safe bg-safe/10 border-safe/20",
  },

  warning: {
    strip: "from-warning to-orange-400",
    iconBg: "bg-warning/10",
    iconBorder: "border-warning/20",
    iconColor: "text-warning",
    glow: "bg-warning/20",
    trend: "text-warning bg-warning/10 border-warning/20",
  },

  danger: {
    strip: "from-danger to-red-500",
    iconBg: "bg-danger/10",
    iconBorder: "border-danger/20",
    iconColor: "text-danger",
    glow: "bg-danger/20",
    trend: "text-danger bg-danger/10 border-danger/20",
  },

  ai: {
    strip: "from-ai to-primary",
    iconBg: "bg-ai/10",
    iconBorder: "border-ai/20",
    iconColor: "text-ai",
    glow: "bg-ai/20",
    trend: "text-ai bg-ai/10 border-ai/20",
  },
};

export function StatCard({
  label,
  value,
  icon,
  accent = "primary",
  trend,
  delay = 0,
}: StatCardProps) {
  const style = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{
        y: -6,
      }}
      className="h-full"
    >
      <Card
        hover
        className="relative overflow-hidden border border-border/60 h-[175px]"
      >
        {/* Top Gradient */}

        <div
          className={cn(
            "absolute left-0 top-0 h-1 w-full bg-gradient-to-r",
            style.strip
          )}
        />

        {/* Background Glow */}

        <div
          className={cn(
            "absolute -top-16 -right-16 h-28 w-28 rounded-full blur-3xl opacity-20",
            style.glow
          )}
        />

        <div className="relative flex h-full justify-between">

          {/* LEFT */}

          <div className="flex flex-col justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.16em] text-muted font-semibold">
                {label}
              </p>

              <motion.h2
                initial={{ scale: .95 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + .15 }}
                className="mt-4 text-4xl lg:text-[42px] font-bold tracking-tight"
              >
                {value}
              </motion.h2>

            </div>

            <div>

              {trend ? (
                <div
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]",
                    style.trend
                  )}
                >
                  {trend}
                </div>
              ) : (
                <div className="h-7" />
              )}

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-start">

            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.08,
              }}
              transition={{
                duration: .2,
              }}
              className={cn(
                "relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl border backdrop-blur-xl",
                style.iconBg,
                style.iconBorder
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-3xl blur-2xl opacity-30",
                  style.glow
                )}
              />

              <div className={cn("relative z-10", style.iconColor)}>
                {icon}
              </div>

            </motion.div>

          </div>

        </div>

      </Card>
    </motion.div>
  );
}