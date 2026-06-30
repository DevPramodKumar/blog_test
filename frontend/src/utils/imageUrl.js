/**
 * Turn stored image paths into browser-loadable URLs.
 * Supports external URLs and uploaded files at /uploads/...
 */
export function resolveImageUrl(image) {
  if (!image) return '';

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/')) {
    return image;
  }

  return `/${image}`;
}
