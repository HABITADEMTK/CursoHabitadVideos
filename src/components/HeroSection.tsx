import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, ArrowDown } from 'lucide-react';
import { IntroVideoPlayer } from './IntroVideoPlayer';

interface HeroSectionProps {
  onScrollToExamples: () => void;
  onOpenCheckout: () => void;
  onStartFreeClass?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToExamples,
  onOpenCheckout,
  onStartFreeClass,
}) => {
  return (
    <section className="relative pt-12 pb-20 px-4 overflow-hidden bg-neutral-950 text-white text-center border-b border-neutral-800/60">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/50 bg-amber-950/60 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>✨ CURSO 100% PRÁCTICO EN VIDEO · ACCESO INMEDIATO Y DE POR VIDA</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.1] max-w-3xl mb-6 font-sans drop-shadow-md"
        >
          CREA ANUNCIOS EN VIDEO PARA BIENES RAÍCES CON INTELIGENCIA ARTIFICIAL EN MINUTOS{' '}
          <span className="inline-block animate-bounce text-2xl sm:text-4xl md:text-5xl align-middle">
            👇🏼
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed mb-6 font-normal"
        >
          <span className="text-white font-semibold underline decoration-amber-500/60 decoration-2 underline-offset-4">
            Sin cámara. Sin actores. Sin ir a la propiedad. Sin editor.
          </span>{' '}
          Aprende a generar videos publicitarios profesionales para vender casas, terrenos y departamentos, desde tu computadora.
        </motion.p>

        {/* Prominent Instant Access Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border-2 border-amber-500/60 p-4 sm:p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[0_0_40px_rgba(245,158,11,0.2)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0 text-2xl shadow-inner">
              🎬
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest block mb-0.5">
                • ACCESO COMPLETO E INMEDIATO
              </span>
              <p className="text-sm sm:text-base font-black text-white leading-snug">
                Accede a todos los módulos en video, plantillas y herramientas desde cualquier dispositivo a tu propio ritmo.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-md transform hover:scale-105"
          >
            Obtener Acceso
          </button>
        </motion.div>

        {/* Horizontal Intro Presentation Video (16:9 format, 1-2 min) */}
        <IntroVideoPlayer />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-2"
        >
          <button
            onClick={onOpenCheckout}
            className="group relative w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-sm sm:text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.65)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-neutral-950 text-neutral-950" />
            <span>INICIA AHORA - OBTENER ACCESO COMPLETO</span>
          </button>

          <button
            onClick={onScrollToExamples}
            className="group relative w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-bold text-sm sm:text-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>VER EJEMPLOS REALES</span>
          </button>
        </motion.div>

        <p className="text-xs sm:text-sm text-neutral-300 font-medium tracking-wide flex items-center justify-center gap-1.5 mt-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Acceso inmediato al confirmar tu pago · Incluye acceso a las herramientas y Canva Pro por 1 año</span>
        </p>
      </div>
    </section>
  );
};
