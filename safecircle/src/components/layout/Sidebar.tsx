import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  History,
  Brain,
  ShieldAlert,
  Users,
  Bell,
  BarChart3,
  Settings,
  Radio,
  Crown,
  X,
  ShieldCheck,
  Activity,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { to: "/journey/start", label: "Start Journey", icon: MapPin },
  { to: "/journey/history", label: "Journey Logs", icon: History },
  { to: "/tracking", label: "Live Monitor", icon: Radio },
  { to: "/ai-risk", label: "AI Guardian", icon: Brain },
  { to: "/sos", label: "SOS Center", icon: ShieldAlert },
  { to: "/contacts", label: "Trusted Contacts", icon: Users },
  { to: "/alerts", label: "Safety Alerts", icon: ShieldAlert },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/analytics", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Preferences", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      {/* Mobile Overlay */}

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-72 z-50 lg:z-0 flex flex-col glass-strong border-r border-primary/10 shadow-[0_0_50px_rgba(16,185,129,0.08)] transition-transform duration-300",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ==========================
              Logo Section
        ========================== */}

        <div className="relative overflow-hidden border-b border-primary/10">

          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-ai/5" />

          <div className="relative px-6 pt-6 pb-5">

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <motion.div
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ duration: .25 }}
                  className="relative h-14 w-14 rounded-3xl bg-gradient-to-br from-primary via-safe to-ai flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                >
                  <ShieldCheck className="h-7 w-7 text-slate-950" />

                  <div className="absolute -inset-1 rounded-3xl border border-primary/30" />
                </motion.div>

                <div>

                  <h1 className="text-xl font-bold tracking-tight">
                    SafeCircle
                  </h1>

                  <p className="text-xs text-muted mt-0.5">
                    AI Safety Network
                  </p>

                </div>

              </div>

              <button
                onClick={onCloseMobile}
                className="lg:hidden text-muted hover:text-text transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Live Badge */}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .2 }}
              className="mt-5 flex items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2"
            >

              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full rounded-full bg-safe animate-ping" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-safe" />

                </span>

                <span className="text-xs font-medium">
                  Monitoring Active
                </span>

              </div>

              <Activity className="h-4 w-4 text-primary" />

            </motion.div>

          </div>

        </div>

        {/* ==========================
              Navigation
        ========================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">

                  {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-muted hover:text-white hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      {/* Active Background */}
                      <motion.div
                        layoutId="sidebar-active"
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 28,
                        }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-ai/10 border border-primary/20"
                      />

                      {/* Left Indicator */}
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                      />
                    </>
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary/15 text-primary shadow-[0_0_20px_rgba(16,185,129,.25)]"
                        : "bg-white/5 group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span className="relative z-10 flex-1">
                    {item.label}
                  </span>

                  {isActive && (
                    <Sparkles className="relative z-10 h-4 w-4 text-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Admin Section */}

          {isAdmin && (
            <div className="mt-5 border-t border-primary/10 pt-5">

              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/20 text-amber-300"
                      : "text-muted hover:text-amber-300 hover:bg-amber-500/10"
                  )
                }
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-all">
                  <Crown className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Admin Panel
                  </p>
                  <p className="text-[11px] opacity-70">
                    Secure Access
                  </p>
                </div>
              </NavLink>

            </div>
          )}

        </nav>

        {/* Footer */}

        <div className="border-t border-primary/10 p-4">

          <div className="glass rounded-3xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <ShieldCheck className="h-5 w-5 text-safe" />

              <span className="font-semibold">
                Protection Status
              </span>

            </div>

            <div className="space-y-2 text-xs">

              <div className="flex items-center justify-between">

                <span className="text-muted">
                  AI Monitoring
                </span>

                <span className="text-safe">
                  Active
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-muted">
                  GPS Tracking
                </span>

                <span className="text-safe">
                  Ready
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-muted">
                  Encryption
                </span>

                <span className="text-safe">
                  Enabled
                </span>

              </div>

            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-r from-primary/10 to-ai/10 border border-primary/10 px-3 py-2">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold">
                    SafeCircle
                  </p>

                  <p className="text-[10px] text-muted">
                    Hackathon Edition • v1.0
                  </p>

                </div>

                <Sparkles className="h-4 w-4 text-primary" />

              </div>

            </div>

          </div>

        </div>

      </aside>

    </>
  );
}