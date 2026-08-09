import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Wifi,
  WifiOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/utils/format";
import { useSocketStatus } from "@/hooks/useSocketStatus";

export function Topbar({
  onMenuClick,
  title,
}: {
  onMenuClick: () => void;
  title: string;
}) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const connected = useSocketStatus();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-bg/70 border-b border-primary/10">

      <div className="flex items-center justify-between px-5 md:px-8 h-20">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="lg:hidden h-11 w-11 rounded-2xl glass hover:scale-105 transition-all duration-300"
          >
            <Menu className="h-5 w-5 mx-auto" />
          </button>

          <div>

            <h1 className="text-2xl font-bold tracking-tight">
              {title}
            </h1>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted">

              <Sparkles className="h-3.5 w-3.5 text-ai" />

              AI Powered Women's Safety Platform

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          {/* Live Status */}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden xl:flex items-center gap-3 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 to-ai/10 px-4 py-2"
          >
            <div className="relative">

              <span className="absolute h-3 w-3 rounded-full bg-safe animate-ping" />

              <span className="relative block h-3 w-3 rounded-full bg-safe" />

            </div>

            <div>

              <p className="text-xs font-semibold">

                AI Protection Active

              </p>

              <p className="text-[11px] text-muted">

                Real-time Monitoring

              </p>

            </div>

          </motion.div>

          {/* Connection */}

          <motion.div
            whileHover={{ y: -2 }}
            className="hidden md:flex items-center gap-2 rounded-2xl glass px-3 py-2"
          >

            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-safe" />

                <span className="text-xs">

                  Connected

                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-danger" />

                <span className="text-xs">

                  Offline

                </span>
              </>
            )}

          </motion.div>

          {/* Notification */}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/notifications")}
            className="relative h-11 w-11 rounded-2xl glass hover:border-primary/30 transition-all duration-300"
          >

            <Bell className="h-5 w-5 mx-auto text-muted hover:text-text transition-colors" />

            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-danger border border-bg animate-pulse" />

          </motion.button>

          {/* Profile */}

          <div
            className="relative"
            ref={menuRef}
          >

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: .98 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 rounded-2xl glass px-2 py-2 transition-all duration-300"
            >

              <div className="relative">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-safe to-ai font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,.35)]">

                  {initials(user?.fullName)}

                </div>

                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg border border-primary">

                  <ShieldCheck className="h-3 w-3 text-primary" />

                </div>

              </div>

              <div className="hidden lg:block text-left">

                <p className="text-sm font-semibold">

                  {user?.fullName}

                </p>

                <p className="text-xs text-muted">

                  Protected User

                </p>

              </div>

              <ChevronDown
                className={`hidden lg:block h-4 w-4 text-muted transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

                        <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl glass-strong border border-primary/15 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
                >
                  {/* Header */}

                  <div className="relative overflow-hidden p-5 border-b border-primary/10">

                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-ai/5 to-transparent" />

                    <div className="relative flex items-center gap-4">

                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-safe to-ai flex items-center justify-center font-bold text-slate-950 text-lg shadow-[0_0_25px_rgba(16,185,129,.35)]">

                        {initials(user?.fullName)}

                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-white">

                          {user?.fullName}

                        </h3>

                        <p className="truncate text-xs text-muted">

                          {user?.email}

                        </p>

                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2 py-1">

                          <span className="h-2 w-2 rounded-full bg-safe animate-pulse" />

                          <span className="text-[11px] font-medium text-primary">

                            AI Protected

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Menu */}

                  <div className="p-2">

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-primary/10"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all">

                        <User className="h-5 w-5 text-primary" />

                      </div>

                      <div className="text-left">

                        <p className="text-sm font-semibold">

                          My Profile

                        </p>

                        <p className="text-xs text-muted">

                          Account & Preferences

                        </p>

                      </div>

                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      className="group mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-danger/10"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 group-hover:bg-danger/20 transition-all">

                        <LogOut className="h-5 w-5 text-danger" />

                      </div>

                      <div className="text-left">

                        <p className="text-sm font-semibold text-danger">

                          Logout

                        </p>

                        <p className="text-xs text-muted">

                          Securely sign out

                        </p>

                      </div>

                    </button>

                  </div>

                  {/* Footer */}

                  <div className="border-t border-primary/10 px-5 py-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-semibold">

                          SafeCircle

                        </p>

                        <p className="text-[11px] text-muted">

                          AI Safety Network

                        </p>

                      </div>

                      <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">

                        v1.0

                      </div>

                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

    </header>
  );
}
//           {menuOpen && (
//             <div className="absolute right-0 mt-2 w-48 glass-strong rounded-2xl p-1.5 shadow-2xl">
//               <button
//                 onClick={() => {
//                   setMenuOpen(false);
//                   navigate('/profile');
//                 }}
//                 className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text hover:bg-white/5 transition-colors"
//               >
//                 <User className="h-4 w-4" /> Profile
//               </button>
//               <button
//                 onClick={() => {
//                   setMenuOpen(false);
//                   logout();
//                   navigate('/login');
//                 }}
//                 className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors"
//               >
//                 <LogOut className="h-4 w-4" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
