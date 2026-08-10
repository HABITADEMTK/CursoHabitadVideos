import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Youtube, Settings, Sparkles } from 'lucide-react';
import { VideoSample } from '../types';
import { VideoManagerModal } from './VideoManagerModal';
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from '../utils/youtube';

interface ShowcaseSectionProps {
  onOpenCheckout: () => void;
  isManagerOpen?: boolean;
  onOpenManager?: () => void;
  onCloseManager?: () => void;
}

export const DEFAULT_VIDEO_SAMPLES: VideoSample[] = [
  {
    id: 'sample-1',
    title: 'Anuncio Terreno Campestre en Preventa',
    propertyType: 'Terreno / Lote',
    duration: '0:22',
    timePosition: '0:00',
    subtitle: 'Lotes de 200m² con enganche accesible y todos los servicios',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/3S3wH9u_qU4',
    avatarName: 'Carlos (Asesor Generado con IA)',
    description:
      'Video publicitario vertical 9:16 para captación de clientes potenciales en Meta Ads.',
  },
  {
    id: 'sample-2',
    title: 'Anuncio Venta de Casas Residenciales',
    propertyType: 'Casa Residencial',
    duration: '0:18',
    timePosition: '0:00',
    subtitle: 'Fraccionamiento privado con alberca y seguridad 24/7',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/51Q8K8vQ140',
    avatarName: 'Sofia (Persona Generada por IA)',
    description:
      'Video en formato Reel con avatar que explica amenidades y facilidades de crédito.',
  },
  {
    id: 'sample-3',
    title: 'Anuncio Departamento Moderno para Inversión',
    propertyType: 'Departamento',
    duration: '0:19',
    timePosition: '0:00',
    subtitle: 'Genera rentas desde el primer día con alta plusvalía',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/3y0R_J3C-6g',
    avatarName: 'Roberto (Asesor Inmobiliario IA)',
    description:
      'Video con enfoque en rentabilidad para inversionistas inmobiliarios.',
  },
];

const LOCAL_STORAGE_KEY = 'anuncios_ia_gallery_v1';

interface VideoCardProps {
  sample: VideoSample;
  onSelect: (sample: VideoSample) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ sample, onSelect }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const ytId = extractYouTubeId(sample.videoUrl || '');
  const isDirectVideo = !ytId && Boolean(sample.videoUrl);

  const handleMouseEnter = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0.1;
      } catch (e) {
        // ignore
      }
      setIsPlayingPreview(false);
    }
  };

  const thumbUrl = ytId
    ? getYouTubeThumbnailUrl(ytId, sample.thumbnailUrl)
    : sample.thumbnailUrl || '';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => onSelect(sample)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl transition-all cursor-pointer flex flex-col"
    >
      {/* 9:16 Aspect Ratio Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
        {isDirectVideo ? (
          <video
            ref={videoRef}
            src={
              sample.videoUrl.includes('#')
                ? sample.videoUrl
                : `${sample.videoUrl}#t=0.1`
            }
            poster={sample.thumbnailUrl || undefined}
            preload="metadata"
            muted
            playsInline
            loop
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={thumbUrl}
            alt={sample.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
          />
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 z-10 bg-neutral-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">
          {sample.propertyType}
        </div>

        {/* YouTube or Video Direct Badge */}
        {ytId ? (
          <div className="absolute top-3 right-3 z-10 bg-red-950/90 border border-red-500/40 text-red-300 font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <Youtube className="w-3.5 h-3.5 fill-current text-red-500" />
            <span>YouTube</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10 bg-amber-950/90 border border-amber-500/40 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Video Directo</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 pointer-events-none" />

        {/* Subtitle Caption */}
        {sample.subtitle && (
          <div className="absolute bottom-6 left-3 right-3 text-center z-10 pointer-events-none">
            <span className="inline-block bg-neutral-950/90 backdrop-blur-sm border border-neutral-700/80 text-white font-medium text-xs px-3 py-1.5 rounded-xl shadow-lg leading-tight">
              "{sample.subtitle}"
            </span>
          </div>
        )}

        {/* Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className={`w-16 h-16 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] transform group-hover:scale-110 transition-all ${
              isPlayingPreview ? 'opacity-40 scale-90' : 'opacity-100'
            }`}
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Card Title Info */}
      <div className="p-4 bg-neutral-900 text-left border-t border-neutral-800">
        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {sample.title}
        </h3>
        <p className="text-[11px] text-amber-400/90 mt-0.5 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Click para reproducir con audio</span>
        </p>
      </div>
    </motion.div>
  );
};

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  onOpenCheckout,
  isManagerOpen: externalIsManagerOpen,
  onOpenManager: externalOnOpenManager,
  onCloseManager: externalOnCloseManager,
}) => {
  const [videoList, setVideoList] = useState<VideoSample[]>(DEFAULT_VIDEO_SAMPLES);
  const [activeVideo, setActiveVideo] = useState<VideoSample | null>(null);
  const [internalIsManagerOpen, setInternalIsManagerOpen] = useState(false);

  const isManagerOpen =
    externalIsManagerOpen !== undefined ? externalIsManagerOpen : internalIsManagerOpen;

  const handleOpenManager = () => {
    if (externalOnOpenManager) {
      externalOnOpenManager();
    } else {
      setInternalIsManagerOpen(true);
    }
  };

  const handleCloseManager = () => {
    if (externalOnCloseManager) {
      externalOnCloseManager();
    } else {
      setInternalIsManagerOpen(false);
    }
  };

  // Load videos from server API or LocalStorage on mount
  useEffect(() => {
    let isMounted = true;

    // First check local storage for immediate render
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideoList(parsed);
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    // Sync with server API
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideoList(data.videos);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.videos));
          } catch (e) {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.warn('Server videos API fetch fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to state, LocalStorage, and server API
  const handleSaveVideos = (newVideos: VideoSample[]) => {
    setVideoList(newVideos);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVideos));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: newVideos }),
    }).catch((err) => console.warn('Server sync skipped:', err));
  };

  const handleResetDefaults = () => {
    handleSaveVideos(DEFAULT_VIDEO_SAMPLES);
  };

  return (
    <section id="ejemplos" className="py-20 px-4 bg-neutral-950 text-white relative border-b border-neutral-800/60">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-amber-500/60" />
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] font-sans">
            EJEMPLOS REALES
          </span>
          <div className="h-[1px] w-8 bg-amber-500/60" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
          Lo que aprenderás <span className="font-serif italic font-normal text-amber-400">a crear en el curso.</span>
        </h2>

        <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-12">
          Haz clic en cualquier video para reproducirlo. Son anuncios publicitarios en formato vertical 9:16 creados 100% con inteligencia artificial.
        </p>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {(videoList || []).map((sample) => (
            <VideoCard key={sample.id} sample={sample} onSelect={setActiveVideo} />
          ))}
        </div>
      </div>

      {/* Video Cinema Player Modal (Vertical 9:16 Reel Player) */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative bg-neutral-950 border border-amber-500/40 rounded-3xl overflow-hidden w-full max-w-sm aspect-[9/16] max-h-[90vh] shadow-[0_0_60px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-neutral-900/90 text-white hover:text-amber-400 flex items-center justify-center border border-neutral-700 shadow-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Badge Header */}
              <div className="absolute top-3 left-3 right-14 z-20 pointer-events-none">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-neutral-950/90 px-2 py-0.5 rounded border border-amber-500/30">
                  {activeVideo.propertyType}
                </span>
                <h4 className="text-xs font-bold text-white truncate drop-shadow mt-1">
                  {activeVideo.title}
                </h4>
              </div>

              {/* Video Player Container */}
              <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                {activeVideo.videoUrl && extractYouTubeId(activeVideo.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.videoUrl, true) || ''}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : activeVideo.videoUrl ? (
                  <video
                    src={activeVideo.videoUrl}
                    poster={activeVideo.thumbnailUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-950">
                    <img
                      src={activeVideo.thumbnailUrl}
                      alt={activeVideo.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="relative z-10 bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
                      <p className="text-xs text-neutral-300 font-bold mb-2">
                        {activeVideo.title}
                      </p>
                      <p className="text-[11px] text-amber-400">
                        Agrega un enlace de YouTube Shorts en el Administrador para reproducir el video.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Gallery Manager Modal */}
      <VideoManagerModal
        isOpen={isManagerOpen}
        onClose={handleCloseManager}
        videos={videoList}
        onSaveVideos={handleSaveVideos}
        onResetDefaults={handleResetDefaults}
      />
    </section>
  );
};
