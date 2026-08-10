import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, LogIn, User, Lock, Phone, Chrome, CheckCircle2, UserPlus } from 'lucide-react';
import { UserAccount } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

const COUNTRY_CODES = [
  { code: '+52', flag: '🇲🇽', country: 'México' },
  { code: '+57', flag: '🇨🇴', country: 'Colombia' },
  { code: '+1', flag: '🇺🇸', country: 'EE.UU. / Canadá' },
  { code: '+34', flag: '🇪🇸', country: 'España' },
  { code: '+54', flag: '🇦🇷', country: 'Argentina' },
  { code: '+56', flag: '🇨🇱', country: 'Chile' },
  { code: '+51', flag: '🇵🇪', country: 'Perú' },
  { code: '+593', flag: '🇪🇨', country: 'Ecuador' },
  { code: '+502', flag: '🇬🇹', country: 'Guatemala' },
  { code: '+506', flag: '🇨🇷', country: 'Costa Rica' },
  { code: '+507', flag: '🇵🇦', country: 'Panamá' },
  { code: '+1-809', flag: '🇩🇴', country: 'Rep. Dominicana' },
  { code: '+598', flag: '🇺🇾', country: 'Uruguay' },
  { code: '+58', flag: '🇻🇪', country: 'Venezuela' },
  { code: '+503', flag: '🇸🇻', country: 'El Salvador' },
  { code: '+504', flag: '🇭🇳', country: 'Honduras' },
  { code: '+591', flag: '🇧🇴', country: 'Bolivia' },
  { code: '+595', flag: '🇵🇾', country: 'Paraguay' },
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [whatsappPhone, setWhatsappPhone] = useState('');

  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handler for Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('El nombre completo es obligatorio.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo de Google válido.');
      return;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!whatsappPhone.trim()) {
      setError('El número de WhatsApp es obligatorio.');
      return;
    }

    const fullWhatsappNumber = `${countryCode} ${whatsappPhone.trim()}`;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: fullName.trim(),
          whatsapp: fullWhatsappNumber,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            email
          )}`,
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
        throw new Error(data.error || 'Error al completar el registro.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrar tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setError('Por favor ingresa tu correo de Google registrado.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
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
        throw new Error(data.error || 'Error al iniciar sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar las credenciales.');
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
          <div className="text-center space-y-1.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 mb-2">
              <Chrome className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">Acceso al Curso</h3>
            <p className="text-xs text-neutral-400">
              <span className="text-amber-400 font-bold">Hábitad | Marketing inmobiliario</span>
            </p>
          </div>

          {verifiedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-white">¡Acceso Concedido!</h4>
              <p className="text-xs text-neutral-300">
                Tu cuenta ha sido validada. Ingresando a la 1ª Clase Gratis...
              </p>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-2xl border border-neutral-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-amber-500 text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrarse</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-amber-500 text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>
              </div>

              {/* Form Content */}
              {activeTab === 'register' ? (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Nombre Completo <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Salvador Aliados"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Correo Electrónico de Google <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Chrome className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="tu.correo@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Contraseña <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      WhatsApp con Indicativo de País <span className="text-amber-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code + c.country} value={c.code}>
                            {c.flag} {c.code} ({c.country})
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="55 1234 5678"
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs font-bold text-red-400 pt-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Creando cuenta...' : 'Completar Registro e Ingresar'}</span>
                  </button>
                </form>
              ) : (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Correo Electrónico de Google
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
                      Contraseña
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

                  {error && <p className="text-xs font-bold text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || !loginEmail.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
                  </button>
                </form>
              )}
            </>
          )}

          <p className="text-[10px] text-center text-neutral-500 mt-4 leading-normal">
            Al registrarte aceptas los términos del curso y el acceso a la 1ª clase gratis.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
