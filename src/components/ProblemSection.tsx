import React from 'react';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-neutral-950 text-white relative border-b border-neutral-800/60">
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-amber-500/60" />
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em]">
            EL PROBLEMA
          </span>
          <div className="h-[1px] w-8 bg-amber-500/60" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
          Grabar un anuncio te cuesta <span className="font-serif italic font-normal text-amber-400">un día entero.</span> Y eso es solo el principio.
        </h2>

        {/* Narrative Paragraphs */}
        <div className="text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 max-w-3xl mx-auto mb-14 text-center">
          <p>
            Coordinar la visita a la propiedad. Esperar a que haya buena luz. Contratar a alguien que salga en cámara o armarte de valor para grabarte tú. Conseguir el equipo. Y después, pagar edición y esperar días a que te lo entreguen.
          </p>
          <p>
            Todo eso para <strong className="text-white font-black underline decoration-amber-500/80">un solo anuncio</strong>. Si no funciona, vuelves a empezar desde cero. Por eso la mayoría de asesores termina publicando la misma foto de siempre y esperando a ver qué pasa.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          {/* Card 1: Como se hacia antes */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 font-mono">
                CÓMO SE HACÍA ANTES
              </h3>

              <ul className="space-y-4 text-sm text-neutral-400">
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <span>Agendar y trasladarte a la propiedad</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <span>Cámara, luces y equipo de grabación</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <span>Un actor, un modelo, o grabarte tú mismo</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <span>Pagar edición y esperar la entrega</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <span>Repetir todo si el anuncio no funcionó</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800/80">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">
                UN DÍA COMPLETO · MILES DE PESOS
              </span>
            </div>
          </motion.div>

          {/* Card 2: Como lo haces ahora */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(245,158,11,0.08)]"
          >
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-6 font-mono">
                CÓMO LO HACES AHORA
              </h3>

              <ul className="space-y-4 text-sm text-neutral-200">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Desde tu computadora, en pijama si quieres</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Sin cámara, sin luces, sin equipo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-bold">La IA genera la persona</strong> que aparece en el video
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Listo para subir a Meta el mismo día</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>¿No funcionó? Haces otro en 20 minutos</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800/80">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                20 MINUTOS · CENTAVOS POR VIDEO
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
