// At least one algorithm is required.
import '@ts/viz/tree_map/tiling.squarified';
// By design discrete colorizing is used by default.
import '@ts/viz/tree_map/colorizing.discrete';

import componentRegistrator from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
// PLUGINS_SECTION
import BaseWidget from '@ts/viz/core/base_widget';
import type { DataSourcePluginMembers } from '@ts/viz/core/data_source';
import { plugin } from '@ts/viz/core/data_source';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { patchFontOptions } from '@ts/viz/core/utils';
import { getColorizer, setDefaultColorizer } from '@ts/viz/tree_map/colorizing';
import { buildRectAppearance, buildTextAppearance } from '@ts/viz/tree_map/common';
import Node from '@ts/viz/tree_map/node';
import { getAlgorithm as getTilingAlgorithm, setDefaultAlgorithm } from '@ts/viz/tree_map/tiling';

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable spellcheck/spell-checker */
const directions: Record<string, number[]> = {
  lefttoprightbottom: [+1, +1],
  leftbottomrighttop: [+1, -1],
  righttopleftbottom: [-1, +1],
  rightbottomlefttop: [-1, -1],
};
/* eslint-enable spellcheck/spell-checker */
setDefaultAlgorithm('squarified');
setDefaultColorizer('discrete');

const emptyRect = [0, 0, 0, 0];

interface TraverseParams {
  itemsField: string;
  valueField: string;
  buildNode: (node: ThemeValue) => void;
  ctx: ThemeValue;
  nodes: ThemeValue[];
}

function pickPositiveInteger(val: number): number {
  return val > 0 ? Math.round(val) : 0;
}

function traverseDataItems(
  root: ThemeValue,
  dataItems: ThemeValue[],
  level: number,
  params: TraverseParams,
): void {
  const nodes: ThemeValue[] = [];
  const allNodes = params.nodes;
  let totalValue = 0;

  dataItems.forEach((dataItem) => {
    const node = new Node();
    node._id = allNodes.length;
    node.ctx = params.ctx;
    node.parent = root;
    node.level = level;
    node.index = nodes.length;
    node.data = dataItem;
    params.buildNode(node);
    allNodes.push(node);
    nodes.push(node);
    const items = dataItem[params.itemsField];
    if (items?.length) {
      traverseDataItems(node, items, level + 1, params);
    }
    if (dataItem[params.valueField] > 0) {
      node.value = Number(dataItem[params.valueField]);
    }
    totalValue += node.value;
  });
  root.nodes = nodes;
  root.value = totalValue;
}

function processNodes(
  context: ThemeValue,
  root: ThemeValue,
  process: (context: ThemeValue, node: ThemeValue) => void,
): void {
  const { nodes } = root as { nodes: ThemeValue[] };

  nodes.forEach((node) => {
    process(context, node);
    if (node.isNode()) {
      processNodes(context, node, process);
    }
  });
}

function createLeaf(context: ThemeValue, node: ThemeValue): ThemeValue {
  const tile = context.renderer.simpleRect().append(context.group);

  context.setTrackerData(node, tile);
  return tile;
}

function createGroup(context: ThemeValue, node: ThemeValue): ThemeValue {
  const outer = context.renderer.simpleRect().append(context.group);
  const inner = context.renderer.simpleRect().append(context.group);

  context.setTrackerData(node, inner);
  return { outer, inner };
}

const createTile = [createLeaf, createGroup];

function processTileAppearance(context: ThemeValue, node: ThemeValue): void {
  node.color = node.data[context.colorField] || context.getColor(node) || node.parent.color;
  node.updateStyles();
  node.tile = (!node.ctx.forceReset && node.tile)
    || createTile[Number(node.isNode())](context, node);
  node.applyState();
}

function createLabel(
  context: ThemeValue,
  currentNode: ThemeValue,
  settings: ThemeValue,
): void {
  const labelData = currentNode.data[context.labelField];

  currentNode.label = labelData ? String(labelData) : null;
  const textData = currentNode.customLabel || currentNode.label;
  if (textData) {
    currentNode.text = context.renderer.text(textData)
      .attr(settings.attr)
      .css(settings.css)
      .append(context.group);
    context.setTrackerData(currentNode, currentNode.text);
  }
}

function processLabelAppearance(context: ThemeValue, node: ThemeValue): void {
  node.updateLabelStyle();
  if (node.labelState.visible) {
    createLabel(context, node, node.labelState);
  }
}

function calculateRects(context: ThemeValue, root: ThemeValue): void {
  const { nodes } = root;
  const items: ThemeValue[] = [];
  const rects: ThemeValue[] = [];
  let sum = 0;
  const ii = nodes.length;
  items.length = ii;
  rects.length = ii;

  for (let i = 0; i < ii; i += 1) {
    sum += nodes[i].value;
    items[i] = { value: nodes[i].value, i };
  }
  if (sum > 0) {
    context.algorithm({
      items: items.slice(),
      sum,
      rect: root.innerRect.slice(),
      isRotated: nodes[0].level % 2 !== 0,
      directions: context.directions,
    });
  }
  for (let i = 0; i < ii; i += 1) {
    rects[i] = items[i].rect || emptyRect;
  }
  root.rects = rects;
}

function marginateRect(rect: number[], margin: number): number[] {
  return [rect[0] + margin, rect[1] + margin, rect[2] - margin, rect[3] - margin];
}

function buildTileRect(
  rect: number[],
  outer: number[],
  edgeOffset: number,
  innerOffset: number,
): number[] {
  return [
    rect[0] + (rect[0] === outer[0] ? edgeOffset : +innerOffset),
    rect[1] + (rect[1] === outer[1] ? edgeOffset : +innerOffset),
    rect[2] - (rect[2] === outer[2] ? edgeOffset : -innerOffset),
    rect[3] - (rect[3] === outer[3] ? edgeOffset : -innerOffset),
  ];
}

function setRectAttrs(element: ThemeValue, rect: number[]): void {
  element.attr({
    x: rect[0],
    y: rect[1],
    width: Math.max(rect[2] - rect[0], 0),
    height: Math.max(rect[3] - rect[1], 0),
  });
}

function processTiling(context: ThemeValue, node: ThemeValue): void {
  let rect = node.parent.rects[node.index];
  const { rectOffsets } = context;

  if (node.isNode()) {
    setRectAttrs(node.tile.outer, buildTileRect(
      rect,
      node.parent.innerRect,
      rectOffsets.headerEdge,
      rectOffsets.headerInner,
    ));
    rect = marginateRect(rect, context.groupPadding);
    const headerHeight = Math.min(context.headerHeight, rect[3] - rect[1]);
    node.rect = [rect[0], rect[1], rect[2], rect[1] + headerHeight];
    setRectAttrs(node.tile.inner, marginateRect(node.rect, rectOffsets.headerEdge));
    rect[1] += headerHeight;
    node.innerRect = rect;
    calculateRects(context, node);
  } else {
    node.rect = rect;
    setRectAttrs(node.tile, buildTileRect(
      rect,
      node.parent.innerRect,
      rectOffsets.tileEdge,
      rectOffsets.tileInner,
    ));
  }
}

function layoutTextNode(node: ThemeValue, params: ThemeValue): void {
  const { rect, text } = node;
  const bBox = text.getBBox();
  const { paddingLeftRight, paddingTopBottom } = params;
  const effectiveWidth = rect[2] - rect[0] - 2 * paddingLeftRight;

  text.setMaxSize(
    effectiveWidth,
    rect[3] - rect[1] - paddingTopBottom,
    node.isNode()
      ? { textOverflow: params.groupLabelOverflow, wordWrap: 'none' }
      : {
        textOverflow: params.tileLabelOverflow,
        wordWrap: params.tileLabelWordWrap,
        hideOverflowEllipsis: true,
      },
  );

  text.move(
    params.rtlEnabled
      ? rect[2] - paddingLeftRight - bBox.x - bBox.width
      : rect[0] + paddingLeftRight - bBox.x,
    rect[1] + paddingTopBottom - bBox.y,
  );
}

function processLabelsLayout(context: ThemeValue, node: ThemeValue): void {
  if (node.text && node.labelState.visible) {
    layoutTextNode(node, node.labelParams);
  }
}

interface TreeMapBase extends DataSourcePluginMembers {
  _applyHoverState: (node: ThemeValue, state: boolean) => void;
  _applySelectionState: (node: ThemeValue, state: boolean) => void;
  _createProxyType: () => void;
  _drillToNode: (index: number) => void;
  _extendProxyType: (members: ThemeValue) => void;
  _hoverNode: (node: ThemeValue, state: boolean) => void;
  _moveTooltip: (node: ThemeValue, coords?: number[]) => void;
  _onNodesCreated: () => void;
  _onTilingPerformed: () => void;
  _selectNode: (node: ThemeValue, state: boolean, isSingle?: boolean) => void;
  _showTooltip: (index: number, coords?: number[]) => void;
  clearHover: () => void;
  clearSelection: () => void;
  drillUp: () => void;
  getCurrentNode: () => ThemeValue;
  getRootNode: () => ThemeValue;
  hideTooltip: () => void;
  resetDrillDown: () => void;
  resetNodes: () => void;
}

class TreeMapBase extends BaseWidget {
  _handlers!: ThemeValue;

  _rectOffsets!: ThemeValue;

  _context!: ThemeValue;

  _root!: ThemeValue;

  _topNode!: ThemeValue;

  _nodes!: ThemeValue[];

  _tilesGroup;

  _labelsGroup;

  _filter: ThemeValue;

  _textForCalculations: ThemeValue;

  _tilingRect!: number[];

  _maxDepth!: number;

  _headerHeight!: number;

  _groupPadding!: number;

  _isDataExpected?: boolean;

  _isSyncData?: boolean;

  _getDefaultSize(): { width: number; height: number } {
    return { width: 400, height: 400 };
  }

  _init(): void {
    this._rectOffsets = {};
    this._handlers = Object.create(this._handlers);
    this._context = {
      suspend: (): void => {
        if (!this._applyingChanges) {
          this._suspendChanges();
        }
      },
      resume: (): void => {
        if (!this._applyingChanges) {
          this._resumeChanges();
        }
      },
      change: (codes: string[]): void => {
        this._change(codes);
      },
      settings: [{}, {}],
      calculateState: this._handlers.calculateState,
      calculateLabelState: buildTextAppearance,
    };
    this._root = { nodes: [] };
    this._topNode = this._root;
    super._init();
  }

  _initCore(): void {
    const renderer = this._renderer;

    this._createProxyType();
    this._tilesGroup = renderer.g().linkOn(renderer.root, 'tiles').linkAppend();
    this._labelsGroup = renderer.g().linkOn(renderer.root, 'labels').linkAppend();
  }

  _disposeCore(): void {
    if (this._filter) {
      this._filter.dispose();
    }
    this._labelsGroup.linkOff();
    this._tilesGroup.linkOff();
  }

  _applySize(rect: number[]): void {
    this._tilingRect = rect.slice();
    this._change(['TILING']);
  }

  _changeDataSource(): void {
    this._isDataExpected = true;
    this._isSyncData = true;
    this._updateDataSource();
    this._isSyncData = false;
    if (this._isDataExpected) {
      this._suspendChanges();
    }
  }

  _dataSourceChangedHandler(): void {
    if (this._isDataExpected) {
      this._isDataExpected = false;
      this._change(['NODES_CREATE']);
      if (!this._isSyncData) {
        this._resumeChanges();
      }
    } else {
      this._requestChange(['NODES_CREATE']);
    }
  }

  _change_DATA_SOURCE(): void {
    this._changeDataSource();
  }

  _change_TILE_SETTINGS(): void {
    this._changeTileSettings();
  }

  _change_GROUP_SETTINGS(): void {
    this._changeGroupSettings();
  }

  _change_MAX_DEPTH(): void {
    this._changeMaxDepth();
  }

  _change_NODES_CREATE(): void {
    this._buildNodes();
  }

  _change_NODES_RESET(): void {
    this._resetNodes();
  }

  _change_TILES(): void {
    this._applyTilesAppearance();
  }

  _change_LABELS(): void {
    this._applyLabelsAppearance();
  }

  _change_TILING(): void {
    this._performTiling();
  }

  _change_LABELS_LAYOUT(): void {
    this._performLabelsLayout();
  }

  _applyChanges(): void {
    super._applyChanges();
    // This looks dirty.
    if (!this._isDataExpected) {
      this._drawn();
    }
    // Looks dirty but let it stay so until there is only one such case.
    this._context.forceReset = false;
  }

  _buildNodes(): void {
    const root = new Node();
    this._root = root;
    this._topNode = root;

    root._id = 0;
    root.parent = {};
    root.data = {};
    root.level = -1;
    root.index = -1;
    root.ctx = this._context;
    root.label = null;
    this._nodes = [root];
    this._handlers.beginBuildNodes();
    const processedData = this._processDataSourceItems(this._dataSourceItems() || []);
    traverseDataItems(root, processedData.items, 0, {
      itemsField: (!processedData.isPlain && this._getOption('childrenField', true)) || 'items',
      valueField: this._getOption('valueField', true) || 'value',
      buildNode: this._handlers.buildNode,
      ctx: this._context,
      nodes: this._nodes,
    });
    this._onNodesCreated();
    this._handlers.endBuildNodes();
    this._change(['NODES_RESET']);
  }

  _processDataSourceItems(items: ThemeValue[]): ThemeValue {
    return { items, isPlain: false };
  }

  _changeTileSettings(): void {
    const options = this._getOption('tile');
    const offsets = this._rectOffsets;
    const borderWidth = pickPositiveInteger(options.border.width);
    const edgeOffset = borderWidth / 2;
    const innerOffset = borderWidth % 2 ? 0.5 : 0;
    const labelOptions = options.label;
    const settings = this._context.settings[0];

    this._change(['TILES', 'LABELS']);
    settings.state = this._handlers.calculateState(options);
    // TODO: There should be some way (option) to prevent filter creation
    this._filter = this._filter || this._renderer.shadowFilter('-50%', '-50%', '200%', '200%');
    this._filter.attr(labelOptions.shadow);
    this._calculateLabelSettings(settings, labelOptions, this._filter.id);
    if (offsets.tileEdge !== edgeOffset || offsets.tileInner !== innerOffset) {
      offsets.tileEdge = edgeOffset;
      offsets.tileInner = innerOffset;
      this._change(['TILING']);
    }
  }

  _changeGroupSettings(): void {
    const options = this._getOption('group');
    const labelOptions = options.label;
    const offsets = this._rectOffsets;
    const borderWidth = pickPositiveInteger(options.border.width);
    const edgeOffset = borderWidth / 2;
    const innerOffset = borderWidth % 2 ? 0.5 : 0;
    const groupPadding = pickPositiveInteger(options.padding);
    const settings = this._context.settings[1];

    this._change(['TILES', 'LABELS']);
    settings.state = this._handlers.calculateState(options);
    this._calculateLabelSettings(settings, labelOptions);
    const headerHeight = options.headerHeight >= 0
      ? pickPositiveInteger(options.headerHeight)
      : settings.labelParams.height + 2 * pickPositiveInteger(labelOptions.paddingTopBottom);
    if (this._headerHeight !== headerHeight) {
      this._headerHeight = headerHeight;
      this._change(['TILING']);
    }
    if (this._groupPadding !== groupPadding) {
      this._groupPadding = groupPadding;
      this._change(['TILING']);
    }
    if (offsets.headerEdge !== edgeOffset || offsets.headerInner !== innerOffset) {
      offsets.headerEdge = edgeOffset;
      offsets.headerInner = innerOffset;
      this._change(['TILING']);
    }
  }

  _calculateLabelSettings(settings: ThemeValue, options: ThemeValue, filter?: ThemeValue): void {
    const bBox = this._getTextBBox(options.font);
    const paddingLeftRight = pickPositiveInteger(options.paddingLeftRight);
    const paddingTopBottom = pickPositiveInteger(options.paddingTopBottom);
    const tileLabelOptions = this._getOption('tile.label');
    const groupLabelOptions = this._getOption('group.label');

    settings.labelState = buildTextAppearance(options, filter);
    settings.labelState.visible = !('visible' in options) || !!options.visible;
    settings.labelParams = {
      height: bBox.height,
      rtlEnabled: this._getOption('rtlEnabled', true),
      paddingTopBottom,
      paddingLeftRight,
      tileLabelWordWrap: tileLabelOptions.wordWrap,
      tileLabelOverflow: tileLabelOptions.textOverflow,
      groupLabelOverflow: groupLabelOptions.textOverflow,
    };
  }

  _changeMaxDepth(): void {
    const option = this._getOption('maxDepth', true);
    const maxDepth = option >= 1 ? Math.round(option) : Infinity;

    if (this._maxDepth !== maxDepth) {
      this._maxDepth = maxDepth;
      this._change(['NODES_RESET']);
    }
  }

  _resetNodes(): void {
    this._tilesGroup.clear();
    this._renderer.initDefsElements();
    this._context.forceReset = true;
    this._context.minLevel = this._topNode.level + 1;
    this._context.maxLevel = this._context.minLevel + this._maxDepth - 1;
    this._change(['TILES', 'LABELS', 'TILING']);
  }

  _processNodes(
    context: ThemeValue,
    process: (context: ThemeValue, node: ThemeValue) => void,
  ): void {
    processNodes(context, this._topNode, process);
  }

  _applyTilesAppearance(): void {
    // Passing *themeManager* looks dirty but is excused by necessity of palettes
    // (and default palette specifically).
    // Passing *topNode* looks awfully dirty and is performed only because of discrete
    // group colorizing.
    // Aforementioned colorizing requires breadth-first tree traversal and nodes processing
    // is performed in a depth-first order.
    // TODO: Find a way to stop passing *topNode*
    const colorizer = getColorizer(this._getOption('colorizer'), this._themeManager, this._topNode);

    this._processNodes({
      renderer: this._renderer,
      group: this._tilesGroup,
      setTrackerData: this._handlers.setTrackerData,
      colorField: this._getOption('colorField', true) || 'color',
      getColor: colorizer,
    }, processTileAppearance);
  }

  _applyLabelsAppearance(): void {
    this._labelsGroup.clear();
    this._processNodes({
      renderer: this._renderer,
      group: this._labelsGroup,
      setTrackerData: this._handlers.setTrackerData,
      labelField: this._getOption('labelField', true) || 'name',
    }, processLabelAppearance);
    // Actually that is strange - for example if just "font.color" is changed then there is
    // no need to layout labels.
    // But for <text> element can change its size because of rather many reasons - so for
    // simplicity layout is always performed.
    this._change(['LABELS_LAYOUT']);
  }

  _performTiling(): void {
    const layoutDirection = String(this._getOption('layoutDirection', true)).toLowerCase();
    const context = {
      algorithm: getTilingAlgorithm(this._getOption('layoutAlgorithm', true)),
      // eslint-disable-next-line spellcheck/spell-checker
      directions: directions[layoutDirection] || directions.lefttoprightbottom,
      headerHeight: this._headerHeight,
      groupPadding: this._groupPadding,
      rectOffsets: this._rectOffsets,
    };

    this._topNode.innerRect = this._tilingRect;
    calculateRects(context, this._topNode);
    this._processNodes(context, processTiling);
    this._change(['LABELS_LAYOUT']);
    this._onTilingPerformed();
  }

  _performLabelsLayout(): void {
    this._processNodes(null, processLabelsLayout);
  }

  _getTextBBox(fontOptions: ThemeValue): ThemeValue {
    const renderer = this._renderer;
    const text = this._textForCalculations || renderer.text('0', 0, 0);

    this._textForCalculations = text;
    text.css(patchFontOptions(fontOptions)).append(renderer.root);
    const bBox = text.getBBox();
    text.remove();
    return bBox;
  }
}

setupWidgetPrototype(TreeMapBase, {
  _handlers: {
    beginBuildNodes: noop,
    buildNode: noop,
    endBuildNodes: noop,
    setTrackerData: noop,
    calculateState(options: ThemeValue): ThemeValue {
      return buildRectAppearance(options);
    },
  },
  _rootClass: 'dxtm-tree-map',
  _rootClassPrefix: 'dxtm',
  _themeSection: 'treeMap',
  _fontFields: ['tile.label.font', 'group.label.font'],
  _initialChanges: ['DATA_SOURCE'],
  _createProxyType: noop,
  _optionChangesMap: {
    dataSource: 'DATA_SOURCE',
    valueField: 'NODES_CREATE',
    childrenField: 'NODES_CREATE',
    colorField: 'TILES',
    colorizer: 'TILES',
    labelField: 'LABELS',
    tile: 'TILE_SETTINGS',
    group: 'GROUP_SETTINGS',
    maxDepth: 'MAX_DEPTH',
    layoutAlgorithm: 'TILING',
    layoutDirection: 'TILING',
  },
  _themeDependentChanges: ['TILE_SETTINGS', 'GROUP_SETTINGS', 'MAX_DEPTH'],
  _optionChangesOrder: ['DATA_SOURCE', 'TILE_SETTINGS', 'GROUP_SETTINGS', 'MAX_DEPTH'],
  _customChangesOrder: ['NODES_CREATE', 'NODES_RESET', 'TILES', 'LABELS', 'TILING', 'LABELS_LAYOUT'],
  _onNodesCreated: noop,
  _onTilingPerformed: noop,
});

componentRegistrator('dxTreeMap', TreeMapBase);

TreeMapBase.addPlugin(plugin);

export default TreeMapBase;
