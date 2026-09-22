import type { LoadOptions } from 'devextreme/common/data.types';

export const pad = (value: number): string => String(value).padStart(2, '0');

export const param = (source: string, name: string): string | undefined => {
  const match = source.match(new RegExp(`(?:^|[?&])${name}=([^&]*)`));

  if (!match) {
    return undefined;
  }

  return decodeURIComponent(match[1].replace(/\+/g, ' '));
};

export const jsonParam = (source: string, name: string): unknown => {
  const raw = param(source, name);

  if (raw === undefined) {
    return undefined;
  }

  return JSON.parse(raw);
};

export const numberParam = (url: string, name: string, fallback: number): number => {
  const raw = param(url, name);

  if (raw !== undefined && /^\d+$/.test(raw)) {
    return Number(raw);
  }

  return fallback;
};

export const skipOf = (url: string): number => numberParam(url, 'skip', 0);

export const hasGroup = (url: string): boolean => /[?&]group=/.test(url);

export const hasFilter = (url: string): boolean => /[?&]filter=/.test(url);

export const groupParam = (url: string): string => param(url, 'group') ?? '';

export const isGroupedBy = (
  url: string,
  selector: string
): boolean => groupParam(url).includes(`"selector":"${selector}"`);

const PAGINATION_PARAMS = ['skip', 'take'] as const;
const FLAGS = ['requireTotalCount', 'requireGroupCount'] as const;
const JSON_VALUES = [
  'sort', 'group', 'filter', 'totalSummary', 'groupSummary', 'select',
] as const;

export const parseLoadOptions = (url: string): LoadOptions => {
  const options: LoadOptions = {};

  PAGINATION_PARAMS.forEach((name) => {
    const raw = param(url, name);

    if (raw !== undefined) {
      options[name] = Number(raw);
    }
  });

  FLAGS.forEach((name) => {
    const raw = param(url, name);

    if (raw !== undefined) {
      options[name] = raw === 'true';
    }
  });

  JSON_VALUES.forEach((name) => {
    const value = jsonParam(url, name);

    if (value !== undefined) {
      options[name] = value;
    }
  });

  return options;
};
