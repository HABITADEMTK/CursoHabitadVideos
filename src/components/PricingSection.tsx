import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Lock, Zap, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onOpenCheckout: () => void;
  onStartFreeClass?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenCheckout,
  onStartFreeClass,
}) => {
  return (
    <section id="oferta" className="py-20 px-4 bg-neutral-950 text-white relative border-b border-neutral-800/60">
      <div className="max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-amber-500/60" />
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em]">
            ACCESO COMPLETO
          </span>
          <div className="h-[1px] w-8 bg-amber-500/60" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-10">
          Un solo pago, <span className="font-serif italic font-normal text-amber-400">acceso de por vida.</span>
        </h2>

        {/* Pricing Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-neutral-900 border border-neutral-800/90 rounded-3xl p-6 sm:p-10 max-w-xl mx-auto relative shadow-[0_0_50px_rgba(245,158,11,0.08)] flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-neutral-950 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>• PRECIO DE LANZAMIENTO</span>
          </div>

          {/* Strikethrough original price */}
          <div className="text-neutral-500 line-through text-lg sm:text-xl font-mono font-bold mb-1">
            $1,999 MXN
          </div>

          {/* Current Big Price */}
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl sm:text-7xl font-black text-amber-400 tracking-tight font-sans">$1,099</span>
            <span className="text-lg sm:text-2xl font-black text-amber-400/90 tracking-wide font-sans">MXN</span>
          </div>

          {/* Price subtitle */}
          <p className="text-neutral-400 text-xs sm:text-sm font-medium mb-8">
            Pago único · Sin mensualidades · Acceso de por vida
          </p>

          {/* Features checklist */}
          <ul className="w-full text-left space-y-3.5 text-xs sm:text-sm text-neutral-300 mb-8 border-t border-b border-neutral-800/80 py-6">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Vamos directo al grano</strong>, paso a paso y con pantalla compartida
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Los <strong className="text-white font-bold">prompts exactos</strong> que uso, listos para copiar y pegar
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Las <strong className="text-white font-bold">herramientas exactas</strong> y cómo configurar cada una
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Los <strong className="text-white font-bold">anuncios de ejemplo</strong> explicados paso a paso
              </span>
            </li>
            <li className="flex items-start gap-3 bg-amber-500/10 p-2 rounded-xl border border-amber-500/30">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Herramienta mejorami.casa</strong> para mejora de imágenes inmobiliarias (50 créditos)
              </span>
            </li>
            <li className="flex items-start gap-3 bg-amber-500/10 p-2 rounded-xl border border-amber-500/30">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Avatar Creator Pro</strong> para creación de avatares hiperrealistas (50 créditos)
              </span>
            </li>
            <li className="flex items-start gap-3 bg-amber-500/10 p-2 rounded-xl border border-amber-500/30">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Canva pro por un año</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Acceso de por vida a grabaciones y materiales, desde celular o PC</span>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="w-full space-y-3 mb-2">
            <button
              onClick={onOpenCheckout}
              className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.65)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-neutral-950 text-neutral-950" />
              <span>INICIA AHORA - ACCESO INMEDIATO</span>
            </button>

            <p className="text-xs sm:text-sm text-neutral-300 font-medium tracking-wide flex items-center justify-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>📹 Incluye acceso inmediato a todas las lecciones en video, plantillas de prompts y herramientas</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
