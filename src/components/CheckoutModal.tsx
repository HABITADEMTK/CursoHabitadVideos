import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle2, ShieldCheck, Sparkles, Phone, Mail, User, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { UserAccount } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManager?: () => void;
  onGoToCourse?: (userEmail?: string, userName?: string) => void;
}

const PAYPAL_SUBSCRIBE_URL = 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-4UG817674T7108159NKVTWKQ';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenManager,
  onGoToCourse,
}) => {
  const [step, setStep] = useState<'form' | 'redirecting'>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key press & Track InitiateCheckout
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setIsLoading(false);
      if ((window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: 9,
          currency: 'USD',
          content_name: 'Suscripción Curso Creación de Anuncios Inmobiliarios en Video con IA',
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !whatsapp.trim()) {
      return;
    }

    setIsLoading(true);

    const userEmail = email.trim().toLowerCase();
    const userName = name.trim();
    const userWhatsapp = whatsapp.trim();

    // Prepare active student account
    const registeredUser: UserAccount = {
      id: `user-${Date.now()}`,
      email: userEmail,
      name: userName,
      whatsapp: userWhatsapp,
      role: 'student',
      status: 'paid',
      hasCourseAccess: true,
      isPaid: true,
      addedAt: new Date().toISOString().split('T')[0],
    };

    // Save session in local storage so upon returning they are logged in with full access
    try {
      localStorage.setItem('anuncios_ia_current_user', JSON.stringify(registeredUser));
      localStorage.setItem('anuncios_ia_pending_buyer', JSON.stringify(registeredUser));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Register user in backend
    try {
      await Promise.allSettled([
        fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            whatsapp: userWhatsapp,
            isPaid: true,
          }),
        }),
        fetch('/api/users/upgrade-paid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            whatsapp: userWhatsapp,
            status: 'paid',
          }),
        }),
      ]);
    } catch (err) {
      console.warn('Backend registration notice:', err);
    }

    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    setStep('redirecting');
    setIsLoading(false);

    // Redirect to PayPal subscription
    setTimeout(() => {
      window.location.href = PAYPAL_SUBSCRIBE_URL;
    }, 700);
  };

  const handleEnterCourseDirectly = () => {
    onClose();
    if (onGoToCourse) {
      onGoToCourse(email.trim() || 'alumno@ejemplo.com', name.trim() || 'Alumno');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-lg w-full text-white shadow-[0_0_50px_rgba(245,158,11,0.25)] my-auto max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Fixed Header with Title & Close Button */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-neutral-900/95 shrink-0 relative pr-14">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>REGISTRO Y SUSCRIPCIÓN SEGURA</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">Acceso Completo al Curso</h3>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center border border-neutral-700 cursor-pointer transition-colors shadow-md z-10"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'form' ? (
            <div>
              <p className="text-xs text-neutral-400 mb-3">
                Creación de Anuncios Inmobiliarios en Video con IA · Acceso Inmediato
              </p>

              {/* Price Summary Banner */}
              <div className="bg-neutral-950 p-3.5 sm:p-4 rounded-2xl border border-neutral-800 mb-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Suscripción mensual de lanzamiento</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-400">$9</span>
                    <span className="text-sm font-bold text-amber-400/90">USD / mes</span>
                    <span className="text-xs text-neutral-400 ml-1">(~$180 MXN)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="line-through text-xs text-neutral-500 font-mono block">$59 USD / mes</span>
                  <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ahorras $50 USD/mes
                  </span>
                </div>
              </div>

              {/* Tool Credits & Feature Callout */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl mb-4 text-left text-xs text-neutral-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Beneficios incluidos en tu suscripción:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-neutral-200 pl-1">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-white">50 créditos mensuales</strong> en la herramienta <strong className="text-amber-300">mejorami.casa</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-white">50 créditos mensuales</strong> en <strong className="text-amber-300">Avatar Creator Pro</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Acceso completo e ilimitado a todas las lecciones en video HD y Canva Pro</span>
                  </li>
                </ul>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tu Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Sánchez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Número de WhatsApp</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">Importante</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+52 55 1234 5678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                  />
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">
                    Recibirás las credenciales de acceso y recordatorios directamente a tu WhatsApp.
                  </p>
                </div>

                {/* Exclusive PayPal Payment Box */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-blue-500/40 space-y-2.5 mt-2">
                  <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black italic tracking-tighter text-blue-400">PayPal</span>
                      <span className="text-[11px] font-bold text-blue-200">Suscripción Oficial</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                      $9 USD / mes
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    El pago se realiza de forma 100% segura mediante la suscripción oficial de <strong>PayPal</strong>. Acepta Tarjeta de Crédito, Débito o Saldo PayPal. Cancela en cualquier momento sin penalizaciones.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <span className="inline-block animate-pulse font-bold">Conectando con PayPal...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>SUSCRIBIRME CON PAYPAL ($9 USD / MES)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protección al comprador PayPal · Encriptación SSL de 256 bits</span>
                </div>
              </form>
            </div>
          ) : (
            /* Redirecting step */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/40 animate-pulse">
                <ExternalLink className="w-8 h-8 text-blue-400" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-block mb-3 uppercase tracking-wider">
                  🚀 REDIRIGIENDO A PAYPAL
                </span>
                <h3 className="text-2xl font-black text-white mb-2">Completando tu Suscripción</h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  Estamos abriendo la pasarela oficial de suscripción de PayPal para <strong className="text-white">{name || 'tu cuenta'}</strong> ({email}).
                </p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-left space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Al terminar tu pago en PayPal:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  PayPal te regresará automáticamente a la página de inicio del curso con todos los módulos y herramientas desbloqueados.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href={PAYPAL_SUBSCRIBE_URL}
                  target="_self"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Abrir PayPal Ahora si no cargó</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleEnterCourseDirectly}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <span>¿Ya completaste el pago? Ir a la Página de Inicio del Curso</span>
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
