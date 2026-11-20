/* eslint-disable @typescript-eslint/init-declarations */

import { normalizeEnum as _normalizeEnum } from '../core/utils';
import type { FunnelDataItem } from './funnel';

export interface TilingAlgorithm {
  getFigures: (data: number[], neckWidth: number, neckHeight: number) => number[][];
  normalizeValues: (items: FunnelDataItem[]) => number[];
}

const algorithms: Record<string, TilingAlgorithm> = {};
let defaultAlgorithm: TilingAlgorithm;

export function getAlgorithm(name: string): TilingAlgorithm {
  return algorithms[_normalizeEnum(name)] || defaultAlgorithm;
}

export function addAlgorithm(name: string, callback: TilingAlgorithm, setDefault?: boolean): void {
  algorithms[name] = callback;

  if (setDefault) {
    defaultAlgorithm = algorithms[name];
  }
}
