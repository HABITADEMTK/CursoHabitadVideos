import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Circle,
  BookOpen,
  Copy,
  Check,
  Download,
  Search,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Home,
  Settings,
  Tv,
  Clock,
  Video,
  FileText,
  ExternalLink,
  Award,
} from 'lucide-react';
import { CourseModule, CourseVideo, UserAccount } from '../types';
import { extractYouTubeId } from '../utils/youtube';

interface CoursePageProps {
  currentUser: UserAccount | null;
  onOpenGoogleAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onGoToLanding: () => void;
  onOpenCheckout: () => void;
}

export const CoursePage: React.FC<CoursePageProps> = ({
  currentUser,
  onOpenGoogleAuth,
  onLogout,
  onOpenAdmin,
  onGoToLanding,
  onOpenCheckout,
}) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null);
  const [activeModuleNumber, setActiveModuleNumber] = useState<number>(1);
  const [completedVideos, setCompletedVideos] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-3': true,
    'mod-4': true,
  });

  // Fetch course modules from backend API
  useEffect(() => {
    fetch('/api/course-modules')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.modules) && data.modules.length > 0) {
          setModules(data.modules);
          // Set first video as default active
          if (data.modules[0]?.videos?.[0]) {
            setActiveVideo(data.modules[0].videos[0]);
            setActiveModuleNumber(data.modules[0].moduleNumber);
          }
        }
      })
      .catch((err) => console.warn('Could not load course modules:', err));

    // Load completed videos from localStorage
    try {
      const savedCompleted = localStorage.getItem('anuncios_ia_completed_lessons');
      if (savedCompleted) {
        setCompletedVideos(JSON.parse(savedCompleted));
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleVideoCompleted = (videoId: string) => {
    const updated = { ...completedVideos, [videoId]: !completedVideos[videoId] };
    setCompletedVideos(updated);
    try {
      localStorage.setItem('anuncios_ia_completed_lessons', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleModuleOpen = (modId: string) => {
    setOpenModuleIds((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Check if current user has full paid access, is admin, or is affiliate
  const isPaidUser =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'affiliate' ||
    currentUser?.status === 'paid';
  const firstVideoId = modules[0]?.videos[0]?.id || 'v-1-1';

  const handleSelectVideo = (video: CourseVideo, moduleNum: number) => {
    if (!isPaidUser && video.id !== firstVideoId) {
      onOpenCheckout();
      return;
    }
    setActiveVideo(video);
    setActiveModuleNumber(moduleNum);
  };

  const handleNextVideo = () => {
    if (!isPaidUser) {
      onOpenCheckout();
      return;
    }
    if (nextVideo) {
      setActiveVideo(nextVideo);
    }
  };

  // Find next video in list
  const allVideosList = (modules || []).flatMap((m) => m.videos || []);
  const totalVideos = allVideosList.length;
  const completedCount = Object.values(completedVideos || {}).filter(Boolean).length;
  const progressPercent = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  const currentVideoIndex = allVideosList.findIndex((v) => v.id === activeVideo?.id);
  const nextVideo =
    currentVideoIndex >= 0 && currentVideoIndex < allVideosList.length - 1
      ? allVideosList[currentVideoIndex + 1]
      : null;

  // Filter modules/videos by search query
  const filteredModules = (modules || []).map((mod) => {
    const modVideos = mod.videos || [];
    if (!searchQuery.trim()) return { ...mod, videos: modVideos };
    const q = searchQuery.toLowerCase();
    const matchedVideos = modVideos.filter(
      (v) => (v.title || '').toLowerCase().includes(q) || (v.description || '').toLowerCase().includes(q)
    );
    return { ...mod, videos: matchedVideos };
  }).filter((mod) => (mod.videos || []).length > 0);

  const getEmbedUrl = (url: string) => {
    const ytId = extractYouTubeId(url);
    if (ytId) {
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-neutral-950 flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
                IA
              </div>
              <div className="text-left hidden sm:block">
                <h1 className="text-sm font-extrabold text-white leading-none">
                  Hábitad | Marketing inmobiliario
                </h1>
                <p className="text-[10px] text-amber-400 font-medium tracking-wider">
                  PORTAL EXCLUSIVO DE ALUMNOS
                </p>
              </div>
            </button>
          </div>

          {/* User Status & Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {(currentUser.role === 'admin' || currentUser.role === 'affiliate') && (
                  <button
                    onClick={onOpenAdmin}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentUser.role === 'admin' ? 'Panel Admin' : 'Panel Afiliado'}</span>
                  </button>
                )}

                <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-black text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-white leading-none truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">
                      {currentUser.email}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ml-1 ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : currentUser.role === 'affiliate'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : currentUser?.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : isPaidUser
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-neutral-800 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {currentUser.role === 'admin'
                      ? 'Admin'
                      : currentUser.role === 'affiliate'
                      ? 'Afiliado'
                      : currentUser?.status === 'pending'
                      ? '⏳ Pendiente'
                      : isPaidUser
                      ? '✨ Premium'
                      : 'Gratuito'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenGoogleAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                <span>Ingresar con Google</span>
              </button>
            )}

            <button
              onClick={onGoToLanding}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
              title="Volver a la Página Principal"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Video Player & Lesson Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!isPaidUser && (
            currentUser?.status === 'pending' ? (
              <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/60 border border-amber-500/60 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 font-extrabold text-lg">
                    ⏳
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Estatus de Cuenta: Pendiente de Confirmación de Pago
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40">
                        En Revisión
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      Hemos registrado tu pago ($1,099 MXN). Un administrador validará la transferencia para liberar los módulos 2, 3 y 4 a tu WhatsApp y correo. Por lo pronto, tienes habilitado el <strong>Video 1 (Clase Gratis)</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenCheckout}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Ver Ficha de Pago SPEI</span>
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950/60 border border-emerald-500/50 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Inicia ahora, paga después · Plan Gratuito
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                        1ª Clase Gratis
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      Estás viendo la 1ª clase del curso. Al terminar o seleccionar las demás clases, te pasamos al módulo de cobro para desbloquear todo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenCheckout}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Desbloquear Todo ($1,099 MXN)</span>
                </button>
              </div>
            )
          )}

          {activeVideo ? (
            <div className="space-y-6">
              {/* Video Player Box */}
              <div className="relative aspect-video w-full bg-neutral-900 rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                {activeVideo.videoUrl ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.videoUrl)}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                    <Video className="w-12 h-12 text-amber-400 mb-2" />
                    <p className="text-sm font-bold text-white">Video en Proceso de Renderizado</p>
                    <p className="text-xs">
                      Este módulo contiene la lección práctica sobre {activeVideo.title}.
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Controls & Progress Bar */}
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Módulo {activeModuleNumber}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {activeVideo.duration}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">{activeVideo.title}</h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => toggleVideoCompleted(activeVideo.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border ${
                        completedVideos[activeVideo.id]
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      {completedVideos[activeVideo.id] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Completada</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-neutral-400" />
                          <span>Marcar Completada</span>
                        </>
                      )}
                    </button>

                    {nextVideo && (
                      <button
                        onClick={handleNextVideo}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-md"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>

              {/* Attached Prompts Section */}
              {activeVideo.promptTemplate && (
                <div className="bg-neutral-900 border border-amber-500/30 p-5 rounded-3xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Prompt Secreto Copiable para ChatGPT / Claude
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyPrompt(activeVideo.promptTemplate!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-xs font-mono text-amber-200/90 leading-relaxed select-all">
                    {activeVideo.promptTemplate}
                  </div>
                </div>
              )}

              {/* Downloadable Resources */}
              {Array.isArray(activeVideo.resources) && activeVideo.resources.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Recursos y Plantillas Descargables de esta Lección
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeVideo.resources || []).map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-white group-hover:text-amber-300">
                            {res.title}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-3xl text-center space-y-4">
              <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Selecciona una lección para comenzar</h3>
              <p className="text-xs text-neutral-400">
                Usa el menú lateral para navegar entre los módulos del curso.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Modules Sidebar & Overall Progress (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Progress Card */}
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Tu Progreso en el Curso
              </span>
              <span className="text-xs font-black text-amber-400">{progressPercent}%</span>
            </div>

            <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-neutral-400">
              {completedCount} de {totalVideos} lecciones completadas
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar lección o tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Modules List Accordion */}
          <div className="space-y-3">
            {filteredModules.map((module) => {
              const isModOpen = openModuleIds[module.id] ?? true;
              const moduleVideos = module.videos || [];
              const moduleCompletedVideos = moduleVideos.filter((v) => completedVideos && completedVideos[v.id]).length;

              return (
                <div
                  key={module.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
                >
                  {/* Module Header Toggle */}
                  <button
                    onClick={() => toggleModuleOpen(module.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-850 transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Módulo {module.moduleNumber} · {moduleCompletedVideos}/{moduleVideos.length} Vistos
                      </span>
                      <h3 className="text-xs font-bold text-white leading-tight">{module.title}</h3>
                    </div>

                    <div className="text-neutral-400 ml-2">
                      {isModOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Module Videos */}
                  <AnimatePresence>
                    {isModOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-800/80 divide-y divide-neutral-800/50 bg-neutral-950/60"
                      >
                        {moduleVideos.map((video) => {
                          const isActive = activeVideo?.id === video.id;
                          const isDone = completedVideos[video.id];
                          const isLocked = !isPaidUser && video.id !== firstVideoId;

                          return (
                            <div
                              key={video.id}
                              onClick={() => handleSelectVideo(video, module.moduleNumber)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleSelectVideo(video, module.moduleNumber);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                                isActive
                                  ? 'bg-amber-500/15 border-l-4 border-amber-500 text-white'
                                  : isLocked
                                  ? 'hover:bg-neutral-900/80 text-neutral-400 opacity-90'
                                  : 'hover:bg-neutral-900 text-neutral-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                {isLocked ? (
                                  <Lock className="w-4 h-4 text-amber-400/80 shrink-0" />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleVideoCompleted(video.id);
                                    }}
                                    className="text-neutral-500 hover:text-emerald-400 shrink-0 cursor-pointer p-1 -m-1 rounded hover:bg-neutral-800/50"
                                    title={isDone ? 'Marcar como no completada' : 'Marcar como completada'}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-neutral-600" />
                                    )}
                                  </button>
                                )}

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4
                                      className={`text-xs font-bold truncate ${
                                        isActive
                                          ? 'text-amber-300'
                                          : isLocked
                                          ? 'text-neutral-400'
                                          : 'text-neutral-200'
                                      }`}
                                    >
                                      {video.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-[10px] text-neutral-500 font-mono">
                                      {video.duration}
                                    </p>
                                    {!isPaidUser && video.id === firstVideoId && (
                                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                                        1ª Clase Gratis
                                      </span>
                                    )}
                                    {isLocked && (
                                      <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                                        🔒 Desbloquear
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {isActive && (
                                <Play className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
