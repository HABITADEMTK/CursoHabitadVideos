import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

app.post('/api/upload-video', (req, res) => {
  try {
    const { videoBase64, fileName } = req.body;
    if (!videoBase64) {
      return res.status(400).json({ error: 'Falta base64 de video' });
    }
    const ext = fileName ? path.extname(fileName) : '.mp4';
    const safeName = `video-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext || '.mp4'}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    const base64Data = videoBase64.replace(/^data:video\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const videoUrl = `/uploads/${safeName}`;
    return res.json({ success: true, videoUrl, fileName: safeName });
  } catch (err: any) {
    console.error('Error uploading video file:', err);
    return res.status(500).json({ error: err.message || 'Error guardando el video' });
  }
});

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Data storage paths
const VIDEOS_FILE = path.join(process.cwd(), 'videos-store.json');
const INTRO_VIDEO_FILE = path.join(process.cwd(), 'intro-video-store.json');
const CHAT_CONFIG_FILE = path.join(process.cwd(), 'chat-config-store.json');
const USERS_FILE = path.join(process.cwd(), 'users-store.json');
const COURSE_MODULES_FILE = path.join(process.cwd(), 'course-modules-store.json');

// Memory cache fallbacks
let inMemoryVideos: any[] | null = null;
let inMemoryIntroVideo: any | null = null;
let inMemoryChatConfig: any | null = null;
let inMemoryUsers: any[] | null = null;
let inMemoryCourseModules: any[] | null = null;

const DEFAULT_USERS = [
  {
    id: 'user-admin-1',
    email: 'salvadoraliadosdigitales@gmail.com',
    name: 'Salvador Aliados Digitales',
    whatsapp: '+52 55 1234 5678',
    role: 'admin',
    status: 'paid',
    addedAt: '2026-08-08',
    hasCourseAccess: true,
  },
  {
    id: 'user-admin-2',
    email: 'humanlabs002@gmail.com',
    name: 'Usuario Principal (Admin)',
    whatsapp: '+52 55 8765 4321',
    role: 'admin',
    status: 'paid',
    addedAt: '2026-08-08',
    hasCourseAccess: true,
  },
  {
    id: 'user-affiliate-1',
    email: 'afiliado.demo@gmail.com',
    name: 'Carlos Afiliado (Socio)',
    whatsapp: '+52 55 9876 5432',
    role: 'affiliate',
    status: 'paid',
    addedAt: '2026-08-08',
    hasCourseAccess: true,
  },
  {
    id: 'user-student-1',
    email: 'ejemplo.alumno@gmail.com',
    name: 'Roberto Gómez (Alumno Demo)',
    whatsapp: '+52 55 1122 3344',
    role: 'student',
    status: 'paid',
    addedAt: '2026-08-08',
    hasCourseAccess: true,
  },
];

const DEFAULT_COURSE_MODULES = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Fundamentos y Guiones Persuasivos con Inteligencia Artificial',
    description: 'Aprende a estructurar guiones de alta conversión para Meta Ads y Reels sin ser experto en redacción.',
    videos: [
      {
        id: 'v-1-1',
        title: '1.1 Bienvenida y Metodología del Curso Anuncios IA',
        description: 'Cómo aprovechar el programa para publicar tu primer video en menos de 20 minutos.',
        videoUrl: 'https://www.youtube.com/watch?v=3S3wH9u_qU4',
        duration: '04:15',
        promptTemplate: 'Actúa como un experto copywriter inmobiliario. Genera un guión de 30 segundos para vender una casa de 3 recámaras en fraccionamiento privado con piscina...',
        resources: [
          { id: 'r1', title: 'Plantilla de Guiones en PDF', url: '#', type: 'pdf' },
          { id: 'r2', title: 'Prompts de Prompts para ChatGPT', url: '#', type: 'doc' },
        ],
      },
      {
        id: 'v-1-2',
        title: '1.2 Estructura de un Guión Inmobiliario de Alto Impacto',
        description: 'Los 3 segundos clave (Gancho), desarrollo del valor de la propiedad y llamada a la acción.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '08:30',
        promptTemplate: 'Escribe 5 variantes de ganchos virales para captar inversionistas en preventa de departamentos...',
      },
      {
        id: 'v-1-3',
        title: '1.3 Prompts Secretos para Casas, Terrenos y Desarrollos',
        description: 'Ingeniería de prompts avanzada para adaptar el lenguaje según el tipo de inmueble.',
        videoUrl: 'https://www.youtube.com/watch?v=3S3wH9u_qU4',
        duration: '12:10',
      },
    ],
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Generación de Avatares y Voces Fotorrealistas (Sin Cámara)',
    description: 'Crea personajes fotorrealistas que hablen por ti con tono neutro y entusiasta.',
    videos: [
      {
        id: 'v-2-1',
        title: '2.1 Selección y Creación del Avatar Inmobiliario',
        description: 'Paso a paso para seleccionar vestimenta, fondo e iluminación en la plataforma de IA.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '10:45',
        promptTemplate: 'Prompt de imagen: Asesor inmobiliario profesional de 35 años, traje casual elegante en oficina de lujo...',
      },
      {
        id: 'v-2-2',
        title: '2.2 Clonación de Voz en Español Mexicano y Tonalidades',
        description: 'Cómo lograr una modulación humana natural sin sonar robótico.',
        videoUrl: 'https://www.youtube.com/watch?v=3S3wH9u_qU4',
        duration: '07:20',
      },
      {
        id: 'v-2-3',
        title: '2.3 Renderizado y Exportación en Formato Vertical 9:16',
        description: 'Ajuste de resolución HD para TikTok, Instagram Reels y YouTube Shorts.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '09:15',
      },
    ],
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Montaje Visual, Edición Rápida y Subtítulos Dinámicos',
    description: 'Agrega Tomas B-Roll de las propiedades, transiciones modernas y subtítulos automáticos.',
    videos: [
      {
        id: 'v-3-1',
        title: '3.1 Edición Express en CapCut / Premiere para Bienes Raíces',
        description: 'Plantillas prediseñadas para ensamblar audio, avatar y clips en 10 minutos.',
        videoUrl: 'https://www.youtube.com/watch?v=3S3wH9u_qU4',
        duration: '11:00',
      },
      {
        id: 'v-3-2',
        title: '3.2 Subtítulos de Alto Enganche y Elementos Gráficos',
        description: 'Animación de texto resaltado en amarillo y efectos de sonido sutiles.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '08:40',
      },
    ],
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Estrategias de Pauta en Meta Ads para Captación de Prospectos',
    description: 'Configura campañas publicitarias eficientes con bajo presupuesto para conseguir clientes en WhatsApp.',
    videos: [
      {
        id: 'v-4-1',
        title: '4.1 Configuración de Anuncios Inmobiliarios en Meta Ads Manager',
        description: 'Creación de públicos objetivo y optimización para mensajes directos a WhatsApp Business.',
        videoUrl: 'https://www.youtube.com/watch?v=3S3wH9u_qU4',
        duration: '14:20',
      },
      {
        id: 'v-4-2',
        title: '4.2 Medición de Resultados y Optimización de Anuncios Ganadores',
        description: 'Análisis de costo por cliente potencial (CPL) y escalado de campañas exitosas.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '11:30',
      },
    ],
  },
];

function loadStoredUsers() {
  if (inMemoryUsers) return inMemoryUsers;
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      inMemoryUsers = JSON.parse(raw);
      // Ensure admins exist
      ensureAdminInUsers(inMemoryUsers);
      return inMemoryUsers;
    }
  } catch (err) {
    console.error('Error loading users-store.json:', err);
  }
  inMemoryUsers = DEFAULT_USERS;
  saveStoredUsers(DEFAULT_USERS);
  return inMemoryUsers;
}

function ensureAdminInUsers(usersList: any[]) {
  const adminEmail = 'salvadoraliadosdigitales@gmail.com';
  const exists = usersList.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!exists) {
    usersList.push({
      id: 'user-admin-' + Date.now(),
      email: adminEmail,
      name: 'Salvador Aliados Digitales',
      role: 'admin',
      addedAt: new Date().toISOString().split('T')[0],
      hasCourseAccess: true,
    });
  } else {
    exists.role = 'admin';
    exists.hasCourseAccess = true;
  }
}

function saveStoredUsers(users: any[]) {
  inMemoryUsers = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users-store.json:', err);
  }
}

function loadStoredCourseModules() {
  if (inMemoryCourseModules) return inMemoryCourseModules;
  try {
    if (fs.existsSync(COURSE_MODULES_FILE)) {
      const raw = fs.readFileSync(COURSE_MODULES_FILE, 'utf-8');
      inMemoryCourseModules = JSON.parse(raw);
      return inMemoryCourseModules;
    }
  } catch (err) {
    console.error('Error loading course-modules-store.json:', err);
  }
  inMemoryCourseModules = DEFAULT_COURSE_MODULES;
  saveStoredCourseModules(DEFAULT_COURSE_MODULES);
  return inMemoryCourseModules;
}

function saveStoredCourseModules(modules: any[]) {
  inMemoryCourseModules = modules;
  try {
    fs.writeFileSync(COURSE_MODULES_FILE, JSON.stringify(modules, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving course-modules-store.json:', err);
  }
}

const DEFAULT_CHAT_CONFIG = {
  welcomeMessage:
    '¡Hola! 👋 Soy el asesor virtual con IA de Hábitad | Marketing inmobiliario. ¿Tienes alguna pregunta sobre el curso o deseas iniciar tu primera clase gratis?',
  systemPromptActions:
    'Sé un experto consultor de ventas sumamente amable, enfático y profesional de "Hábitad | Marketing inmobiliario". Tu meta es resolver cualquier duda del usuario sobre los módulos del curso de marketing e inteligencia artificial para bienes raíces, y motivarlo a iniciar su primera clase totalmente gratis haciendo clic en "Inicia gratis".',
  customKnowledge:
    'DATOS DE SERVICIO Y CURSO:\n- Empresa emisora: Hábitad | Marketing inmobiliario.\n- Lección de prueba: Primera clase totalmente gratis al registrarse con Google, sin necesidad de tarjeta de crédito.\n- Formas de pago aceptadas: Tarjeta de Crédito, Débito, Mercado Pago, PayPal, OXXO y SPEI.\n- Acceso: Inmediato e ilimitado de por vida al portal de alumnos.\n- Soporte: Soporte constante para resolución de dudas con las herramientas de IA.\n- Plataformas que se enseñan: Herramientas para generación de avatares fotorrealistas, clonación de voz en español, guiones optimizados para Meta Ads y montaje automático.',
};

function loadStoredVideos() {
  if (inMemoryVideos) return inMemoryVideos;
  try {
    if (fs.existsSync(VIDEOS_FILE)) {
      const raw = fs.readFileSync(VIDEOS_FILE, 'utf-8');
      inMemoryVideos = JSON.parse(raw);
      return inMemoryVideos;
    }
  } catch (err) {
    console.error('Error loading videos-store.json:', err);
  }
  return null;
}

function saveStoredVideos(videos: any[]) {
  inMemoryVideos = videos;
  try {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving videos-store.json:', err);
  }
}

const DEFAULT_INTRO_VIDEO = {
  videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
  title: 'Cómo crear anuncios inmobiliarios con IA en 20 minutos',
  subtitle: 'Demostración paso a paso del método Hábitad Marketing Inmobiliario',
  durationText: '1:30 min',
};

function loadStoredIntroVideo() {
  if (inMemoryIntroVideo) return inMemoryIntroVideo;
  try {
    if (fs.existsSync(INTRO_VIDEO_FILE)) {
      const raw = fs.readFileSync(INTRO_VIDEO_FILE, 'utf-8');
      inMemoryIntroVideo = JSON.parse(raw);
      return inMemoryIntroVideo;
    }
  } catch (err) {
    console.error('Error loading intro-video-store.json:', err);
  }
  inMemoryIntroVideo = DEFAULT_INTRO_VIDEO;
  return inMemoryIntroVideo;
}

function saveStoredIntroVideo(data: any) {
  inMemoryIntroVideo = data;
  try {
    fs.writeFileSync(INTRO_VIDEO_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving intro-video-store.json:', err);
  }
}

function loadStoredChatConfig() {
  if (inMemoryChatConfig) return inMemoryChatConfig;
  try {
    if (fs.existsSync(CHAT_CONFIG_FILE)) {
      const raw = fs.readFileSync(CHAT_CONFIG_FILE, 'utf-8');
      inMemoryChatConfig = JSON.parse(raw);
      return inMemoryChatConfig;
    }
  } catch (err) {
    console.error('Error loading chat-config-store.json:', err);
  }
  inMemoryChatConfig = DEFAULT_CHAT_CONFIG;
  return inMemoryChatConfig;
}

function saveStoredChatConfig(config: any) {
  inMemoryChatConfig = config;
  try {
    fs.writeFileSync(CHAT_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving chat-config-store.json:', err);
  }
}

// API Routes
app.get('/api/intro-video', (req, res) => {
  const introVideo = loadStoredIntroVideo();
  res.json({ success: true, introVideo });
});

app.post('/api/intro-video', (req, res) => {
  const { introVideo } = req.body;
  if (introVideo && typeof introVideo === 'object') {
    saveStoredIntroVideo(introVideo);
    return res.json({ success: true, introVideo });
  }
  res.status(400).json({ error: 'Invalid intro video payload' });
});

app.get('/api/videos', (req, res) => {
  const videos = loadStoredVideos();
  res.json({ success: true, videos: videos || [] });
});

app.post('/api/videos', (req, res) => {
  const { videos } = req.body;
  if (Array.isArray(videos)) {
    saveStoredVideos(videos);
    return res.json({ success: true, count: videos.length });
  }
  res.status(400).json({ error: 'Invalid videos payload' });
});

// Chat Config Endpoints
app.get('/api/chat-config', (req, res) => {
  const config = loadStoredChatConfig();
  res.json({ success: true, config });
});

app.post('/api/chat-config', (req, res) => {
  const { config } = req.body;
  if (config && typeof config === 'object') {
    saveStoredChatConfig(config);
    return res.json({ success: true, config });
  }
  res.status(400).json({ error: 'Invalid chat config payload' });
});

// Chat Interaction Endpoint using Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const config = loadStoredChatConfig();
    const systemInstruction = `
ERES EL ASESOR VIRTUAL DE VENTAS Y ATENCIÓN OFICIAL DE "HÁBITAD | MARKETING INMOBILIARIO".

=== OBJETIVO PRINCIPAL ===
Responder preguntas sobre el curso con un tono profesional, amable, claro y servicial. Tu meta es orientar al usuario sobre los módulos, las herramientas de inteligencia artificial y animarlo a tomar su primera clase haciendo clic en "Inicia gratis".

=== INFORMACIÓN CLAVE DEL CURSO (HÁBITAD | MARKETING INMOBILIARIO) ===
- Nombre del Programa: "Curso de Anuncios en Video para Bienes Raíces con Inteligencia Artificial".
- Promesa: Enseña a crear anuncios en video formato vertical 9:16 (Reels, TikTok, Meta Ads) para vender o rentar casas, departamentos, terrenos y desarrollos en solo 20 minutos con IA.
- Beneficio principal:
  * 1ª Clase Gratis disponible para comenzar de inmediato con tu cuenta de Google.
  * Sin salir en cámara ni grabar tu voz si no quieres (avatares y voces fotorrealistas con IA).
  * Sin contratar agencias ni editores costosos.
  * No requiere experiencia previa.
- Garantía y Acceso:
  * Acceso de por vida a las lecciones y plantillas.
  * Garantía de satisfacción.

=== INSTRUCCIONES Y ACCIONES PERSONALIZADAS DEL ADMINISTRADOR ===
${config.systemPromptActions || ''}

=== BASE DE CONOCIMIENTO ADICIONAL ===
${config.customKnowledge || ''}

REGLAS DE RESPUESTA:
1. Responde de forma clara, amable y concisa (máximo 2 a 3 párrafos cortos).
2. Anima siempre al usuario a hacer clic en el botón "Inicia gratis" para ver la primera lección sin costo.
3. Usa un tono profesional y cercano en español de México.
`;

    const ai = getGenAI();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured in environment
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      return res.json({
        success: true,
        reply: `¡Hola! En Hábitad | Marketing inmobiliario te enseñamos a crear videos publicitarios profesionales para bienes raíces en solo 20 minutos usando inteligencia artificial. Sobre tu consulta ("${lastUserMsg}"), nuestro programa incluye lecciones paso a paso. ¡Puedes hacer clic en "Inicia gratis" para comenzar tu primera lección hoy mismo!`,
      });
    }

    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply =
      response.text ||
      'Disculpa, no pude procesar la respuesta. ¿Me podrías repetir tu pregunta?';
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Error al conectar con el servidor de IA',
      details: error.message,
    });
  }
});

// Users Management Endpoints
app.get('/api/users', (req, res) => {
  const users = loadStoredUsers();
  res.json({ success: true, users });
});

app.post('/api/users', (req, res) => {
  const { email, name, whatsapp, role, status, createdBy, hasCourseAccess } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  const users = loadStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  const isAdminEmail =
    normalizedEmail === 'salvadoraliadosdigitales@gmail.com' ||
    normalizedEmail === 'humanlabs002@gmail.com';

  const assignedRole = isAdminEmail ? 'admin' : (role || 'student');
  const userStatus = status || (hasCourseAccess ? 'paid' : 'free');

  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      name: name !== undefined ? name : users[existingIndex].name,
      whatsapp: whatsapp !== undefined ? whatsapp : (users[existingIndex].whatsapp || ''),
      role: assignedRole,
      status: userStatus,
      createdBy: createdBy !== undefined ? createdBy : users[existingIndex].createdBy,
      hasCourseAccess: hasCourseAccess !== undefined ? hasCourseAccess : (userStatus === 'paid'),
    };
  } else {
    users.push({
      id: 'user-' + Date.now(),
      email: normalizedEmail,
      name: name || normalizedEmail.split('@')[0],
      whatsapp: whatsapp || '',
      role: assignedRole,
      status: userStatus,
      createdBy: createdBy || '',
      addedAt: new Date().toISOString().split('T')[0],
      hasCourseAccess: hasCourseAccess !== undefined ? hasCourseAccess : (userStatus === 'paid'),
    });
  }

  saveStoredUsers(users);
  res.json({ success: true, users });
});

app.delete('/api/users/:email', (req, res) => {
  const emailToDelete = req.params.email?.trim().toLowerCase();
  if (emailToDelete === 'salvadoraliadosdigitales@gmail.com') {
    return res.status(400).json({ error: 'No se puede eliminar la cuenta de administrador principal' });
  }

  let users = loadStoredUsers();
  users = users.filter((u) => u.email.toLowerCase() !== emailToDelete);
  saveStoredUsers(users);
  res.json({ success: true, users });
});

// Google Authentication Endpoint for Existing Paid/Registered Users
app.post('/api/auth/google', (req, res) => {
  const { email, name, avatarUrl, isPaid, whatsapp, isPending, isLogin } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Proporciona una cuenta de correo válida' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Basic Google Email domain check
  const isGmail = normalizedEmail.endsWith('@gmail.com') || normalizedEmail.endsWith('@googlemail.com');

  let users = loadStoredUsers();
  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  const isAdminEmail =
    normalizedEmail === 'salvadoraliadosdigitales@gmail.com' ||
    normalizedEmail === 'humanlabs002@gmail.com';

  // If this is a login attempt and the user doesn't exist, reject registration
  if (isLogin && !user) {
    return res.status(403).json({
      error: 'No existe una cuenta registrada con este correo. El registro se realiza únicamente al comprar el curso en la ventana de pago.',
    });
  }

  const defaultStatus = isAdminEmail ? 'paid' : (isPending || isPaid ? 'pending' : 'free');

  if (!user) {
    user = {
      id: 'user-google-' + Date.now(),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${normalizedEmail}`,
      whatsapp: whatsapp || '',
      role: isAdminEmail ? 'admin' : 'student',
      status: defaultStatus,
      addedAt: new Date().toISOString().split('T')[0],
      hasCourseAccess: isAdminEmail, // Only admins or approved paid users get full course access
    };
    users.push(user);
    saveStoredUsers(users);
  } else {
    if (name?.trim()) {
      user.name = name.trim();
    }
    if (whatsapp?.trim()) {
      user.whatsapp = whatsapp.trim();
    }
    if (isAdminEmail) {
      user.role = 'admin';
      user.status = 'paid';
      user.hasCourseAccess = true;
    } else if ((isPaid || isPending) && user.status !== 'paid') {
      user.status = 'pending';
      user.hasCourseAccess = false;
    }
    saveStoredUsers(users);
  }

  res.json({
    success: true,
    user,
    verifiedGoogleAccount: true,
    accountType: isGmail ? 'Google Gmail' : 'Google Workspace / Email',
  });
});

// Upgrade user or set pending status after checkout
app.post('/api/users/upgrade-paid', (req, res) => {
  const { email, whatsapp, status, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let users = loadStoredUsers();
  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  const isAdminEmail =
    normalizedEmail === 'salvadoraliadosdigitales@gmail.com' ||
    normalizedEmail === 'humanlabs002@gmail.com';

  const targetStatus = isAdminEmail ? 'paid' : (status || 'pending');
  const fullAccess = targetStatus === 'paid' || isAdminEmail;

  if (!user) {
    user = {
      id: 'user-google-' + Date.now(),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
      whatsapp: whatsapp || '',
      role: isAdminEmail ? 'admin' : 'student',
      status: targetStatus,
      addedAt: new Date().toISOString().split('T')[0],
      hasCourseAccess: fullAccess,
    };
    users.push(user);
  } else {
    if (whatsapp) user.whatsapp = whatsapp.trim();
    if (name) user.name = name.trim();
    if (!isAdminEmail) {
      user.status = targetStatus;
      user.hasCourseAccess = fullAccess;
    }
  }

  saveStoredUsers(users);
  res.json({ success: true, user });
});

// Course Modules & Videos Endpoints
app.get('/api/course-modules', (req, res) => {
  const modules = loadStoredCourseModules();
  res.json({ success: true, modules });
});

app.post('/api/course-modules', (req, res) => {
  const { modules } = req.body;
  if (Array.isArray(modules)) {
    saveStoredCourseModules(modules);
    return res.json({ success: true, modules });
  }
  res.status(400).json({ error: 'Payload de módulos inválido' });
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const distIndex = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(distIndex);

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
