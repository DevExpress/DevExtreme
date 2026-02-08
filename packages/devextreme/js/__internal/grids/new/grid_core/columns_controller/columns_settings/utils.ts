import { isObject } from '@js/core/utils/type';

export const isAllowedColumnValue = (
  value: unknown,
): boolean => isObject(value) || typeof value === 'string';

export const isCorrectColumnIdx = (
  pathIdx: string,
): boolean => !isNaN(+pathIdx) && pathIdx !== null;

export const getColumnIdxFromPath = (
  path: string[],
): number => +path[1];

export const getColumnOptionPathStr = (
  path: string[],
): string => [...path].splice(2).join('.');
