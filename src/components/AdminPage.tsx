import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Youtube,
  Bot,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  Link as LinkIcon,
  MessageSquare,
  Send,
  BookOpen,
  ShieldCheck,
  Settings,
  AlertCircle,
  Film,
  Users,
  Video,
  UserPlus,
  Lock,
  Unlock,
  CheckCircle2,
  FileText,
  Download,
  Phone,
  UserCheck,
  Upload,
} from 'lucide-react';
import { VideoSample, ChatAdminConfig, ChatMessage, UserAccount, CourseModule, CourseVideo } from '../types';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';
import { VideoManagerModal } from './VideoManagerModal';
import { DEFAULT_VIDEO_SAMPLES } from './ShowcaseSection';

interface AdminPageProps {
  onBackToLanding: () => void;
  currentUser?: UserAccount | null;
}

const COUNTRY_CODES = [
  { code: '+52', flag: '🇲🇽', country: 'México (+52)' },
  { code: '+57', flag: '🇨🇴', country: 'Colombia (+57)' },
  { code: '+1', flag: '🇺🇸', country: 'EE.UU. / Canadá (+1)' },
  { code: '+34', flag: '🇪🇸', country: 'España (+34)' },
  { code: '+54', flag: '🇦🇷', country: 'Argentina (+54)' },
  { code: '+56', flag: '🇨🇱', country: 'Chile (+56)' },
  { code: '+51', flag: '🇵🇪', country: 'Perú (+51)' },
  { code: '+593', flag: '🇪🇨', country: 'Ecuador (+593)' },
  { code: '+502', flag: '🇬🇹', country: 'Guatemala (+502)' },
  { code: '+506', flag: '🇨🇷', country: 'Costa Rica (+506)' },
  { code: '+507', flag: '🇵🇦', country: 'Panamá (+507)' },
  { code: '+1-809', flag: '🇩🇴', country: 'Rep. Dominicana (+1-809)' },
  { code: '+598', flag: '🇺🇾', country: 'Uruguay (+598)' },
  { code: '+58', flag: '🇻🇪', country: 'Venezuela (+58)' },
  { code: '+503', flag: '🇸🇻', country: 'El Salvador (+503)' },
  { code: '+504', flag: '🇭🇳', country: 'Honduras (+504)' },
  { code: '+591', flag: '🇧🇴', country: 'Bolivia (+591)' },
  { code: '+595', flag: '🇵🇾', country: 'Paraguay (+595)' },
];

const DEFAULT_VIDEOS: VideoSample[] = [
  {
    id: 'sample-1',
    title: 'Anuncio Terreno Campestre',
    propertyType: 'Terreno / Lote residencial',
    duration: '0:22',
    timePosition: '0:04',
    subtitle: 'terreno de 200m² con todos los servicios',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/3S3wH9u_qU4',
    avatarName: 'Carlos (Asesor Generado con IA)',
    description:
      'Anuncio para lote en preventa generado 100% con IA sin ir a la ubicación.',
    promptExample:
      'Generar un avatar masculino de 30 años, vistiendo camisa azul casual en un terreno despejado bajo el sol, hablando a la cámara con tono entusiasta sobre oportunidades de inversión inmobiliaria.',
  },
  {
    id: 'sample-2',
    title: 'Anuncio Venta de Casas',
    propertyType: 'Casa Residencial en Fraccionamiento',
    duration: '0:18',
    timePosition: '0:04',
    subtitle: 'aparte debo servicios',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/3S3wH9u_qU4',
    avatarName: 'Sofia (Persona Generada por IA)',
    description:
      'Video publicitario tipo Reel para Meta Ads con llamada telefónica simulada.',
    promptExample:
      'Crear un video vertical de una mujer hispana joven caminando por una calle residencial moderna, hablando por teléfono sobre facilidades de pago e impuestos de propiedad.',
  },
  {
    id: 'sample-3',
    title: 'Anuncio Departamento Moderno',
    propertyType: 'Departamento en Preventa',
    duration: '0:19',
    timePosition: '0:19',
    subtitle: '¿Habitas o inviertes? Este depa genera rentas desde el día 1',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/3S3wH9u_qU4',
    avatarName: 'Roberto (Asesor Inmobiliario IA)',
    description:
      'Video de opinión experta en oficina inmobiliaria para generar alta confianza.',
    promptExample:
      'Asesor inmobiliario en oficina elegante con fotos de propiedades al fondo y micrófono de podcast, dirigiéndose al espectador con voz clara sobre rentabilidad de departamentos.',
  },
];

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToLanding, currentUser }) => {
  const isAffiliate = currentUser?.role === 'affiliate';
  const isAdmin = currentUser?.role === 'admin' || !currentUser; // default admin if no user passed

  const [activeTab, setActiveTab] = useState<'users' | 'course-videos' | 'ai-chat' | 'videos'>('users');

  // User Management State
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'student' | 'affiliate'>('student');
  const [newStatus, setNewStatus] = useState<'free' | 'paid'>('paid');
  const [userMsg, setUserMsg] = useState('');
  const [userError, setUserError] = useState('');

  // Course Videos Management State
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [courseVideoTitle, setCourseVideoTitle] = useState('');
  const [courseVideoUrl, setCourseVideoUrl] = useState('');
  const [courseVideoDuration, setCourseVideoDuration] = useState('08:30');
  const [courseVideoDesc, setCourseVideoDesc] = useState('');
  const [courseVideoPrompt, setCourseVideoPrompt] = useState('');
  const [courseMsg, setCourseMsg] = useState('');

  // Create / Edit Module State
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDesc, setEditModuleDesc] = useState('');

  // Landing Videos State
  const [videoList, setVideoList] = useState<VideoSample[]>(DEFAULT_VIDEOS);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState('https://www.youtube.com/watch?v=5qap5aO4i9A');
  const [introVideoTitle, setIntroVideoTitle] = useState('Cómo crear anuncios inmobiliarios con IA en 20 minutos');
  const [introSaveMsg, setIntroSaveMsg] = useState(false);

  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('Terreno / Lote');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [videoFormError, setVideoFormError] = useState('');
  const [videoSaveSuccess, setVideoSaveSuccess] = useState(false);

  // AI Chat Config State
  const [chatConfig, setChatConfig] = useState<ChatAdminConfig>({
    welcomeMessage:
      '¡Hola! 👋 Soy el asesor virtual con IA de Hábitad | Marketing inmobiliario. ¿Tienes alguna pregunta sobre el curso o deseas iniciar tu primera clase gratis?',
    systemPromptActions:
      'Sé un experto consultor de ventas sumamente amable, enfático y profesional de "Hábitad | Marketing inmobiliario". Tu meta es resolver cualquier duda del usuario sobre los módulos del curso de marketing e inteligencia artificial para bienes raíces, y motivarlo a iniciar su primera clase totalmente gratis haciendo clic en "Inicia gratis".',
    customKnowledge:
      'DATOS DE SERVICIO Y CURSO:\n- Empresa emisora: Hábitad | Marketing inmobiliario.\n- Lección de prueba: Primera clase totalmente gratis al registrarse con Google, sin necesidad de tarjeta de crédito.\n- Formas de pago aceptadas: Tarjeta de Crédito, Débito, Mercado Pago, PayPal, OXXO y SPEI.\n- Acceso: Inmediato e ilimitado de por vida al portal de alumnos.\n- Soporte: Soporte constante para resolución de dudas con las herramientas de IA.\n- Plataformas que se enseñan: Herramientas para generación de avatares fotorrealistas, clonación de voz en español, guiones optimizados para Meta Ads y montaje automático.',
  });
  const [chatSaveSuccess, setChatSaveSuccess] = useState(false);

  // Playground Chat State
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // Load all server state on mount
  useEffect(() => {
    // Load Users
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      })
      .catch((e) => console.warn(e));

    // Load Course Modules
    fetch('/api/course-modules')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.modules)) {
          setCourseModules(data.modules);
          if (data.modules[0]) {
            setSelectedModuleId(data.modules[0].id);
          }
        }
      })
      .catch((e) => console.warn(e));

    // Load Intro Video
    fetch('/api/intro-video')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.introVideo) {
          if (data.introVideo.videoUrl) setIntroVideoUrl(data.introVideo.videoUrl);
          if (data.introVideo.title) setIntroVideoTitle(data.introVideo.title);
        }
      })
      .catch(() => {});

    // Load Videos
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideoList(data.videos);
        }
      })
      .catch((err) => console.warn(err));

    // Load Chat Config
    fetch('/api/chat-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.config) {
          setChatConfig(data.config);
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  // Handlers for User Management
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserMsg('');

    if (!newName.trim()) {
      setUserError('El nombre completo es obligatorio.');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setUserError('Ingresa un correo electrónico de Google válido.');
      return;
    }

    if (!whatsappNumber.trim()) {
      setUserError('El número de WhatsApp es obligatorio.');
      return;
    }

    const fullWhatsapp = `${countryCode} ${whatsappNumber.trim()}`;
    const creatorEmail = currentUser?.email || 'admin';
    const assignedRole = isAffiliate ? 'student' : newRole;

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail.trim().toLowerCase(),
        name: newName.trim(),
        whatsapp: fullWhatsapp,
        role: assignedRole,
        status: newStatus,
        createdBy: creatorEmail,
        hasCourseAccess: newStatus === 'paid' || assignedRole === 'admin' || assignedRole === 'affiliate',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setUsersList(data.users);
          setUserMsg(`¡Usuario ${newName} (${newEmail}) registrado con éxito!`);
          setNewEmail('');
          setNewName('');
          setWhatsappNumber('');
          setTimeout(() => setUserMsg(''), 4000);
        } else {
          setUserError(data.error || 'Error al agregar usuario');
        }
      })
      .catch((e) => setUserError('Error al guardar usuario'));
  };

  const handleDeleteUser = (email: string) => {
    if (email.toLowerCase() === 'salvadoraliadosdigitales@gmail.com') {
      alert('No puedes eliminar la cuenta de Administrador Principal.');
      return;
    }

    fetch(`/api/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setUsersList(data.users);
        } else {
          alert(data.error || 'Error al eliminar');
        }
      })
      .catch((e) => console.error(e));
  };

  const handleToggleUserStatus = (user: UserAccount, targetStatus?: 'free' | 'pending' | 'paid') => {
    let nextStatus: 'free' | 'pending' | 'paid' = 'paid';
    if (targetStatus) {
      nextStatus = targetStatus;
    } else if (user.status === 'paid') {
      nextStatus = 'free';
    } else if (user.status === 'pending') {
      nextStatus = 'paid';
    } else {
      nextStatus = 'paid';
    }

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        status: nextStatus,
        hasCourseAccess: nextStatus === 'paid' || user.role === 'admin' || user.role === 'affiliate',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setUsersList(data.users);
        }
      });
  };

  const handleToggleRole = (user: UserAccount) => {
    if (user.email.toLowerCase() === 'salvadoraliadosdigitales@gmail.com') return;
    let nextRole: 'student' | 'affiliate' | 'admin' = 'student';
    if (user.role === 'student') nextRole = 'affiliate';
    else if (user.role === 'affiliate') nextRole = 'admin';
    else if (user.role === 'admin') nextRole = 'student';

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        role: nextRole,
        hasCourseAccess: nextRole === 'admin' || nextRole === 'affiliate' || user.status === 'paid',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setUsersList(data.users);
        }
      });
  };

  // Handlers for Course Content Management
  const handleAddCourseVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !courseVideoTitle.trim() || !courseVideoUrl.trim()) {
      alert('Selecciona un módulo y completa el título y la URL del video.');
      return;
    }

    const updatedModules = courseModules.map((mod) => {
      if (mod.id === selectedModuleId) {
        const newVid: CourseVideo = {
          id: `v-${mod.moduleNumber}-${Date.now()}`,
          title: courseVideoTitle.trim(),
          videoUrl: courseVideoUrl.trim(),
          duration: courseVideoDuration || '10:00',
          description: courseVideoDesc.trim() || 'Video explicativo de la lección.',
          promptTemplate: courseVideoPrompt.trim() || undefined,
        };
        return { ...mod, videos: [...(mod.videos || []), newVid] };
      }
      return mod;
    });

    handleSaveCourseModules(updatedModules);
    setCourseVideoTitle('');
    setCourseVideoUrl('');
    setCourseVideoDesc('');
    setCourseVideoPrompt('');
  };

  const handleDeleteCourseVideo = (moduleId: string, videoId: string) => {
    const updatedModules = courseModules.map((mod) => {
      if (mod.id === moduleId) {
        return { ...mod, videos: (mod.videos || []).filter((v) => v.id !== videoId) };
      }
      return mod;
    });
    handleSaveCourseModules(updatedModules);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) {
      alert('Ingresa el nombre del nuevo módulo.');
      return;
    }

    const nextNumber = (courseModules || []).length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      moduleNumber: nextNumber,
      title: newModuleTitle.trim(),
      description: newModuleDesc.trim() || `Contenido y lecciones del Módulo ${nextNumber}`,
      videos: [],
    };

    const updatedModules = [...(courseModules || []), newMod];
    handleSaveCourseModules(updatedModules);
    setSelectedModuleId(newMod.id);
    setNewModuleTitle('');
    setNewModuleDesc('');
    setShowAddModuleForm(false);
  };

  const handleDeleteModule = (moduleId: string) => {
    const modToDelete = (courseModules || []).find((m) => m.id === moduleId);
    if (!modToDelete) return;

    const confirmMsg = `¿Estás seguro de ELIMINAR el Módulo ${modToDelete.moduleNumber} ("${modToDelete.title}")?\n\nEsta acción borrará el módulo completo con sus ${(modToDelete.videos || []).length} clase(s) asociadas.`;
    if (!window.confirm(confirmMsg)) return;

    const updatedModules = courseModules
      .filter((m) => m.id !== moduleId)
      .map((m, idx) => ({
        ...m,
        moduleNumber: idx + 1,
      }));

    handleSaveCourseModules(updatedModules);
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(updatedModules[0]?.id || '');
    }
  };

  const handleStartEditModule = (mod: CourseModule) => {
    setEditingModuleId(mod.id);
    setEditModuleTitle(mod.title);
    setEditModuleDesc(mod.description);
  };

  const handleSaveEditModule = (moduleId: string) => {
    if (!editModuleTitle.trim()) {
      alert('El título del módulo no puede estar vacío.');
      return;
    }

    const updatedModules = courseModules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          title: editModuleTitle.trim(),
          description: editModuleDesc.trim(),
        };
      }
      return m;
    });

    handleSaveCourseModules(updatedModules);
    setEditingModuleId(null);
  };

  const handleSaveCourseModules = (modulesToSave: CourseModule[]) => {
    fetch('/api/course-modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modules: modulesToSave }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setCourseModules(data.modules);
          setCourseMsg('¡Módulos y videos del curso actualizados!');
          setTimeout(() => setCourseMsg(''), 3000);
        }
      })
      .catch((e) => console.error(e));
  };

  // Handlers for Landing Videos
  const handleAddLandingVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoFormError('');
    setVideoSaveSuccess(false);

    if (!newUrl.trim()) {
      setVideoFormError('Ingresa un enlace de YouTube o Shorts válido');
      return;
    }

    const ytId = extractYouTubeId(newUrl);
    const thumbnail = ytId
      ? getYouTubeThumbnailUrl(ytId)
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop';

    const newSample: VideoSample = {
      id: 'vid-' + Date.now(),
      title: newTitle.trim() || 'Nuevo Anuncio Generado con IA',
      propertyType: newPropertyType || 'Bienes Raíces',
      duration: '0:20',
      timePosition: '0:00',
      subtitle: newSubtitle.trim() || 'Ejemplo publicitario para inmobiliarias',
      videoUrl: newUrl.trim(),
      thumbnailUrl: thumbnail,
      avatarName: 'Asesor IA',
      description: 'Anuncio inmobiliario publicado desde el backend.',
    };

    const updatedList = [newSample, ...(videoList || [])];
    handleSaveVideos(updatedList);
    setNewUrl('');
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleSaveVideos = (newList: VideoSample[]) => {
    setVideoList(newList);

    try {
      localStorage.setItem('anuncios_ia_gallery_v1', JSON.stringify(newList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: newList }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.videos)) {
          setVideoList(data.videos);
          setVideoSaveSuccess(true);
          setTimeout(() => setVideoSaveSuccess(false), 3000);
        }
      })
      .catch((err) => console.error(err));
  };

  // Handlers for AI Chat Config
  const handleSaveChatConfig = () => {
    fetch('/api/chat-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: chatConfig }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setChatSaveSuccess(true);
          setTimeout(() => setChatSaveSuccess(false), 3000);
        }
      });
  };

  const handleSendTestMessage = () => {
    if (!testInput.trim() || testLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: testInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...(testMessages || []), userMessage];
    setTestMessages(updatedHistory);
    setTestInput('');
    setTestLoading(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedHistory,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.reply) {
          const botMsg: ChatMessage = {
            id: 'msg-bot-' + Date.now(),
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setTestMessages((prev) => [...(prev || []), botMsg]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setTestLoading(false));
  };

  // Filtered Users List based on role
  const displayedUsers = isAffiliate
    ? (usersList || []).filter(
        (u) =>
          (u.createdBy || '').toLowerCase() === (currentUser?.email || '').toLowerCase() ||
          (u.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase()
      )
    : (usersList || []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all hover:scale-105 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Landing Page</span>
            </button>
            <div className="hidden sm:block h-5 w-[1px] bg-neutral-800" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isAffiliate ? 'Panel de Afiliados' : 'Panel de Administración Backend'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${
                isAffiliate
                  ? 'text-blue-300 bg-blue-500/10 border-blue-500/30'
                  : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
              }`}
            >
              {currentUser ? `${currentUser.email} (${currentUser.role.toUpperCase()})` : 'ADMINISTRADOR'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Settings className="w-3.5 h-3.5" />
              <span>{isAffiliate ? 'SISTEMA DE AFILIADOS SOCIOS' : 'SISTEMA CENTRAL DE CONTROL'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isAffiliate
                ? 'Panel de Afiliados — Registro y Control de Alumnos'
                : 'Administración de Usuarios y Curso — Hábitad | Marketing inmobiliario'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
              {isAffiliate
                ? 'Registra a tus alumnos referidos con su correo de Google y número de WhatsApp. Cambia su acceso de Gratuito a Acceso Completo cuando realicen su inscripción.'
                : 'Administra usuarios de Google, otorga accesos, añade/edita los videos de las clases del curso, configura las tácticas del Asesor de Ventas con IA y la galería de la landing page.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>
              {isAffiliate
                ? `1. Mis Usuarios Registrados (${(displayedUsers || []).length})`
                : `1. Usuarios y Permisos (${(usersList || []).length})`}
            </span>
          </button>

          {!isAffiliate && (
            <>
              <button
                onClick={() => setActiveTab('course-videos')}
                className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'course-videos'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>2. Videos del Curso ({(courseModules || []).reduce((acc, m) => acc + (m.videos ? m.videos.length : 0), 0)})</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-chat')}
                className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ai-chat'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>3. Chat IA & Ventas</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>4. Galería Landing ({(videoList || []).length})</span>
              </button>
            </>
          )}
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Add User Form */}
            <form
              onSubmit={handleAddUser}
              className="bg-neutral-900 border border-amber-500/30 p-6 rounded-3xl space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {isAffiliate
                    ? 'REGISTRAR NUEVO ALUMNO EN EL SISTEMA'
                    : 'REGISTRAR NUEVO USUARIO (ESTUDIANTE, AFILIADO O ADMIN)'}
                </span>
                <span className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  Autenticación de Google + WhatsApp
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Nombre Completo <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Correo de Google (@gmail.com) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="alumno@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    WhatsApp (Indicativo + Número) <span className="text-amber-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="55 1234 5678"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Tipo de Acceso Inicial */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Tipo de Acceso Inicial
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'free' | 'paid')}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="paid">Full Access (Acceso de Paga)</option>
                    <option value="free">Gratuito (Solo 1ª Clase Gratis)</option>
                  </select>
                </div>

                {/* Rol (Solo visible para Admin) */}
                {!isAffiliate && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Rol en el Sistema
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="student">Estudiante / Alumno</option>
                      <option value="affiliate">Afiliado (Socio Backend)</option>
                      <option value="admin">Administrador del Sistema</option>
                    </select>
                  </div>
                )}
              </div>

              {userMsg && <p className="text-xs font-bold text-emerald-400">{userMsg}</p>}
              {userError && <p className="text-xs font-bold text-red-400">{userError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>REGISTRAR USUARIO</span>
              </button>
            </form>

            {/* Registered Users List */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAffiliate
                    ? `LISTA DE ALUMNOS REGISTRADOS POR TI (${(displayedUsers || []).length})`
                    : `LISTA DE USUARIOS REGISTRADOS EN EL SISTEMA (${(usersList || []).length})`}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {isAffiliate ? `Afiliado: ${currentUser?.email}` : 'Administrador Principal'}
                </span>
              </div>

              {(!displayedUsers || displayedUsers.length === 0) ? (
                <div className="text-center py-12 text-neutral-500 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="text-xs font-bold">No hay usuarios registrados en esta sección.</p>
                  <p className="text-[11px]">Utiliza el formulario superior para añadir a tu primer alumno.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedUsers.map((usr) => {
                    const isMainAdmin =
                      usr.email.toLowerCase() === 'salvadoraliadosdigitales@gmail.com';
                    const isPaid = usr.status === 'paid' || usr.role === 'admin' || usr.role === 'affiliate';

                    return (
                      <div
                        key={usr.id || usr.email}
                        className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        {/* User Details */}
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-sm shrink-0">
                            {(usr.name || usr.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-white">{usr.name}</h4>

                              {/* Role Badge */}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                                  usr.role === 'admin'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : usr.role === 'affiliate'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                                }`}
                              >
                                {usr.role === 'admin'
                                  ? 'Admin'
                                  : usr.role === 'affiliate'
                                  ? 'Afiliado'
                                  : 'Estudiante'}
                              </span>

                              {/* Access Status Badge */}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                                  usr.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                    : isPaid
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                }`}
                              >
                                {usr.status === 'pending'
                                  ? '⏳ Pendiente'
                                  : isPaid
                                  ? '✨ Premium (Full Access)'
                                  : 'Gratuito'}
                              </span>

                              {isMainAdmin && (
                                <span className="text-[9px] bg-amber-400 text-neutral-950 font-black px-1.5 py-0.2 rounded">
                                  Principal
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{usr.email}</p>

                            {/* WhatsApp & Creator info */}
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-400 flex-wrap">
                              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                {usr.whatsapp || 'Sin WhatsApp'}
                              </span>
                              {usr.createdBy && (
                                <span className="text-neutral-500">
                                  Registrado por: <strong className="text-neutral-300">{usr.createdBy}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                          {/* Toggle Status (Gratuito vs Pendiente vs Full Access) */}
                          <button
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              usr.status === 'pending'
                                ? 'bg-amber-500 text-neutral-950 border-amber-400 hover:bg-amber-400 shadow-md animate-pulse'
                                : isPaid
                                ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {usr.status === 'pending' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950" />
                                <span>Aprobar Pago (Liberar Acceso)</span>
                              </>
                            ) : isPaid ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Acceso: Full Access</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Acceso: Gratuito (Aprobar)</span>
                              </>
                            )}
                          </button>

                          {/* Role Toggle (Admin only) */}
                          {isAdmin && !isMainAdmin && (
                            <button
                              onClick={() => handleToggleRole(usr)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 cursor-pointer"
                            >
                              Rol: {usr.role.toUpperCase()}
                            </button>
                          )}

                          {/* Delete User (Admin only) */}
                          {isAdmin && !isMainAdmin && (
                            <button
                              onClick={() => handleDeleteUser(usr.email)}
                              className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-500/30 cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COURSE VIDEOS */}
        {activeTab === 'course-videos' && !isAffiliate && (
          <div className="space-y-8">
            {courseMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{courseMsg}</span>
              </div>
            )}

            {/* Create New Module Section */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    GESTIÓN DE MÓDULOS DEL CURSO ({(courseModules || []).length})
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Crea nuevos módulos temáticos o borra/edita los módulos existentes.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModuleForm(!showAddModuleForm)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddModuleForm ? 'Cancelar' : 'Crear Nuevo Módulo'}</span>
                </button>
              </div>

              {showAddModuleForm && (
                <form onSubmit={handleCreateModule} className="bg-neutral-950 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase">Crear Módulo #{(courseModules || []).length + 1}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Título del Módulo <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Módulo 4: Automatización y Embudos Inmobiliarios"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        Descripción Corta
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Domina la integración con CRM y auto-respuestas..."
                        value={newModuleDesc}
                        onChange={(e) => setNewModuleDesc(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>GUARDAR Y CREAR MÓDULO #{(courseModules || []).length + 1}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Add Video to Module Form */}
            {(courseModules || []).length > 0 ? (
              <form
                onSubmit={handleAddCourseVideo}
                className="bg-neutral-900 border border-amber-500/30 p-6 rounded-3xl space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    AÑADIR NUEVO VIDEO / CLASE AL CURSO
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Selecciona Módulo del Curso <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {(courseModules || []).map((m) => (
                        <option key={m.id} value={m.id}>
                          Módulo {m.moduleNumber}: {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Título de la Lección <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 1.3 Clonación de Voz fotorrealista con IA"
                      value={courseVideoTitle}
                      onChange={(e) => setCourseVideoTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      URL del Video (YouTube / YouTube Shorts / Vimeo) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={courseVideoUrl}
                      onChange={(e) => setCourseVideoUrl(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Duración Estimada
                    </label>
                    <input
                      type="text"
                      placeholder="08:30"
                      value={courseVideoDuration}
                      onChange={(e) => setCourseVideoDuration(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Descripción o Instrucciones
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detalles sobre las herramientas explicadas en esta lección..."
                    value={courseVideoDesc}
                    onChange={(e) => setCourseVideoDesc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Prompt o Plantilla Copiable (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Escribe el prompt exacto para copiar..."
                    value={courseVideoPrompt}
                    onChange={(e) => setCourseVideoPrompt(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>AÑADIR CLASE AL MÓDULO</span>
                </button>
              </form>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center space-y-3">
                <p className="text-xs text-neutral-400 font-bold">No hay módulos disponibles en el curso.</p>
                <button
                  onClick={() => setShowAddModuleForm(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Primer Módulo</span>
                </button>
              </div>
            )}

            {/* List of Modules & Videos */}
            <div className="space-y-6">
              {(courseModules || []).map((mod) => (
                <div key={mod.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
                  {/* Module Header / Edit view */}
                  {editingModuleId === mod.id ? (
                    <div className="bg-neutral-950 border border-amber-500/40 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase">
                          Editar Módulo {mod.moduleNumber}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-300 mb-1">Título del Módulo</label>
                          <input
                            type="text"
                            value={editModuleTitle}
                            onChange={(e) => setEditModuleTitle(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-300 mb-1">Descripción</label>
                          <input
                            type="text"
                            value={editModuleDesc}
                            onChange={(e) => setEditModuleDesc(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingModuleId(null)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEditModule(mod.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar Módulo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                            Módulo {mod.moduleNumber}: {mod.title}
                          </h3>
                          <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-0.5 rounded-full border border-neutral-800">
                            {(mod.videos || []).length} Clase(s)
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{mod.description}</p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        {/* Edit Module Button */}
                        <button
                          onClick={() => handleStartEditModule(mod)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Editar título y descripción de este módulo"
                        >
                          <Settings className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Editar Módulo</span>
                        </button>

                        {/* Delete Module Button */}
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/90 text-red-300 text-xs font-bold border border-red-500/40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                          title="Borrar este módulo completo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Borrar Módulo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(!mod.videos || mod.videos.length === 0) ? (
                      <p className="text-xs text-neutral-500 py-3 text-center italic">
                        Este módulo no tiene clases registradas.
                      </p>
                    ) : (
                      (mod.videos || []).map((vid) => (
                        <div
                          key={vid.id}
                          className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{vid.title}</h4>
                              <p className="text-[10px] text-neutral-400 font-mono truncate max-w-md">
                                {vid.videoUrl} • {vid.duration}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteCourseVideo(mod.id, vid.id)}
                            className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-500/30 cursor-pointer"
                            title="Eliminar esta clase del módulo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI CHAT CONFIG */}
        {activeTab === 'ai-chat' && !isAffiliate && (
          <div className="space-y-8">
            <div className="bg-neutral-900 border border-amber-500/30 p-6 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  CONFIGURACIÓN DEL AGENTE ASESOR DE VENTAS IA
                </span>
                {chatSaveSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Guardado
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Mensaje de Bienvenida en el Chat
                </label>
                <input
                  type="text"
                  value={chatConfig.welcomeMessage}
                  onChange={(e) =>
                    setChatConfig({ ...chatConfig, welcomeMessage: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Prompt del Sistema (Comportamiento y Tonalidad)
                </label>
                <textarea
                  rows={4}
                  value={chatConfig.systemPromptActions}
                  onChange={(e) =>
                    setChatConfig({ ...chatConfig, systemPromptActions: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Base de Conocimientos Personalizada (Precios, Garantías, Métodos de Pago)
                </label>
                <textarea
                  rows={6}
                  value={chatConfig.customKnowledge}
                  onChange={(e) =>
                    setChatConfig({ ...chatConfig, customKnowledge: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                onClick={handleSaveChatConfig}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>GUARDAR CONFIGURACIÓN DEL CHAT IA</span>
              </button>
            </div>

            {/* Test Playground */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-neutral-800 pb-3">
                PRUEBA EN VIVO DE LAS RESPUESTAS DEL ASESOR
              </span>

              <div className="h-64 bg-neutral-950 rounded-2xl p-4 border border-neutral-800 overflow-y-auto space-y-3">
                {(!testMessages || testMessages.length === 0) ? (
                  <p className="text-xs text-neutral-500 text-center py-10">
                    Envía un mensaje de prueba abajo para simular una conversación de prospecto.
                  </p>
                ) : (
                  (testMessages || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs ${
                          msg.sender === 'user'
                            ? 'bg-amber-500 text-neutral-950 font-medium'
                            : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {testLoading && (
                  <p className="text-[10px] text-amber-400 font-bold animate-pulse">Escribiendo respuesta...</p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje de prueba..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTestMessage()}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={testLoading || !testInput.trim()}
                  className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs hover:bg-amber-400 disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LANDING PAGE GALLERY */}
        {activeTab === 'videos' && !isAffiliate && (
          <div className="space-y-8">
            {/* Intro Video Config Card (Horizontal 16:9) */}
            <div className="bg-neutral-900 border border-amber-500/50 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  VIDEO PRINCIPAL DE PRESENTACIÓN (HORIZONTAL 16:9 - 1 A 2 MIN)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                  PRIMERA SECCIÓN
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Este es el video horizontal que se muestra justo después del título principal y antes de los botones de la primera clase gratis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Enlace de YouTube o Ruta de Video Subido (.mp4)
                  </label>
                  <input
                    type="text"
                    value={introVideoUrl}
                    onChange={(e) => setIntroVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... o /uploads/video-..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Título del Video de Presentación
                  </label>
                  <input
                    type="text"
                    value={introVideoTitle}
                    onChange={(e) => setIntroVideoTitle(e.target.value)}
                    placeholder="Cómo crear anuncios inmobiliarios con IA en 20 minutos"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center gap-2 cursor-pointer border border-neutral-700"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Subir archivo MP4 desde tu dispositivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const payload = { videoUrl: introVideoUrl, title: introVideoTitle, durationText: '1:30 min' };
                    try {
                      localStorage.setItem('anuncios_ia_intro_video_v1', JSON.stringify(payload));
                    } catch (e) {
                      console.warn(e);
                    }
                    fetch('/api/intro-video', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ introVideo: payload }),
                    }).catch(() => {});
                    setIntroSaveMsg(true);
                    setTimeout(() => setIntroSaveMsg(false), 3000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR VIDEO PRINCIPAL</span>
                </button>
              </div>

              {introSaveMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Video principal de presentación actualizado correctamente!</span>
                </div>
              )}
            </div>

            <div className="bg-neutral-900 border border-amber-500/40 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>GESTOR COMPLETO DE VIDEOS DE LA LANDING</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Sube directamente archivos de video MP4/WebM desde tu dispositivo o ingresa enlaces de YouTube Shorts.
                </p>
              </div>

              <button
                onClick={() => setIsManagerOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>SUBIR VIDEO / ABRIR GESTOR</span>
              </button>
            </div>

            {videoSaveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Lista de videos guardada en la landing page!</span>
              </div>
            )}

            <form
              onSubmit={handleAddLandingVideo}
              className="bg-neutral-900 border border-amber-500/30 p-6 rounded-3xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  AGREGAR NUEVO VIDEO A LA GALERÍA DE LA LANDING
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Enlace de YouTube / Shorts <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/shorts/3S3wH9u_qU4"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Título del Anuncio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Anuncio Terreno Preventa"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={newPropertyType}
                    onChange={(e) => setNewPropertyType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Terreno / Lote">Terreno / Lote</option>
                    <option value="Casa Residencial">Casa Residencial</option>
                    <option value="Departamento en Preventa">Departamento</option>
                  </select>
                </div>
              </div>

              {videoFormError && <p className="text-xs text-red-400 font-bold">{videoFormError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>AÑADIR A LA LANDING PAGE</span>
              </button>
            </form>

            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  VIDEOS PUBLICADOS EN LA LANDING PAGE ({(videoList || []).length})
                </span>
              </div>

              <div className="space-y-3">
                {(videoList || []).map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded-xl border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          {item.propertyType}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        {item.subtitle && (
                          <p className="text-[11px] text-neutral-400 truncate italic">"{item.subtitle}"</p>
                        )}
                        {item.videoUrl && (
                          <p className="text-[10px] text-neutral-500 font-mono truncate mt-0.5">
                            {item.videoUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reorder and Delete Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          if (idx <= 0) return;
                          const copy = [...videoList];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          handleSaveVideos(copy);
                        }}
                        disabled={idx === 0}
                        title="Mover Arriba"
                        className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-amber-400 disabled:opacity-30 border border-neutral-800 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (idx >= videoList.length - 1) return;
                          const copy = [...videoList];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          handleSaveVideos(copy);
                        }}
                        disabled={idx === videoList.length - 1}
                        title="Mover Abajo"
                        className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-amber-400 disabled:opacity-30 border border-neutral-800 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSaveVideos(videoList.filter((v) => v.id !== item.id))}
                        title="Eliminar Video"
                        className="p-2 rounded-xl bg-red-950/50 text-red-400 border border-red-500/30 hover:bg-red-900/80 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(videoList || []).length === 0 && (
                  <p className="text-xs text-neutral-500 text-center py-6">
                    No hay videos en la galería. Añade uno arriba.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <VideoManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        videos={videoList}
        onSaveVideos={handleSaveVideos}
        onResetDefaults={() => handleSaveVideos(DEFAULT_VIDEO_SAMPLES)}
      />
    </div>
  );
};
