/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
// PLUGINS_SECTION
import componentRegistrator from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { isNumeric as _isNumber, isString as _isString } from '@js/core/utils/type';
import { plugin as pluginDataSource } from '@ts/viz/core/data_source';
import baseWidget from '@ts/viz/core/m_base_widget';
import { COLOR_MODE_GRADIENT, COLOR_MODE_SOURCE, COLOR_MODE_TARGET } from '@ts/viz/sankey/constants';
import { layout as defaultLayoutBuilder } from '@ts/viz/sankey/layout';
import Link from '@ts/viz/sankey/link_item';
import Node from '@ts/viz/sankey/node_item';

function moveLabel(node, labelOptions, availableLabelWidth, rect) {
  if (node._label.getBBox().width > availableLabelWidth) {
    node.labelText.applyEllipsis(availableLabelWidth);
  }

  const bBox = node._label.getBBox();
  const verticalOffset = labelOptions.verticalOffset;
  const horizontalOffset = labelOptions.horizontalOffset;
  let labelOffsetY = Math.round(node.rect.y + node.rect.height / 2 - bBox.y - bBox.height / 2) + verticalOffset;
  let labelOffsetX = node.rect.x + horizontalOffset + node.rect.width - bBox.x;

  if (labelOffsetX + bBox.width >= rect[2] - rect[0]) {
    labelOffsetX = node.rect.x - horizontalOffset - bBox.x - bBox.width;
  }

  if (labelOffsetY >= rect[3]) {
    labelOffsetY = rect[3];
  }

  if (labelOffsetY - bBox.height < rect[1]) {
    labelOffsetY = node.rect.y - bBox.y + verticalOffset;
  }

  node.labelText.attr({
    translateX: labelOffsetX,
    translateY: labelOffsetY,
  });
}

function getConnectedLinks(layout, nodeName, linkType) {
  const result = [];
  const attrName = linkType === 'in' ? '_to' : '_from';
  const invertedAttrName = linkType === 'in' ? '_from' : '_to';

  layout.links.map((link) => link[attrName]._name === nodeName).forEach((connected, idx) => {
    // @ts-expect-error
    connected && result.push({ index: idx, weight: layout.links[idx]._weight, node: layout.links[idx][invertedAttrName]._name });
  });
  return result;
}

const dxSankey = baseWidget.inherit({
  _rootClass: 'dxs-sankey',

  _rootClassPrefix: 'dxs',

  _proxyData: [],

  _optionChangesMap: {
    dataSource: 'DATA_SOURCE',
    sortData: 'DATA_SOURCE',
    alignment: 'DATA_SOURCE',
    node: 'BUILD_LAYOUT',
    label: 'LABELS',
    link: 'BUILD_LAYOUT',
    palette: 'BUILD_LAYOUT',
    paletteExtensionMode: 'BUILD_LAYOUT',
  },

  _themeDependentChanges: ['BUILD_LAYOUT'],

  _getDefaultSize() {
    return { width: 400, height: 400 };
  },

  _themeSection: 'sankey',

  _fontFields: ['label.font'],

  _optionChangesOrder: ['DATA_SOURCE'],

  _initialChanges: ['DATA_SOURCE'],

  _initCore() {
    this._groupLinks = this._renderer.g().append(this._renderer.root);
    this._groupNodes = this._renderer.g().append(this._renderer.root);
    this._groupLabels = this._renderer.g().attr({
      class: `${this._rootClassPrefix}-labels`,
    }).append(this._renderer.root);

    this._drawLabels = true;

    this._nodes = [];
    this._links = [];
    this._gradients = [];
  },

  _disposeCore: noop,

  _applySize(rect) {
    this._rect = rect.slice();

    const adaptiveLayout = this._getOption('adaptiveLayout');
    if (adaptiveLayout.keepLabels || this._rect[2] - this._rect[0] > adaptiveLayout.width) {
      this._drawLabels = true;
    } else {
      this._drawLabels = false;
    }

    this._change(['BUILD_LAYOUT']);
    return this._rect;
  },

  _eventsMap: {
    onNodeHoverChanged: { name: 'nodeHoverChanged' },
    onLinkHoverChanged: { name: 'linkHoverChanged' },
  },

  _customChangesOrder: ['BUILD_LAYOUT', 'NODES_DRAW', 'LINKS_DRAW', 'LABELS', 'DRAWN'],

  _dataSourceChangedHandler() {
    this._requestChange(['BUILD_LAYOUT']);
  },

  _change_DRAWN() {
    this._drawn();
  },

  _change_DATA_SOURCE() {
    this._change(['DRAWN']);
    this._updateDataSource();
  },

  _change_LABELS() {
    this._applyLabelsAppearance();
  },

  _change_BUILD_LAYOUT() {
    this._groupNodes.clear();
    this._groupLinks.clear();
    this._groupLabels.clear();

    this._buildLayout();
  },

  _change_NODES_DRAW() {
    const that = this;
    const nodes = that._nodes;

    nodes.forEach((node, index) => {
      const element = that._renderer.rect().attr(node.rect).append(that._groupNodes);
      node.element = element;
    });
    this._applyNodesAppearance();
  },

  _change_LINKS_DRAW() {
    const that = this;
    const links = that._links;

    links.forEach((link, index) => {
      const group = that._renderer.g().attr({ class: 'link', 'data-link-idx': index }).append(that._groupLinks);
      link.overlayElement = that._renderer.path([], 'area').attr({ d: link.d }).append(group);
      link.element = that._renderer.path([], 'area').attr({ d: link.d }).append(group);
    });
    this._applyLinksAppearance();
  },

  _suspend() {
    if (!this._applyingChanges) {
      this._suspendChanges();
    }
  },
  _resume() {
    if (!this._applyingChanges) {
      this._resumeChanges();
    }
  },

  _showTooltip: noop,

  hideTooltip: noop,

  clearHover() {
    this._suspend();

    this._nodes.forEach((node) => {
      node.isHovered() && node.hover(false);
    });

    this._links.forEach((link) => {
      link.isHovered() && link.hover(false);
      link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
    });

    this._resume();
  },

  _applyNodesAppearance() {
    this._nodes.forEach((node) => {
      const state = node.getState();
      node.element.smartAttr(node.states[state]);
    });
  },

  _applyLinksAppearance() {
    this._links.forEach((link) => {
      const state = link.getState();
      link.element.smartAttr(link.states[state]);
      link.overlayElement.smartAttr(link.overlayStates[state]);
    });
  },

  _hitTestTargets(x, y) {
    const that = this;
    let data;
    // @ts-expect-error
    this._proxyData.some((callback) => {
      data = callback.call(that, x, y);
      if (data) {
        return true;
      }
    });
    return data;
  },

  _getData() {
    const that = this;
    const data = that._dataSourceItems() || [];
    const sourceField = that._getOption('sourceField', true);
    const targetField = that._getOption('targetField', true);
    const weightField = that._getOption('weightField', true);
    const processedData = [];

    data.forEach((item) => {
      const hasItemOwnProperty = Object.prototype.hasOwnProperty.bind(item);
      if (!hasItemOwnProperty(sourceField)) {
        that._incidentOccurred('E2007', sourceField);
      } else if (!hasItemOwnProperty(targetField)) {
        that._incidentOccurred('E2007', targetField);
      } else if (!hasItemOwnProperty(weightField)) {
        that._incidentOccurred('E2007', weightField);
      } else if (!_isString(item[sourceField])) {
        that._incidentOccurred('E2008', sourceField);
      } else if (!_isString(item[targetField])) {
        that._incidentOccurred('E2008', targetField);
      } else if (!_isNumber(item[weightField]) || item[weightField] <= 0) {
        that._incidentOccurred('E2009', weightField);
      } else {
        // @ts-expect-error
        processedData.push([item[sourceField], item[targetField], item[weightField]]);
      }
    });

    return processedData;
  },

  _buildLayout() {
    const that = this;
    const data = that._getData();
    const availableRect = this._rect;
    const nodeOptions = that._getOption('node');
    const sortData = that._getOption('sortData');
    const layoutBuilder = that._getOption('layoutBuilder', true) || defaultLayoutBuilder;
    const rect = {
      x: availableRect[0],
      y: availableRect[1],
      width: availableRect[2] - availableRect[0],
      height: availableRect[3] - availableRect[1],
    };
    const layout = layoutBuilder.computeLayout(
      data,
      sortData,
      {
        availableRect: rect,
        nodePadding: nodeOptions.padding,
        nodeWidth: nodeOptions.width,
        nodeAlign: that._getOption('alignment', true),
      },
      that._incidentOccurred,
    );
    that._layoutMap = layout;

    if (!Object.prototype.hasOwnProperty.call(layout, 'error')) {
      const nodeColors = {};
      let nodeIdx = 0;
      const linkOptions = that._getOption('link');
      const totalNodesNum = layout.nodes
        .map((item) => item.length)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      const palette = that._themeManager.createPalette(that._getOption('palette', true), {
        useHighlight: true,
        extensionMode: that._getOption('paletteExtensionMode', true),
        count: totalNodesNum,
      });

      that._nodes = [];
      that._links = [];

      that._gradients.forEach((gradient) => { gradient.dispose(); });
      that._gradients = [];

      that._shadowFilter && that._shadowFilter.dispose();

      layout.nodes.forEach((cascadeNodes) => {
        cascadeNodes.forEach((node) => {
          const color = nodeOptions.color || palette.getNextColor();
          const nodeItem = new Node(that, {
            id: nodeIdx,
            color,
            rect: node,
            options: nodeOptions,
            linksIn: getConnectedLinks(layout, node._name, 'in'),
            linksOut: getConnectedLinks(layout, node._name, 'out'),
          });
          that._nodes.push(nodeItem);
          nodeIdx++;
          nodeColors[node._name] = color;
        });
      });

      layout.links.forEach((link) => {
        let gradient = null;

        if (linkOptions.colorMode === COLOR_MODE_GRADIENT) {
          gradient = that._renderer.linearGradient([
            { offset: '0%', 'stop-color': nodeColors[link._from._name] },
            { offset: '100%', 'stop-color': nodeColors[link._to._name] },
          ]);
          this._gradients.push(gradient);
        }

        let color = linkOptions.color;
        if (linkOptions.colorMode === COLOR_MODE_SOURCE) {
          color = nodeColors[link._from._name];
        } else if (linkOptions.colorMode === COLOR_MODE_TARGET) {
          color = nodeColors[link._to._name];
        }

        const linkItem = new Link(that, {
          d: link.d,
          boundingRect: link._boundingRect,
          color,
          options: linkOptions,
          connection: {
            source: link._from._name,
            target: link._to._name,
            weight: link._weight,
          },
          gradient,
        });
        that._links.push(linkItem);
      });

      that._renderer.initDefsElements();
      that._change(['NODES_DRAW', 'LINKS_DRAW', 'LABELS']);
    }

    that._change(['DRAWN']);
  },

  _applyLabelsAppearance() {
    const that = this;
    const labelOptions = that._getOption('label');
    const availableWidth = that._rect[2] - that._rect[0];
    const nodeOptions = that._getOption('node');

    that._shadowFilter = that._renderer.shadowFilter('-50%', '-50%', '200%', '200%').attr(labelOptions.shadow);
    that._groupLabels.clear();

    if (that._drawLabels && labelOptions.visible) {
      // emtpy space between cascades with 'labelOptions.horizontalOffset' subtracted
      const availableLabelWidth = (availableWidth - (nodeOptions.width + labelOptions.horizontalOffset) - (that._layoutMap.cascades.length * nodeOptions.width)) / (that._layoutMap.cascades.length - 1) - labelOptions.horizontalOffset;
      that._nodes.forEach((node) => {
        that._createLabel(node, labelOptions, that._shadowFilter.id);
        moveLabel(node, labelOptions, availableLabelWidth, that._rect);
      });

      // test and handle labels overlapping here
      if (labelOptions.overlappingBehavior !== 'none') {
        that._nodes.forEach((thisNode) => {
          const thisBox = thisNode._label.getBBox();
          that._nodes.forEach((otherNode) => {
            const otherBox = otherNode._label.getBBox();
            if (thisNode.id !== otherNode.id && defaultLayoutBuilder.overlap(thisBox, otherBox)) {
              if (labelOptions.overlappingBehavior === 'ellipsis') {
                thisNode.labelText.applyEllipsis(otherBox.x - thisBox.x);
              } else if (labelOptions.overlappingBehavior === 'hide') {
                thisNode.labelText.remove();
              }
            }
          });
        });
      }
    }
  },

  _createLabel(node, labelOptions, filter) {
    const textData = labelOptions.customizeText(node);
    const settings = node.getLabelAttributes(labelOptions, filter);
    if (textData) {
      node._label = this._renderer.g().append(this._groupLabels);
      node.labelText = this._renderer.text(textData)
        .attr(settings.attr)
        .css(settings.css);
      node.labelText.append(node._label);
    }
  },

  _getMinSize() {
    const adaptiveLayout = this._getOption('adaptiveLayout');
    return [adaptiveLayout.width, adaptiveLayout.height];
  },

  getAllNodes() {
    return this._nodes.slice();
  },

  getAllLinks() {
    return this._links.slice();
  },
});

componentRegistrator('dxSankey', dxSankey);
export default dxSankey;
dxSankey.addPlugin(pluginDataSource);
