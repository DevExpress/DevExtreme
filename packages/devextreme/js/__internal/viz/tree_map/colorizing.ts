/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop as _noop } from '@js/core/utils/common';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';

const colorizers = {};
let defaultColorizerName;

function wrapLeafColorGetter(getter) {
  return function (node) {
    return !node.isNode() ? getter(node) : undefined;
  };
}

function wrapGroupColorGetter(getter) {
  return function (node) {
    const parent = !node.isNode() && node.parent;

    return parent ? (parent._groupColor = parent._groupColor || getter(parent)) : undefined;
  };
}

export function getColorizer(options, themeManager, root) {
  const type = _normalizeEnum(options.type || defaultColorizerName);
  const colorizer = colorizers[type]?.(options, themeManager, root);

  return colorizer ? (options.colorizeGroups ? wrapGroupColorGetter : wrapLeafColorGetter)(colorizer) : _noop;
}

export function addColorizer(name, colorizer) {
  colorizers[name] = colorizer;
}

export function setDefaultColorizer(name) {
  defaultColorizerName = name;
}

function getValueAsColorCode(node) {
  return node.value;
}

function createColorCode(colorCodeField) {
  return function (node) {
    return Number(node.data[colorCodeField]);
  };
}

export function createColorCodeGetter(options) {
  return options.colorCodeField ? createColorCode(options.colorCodeField) : getValueAsColorCode;
}
