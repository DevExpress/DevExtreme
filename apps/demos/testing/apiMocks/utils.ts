export const pad = (value: number): string => String(value).padStart(2, '0');

export const numberParam = (url: string, name: string, fallback: number): number => {
  const match = url.match(new RegExp(`[?&]${name}=(\\d+)`));
  return match ? Number(match[1]) : fallback;
};

export const skipOf = (url: string): number => numberParam(url, 'skip', 0);

export const hasGroup = (url: string): boolean => /[?&]group=/.test(url);

export const hasFilter = (url: string): boolean => /[?&]filter=/.test(url);

export const groupParam = (url: string): string => {
  const match = url.match(/[?&]group=([^&]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

export const isGroupedBy = (
  url: string,
  selector: string
): boolean => groupParam(url).includes(`"selector":"${selector}"`);
