import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle2, ShieldCheck, Zap, CreditCard, Sparkles, Copy, Check, Phone, MessageSquare } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManager?: () => void;
  onGoToCourse?: (userEmail?: string, userName?: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenManager,
  onGoToCourse,
}) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [copiedOxxoAcc, setCopiedOxxoAcc] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'oxxo' | 'spei' | 'paypal'>('spei');
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyClabe = () => {
    navigator.clipboard.writeText('721180100049182350');
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  const handleCopyOxxo = () => {
    navigator.clipboard.writeText('2242170650133700');
    setCopiedOxxoAcc(true);
    setTimeout(() => setCopiedOxxoAcc(false), 2500);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register or authenticate the buyer as 'pending' in the system
      const userEmail = email.trim() || 'alumno.nuevo@gmail.com';
      const userName = name.trim() || 'Nuevo Alumno';

      await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          whatsapp: whatsapp.trim(),
          isPending: true,
        }),
      });

      await fetch('/api/users/upgrade-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          whatsapp: whatsapp.trim(),
          status: 'pending',
        }),
      });

      if (paymentMethod === 'paypal') {
        window.open('https://www.paypal.com/ncp/payment/JCFR6P8KB9KVN', '_blank');
      }

      setIsLoading(false);
      setStep('success');
    } catch (err) {
      setIsLoading(false);
      setStep('success');
    }
  };

  const handleEnterCoursePortal = () => {
    setStep('checkout');
    onClose();
    if (onGoToCourse) {
      onGoToCourse(email.trim() || 'salvadoraliadosdigitales@gmail.com', name.trim() || 'Alumno');
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
        className="relative bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-lg w-full text-white shadow-[0_0_50px_rgba(245,158,11,0.25)] my-auto max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Fixed Header with Title & Close Button */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-neutral-900/95 shrink-0 relative pr-14">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>PROCESO DE PAGO SEGURO</span>
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

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'checkout' ? (
            <div>
              <p className="text-xs text-neutral-400 mb-4">
                Creación de Anuncios Inmobiliarios en Video con IA
              </p>

              {/* Price Summary Banner */}
              <div className="bg-neutral-950 p-3.5 sm:p-4 rounded-2xl border border-neutral-800 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Pago único de lanzamiento</span>
                  <span className="text-2xl font-black text-amber-400">$1,099 MXN</span>
                </div>
                <div className="text-right">
                  <span className="line-through text-xs text-neutral-500 font-mono">$1,999 MXN</span>
                  <span className="block text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ahorras $900 MXN
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Tu Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* WhatsApp Field */}
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
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>En tu WhatsApp recibirás el acceso directo a la plataforma.</span>
                  </p>
                </div>

                {/* Payment selection */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('spei')}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'spei'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>SPEI / Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>PayPal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('oxxo')}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'oxxo'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>OXXO / SPIN</span>
                    </button>
                  </div>
                </div>

                {/* PayPal Box Details */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-blue-500/40 space-y-3">
                    <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                        💳 <span>Pago seguro internacional con PayPal / Tarjeta</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                        PayPal Checkout
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Al hacer clic en pagar, tus datos se registrarán con estatus <strong className="text-amber-400">Pendiente</strong> y se abrirá la pasarela oficial de PayPal para tu pago de <strong>$1,099 MXN</strong>.
                    </p>

                    <a
                      href="https://www.paypal.com/ncp/payment/JCFR6P8KB9KVN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                    >
                      <span>Abrir Enlace Oficial de PayPal</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </a>

                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 flex items-start gap-2 text-[11px] text-neutral-300 leading-snug">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Redirect automático:</strong> Al finalizar en PayPal, la plataforma te devolverá a esta app y recibirás la confirmación de tu acceso.
                      </div>
                    </div>
                  </div>
                )}

                {/* SPEI Details */}
                {paymentMethod === 'spei' && (
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                        🇲🇽 <span>Este proceso sólo aplica para México</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        SPEI Directo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-mono uppercase">Banco</span>
                        <span className="text-sm font-black text-white">Albo</span>
                      </div>
                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] text-neutral-400 block font-mono uppercase">Nombre de la cuenta</span>
                        <span className="text-xs font-bold text-amber-300 leading-tight block">Hábitad Marketing Inmobiliario</span>
                      </div>
                    </div>

                    <div className="bg-neutral-900 p-3 rounded-xl border border-amber-500/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-400 font-mono uppercase">CLABE Interbancaria</span>
                        <button
                          type="button"
                          onClick={handleCopyClabe}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-700 transition-colors"
                        >
                          {copiedClabe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedClabe ? '¡Copiado!' : 'Copiar CLABE'}</span>
                        </button>
                      </div>
                      <span className="text-base sm:text-lg font-black text-amber-400 font-mono tracking-wider block select-all">
                        721180100049182350
                      </span>
                    </div>

                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 flex items-start gap-2 text-[11px] text-neutral-300 leading-snug">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Nota de entrega:</strong> Realiza la transferencia de <strong>$1,099 MXN</strong>. <span className="text-amber-300 font-semibold underline decoration-amber-500">Recibirás el acceso en los próximos minutos</span> a tu WhatsApp y correo registrado.
                      </div>
                    </div>
                  </div>
                )}

                {/* OXXO Details */}
                {paymentMethod === 'oxxo' && (
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                        🏪 <span>Depósito en Ventanilla OXXO</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                        SPIN BY OXXO
                      </span>
                    </div>

                    <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
                      <p className="text-amber-300 font-bold">Instrucciones en caja:</p>
                      <p className="leading-relaxed">
                        En la caja de cualquier tienda OXXO indica que vas a realizar un pago o depósito a una cuenta <strong className="text-amber-400">SPIN BY OXXO</strong>.
                      </p>
                    </div>

                    <div className="bg-neutral-900 p-3 rounded-xl border border-amber-500/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-400 font-mono uppercase">Número de Cuenta SPIN BY OXXO</span>
                        <button
                          type="button"
                          onClick={handleCopyOxxo}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-700 transition-colors"
                        >
                          {copiedOxxoAcc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedOxxoAcc ? '¡Copiado!' : 'Copiar Cuenta'}</span>
                        </button>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-amber-400 font-mono tracking-wider block select-all">
                        2242 1706 5013 3700
                      </span>
                    </div>

                    <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/40 text-xs space-y-2">
                      <p className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Confirmación y Activación del Curso:</span>
                      </p>
                      <p className="text-neutral-300 text-[11px] leading-relaxed">
                        Envía la foto o captura de tu comprobante de pago al WhatsApp <strong className="text-emerald-400 font-mono text-xs">+52 2211 8620 18</strong> para activar tu curso de inmediato.
                      </p>
                      <a
                        href="https://wa.me/522211862018?text=Hola,%20adjunto%20mi%20comprobante%20de%20pago%20en%20OXXO%20para%20activar%20mi%20curso."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-all shadow-md mt-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Enviar Comprobante (+52 2211 8620 18)</span>
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin font-bold">⏳ Registrando...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'spei'
                          ? 'CONFIRMAR TRANSFERENCIA ($1,099 MXN)'
                          : paymentMethod === 'paypal'
                          ? 'PAGAR CON PAYPAL ($1,099 MXN)'
                          : 'CONFIRMAR Y VER DATOS OXXO ($1,099 MXN)'}
                      </span>
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1 mt-2 mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Garantía de satisfacción · Encriptación SSL de 256 bits</span>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>

              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-block mb-3 uppercase tracking-wider">
                ⏳ ESTATUS DE CUENTA: PENDIENTE DE CONFIRMACIÓN
              </span>

              <h3 className="text-2xl font-black text-white mb-2">¡Registro Recibido, {name || 'Asesor'}!</h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto mb-4">
                Hemos registrado tu solicitud de pago de <strong>$1,099 MXN</strong>. Tu cuenta tiene estatus <strong className="text-amber-400 font-bold">Pendiente de Confirmación</strong> mientras se verifica la transferencia o depósito.
              </p>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 text-left space-y-2.5 mb-6">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>ACCESO Y SINOPSIS DEL ESTATUS:</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  • Recibirás la activación a <strong>Estatus Premium</strong> en tu WhatsApp <strong className="text-emerald-400">{whatsapp || 'registrado'}</strong> y correo <strong className="text-amber-300">{email || 'registrado'}</strong> en los próximos minutos.
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  • Mientras tanto, al ingresar a la plataforma puedes comenzar viendo la <strong className="text-amber-300">Clase Gratis (Video 1 del Módulo 1)</strong>.
                </p>
                <p className="text-[11px] text-neutral-400 italic pt-1 border-t border-neutral-800">
                  Los módulos restantes se desbloquearán automáticamente en cuanto tu pago sea verificado por un administrador.
                </p>
              </div>

              <button
                onClick={handleEnterCoursePortal}
                className="w-full py-4 rounded-2xl bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>INGRESAR A LA PLATAFORMA Y VER CLASE 1</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};


