export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface VideoSample {
  id: string;
  title: string;
  propertyType: string;
  duration?: string;
  timePosition?: string;
  subtitle?: string;
  thumbnailUrl: string;
  avatarName?: string;
  videoUrl?: string; // YouTube Shorts URL or video link
  description?: string;
  promptExample?: string;
}

export interface ComparisonItem {
  text: string;
  highlighted?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatAdminConfig {
  welcomeMessage: string;
  systemPromptActions: string;
  customKnowledge: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  whatsapp?: string;
  role: 'admin' | 'student' | 'affiliate';
  status?: 'free' | 'pending' | 'paid';
  createdBy?: string;
  addedAt: string;
  hasCourseAccess: boolean;
  isPaid?: boolean;
}

export interface CourseResource {
  id: string;
  title: string;
  url: string;
  type?: 'pdf' | 'link' | 'zip' | 'doc';
}

export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube, Shorts, Vimeo, MP4
  duration: string;
  thumbnailUrl?: string;
  promptTemplate?: string;
  resources?: CourseResource[];
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  videos: CourseVideo[];
}
