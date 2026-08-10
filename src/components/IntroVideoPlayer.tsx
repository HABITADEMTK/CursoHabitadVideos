import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Youtube, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';

interface IntroVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  durationText?: string;
}

export const DEFAULT_INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=5qap5aO4i9A';

export const IntroVideoPlayer: React.FC<IntroVideoPlayerProps> = ({
  videoUrl = DEFAULT_INTRO_VIDEO_URL,
  title = 'Cómo crear anuncios inmobiliarios con IA en 20 minutos',
  subtitle = 'Demostración paso a paso del método Hábitad Marketing Inmobiliario',
  durationText = '1:30 min',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Load persisted intro video if available
    try {
      const saved = localStorage.getItem('anuncios_ia_intro_video_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.videoUrl) setCurrentUrl(parsed.videoUrl);
      }
    } catch (e) {
      console.warn(e);
    }

    // Fetch from server if available
    fetch('/api/intro-video')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.introVideo && data.introVideo.videoUrl) {
          setCurrentUrl(data.introVideo.videoUrl);
        }
      })
      .catch(() => {});
  }, []);

  const ytId = extractYouTubeId(currentUrl);
  const isDirectVideo = !ytId && Boolean(currentUrl);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const thumbUrl = ytId
    ? getYouTubeThumbnailUrl(ytId)
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="w-full max-w-3xl mx-auto my-8 relative"
    >
      {/* Container Frame with Gold Neon Border & Glow */}
      <div className="group relative bg-neutral-900 border-2 border-amber-500/50 hover:border-amber-400 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] transition-all">
        
        {/* Top Info Bar */}
        <div className="bg-neutral-950/90 backdrop-blur-md px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-amber-400 font-extrabold text-[11px] uppercase tracking-wider truncate">
              VIDEO DE PRESENTACIÓN (1 - 2 MIN)
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
              ⏱️ {durationText}
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>16:9 HD</span>
            </span>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Video Player Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {isPlaying ? (
            ytId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : isDirectVideo ? (
              <div className="relative w-full h-full group/controls">
                <video
                  ref={videoRef}
                  src={currentUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400 text-xs">
                No se pudo cargar el video. Revisa el enlace.
              </div>
            )
          ) : (
            /* Thumbnail & Initial Play Overlay */
            <div
              onClick={handlePlayClick}
              className="relative w-full h-full cursor-pointer group/play overflow-hidden flex items-center justify-center"
            >
              {isDirectVideo ? (
                <video
                  src={currentUrl.includes('#') ? currentUrl : `${currentUrl}#t=0.5`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={thumbUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-700 brightness-90 group-hover/play:brightness-100"
                />
              )}

              {/* Dark Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

              {/* Large Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500 text-neutral-950 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.8)] group-hover/play:scale-110 transition-transform duration-300">
                  <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-neutral-950 ml-1.5" />
                </div>
                <span className="mt-4 bg-neutral-950/90 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>HAZ CLIC PARA REPRODUCIR VIDEO</span>
                </span>
              </div>

              {/* Title Overlay at bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-left z-10 pointer-events-none">
                <p className="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-md">
                  {title}
                </p>
                <p className="text-xs text-neutral-300 font-medium mt-1 drop-shadow">
                  {subtitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner Note */}
        <div className="bg-neutral-950 border-t border-neutral-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Aprende el sistema de creación con Inteligencia Artificial paso a paso.</span>
          </div>
          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Volver a la portada</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
