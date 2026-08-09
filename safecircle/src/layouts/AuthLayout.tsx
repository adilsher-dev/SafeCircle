import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Brain, Users } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden border-r border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-ai/10" />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-ai/10 blur-3xl animate-pulse-slow" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-ai flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <span className="font-bold text-2xl tracking-tight">SafeCircle</span>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight leading-tight mb-4"
            >
              AI-powered personal safety, watching over every journey.
            </motion.h2>
            <p className="text-muted text-base leading-relaxed max-w-md">
              Live tracking, instant SOS alerts, and predictive risk intelligence — built for the moments that matter most.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { icon: MapPin, label: 'Live Tracking' },
                { icon: Brain, label: 'AI Risk Engine' },
                { icon: Users, label: 'Trusted Circle' },
              ].map((f) => (
                <div key={f.label} className="glass rounded-2xl p-4 text-center">
                  <f.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted">© {new Date().getFullYear()} SafeCircle. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-primary/5 via-transparent to-ai/5" />
        <div className="w-full max-w-md relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
