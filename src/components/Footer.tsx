import React from 'react';
import { Lock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCheckout: () => void;
  onOpenManager?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCheckout, onOpenManager }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 px-4 border-t border-neutral-900 text-xs">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold text-lg tracking-tight">Hábitad</span>
          <span className="text-neutral-600 font-bold">|</span>
          <span className="text-neutral-300 font-medium">Marketing inmobiliario</span>
        </div>

        <p className="max-w-xl text-neutral-400 leading-relaxed">
          Programa práctico diseñado por Hábitad | Marketing inmobiliario para asesores, brokers y desarrolladores que buscan escalar sus ventas con anuncios de video creados mediante inteligencia artificial.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 font-medium">
          <button onClick={onOpenCheckout} className="hover:text-amber-400 transition-colors">
            Acceso al Curso
          </button>
          <a href="#ejemplos" className="hover:text-amber-400 transition-colors">
            Ejemplos de Video
          </a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">
            Preguntas Frecuentes
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 border-t border-b border-neutral-900/80 py-4 w-full">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pago Seguro Encriptado</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">
              Garantía de Satisfacción
            </span>
          </div>
          <span>•</span>
          <span>Procesado por Stripe</span>
        </div>

        <div className="text-[11px] text-neutral-400">
          © {new Date().getFullYear()} Hábitad | Marketing inmobiliario. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
