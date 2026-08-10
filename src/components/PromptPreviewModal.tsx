import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Terminal, Copy, Check, Sparkles, RefreshCw, Play } from 'lucide-react';

interface PromptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
}) => {
  const [propertyType, setPropertyType] = useState('Terreno / Lote');
  const [targetAudience, setTargetAudience] = useState('Inversionista');
  const [city, setCity] = useState('Querétaro / Riviera Maya');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedScript = `🚨 ¡ATENCIÓN INVERSIONISTAS EN ${city.toUpperCase()}! 🚨\n\n¿Sabías que adquirir un ${propertyType.toLowerCase()} en preventa hoy puede dejarte una plusvalía superior al 25% el próximo año?\n\nSin trámites complejos y con enganche accesible. Haz clic abajo para recibir la ficha técnica antes de que suba de precio.`;

  const generatedAvatarPrompt = `Avatar digital de un asesor inmobiliario profesional de 32 años, vestido con saco azul marino sin corbata, sonriendo con confianza y sosteniendo una tablet en un entorno moderno de ${propertyType.toLowerCase()}, iluminación cinemática y ángulo vertical 9:16.`;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(`GUION:\n${generatedScript}\n\nPROMPT DE AVATAR:\n${generatedAvatarPrompt}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white shadow-[0_0_50px_rgba(245,158,11,0.2)] my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 w-fit mb-3">
          <Terminal className="w-4 h-4" />
          <span>PROBADOR INTERACTIVO DE PROMPTS DE IA</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          Generador de Guiones y Prompts Inmobiliarios
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Experimenta cómo las fórmulas exactas del curso convierten cualquier parámetro de tu propiedad en guiones y personajes listos para video.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
          <div>
            <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
              Tipo de Inmueble
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Terreno / Lote">Terreno / Lote</option>
              <option value="Casa Residencial">Casa Residencial</option>
              <option value="Departamento en Preventa">Departamento</option>
              <option value="Local Comercial">Local Comercial</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
              Perfil del Cliente
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Inversionista">Inversionista</option>
              <option value="Familia Joven">Familia Joven</option>
              <option value="Comprador Primerizo">Primer Inmueble</option>
              <option value="Jubilado">Jubilado / Retiro</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
              Ubicación / Ciudad
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Output Prompt Box */}
        <div className="space-y-4 mb-6">
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                GUION GENERADO PARA ANUNCIO:
              </span>
              <button
                onClick={handleCopyAll}
                className="text-[11px] flex items-center gap-1 text-neutral-400 hover:text-amber-400"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Todo'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed">
              {generatedScript}
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/30 text-left">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              PROMPT PARA EL PERSONAJE DIGITAL DE IA:
            </span>
            <p className="text-xs text-neutral-300 font-mono leading-relaxed">
              "{generatedAvatarPrompt}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenCheckout();
            }}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>OBTENER LAS 50+ PLANTILLAS DE PROMPTS COMPLETAS</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
