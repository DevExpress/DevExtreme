/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { BaseThemeManagerInstance, Palette } from '@ts/viz/core/base_theme_manager';
import type { ColorGetter, ColorizerOptions } from '@ts/viz/tree_map/colorizing';
import { addColorizer } from '@ts/viz/tree_map/colorizing';
import type Node from '@ts/viz/tree_map/node';

function discreteColorizer(
  options: ColorizerOptions,
  themeManager: BaseThemeManagerInstance,
  root: Node,
): ColorGetter {
  const palette = themeManager.createPalette(options.palette, {
    useHighlight: true,
    extensionMode: options.paletteExtensionMode,
    count: options.colorizeGroups ? getNodesCount(root) : getLeafsCount(root),
  });

  return (options.colorizeGroups ? discreteGroupColorizer : discreteLeafColorizer)(palette, root);
}

function getLeafsCount(root: Node): number {
  const allNodes = (root.nodes as Node[]).slice();
  let i;
  const ii = allNodes.length;
  let count = 0;
  let node;

  for (i = 0; i < ii; i += 1) {
    node = allNodes[i];
    if (node.isNode()) {
      count = Math.max(count, getLeafsCount(node));
    } else {
      count += 1;
    }
  }

  return count;
}

function discreteLeafColorizer(palette: Palette): ColorGetter {
  const colors: string[] = palette.generateColors();

  return function (node) {
    return colors[node.index];
  };
}

function getNodesCount(root: Node): number {
  const allNodes = (root.nodes as Node[]).slice();
  let i;
  const ii = allNodes.length;
  let count = 0;
  let node;

  for (i = 0; i < ii; i += 1) {
    node = allNodes[i];
    if (node.isNode()) {
      count += getNodesCount(node) + 1;
    }
  }

  return count;
}

function prepareDiscreteGroupColors(palette: Palette, root: Node): Record<number, string> {
  const colors: Record<number, string> = {};
  let allNodes = (root.nodes as Node[]).slice();
  let i;
  let ii = allNodes.length;
  let node;

  for (i = 0; i < ii; i += 1) {
    node = allNodes[i];
    if (node.isNode()) {
      allNodes = allNodes.concat(node.nodes);
      ii = allNodes.length;
    } else if (!colors[node.parent._id]) {
      colors[node.parent._id] = palette.getNextColor();
    }
  }
  return colors;
}

function discreteGroupColorizer(palette: Palette, root: Node): ColorGetter {
  const colors = prepareDiscreteGroupColors(palette, root);

  return function (node) {
    return colors[node._id];
  };
}

addColorizer('discrete', discreteColorizer);
export default discreteColorizer;
