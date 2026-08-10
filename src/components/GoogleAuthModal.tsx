import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Lock, Chrome, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handler for Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setError('Por favor ingresa tu correo registrado.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          isLogin: true,
        }),
      });

      const data = await response.json();
      if (data && data.success && data.user) {
        setVerifiedSuccess(true);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
          setVerifiedSuccess(false);
        }, 900);
      } else {
        throw new Error(data.error || 'No se encontró una cuenta con este correo.');
      }
    } catch (err: any) {
      setError(
        err.message ||
          'Cuenta no registrada o sin acceso. Recuerda que la cuenta se activa al completar tu pago en la ventana de compra o por medio de un administrador.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 mb-2">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">Iniciar Sesión</h3>
            <p className="text-xs text-neutral-400">
              Acceso para alumnos con membresía activa o credenciales asignadas
            </p>
          </div>

          {verifiedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-white">¡Acceso Concedido!</h4>
              <p className="text-xs text-neutral-300">
                Tu cuenta ha sido validada. Ingresando al portal de alumnos...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* LOGIN FORM */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Correo Electrónico Registrado <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Chrome className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="tu.correo@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Contraseña de Acceso <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 leading-relaxed font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !loginEmail.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Validando...' : 'Ingresar al Portal'}</span>
                </button>
              </form>

              {/* Informational note for unregistered users */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed">
                <p className="font-bold mb-0.5 text-amber-300">📌 ¿Aún no has adquirido el curso?</p>
                <p>
                  El registro se genera únicamente al realizar tu pago en la ventana de compra o si tu administrador te asignó tus credenciales de acceso.
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-center text-neutral-500 mt-5 leading-normal">
            Hábitad | Marketing Inmobiliario · Acceso Restringido a Alumnos Registrados
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
