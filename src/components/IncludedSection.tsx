import React from 'react';
import { motion } from 'motion/react';
import { Check, Terminal, Sparkles } from 'lucide-react';

interface IncludedSectionProps {
  onOpenPromptDemo: () => void;
}

export const IncludedSection: React.FC<IncludedSectionProps> = ({ onOpenPromptDemo }) => {
  return (
    <section className="py-20 px-4 bg-neutral-950 text-white relative border-b border-neutral-800/60">
      <div className="max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-amber-500/60" />
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em]">
            QUÉ INCLUYE
          </span>
          <div className="h-[1px] w-8 bg-amber-500/60" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Directo al grano. <span className="font-serif italic font-normal text-amber-400">Sin relleno.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl mx-auto">
          No hay teoría, ni introducciones de media hora, ni módulos que no vas a usar. Es el proceso exacto, con la pantalla compartida, para que vayas haciendo mientras miras.
        </p>

        {/* Card Box */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-6 sm:p-10 text-left shadow-2xl relative mb-8"
        >
          <ul className="space-y-4 text-sm sm:text-base text-neutral-300">
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Las <strong className="text-white font-bold">herramientas exactas</strong> que uso y cómo configurarlas
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Cómo escribir el <strong className="text-white font-bold">guion del anuncio</strong> con IA en segundos
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Cómo <strong className="text-white font-bold">generar a la persona</strong> que aparece en el video
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Cómo <strong className="text-white font-bold">crear las escenas</strong> de la propiedad sin pisar el lugar
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Cómo <strong className="text-white font-bold">armar el video final</strong> listo para Facebook e Instagram
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Mis <strong className="text-white font-bold">prompts exactos</strong>, para copiar y pegar
              </span>
            </li>
            <li className="flex items-start gap-3.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Herramienta mejorami.casa</strong> para mejora de imágenes inmobiliarias (50 créditos)
              </span>
            </li>
            <li className="flex items-start gap-3.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Avatar Creator Pro</strong> para creación de avatares hiperrealistas (50 créditos)
              </span>
            </li>
            <li className="flex items-start gap-3.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
              <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold">Canva pro por un año</strong>
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Bottom Note */}
        <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto">
          Terminas con tu primer anuncio hecho. Eso es todo lo que promete y eso es todo lo que hace.
        </p>
      </div>
    </section>
  );
};
