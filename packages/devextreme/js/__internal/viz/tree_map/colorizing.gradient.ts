/* eslint-disable no-return-assign */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { addColorizer, createColorCodeGetter as _createColorCodeGetter } from '@ts/viz/tree_map/colorizing';

const _min = Math.min;
const _max = Math.max;

function createSimpleColorizer(getColor, range) {
  return function (node) {
    return getColor(node, range);
  };
}

function getRangeData(range) {
  return [Number(range[0]) || 0, (range[1] - range[0]) || 1];
}

function calculateRange(nodes, getValue) {
  let i;
  const ii = nodes.length;
  const codes = [];
  let code;

  for (i = 0; i < ii; ++i) {
    code = getValue(nodes[i]);
    if (isFinite(code)) {
      // @ts-expect-error
      codes.push(code);
    }
  }
  return getRangeData([_min.apply(null, codes), _max.apply(null, codes)]);
}

function createGuessingColorizer(getColor, getValue) {
  const ranges = {};

  return function (node) {
    const { parent } = node;

    return getColor(node, ranges[parent._id] || (ranges[parent._id] = calculateRange(parent.nodes, getValue)));
  };
}

function gradientColorizer(options, themeManager) {
  const palette = themeManager.createGradientPalette(options.palette);
  const getValue = _createColorCodeGetter(options);

  return 'range' in options ? createSimpleColorizer(getColor, getRangeData(options.range || [])) : createGuessingColorizer(getColor, getValue);

  function getColor(node, arg) {
    return palette.getColor((getValue(node) - arg[0]) / arg[1]);
  }
}

addColorizer('gradient', gradientColorizer);
export default gradientColorizer;
