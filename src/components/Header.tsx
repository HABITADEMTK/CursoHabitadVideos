import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Zap, Sparkles, LogIn } from 'lucide-react';

interface HeaderProps {
  onCheckout: () => void;
  onOpenLogin?: () => void;
  currentUser?: any;
}

export const Header: React.FC<HeaderProps> = ({
  onCheckout,
  onOpenLogin,
  currentUser,
}) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 15, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-amber-500/20 py-2.5 px-4 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-300">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            CURSO EN VIVO POR GOOGLE MEET
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-300">
            Viernes 14 de Agosto · 19:00 hrs (Hora CDMX)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Inicia sesión</span>
            </button>
          )}

          <button
            onClick={onCheckout}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-xs px-3.5 py-1.5 rounded-full transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>INICIA AHORA ($1,099 MXN)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
