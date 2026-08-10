import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Youtube,
  Link as LinkIcon,
  RotateCcw,
  Edit2,
  Save,
  Check,
  Upload,
  Video,
  Loader2,
  Film,
} from 'lucide-react';
import { VideoSample } from '../types';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';

interface VideoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoSample[];
  onSaveVideos: (newVideos: VideoSample[]) => void;
  onResetDefaults: () => void;
}

export const VideoManagerModal: React.FC<VideoManagerModalProps> = ({
  isOpen,
  onClose,
  videos,
  onSaveVideos,
  onResetDefaults,
}) => {
  const [videoList, setVideoList] = useState<VideoSample[]>(videos || []);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Tab mode for adding video: 'file' | 'youtube'
  const [addMode, setAddMode] = useState<'file' | 'youtube'>('file');

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editPropertyType, setEditPropertyType] = useState('Terreno / Lote');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  // Add video form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileThumbnailUrl, setFileThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('Terreno / Lote');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [formError, setFormError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when videos prop updates
  useEffect(() => {
    setVideoList(videos || []);
  }, [videos]);

  if (!isOpen) return null;

  // Handle local video file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Por favor selecciona un archivo de video válido (.mp4, .webm, .mov).');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);

    // Auto-generate video thumbnail using offscreen video canvas
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, video.duration / 2);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 360;
        canvas.height = video.videoHeight || 640;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumb = canvas.toDataURL('image/jpeg', 0.85);
          setFileThumbnailUrl(thumb);
        }
      } catch (err) {
        console.warn('Error capturing thumbnail frame:', err);
      }
    };
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    let finalVideoUrl = '';
    let finalThumbnail = '';

    if (addMode === 'file') {
      if (!selectedFile) {
        setFormError('Por favor selecciona o arrastra un archivo de video MP4/WebM.');
        return;
      }

      setIsUploading(true);

      try {
        // Convert file to Base64 to send to backend / API
        const base64: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        // Try server upload endpoint
        const res = await fetch('/api/upload-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoBase64: base64,
            fileName: selectedFile.name,
          }),
        });

        const data = await res.json();
        if (data && data.success && data.videoUrl) {
          finalVideoUrl = data.videoUrl;
        } else {
          // Fallback to data URL
          finalVideoUrl = base64;
        }
      } catch (err) {
        console.warn('Server upload fallback to base64/object URL:', err);
        finalVideoUrl = filePreviewUrl || '';
      } finally {
        setIsUploading(false);
      }

      finalThumbnail =
        fileThumbnailUrl ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop';
    } else {
      // YouTube mode
      if (!newUrl.trim()) {
        setFormError('Por favor ingresa un enlace de YouTube Shorts o Video.');
        return;
      }

      finalVideoUrl = newUrl.trim();
      const ytId = extractYouTubeId(finalVideoUrl);
      finalThumbnail = ytId
        ? getYouTubeThumbnailUrl(ytId)
        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop';
    }

    const newItem: VideoSample = {
      id: 'video-' + Date.now(),
      title: newTitle.trim() || selectedFile?.name.replace(/\.[^/.]+$/, '') || 'Anuncio Inmobiliario IA',
      propertyType: newPropertyType || 'Bienes Raíces',
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnail,
      duration: '0:30',
      timePosition: '0:00',
      subtitle: newSubtitle.trim() || 'Anuncio publicitario en formato vertical',
      avatarName: 'Asesor IA',
      description: 'Video publicitario subido directamente para la landing page.',
    };

    const updated = [newItem, ...(videoList || [])];
    setVideoList(updated);
    onSaveVideos(updated);

    // Reset form
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFileThumbnailUrl(null);
    setNewUrl('');
    setNewTitle('');
    setNewSubtitle('');

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...(videoList || [])];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setVideoList(copy);
    onSaveVideos(copy);
  };

  const handleMoveDown = (index: number) => {
    const list = videoList || [];
    if (index >= list.length - 1) return;
    const copy = [...list];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setVideoList(copy);
    onSaveVideos(copy);
  };

  const handleDelete = (id: string) => {
    const updated = (videoList || []).filter((v) => v.id !== id);
    setVideoList(updated);
    onSaveVideos(updated);
  };

  const handleStartEdit = (item: VideoSample) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPropertyType(item.propertyType);
    setEditSubtitle(item.subtitle || '');
    setEditVideoUrl(item.videoUrl || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = (videoList || []).map((v) => {
      if (v.id === id) {
        const ytId = extractYouTubeId(editVideoUrl);
        const newThumb = ytId
          ? getYouTubeThumbnailUrl(ytId, v.thumbnailUrl)
          : v.thumbnailUrl;

        return {
          ...v,
          title: editTitle.trim() || v.title,
          propertyType: editPropertyType || v.propertyType,
          subtitle: editSubtitle.trim(),
          videoUrl: editVideoUrl.trim(),
          thumbnailUrl: newThumb,
        };
      }
      return v;
    });

    setVideoList(updated);
    onSaveVideos(updated);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Administrar Galería de Videos</h3>
              <p className="text-xs text-neutral-400">
                Añade, edita, reordena o elimina los videos que se muestran en la página principal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-6 space-y-8 pr-1">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>¡Cambios guardados en la galería!</span>
            </div>
          )}

          {/* Section 1: Add New Video Form */}
          <form
            onSubmit={handleAddVideo}
            className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 space-y-4 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                AÑADIR NUEVO VIDEO A LA GALERÍA
              </span>
            </div>

            {/* Mode Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAddMode('file')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  addMode === 'file'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Subir Video (MP4 / WebM)</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMode('youtube')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  addMode === 'youtube'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>Enlace de YouTube</span>
              </button>
            </div>

            {addMode === 'file' ? (
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Seleccionar Archivo de Video MP4, WebM o MOV <span className="text-amber-400">*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-800 hover:border-amber-500/60 bg-neutral-900/60 hover:bg-neutral-900 p-6 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
                >
                  {filePreviewUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-24 aspect-[9/16] bg-black rounded-xl overflow-hidden border border-amber-500/50 shadow-lg">
                        <video
                          src={filePreviewUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Film className="w-6 h-6 text-amber-400" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-amber-400 truncate max-w-xs">
                        {selectedFile?.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        ({selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : 0} MB) — Click para cambiar video
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">
                          Haz clic aquí para seleccionar tu video desde tu equipo
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          Formatos soportados: MP4, WebM, MOV (Formato vertical 9:16 ideal)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Enlace de YouTube / YouTube Shorts <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/shorts/3S3wH9u_qU4  o  https://youtu.be/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Título del Anuncio
                </label>
                <input
                  type="text"
                  placeholder="Ej. Anuncio Terreno Preventa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Tipo de Inmueble
                </label>
                <select
                  value={newPropertyType}
                  onChange={(e) => setNewPropertyType(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Terreno / Lote">Terreno / Lote</option>
                  <option value="Casa Residencial">Casa Residencial</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="Desarrollo Inmobiliario">Desarrollo Inmobiliario</option>
                  <option value="Macrolote">Macrolote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Subtítulo o Leyenda que destaca la oferta
              </label>
              <input
                type="text"
                placeholder="Ej. Lotes de 200m² con todos los servicios"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {formError && <p className="text-xs text-red-400 font-bold">{formError}</p>}

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PROCESANDO Y SUBIENDO VIDEO...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>AÑADIR VIDEO A LA GALERÍA</span>
                </>
              )}
            </button>
          </form>

          {/* Section 2: Video List & Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                VIDEOS PUBLICADOS EN LANDING ({(videoList || []).length})
              </span>
              <button
                onClick={() => {
                  onResetDefaults();
                  setVideoList(videos);
                }}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer iniciales</span>
              </button>
            </div>

            <div className="space-y-3">
              {(videoList || []).map((item, idx) => {
                const ytId = extractYouTubeId(item.videoUrl || '');
                const isEditing = editingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Thumbnail & Video Info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="relative w-14 h-20 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-neutral-800 flex items-center justify-center">
                          {ytId ? (
                            <>
                              <img
                                src={getYouTubeThumbnailUrl(ytId, item.thumbnailUrl)}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Youtube className="w-5 h-5 text-red-500 fill-current" />
                              </div>
                            </>
                          ) : item.videoUrl ? (
                            <video
                              src={
                                item.videoUrl.includes('#')
                                  ? item.videoUrl
                                  : `${item.videoUrl}#t=0.1`
                              }
                              poster={item.thumbnailUrl || undefined}
                              preload="metadata"
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={
                                item.thumbnailUrl ||
                                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop'
                              }
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                              {item.propertyType}
                            </span>
                            {ytId && (
                              <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono">
                                YouTube
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-xs text-neutral-400 truncate italic">"{item.subtitle}"</p>
                          )}
                          {item.videoUrl && (
                            <p className="text-[10px] text-neutral-500 truncate font-mono mt-0.5">
                              {item.videoUrl}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls: Edit, Up, Down, Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => (isEditing ? setEditingId(null) : handleStartEdit(item))}
                          title={isEditing ? 'Cancelar Edición' : 'Editar Video'}
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-amber-400 border border-neutral-800 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          title="Mover Arriba"
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-amber-400 disabled:opacity-30 border border-neutral-800 cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === (videoList || []).length - 1}
                          title="Mover Abajo"
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-amber-400 disabled:opacity-30 border border-neutral-800 cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Eliminar Video"
                          className="p-2 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900/80 border border-red-500/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {isEditing && (
                      <div className="pt-3 border-t border-neutral-800 space-y-3 bg-neutral-900/90 p-3.5 rounded-xl text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                              Título del Anuncio
                            </label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                              Tipo de Inmueble
                            </label>
                            <select
                              value={editPropertyType}
                              onChange={(e) => setEditPropertyType(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="Terreno / Lote">Terreno / Lote</option>
                              <option value="Casa Residencial">Casa Residencial</option>
                              <option value="Departamento">Departamento</option>
                              <option value="Local Comercial">Local Comercial</option>
                              <option value="Desarrollo Inmobiliario">Desarrollo Inmobiliario</option>
                              <option value="Macrolote">Macrolote</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                            Subtítulo / Leyenda
                          </label>
                          <input
                            type="text"
                            value={editSubtitle}
                            onChange={(e) => setEditSubtitle(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                            Enlace de Video (YouTube Shorts / Video URL)
                          </label>
                          <input
                            type="text"
                            value={editVideoUrl}
                            onChange={(e) => setEditVideoUrl(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Guardar Cambios</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {(videoList || []).length === 0 && (
                <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-500 text-xs">
                  No hay videos en la galería. Añade uno utilizando el formulario superior.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            GUARDAR Y CERRAR
          </button>
        </div>
      </motion.div>
    </div>
  );
};
