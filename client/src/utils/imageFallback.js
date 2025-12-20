// Safe image fallback - SVG data URI that won't fail to load
export const getImageFallback = (width = 300, height = 300, text = "No Image") => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect fill="#f0f0f0" width="${width}" height="${height}"/>
      <text fill="#999" font-family="Arial, sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const handleImageError = (e, fallbackText = "No Image") => {
  e.target.onerror = null;
  e.target.src = getImageFallback(300, 300, fallbackText);
};

