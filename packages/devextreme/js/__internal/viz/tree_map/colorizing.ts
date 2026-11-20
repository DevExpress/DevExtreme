/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */

import type { Properties as TreeMapProperties } from '@js/viz/tree_map';
import { noop as _noop } from '@ts/core/utils/common';
import type { BaseThemeManagerInstance } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import type Node from '@ts/viz/tree_map/node';

export type ColorizerOptions = NonNullable<TreeMapProperties['colorizer']>;

export type ColorGetter = (node: Node) => string | null | undefined;

export type Colorizer = (
  options: ColorizerOptions,
  themeManager: BaseThemeManagerInstance,
  root: Node,
) => ColorGetter;

export type ColorCodeGetter = (node: Node) => number;

const colorizers: Record<string, Colorizer> = {};
let defaultColorizerName: string;

function wrapLeafColorGetter(getter: ColorGetter): ColorGetter {
  return function (node) {
    return !node.isNode() ? getter(node) : undefined;
  };
}

function wrapGroupColorGetter(getter: ColorGetter): ColorGetter {
  return function (node) {
    const parent: Node | false = !node.isNode() && node.parent;

    return parent ? (parent._groupColor = parent._groupColor || getter(parent)) : undefined;
  };
}

export function getColorizer(
  options: ColorizerOptions,
  themeManager: BaseThemeManagerInstance,
  root: Node,
): ColorGetter | typeof _noop {
  const type = _normalizeEnum(options.type || defaultColorizerName);
  const colorizer = colorizers[type]?.(options, themeManager, root);

  return colorizer
    ? (options.colorizeGroups ? wrapGroupColorGetter : wrapLeafColorGetter)(colorizer)
    : _noop;
}

export function addColorizer(name: string, colorizer: Colorizer): void {
  colorizers[name] = colorizer;
}

export function setDefaultColorizer(name: string): void {
  defaultColorizerName = name;
}

function getValueAsColorCode(node: Node): number {
  return node.value;
}

function createColorCode(colorCodeField: string): ColorCodeGetter {
  return function (node): number {
    return Number(node.data[colorCodeField]);
  };
}

export function createColorCodeGetter(options: ColorizerOptions): ColorCodeGetter {
  return options.colorCodeField ? createColorCode(options.colorCodeField) : getValueAsColorCode;
}
