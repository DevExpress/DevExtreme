/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */

import type { Properties as TreeMapProperties } from '@js/viz/tree_map';
import { isFunction as _isFunction } from '@ts/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';

type LayoutAlgorithmArgs = Parameters<Exclude<TreeMapProperties['layoutAlgorithm'], string | undefined>>[0];

export interface TilingItem {
  value: number;
  i: number;
  rect?: number[];
}

export interface TilingData extends Required<LayoutAlgorithmArgs> {
  items: TilingItem[];
  isRotated: boolean;
  directions: number[];
}

export type TilingAlgorithm = (data: TilingData) => void;

export interface SidesData {
  staticSide: number;
  variedSide: number;
  static1: number;
  static2: number;
  varied1: number;
  varied2: number;
  staticDir: number;
  variedDir: number;
}

export interface RowData {
  sum: number;
  count: number;
  side: number;
}

const _round = Math.round;

const algorithms: Record<string, TilingAlgorithm> = {};
let defaultAlgorithm: TilingAlgorithm;

export function getAlgorithm(value: ThemeValue): TilingAlgorithm {
  return algorithms[_normalizeEnum(value)] || (_isFunction(value) && value) || defaultAlgorithm;
}

export function addAlgorithm(name: string, callback: TilingAlgorithm): void {
  algorithms[name] = callback;
}

export function setDefaultAlgorithm(name: string): void {
  defaultAlgorithm = algorithms[name];
}

const directionToIndexOffsets: Record<number, number[]> = {};
directionToIndexOffsets[-1] = [2, 0];
directionToIndexOffsets[+1] = [0, 2];

export const getStaticSideIndex = function (rect: number[]): 0 | 1 {
  return (rect[2] - rect[0]) < (rect[3] - rect[1]) ? 0 : 1;
};

export function buildSidesData(
  rect: number[],
  directions: number[],
  _staticSideIndex?: number,
): SidesData {
  const staticSideIndex = _staticSideIndex !== undefined
    ? _staticSideIndex
    : getStaticSideIndex(rect);
  const variedSideIndex = 1 - staticSideIndex;
  const staticSideDirection = directions[staticSideIndex];
  const variedSideDirection = directions[variedSideIndex];
  const staticSideIndexOffsets = directionToIndexOffsets[staticSideDirection];
  const variedSideIndexOffsets = directionToIndexOffsets[variedSideDirection];
  return {
    staticSide: rect[2 + staticSideIndex] - rect[staticSideIndex],
    variedSide: rect[2 + variedSideIndex] - rect[variedSideIndex],
    static1: staticSideIndex + staticSideIndexOffsets[0],
    static2: staticSideIndex + staticSideIndexOffsets[1],
    varied1: variedSideIndex + variedSideIndexOffsets[0],
    varied2: variedSideIndex + variedSideIndexOffsets[1],
    staticDir: staticSideDirection,
    variedDir: variedSideDirection,
  };
}

export function calculateRectangles(
  nodes: TilingItem[],
  head: number,
  totalRect: number[],
  sidesData: SidesData,
  rowData: RowData,
): void {
  let i;
  let ii;
  const variedSidePart = [0, 0, 0, 0];
  const { static1, static2 } = sidesData;
  let position = totalRect[static1];
  const dir = sidesData.staticDir;
  let side = sidesData.staticSide;
  let { sum } = rowData;
  let rect;
  let delta;

  variedSidePart[sidesData.varied1] = totalRect[sidesData.varied1];
  variedSidePart[sidesData.varied2] = totalRect[sidesData.varied1]
    + sidesData.variedDir * rowData.side;
  for (i = head, ii = head + rowData.count; i < ii; i += 1) {
    rect = variedSidePart.slice();
    rect[static1] = position;
    delta = _round(side * nodes[i].value / sum) || 0;
    sum -= nodes[i].value;
    side -= delta;
    position += dir * delta;
    rect[static2] = position;
    nodes[i].rect = rect;
  }
  totalRect[sidesData.varied1] = variedSidePart[sidesData.varied2];
}
