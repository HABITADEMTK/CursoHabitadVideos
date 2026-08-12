import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface FloatingChatWidgetProps {
  onOpenCheckout: () => void;
  onStartFreeClass?: () => void;
}

const QUICK_QUESTIONS = [
  '¿Cómo puedo acceder al curso completo?',
  '¿Qué herramientas incluye el curso?',
  '¿Necesito experiencia previa?',
  '¿Cómo realizo mi pago e inscripción?',
];

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onOpenCheckout,
  onStartFreeClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    '¡Hola! 👋 Soy el asesor virtual con IA de Hábitad | Marketing inmobiliario. ¿Tienes alguna duda sobre el curso de Creación de Anuncios Inmobiliarios en Video con IA?'
  );

  // Voice Interaction States
  const [isListening, setIsListening] = useState(false);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'es-MX';

    rec.onresult = (event: any) => {
      let currentText = '';
      if (event && event.results) {
        for (let i = event.resultIndex || 0; i < event.results.length; i++) {
          if (event.results[i] && event.results[i][0]) {
            currentText += event.results[i][0].transcript || '';
          }
        }
        setInput(currentText);
      }
    };

        rec.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta entrada de voz directa. Puedes escribir tu consulta por texto.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Text-To-Speech function
  const speakText = (text: string, msgId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (msgId && speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    // Clean markdown formatting for clearer speech
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\(http[^)]+\)/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-MX';
    utterance.rate = 1.0;

    // Try to pick Spanish voice if available
    try {
      const rawVoices = window.speechSynthesis.getVoices();
      const voices = Array.isArray(rawVoices) ? rawVoices : [];
      const esVoice = voices.find((v) => v && v.lang && typeof v.lang === 'string' && v.lang.startsWith('es'));
      if (esVoice) {
        utterance.voice = esVoice;
      }
    } catch (e) {
      console.warn('Speech synthesis voice selection error:', e);
    }

    if (msgId) setSpeakingMsgId(msgId);

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Load welcome message from server chat config
  useEffect(() => {
    fetch('/api/chat-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.config?.welcomeMessage) {
          setWelcomeMessage(data.config.welcomeMessage);
        }
      })
      .catch((err) => console.warn('Could not load chat config:', err));
  }, []);

  // Initialize first message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeObj: ChatMessage = {
        id: 'welcome-msg',
        sender: 'bot',
        text: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([welcomeObj]);
      if (autoVoiceEnabled) {
        speakText(welcomeMessage, 'welcome-msg');
      }
    }
  }, [isOpen, welcomeMessage, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const newHistory = [...(messages || []), userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: (newHistory || []).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (data && data.reply) {
        const botMsgId = 'msg-' + (Date.now() + 1);
        const botMsg: ChatMessage = {
          id: botMsgId,
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...(prev || []), botMsg]);

        if (autoVoiceEnabled) {
          speakText(data.reply, botMsgId);
        }
      } else {
        throw new Error(data.error || 'Respuesta no válida');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsgText =
        '¡Hola! Puedo ayudarte con cualquier consulta sobre los módulos del curso de Hábitad | Marketing inmobiliario. ¡Haz clic en "Inicia gratis" para ver la primera lección sin costo!';
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'bot',
        text: errorMsgText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...(prev || []), errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAction = () => {
    setIsOpen(false);
    if (onStartFreeClass) {
      onStartFreeClass();
    } else {
      onOpenCheckout();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 p-3 sm:px-4 sm:py-3.5 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] border border-amber-300/40 cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-neutral-950/90 text-amber-400 flex items-center justify-center border border-amber-400/40">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-neutral-900"></span>
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-neutral-900" /> Asesor IA · Hábitad
              </span>
              <span className="text-xs font-black text-neutral-950 leading-tight">
                ¿Tienes dudas o deseas voz? Chatea aquí
              </span>
            </div>

            <span className="sm:hidden text-xs font-black text-neutral-950 pr-1">
              Asesor IA
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] sm:w-[390px] h-[530px] max-h-[85vh] bg-neutral-900 border border-amber-500/40 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-white border-b-2 border-b-amber-500"
          >
            {/* Header */}
            <div className="bg-neutral-950 p-3.5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-extrabold text-white">Asesor IA · Hábitad</h3>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                      GEMINI + VOZ
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>En línea · Interacción con voz habilitada</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Auto Voice Output Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoVoiceEnabled;
                    setAutoVoiceEnabled(next);
                    if (!next && typeof window !== 'undefined') {
                      window.speechSynthesis.cancel();
                      setSpeakingMsgId(null);
                    }
                  }}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                    autoVoiceEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                  }`}
                  title={autoVoiceEnabled ? 'Voz automática ACTIVADA' : 'Activar voz automática'}
                >
                  {autoVoiceEnabled ? <Volume2 className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3" />}
                  <span>{autoVoiceEnabled ? 'Voz On' : 'Voz Off'}</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.speechSynthesis.cancel();
                    }
                    setIsOpen(false);
                  }}
                  className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-gradient-to-b from-neutral-950/60 to-neutral-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500">
                    {msg.sender === 'bot' ? (
                      <>
                        <Bot className="w-3 h-3 text-amber-400" />
                        <span className="font-bold text-amber-400">Asesor IA</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-neutral-400" />
                        <span>Tú</span>
                      </>
                    )}
                    <span>· {msg.timestamp}</span>

                    {/* Button to listen aloud individually */}
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className="ml-1 text-neutral-400 hover:text-amber-400 p-0.5 rounded transition-colors cursor-pointer"
                        title="Escuchar mensaje en voz alta"
                      >
                        <Volume2
                          className={`w-3 h-3 ${
                            speakingMsgId === msg.id ? 'text-amber-400 animate-pulse' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  <div
                    className={`max-w-[88%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-none shadow-md'
                        : 'bg-neutral-800 text-neutral-100 rounded-tl-none border border-neutral-700/80 shadow-md whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-neutral-500">
                    <Bot className="w-3 h-3 text-amber-400" />
                    <span className="font-bold text-amber-400">Asesor IA procesando...</span>
                  </div>
                  <div className="bg-neutral-800 text-neutral-300 p-3 rounded-2xl rounded-tl-none border border-neutral-700 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            <div className="p-2 bg-neutral-950/80 border-t border-neutral-800/80 overflow-x-auto flex gap-2 no-scrollbar shrink-0">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="whitespace-nowrap bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 hover:border-amber-400 text-neutral-300 hover:text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Direct CTA Banner */}
            <div className="bg-neutral-950 border-t border-amber-500/20 px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso inmediato e ilimitado</span>
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCheckout();
                }}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-neutral-950" />
                <span>Inicia ahora</span>
              </button>
            </div>

            {/* Input Form with Microphone Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
            >
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                  isListening
                    ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-neutral-800 hover:border-amber-500/40'
                }`}
                title={isListening ? 'Detener grabación de voz' : 'Hablar por micrófono (Dictado)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe o dicta tu pregunta...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center font-bold disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
