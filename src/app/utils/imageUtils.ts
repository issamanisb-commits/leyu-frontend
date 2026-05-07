// Utility functions for handling images across the application

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => {
  const target = e.target as HTMLImageElement;
  const defaultFallback = "/imageNotAvailable.png";
  const fallback = fallbackSrc || defaultFallback;
  
  console.log("Image failed to load:", target.src);
  
  // Prevent infinite loop if fallback also fails
  if (target.src !== fallback && !target.src.includes(fallback.replace("/", ""))) {
    target.src = fallback;
  }
};

export const getValidImageSrc = (src: string | null | undefined, fallback?: string): string => {
  const defaultFallback = "/imageNotAvailable.png";
  const fallbackSrc = fallback || defaultFallback;
  
  // If no src or it's null/empty, use fallback
  if (!src || src === "null" || src.trim() === "") {
    return fallbackSrc;
  }
  
  return src;
};

export const getProfileImageSrc = (src: string | null | undefined): string => {
  // If no src or it's null/empty, use default avatar
  if (!src || src === "null" || src.trim() === "") {
    return "/default-avatar.png";
  }
  
  // Check if it's an HTTP URL from your specific image server
  if (src.startsWith("http://164.90.209.220:9000/")) {
    // Try to convert to HTTPS (this may or may not work depending on your server config)
    const httpsUrl = src.replace("http://", "https://");
    console.log("Converting HTTP to HTTPS:", src, "->", httpsUrl);
    return httpsUrl;
  }
  
  // Check if it's any other HTTP URL (which will be blocked on HTTPS sites like Vercel)
  if (src.startsWith("http://")) {
    console.warn("HTTP image URL detected on HTTPS site, falling back to default avatar:", src);
    return "/default-avatar.png";
  }
  
  // If it's HTTPS or a relative URL, use it
  return src;
};