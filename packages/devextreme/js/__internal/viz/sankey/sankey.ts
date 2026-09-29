/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
// PLUGINS_SECTION
import componentRegistrator from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { isNumeric, isString } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import BaseWidget from '@ts/viz/core/base_widget';
import type { DataSourcePluginMembers } from '@ts/viz/core/data_source';
import { plugin as pluginDataSource } from '@ts/viz/core/data_source';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { COLOR_MODE_GRADIENT, COLOR_MODE_SOURCE, COLOR_MODE_TARGET } from '@ts/viz/sankey/constants';
import { layout as defaultLayoutBuilder } from '@ts/viz/sankey/layout';
import Link from '@ts/viz/sankey/link_item';
import Node from '@ts/viz/sankey/node_item';

type SankeyDataItem = [string, string, number];

interface ConnectedLink {
  index: number;
  weight: number;
  node: string;
}

type HitTestCallback = (this: Sankey, x: number, y: number) => ThemeValue;

function moveLabel(
  node: ThemeValue,
  labelOptions: ThemeValue,
  availableLabelWidth: number,
  rect: number[],
): void {
  if (node._label.getBBox().width > availableLabelWidth) {
    node.labelText.applyEllipsis(availableLabelWidth);
  }

  const bBox = node._label.getBBox();
  const { verticalOffset, horizontalOffset } = labelOptions;
  const [rectLeft, rectTop, rectRight, rectBottom] = rect;
  let labelOffsetY = Math.round(
    node.rect.y + node.rect.height / 2 - bBox.y - bBox.height / 2,
  ) + verticalOffset;
  let labelOffsetX = node.rect.x + horizontalOffset + node.rect.width - bBox.x;

  if (labelOffsetX + bBox.width >= rectRight - rectLeft) {
    labelOffsetX = node.rect.x - horizontalOffset - bBox.x - bBox.width;
  }

  if (labelOffsetY >= rectBottom) {
    labelOffsetY = rectBottom;
  }

  if (labelOffsetY - bBox.height < rectTop) {
    labelOffsetY = node.rect.y - bBox.y + verticalOffset;
  }

  node.labelText.attr({
    translateX: labelOffsetX,
    translateY: labelOffsetY,
  });
}

function getConnectedLinks(
  layout: ThemeValue,
  nodeName: string,
  linkType: string,
): ConnectedLink[] {
  const result: ConnectedLink[] = [];
  const attrName = linkType === 'in' ? '_to' : '_from';
  const invertedAttrName = linkType === 'in' ? '_from' : '_to';

  layout.links.forEach((link: ThemeValue, idx: number) => {
    if (link[attrName]._name === nodeName) {
      result.push({ index: idx, weight: link._weight, node: link[invertedAttrName]._name });
    }
  });
  return result;
}

interface Sankey extends DataSourcePluginMembers {}

class Sankey extends BaseWidget {
  _groupLinks;

  _groupNodes;

  _groupLabels;

  _drawLabels!: boolean;

  _nodes!: ThemeValue[];

  _links!: ThemeValue[];

  _gradients!: ThemeValue[];

  _rect!: number[];

  _layoutMap: ThemeValue;

  _shadowFilter: ThemeValue;

  _proxyData!: HitTestCallback[];

  _getDefaultSize(): { width: number; height: number } {
    return { width: 400, height: 400 };
  }

  _initCore(): void {
    this._groupLinks = this._renderer.g().append(this._renderer.root);
    this._groupNodes = this._renderer.g().append(this._renderer.root);
    this._groupLabels = this._renderer.g().attr({
      class: `${this._rootClassPrefix}-labels`,
    }).append(this._renderer.root);

    this._drawLabels = true;

    this._nodes = [];
    this._links = [];
    this._gradients = [];
  }

  _applySize(rect: number[]): number[] {
    this._rect = rect.slice();

    const adaptiveLayout = this._getOption('adaptiveLayout');
    this._drawLabels = Boolean(adaptiveLayout.keepLabels)
      || this._rect[2] - this._rect[0] > adaptiveLayout.width;

    this._change(['BUILD_LAYOUT']);
    return this._rect;
  }

  _dataSourceChangedHandler(): void {
    this._requestChange(['BUILD_LAYOUT']);
  }

  _change_DRAWN(): void {
    this._drawn();
  }

  _change_DATA_SOURCE(): void {
    this._change(['DRAWN']);
    this._updateDataSource();
  }

  _change_LABELS(): void {
    this._applyLabelsAppearance();
  }

  _change_BUILD_LAYOUT(): void {
    this._groupNodes.clear();
    this._groupLinks.clear();
    this._groupLabels.clear();

    this._buildLayout();
  }

  _change_NODES_DRAW(): void {
    this._nodes.forEach((node) => {
      node.element = this._renderer.rect().attr(node.rect).append(this._groupNodes);
    });
    this._applyNodesAppearance();
  }

  _change_LINKS_DRAW(): void {
    this._links.forEach((link, index) => {
      const group = this._renderer.g()
        .attr({ class: 'link', 'data-link-idx': index })
        .append(this._groupLinks);
      link.overlayElement = this._renderer.path([], 'area').attr({ d: link.d }).append(group);
      link.element = this._renderer.path([], 'area').attr({ d: link.d }).append(group);
    });
    this._applyLinksAppearance();
  }

  _suspend(): void {
    if (!this._applyingChanges) {
      this._suspendChanges();
    }
  }

  _resume(): void {
    if (!this._applyingChanges) {
      this._resumeChanges();
    }
  }

  clearHover(): void {
    this._suspend();

    this._nodes.forEach((node) => {
      if (node.isHovered()) {
        node.hover(false);
      }
    });

    this._links.forEach((link) => {
      if (link.isHovered()) {
        link.hover(false);
      }
      if (link.isAdjacentNodeHovered()) {
        link.adjacentNodeHover(false);
      }
    });

    this._resume();
  }

  _applyNodesAppearance(): void {
    this._nodes.forEach((node) => {
      const state = node.getState();
      node.element.smartAttr(node.states[state]);
    });
  }

  _applyLinksAppearance(): void {
    this._links.forEach((link) => {
      const state = link.getState();
      link.element.smartAttr(link.states[state]);
      link.overlayElement.smartAttr(link.overlayStates[state]);
    });
  }

  _hitTestTargets(x: number, y: number): ThemeValue {
    return this._proxyData.reduce<ThemeValue>(
      (found: ThemeValue, callback: HitTestCallback): ThemeValue => (
        found || callback.call(this, x, y)
      ),
      undefined,
    );
  }

  _getData(): SankeyDataItem[] {
    const data: ThemeValue[] = this._dataSourceItems() || [];
    const sourceField = this._getOption('sourceField', true);
    const targetField = this._getOption('targetField', true);
    const weightField = this._getOption('weightField', true);
    const processedData: SankeyDataItem[] = [];

    data.forEach((item) => {
      const hasItemOwnProperty = Object.prototype.hasOwnProperty.bind(item);
      if (!hasItemOwnProperty(sourceField)) {
        this._incidentOccurred('E2007', sourceField);
      } else if (!hasItemOwnProperty(targetField)) {
        this._incidentOccurred('E2007', targetField);
      } else if (!hasItemOwnProperty(weightField)) {
        this._incidentOccurred('E2007', weightField);
      } else if (!isString(item[sourceField])) {
        this._incidentOccurred('E2008', sourceField);
      } else if (!isString(item[targetField])) {
        this._incidentOccurred('E2008', targetField);
      } else if (!isNumeric(item[weightField]) || item[weightField] <= 0) {
        this._incidentOccurred('E2009', weightField);
      } else {
        processedData.push([item[sourceField], item[targetField], item[weightField]]);
      }
    });

    return processedData;
  }

  _buildLayout(): void {
    const data = this._getData();
    const availableRect = this._rect;
    const nodeOptions = this._getOption('node');
    const sortData = this._getOption('sortData');
    const layoutBuilder = this._getOption('layoutBuilder', true) || defaultLayoutBuilder;
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
        nodeAlign: this._getOption('alignment', true),
      },
      this._incidentOccurred,
    );
    this._layoutMap = layout;

    if (!Object.prototype.hasOwnProperty.call(layout, 'error')) {
      const nodeColors: Record<string, ThemeValue> = {};
      let nodeIdx = 0;
      const linkOptions = this._getOption('link');
      const totalNodesNum: number = layout.nodes
        .map((item: ThemeValue[]) => item.length)
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
      const palette = this._themeManager.createPalette(this._getOption('palette', true), {
        useHighlight: true,
        extensionMode: this._getOption('paletteExtensionMode', true),
        count: totalNodesNum,
      });

      this._nodes = [];
      this._links = [];

      this._gradients.forEach((gradient) => { gradient.dispose(); });
      this._gradients = [];

      if (this._shadowFilter) {
        this._shadowFilter.dispose();
      }

      layout.nodes.forEach((cascadeNodes: ThemeValue[]) => {
        cascadeNodes.forEach((node) => {
          const color = nodeOptions.color || palette.getNextColor();
          const nodeItem = new Node(this, {
            id: nodeIdx,
            color,
            rect: node,
            options: nodeOptions,
            linksIn: getConnectedLinks(layout, node._name, 'in'),
            linksOut: getConnectedLinks(layout, node._name, 'out'),
          });
          this._nodes.push(nodeItem);
          nodeIdx += 1;
          nodeColors[node._name] = color;
        });
      });

      layout.links.forEach((link: ThemeValue) => {
        let gradient = null;

        if (linkOptions.colorMode === COLOR_MODE_GRADIENT) {
          gradient = this._renderer.linearGradient([
            { offset: '0%', 'stop-color': nodeColors[link._from._name] },
            { offset: '100%', 'stop-color': nodeColors[link._to._name] },
          ]);
          this._gradients.push(gradient);
        }

        let { color } = linkOptions;
        if (linkOptions.colorMode === COLOR_MODE_SOURCE) {
          color = nodeColors[link._from._name];
        } else if (linkOptions.colorMode === COLOR_MODE_TARGET) {
          color = nodeColors[link._to._name];
        }

        const linkItem = new Link(this, {
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
        this._links.push(linkItem);
      });

      this._renderer.initDefsElements();
      this._change(['NODES_DRAW', 'LINKS_DRAW', 'LABELS']);
    }

    this._change(['DRAWN']);
  }

  _applyLabelsAppearance(): void {
    const labelOptions = this._getOption('label');
    const availableWidth = this._rect[2] - this._rect[0];
    const nodeOptions = this._getOption('node');

    this._shadowFilter = this._renderer.shadowFilter('-50%', '-50%', '200%', '200%')
      .attr(labelOptions.shadow);
    this._groupLabels.clear();

    if (this._drawLabels && labelOptions.visible) {
      // emtpy space between cascades with 'labelOptions.horizontalOffset' subtracted
      const cascadesCount: number = this._layoutMap.cascades.length;
      const freeSpace = availableWidth
        - (nodeOptions.width + labelOptions.horizontalOffset)
        - cascadesCount * nodeOptions.width;
      const availableLabelWidth = freeSpace / (cascadesCount - 1) - labelOptions.horizontalOffset;
      this._nodes.forEach((node) => {
        this._createLabel(node, labelOptions, this._shadowFilter.id);
        moveLabel(node, labelOptions, availableLabelWidth, this._rect);
      });

      // test and handle labels overlapping here
      if (labelOptions.overlappingBehavior !== 'none') {
        this._nodes.forEach((thisNode) => {
          const thisBox = thisNode._label.getBBox();
          this._nodes.forEach((otherNode) => {
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
  }

  _createLabel(node: ThemeValue, labelOptions: ThemeValue, filter: ThemeValue): void {
    const textData = labelOptions.customizeText(node);
    const settings = node.getLabelAttributes(labelOptions, filter);
    if (textData) {
      node._label = this._renderer.g().append(this._groupLabels);
      node.labelText = this._renderer.text(textData)
        .attr(settings.attr)
        .css(settings.css);
      node.labelText.append(node._label);
    }
  }

  _getMinSize(): number[] {
    const adaptiveLayout: { width: number; height: number } = this._getOption('adaptiveLayout');
    return [adaptiveLayout.width, adaptiveLayout.height];
  }

  getAllNodes(): ThemeValue[] {
    return this._nodes.slice();
  }

  getAllLinks(): ThemeValue[] {
    return this._links.slice();
  }
}

setupWidgetPrototype(Sankey, {
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
  _themeSection: 'sankey',
  _fontFields: ['label.font'],
  _optionChangesOrder: ['DATA_SOURCE'],
  _initialChanges: ['DATA_SOURCE'],
  _eventsMap: {
    onNodeHoverChanged: { name: 'nodeHoverChanged' },
    onLinkHoverChanged: { name: 'linkHoverChanged' },
  },
  _customChangesOrder: ['BUILD_LAYOUT', 'NODES_DRAW', 'LINKS_DRAW', 'LABELS', 'DRAWN'],
  _disposeCore: noop,
  _showTooltip: noop,
  hideTooltip: noop,
});

componentRegistrator('dxSankey', Sankey);

Sankey.addPlugin(pluginDataSource);

export default Sankey;
