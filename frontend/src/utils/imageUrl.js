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
