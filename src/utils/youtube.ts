/**
 * Helper functions for YouTube URLs, Shorts, and Embeds
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleaned = url.trim();

  // YouTube Shorts: /shorts/ID
  const shortsMatch = cleaned.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Standard watch: ?v=ID, youtu.be/ID, embed/ID
  const watchMatch = cleaned.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

export function getYouTubeEmbedUrl(urlOrId: string, autoplay = true): string | null {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;
  // Use youtube.com/embed with autoplay, playsinline, controls, rel=0, enablejsapi
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=0&controls=1&rel=0&playsinline=1&enablejsapi=1`;
}

export function getYouTubeThumbnailUrl(urlOrId: string, fallback = ''): string {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return fallback;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
