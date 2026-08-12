import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { FaqItem } from '../types';

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-0',
    question: '¿Cómo accedo al curso y cuándo puedo empezar?',
    answer:
      'El curso es 100% online y grabado en video HD para que aprendas a tu propio ritmo. Al inscribirte obtienes acceso inmediato e ilimitado a la plataforma de alumnos, a las lecciones en video, a las herramientas incluidas (mejorami.casa, Avatar Creator Pro, Canva Pro por un año) y a todos los materiales descargables.',
  },
  {
    id: 'faq-1',
    question: '¿Tengo que pagar algo más aparte del curso?',
    answer:
      'Sí, las plataformas de IA funcionan con créditos y esos los pones tú. Pero es muy poco: con alrededor de 10 USD tienes para hacer varios anuncios. Compáralo con lo que cuesta un día de grabación con cámara, locación, alguien que salga en el video y edición. Esta es, por mucho, la forma más barata de producir anuncios.',
  },
  {
    id: 'faq-2',
    question: '¿Necesito saber de edición o de tecnología?',
    answer:
      'En absoluto. No necesitas saber editar video, ni usar programas complejos, ni programar. El proceso está pensado para que cualquier persona, sin importar su edad o nivel tecnológico, pueda replicarlo paso a paso desde su pantalla.',
  },
  {
    id: 'faq-3',
    question: '¿Tengo que salir yo en el video?',
    answer:
      'Para nada. Esa es una de las mayores ventajas: la Inteligencia Artificial genera avatares hiperrealistas y modelos digitales que hablan por ti en el video con una pronunciación y fluidez perfecta.',
  },
  {
    id: 'faq-4',
    question: '¿Necesito visitar la propiedad o tener fotos profesionales?',
    answer:
      'No es obligatorio. Te enseñamos cómo generar escenas hiperrealistas del inmueble, fachadas o interiores usando IA a partir de descripciones o fotos sencillas que tengas del desarrollo o terreno.',
  },
  {
    id: 'faq-5',
    question: '¿De verdad se hace en 20 minutos?',
    answer:
      'Sí. Una vez que dominas la plantilla y utilizas los prompts listos para copiar y pegar que te proporcionamos, la creación del guion, la generación del personaje y la exportación final toma menos de 20 minutos.',
  },
  {
    id: 'faq-6',
    question: '¿Sirve para casas, terrenos y departamentos?',
    answer:
      'Funciona perfectamente para todo tipo de propiedad: casas residenciales, lotes y terrenos de inversión, departamentos, locales comerciales e incluso desarrollos en preventa.',
  },
  {
    id: 'faq-7',
    question: '¿El pago es mensual?',
    answer:
      'No, es un pago único de $1,099 MXN. Obtienes acceso de por vida al programa, a las plantillas y a todas las actualizaciones futuras sin mensualidades ni cargos recurrentes.',
  },
];

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-neutral-950 text-white relative border-b border-neutral-800/60">
      <div className="max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-amber-500/60" />
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em]">
            PREGUNTAS FRECUENTES
          </span>
          <div className="h-[1px] w-8 bg-amber-500/60" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-12">
          Antes de <span className="font-serif italic font-normal text-amber-400">acceder</span>
        </h2>

        {/* Accordion FAQ list */}
        <div className="space-y-3.5 text-left">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-white hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/50 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
