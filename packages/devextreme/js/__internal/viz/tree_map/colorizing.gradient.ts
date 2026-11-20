/* eslint-disable no-return-assign */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { BaseThemeManagerInstance } from '@ts/viz/core/base_theme_manager';
import type { ColorCodeGetter, ColorGetter, ColorizerOptions } from '@ts/viz/tree_map/colorizing';
import { addColorizer, createColorCodeGetter as _createColorCodeGetter } from '@ts/viz/tree_map/colorizing';
import type Node from '@ts/viz/tree_map/node';

type RangeColorGetter = (node: Node, range: number[]) => string | null;

const _min = Math.min;
const _max = Math.max;

function createSimpleColorizer(getColor: RangeColorGetter, range: number[]): ColorGetter {
  return function (node) {
    return getColor(node, range);
  };
}

function getRangeData(range: number[]): number[] {
  return [Number(range[0]) || 0, (range[1] - range[0]) || 1];
}

function calculateRange(nodes: Node[], getValue: ColorCodeGetter): number[] {
  let i;
  const ii = nodes.length;
  const codes: number[] = [];
  let code;

  for (i = 0; i < ii; i += 1) {
    code = getValue(nodes[i]);
    if (isFinite(code)) {
      codes.push(code);
    }
  }
  return getRangeData([_min.apply(null, codes), _max.apply(null, codes)]);
}

function createGuessingColorizer(
  getColor: RangeColorGetter,
  getValue: ColorCodeGetter,
): ColorGetter {
  const ranges: Record<number, number[]> = {};

  return function (node) {
    const { parent } = node;

    return getColor(
      node,
      ranges[parent._id] || (ranges[parent._id] = calculateRange(parent.nodes, getValue)),
    );
  };
}

function gradientColorizer(
  options: ColorizerOptions,
  themeManager: BaseThemeManagerInstance,
): ColorGetter {
  const palette = themeManager.createGradientPalette(options.palette);
  const getValue = _createColorCodeGetter(options);

  return 'range' in options ? createSimpleColorizer(getColor, getRangeData(options.range || [])) : createGuessingColorizer(getColor, getValue);

  function getColor(node: Node, arg: number[]): string | null {
    return palette.getColor((getValue(node) - arg[0]) / arg[1]);
  }
}

addColorizer('gradient', gradientColorizer);
export default gradientColorizer;
