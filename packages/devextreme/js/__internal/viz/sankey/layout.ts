/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-else-return */

import type { Properties as SankeyProperties } from '@js/viz/sankey';
import type { BBox } from '@ts/viz/core/types';
import validatorModule from '@ts/viz/sankey/data_validator';
import type { RankedVertex } from '@ts/viz/sankey/graph';
import graphModule from '@ts/viz/sankey/graph';
import type { NodeRect } from '@ts/viz/sankey/node_item';
import type { SankeyDataItem } from '@ts/viz/sankey/sankey';

interface CascadeNode {
  nodeTitle: string;
  inWeight: number;
  outWeight: number;
  maxWeight: number;
  sort: number;
}

type Cascade = Record<string, CascadeNode>;

interface LinkEnd extends BBox {
  node: NodeRect;
}

interface LinkPath {
  from: LinkEnd & { weight: number };
  to: LinkEnd;
}

type SortableLink = Omit<SankeyDataItem, 'sort'> & { sort: number };

interface LayoutLink {
  d: string;
  _boundingRect: BBox;
  _weight: number;
  _from: NodeRect;
  _to: NodeRect;
}

interface NodesOptions extends BBox {
  nodePadding: number;
  nodeWidth: number;
  nodeAlign: SankeyProperties['alignment'];
}

interface LayoutOptions {
  availableRect: BBox;
  nodePadding: number;
  nodeWidth: number;
  nodeAlign: SankeyProperties['alignment'];
}

interface LayoutResult {
  cascades?: Cascade[];
  nodes?: NodeRect[][];
  links?: LayoutLink[];
  error?: string;
}

interface SankeyLayout {
  _weightPerPixel: number | null;
  _sort?: Record<string, number>;
  _getCascadeIdx: (nodeTitle: string, cascadesConfig: RankedVertex[]) => number;
  _getInWeightForNode: (nodeTitle: string, links: SankeyDataItem[]) => number;
  _getOutWeightForNode: (nodeTitle: string, links: SankeyDataItem[]) => number;
  _computeCascades: (links: SankeyDataItem[]) => Cascade[];
  _getWeightForCascade: (cascades: Cascade[], cascadeIdx: number) => number;
  _getMaxWeightThroughCascades: (cascades: Cascade[]) => number;
  _computeNodes: (cascades: Cascade[], options: NodesOptions) => NodeRect[][];
  _findRectByName: (rects: NodeRect[][], name: string) => NodeRect | null;
  _findIndexByName: (rects: NodeRect[][], nodeTitle: string) => number | null;
  _computeLinks: (
    links: SankeyDataItem[],
    rects: NodeRect[][],
    cascades: Cascade[],
  ) => LayoutLink[];
  _fitNodeHeight: (nodeName: string, nodeRects: NodeRect[][], paths: LinkPath[]) => void;
  _fitAllNodesHeight: (nodeRects: NodeRect[][], paths: LinkPath[]) => void;
  _spline: (rectLeft: BBox, rectRight: BBox) => string;
  computeLayout: (
    linksData: SankeyDataItem[],
    sortData: Record<string, number> | undefined,
    options: LayoutOptions,
    incidentOccurred: (errorCode: string) => void,
  ) => LayoutResult;
  overlap: (box1: BBox, box2: BBox) => boolean;
}

const _SPLINE_TENSION = 0.3;
const _ALIGNMENT_CENTER = 'center';
const _ALIGNMENT_BOTTOM = 'bottom';
const _ALIGNMENT_DEFAULT = _ALIGNMENT_CENTER;

export const layout: SankeyLayout = {
  _weightPerPixel: null,

  _getCascadeIdx(nodeTitle: string, cascadesConfig: RankedVertex[]): number {
    const nodeInfo = cascadesConfig.filter((c) => c.name === nodeTitle)[0];

    if (nodeInfo.outgoing.length > 0) {
      // in common case number of cascade is the longest path to the node
      return nodeInfo.lp;
    } else {
      // but if the node is last (ie has no outgoing edges) lets move it to the LAST cascade
      return graphModule.routines.maxOfArray(cascadesConfig.map((c) => c.lp));
    }
  },

  _getInWeightForNode(nodeTitle: string, links: SankeyDataItem[]): number {
    let w = 0;
    links.forEach((link) => {
      if (link[1] === nodeTitle) {
        w += link[2];
      }
    });
    return w;
  },

  _getOutWeightForNode(nodeTitle: string, links: SankeyDataItem[]): number {
    let w = 0;
    links.forEach((link) => {
      if (link[0] === nodeTitle) {
        w += link[2];
      }
    });
    return w;
  },

  _computeCascades(this: SankeyLayout, links: SankeyDataItem[]): Cascade[] {
    const cascadesConfig = graphModule.struct.computeLongestPaths(links);
    const maxCascade = graphModule.routines.maxOfArray(cascadesConfig.map((c) => c.lp));

    const cascades: Cascade[] = [];

    // init cascades
    for (let i = 0; i < maxCascade + 1; i += 1) {
      cascades.push({});
    }

    // add nodes to cascades
    links.forEach((link) => {
      let cascade = cascades[this._getCascadeIdx(link[0], cascadesConfig)];
      if (!cascade[link[0]]) {
        cascade[link[0]] = { nodeTitle: link[0] } as CascadeNode;
      }
      cascade = cascades[this._getCascadeIdx(link[1], cascadesConfig)];
      if (!cascade[link[1]]) {
        cascade[link[1]] = { nodeTitle: link[1] } as CascadeNode;
      }
    });

    // compute in and out weightes of all nodes of cascades
    cascades.forEach((cascade) => {
      Object.keys(cascade).forEach((nodeTitle) => {
        const node = cascade[nodeTitle];
        node.inWeight = this._getInWeightForNode(node.nodeTitle, links);
        node.outWeight = this._getOutWeightForNode(node.nodeTitle, links);
        node.maxWeight = Math.max(node.inWeight, node.outWeight);
      });
    });

    return cascades;
  },

  _getWeightForCascade(cascades: Cascade[], cascadeIdx: number): number {
    let wMax = 0;
    const cascade = cascades[cascadeIdx];
    Object.keys(cascade).forEach((nodeTitle) => {
      wMax += Math.max(cascade[nodeTitle].inWeight, cascade[nodeTitle].outWeight);
    });
    return wMax;
  },

  _getMaxWeightThroughCascades(cascades: Cascade[]): number {
    const max: number[] = [];
    cascades.forEach((cascade) => {
      let mW = 0;
      Object.keys(cascade).forEach((nodeTitle) => {
        const node = cascade[nodeTitle];
        mW += Math.max(node.inWeight, node.outWeight);
      });
      max.push(mW);
    });
    return graphModule.routines.maxOfArray(max);
  },

  _computeNodes(this: SankeyLayout, cascades: Cascade[], options: NodesOptions): NodeRect[][] {
    const rects: NodeRect[][] = [];
    const maxWeight = this._getMaxWeightThroughCascades(cascades);
    const maxNodeNum = graphModule.routines.maxOfArray(
      cascades.map((nodesInCascade) => Object.keys(nodesInCascade).length),
    );
    let { nodePadding } = options;
    let heightAvailable = options.height - nodePadding * (maxNodeNum - 1);

    if (heightAvailable < 0) {
      // when the available height is too small, e.g. sum of all paddings is more then available
      // height
      nodePadding = 0;
      heightAvailable = options.height - nodePadding * (maxNodeNum - 1);
    }

    this._weightPerPixel = maxWeight / heightAvailable;

    // compute in and out weightes of all nodes of cascades
    let cascadeIdx = 0;
    cascades.forEach((cascade) => {
      const cascadeRects: NodeRect[] = [];
      let y = 0;
      const nodesInCascade = Object.keys(cascade).length;
      const cascadeHeight = this._getWeightForCascade(cascades, cascadeIdx)
        / (this._weightPerPixel as number)
        + nodePadding * (nodesInCascade - 1);

      let cascadeAlign;

      if (Array.isArray(options.nodeAlign)) {
        cascadeAlign = cascadeIdx < options.nodeAlign.length
          ? options.nodeAlign[cascadeIdx]
          : _ALIGNMENT_DEFAULT;
      } else {
        cascadeAlign = options.nodeAlign;
      }

      if (cascadeAlign === _ALIGNMENT_BOTTOM) {
        y = options.height - cascadeHeight;
      } else if (cascadeAlign === _ALIGNMENT_CENTER) {
        y = 0.5 * (options.height - cascadeHeight);
      }
      y = Math.round(y);

      Object.keys(cascade).forEach((nodeTitle) => {
        cascade[nodeTitle].sort = this._sort
          && Object.prototype.hasOwnProperty.call(this._sort, nodeTitle)
          ? this._sort[nodeTitle]
          : 1;
      });

      Object.keys(cascade)
        .sort((a, b) => cascade[a].sort - cascade[b].sort)
        .forEach((nodeTitle) => {
          const node = cascade[nodeTitle];
          const height = Math.floor((heightAvailable * node.maxWeight) / maxWeight);
          const x = Math.round((cascadeIdx * options.width) / (cascades.length - 1))
            - (cascadeIdx === 0 ? 0 : options.nodeWidth);
          const rect: NodeRect = {
            _name: nodeTitle,
            width: options.nodeWidth,
            height,
            x: x + options.x,
            y: y + options.y,
          };

          y += height + nodePadding;
          cascadeRects.push(rect);
        });
      cascadeIdx += 1;
      rects.push(cascadeRects);
    });

    return rects;
  },

  _findRectByName(rects: NodeRect[][], name: string): NodeRect | null {
    for (let c = 0; c < rects.length; c += 1) {
      for (let r = 0; r < rects[c].length; r += 1) {
        if (name === rects[c][r]._name) return rects[c][r];
      }
    }
    return null;
  },

  _findIndexByName(rects: NodeRect[][], nodeTitle: string): number | null {
    let index = 0;
    for (let c = 0; c < rects.length; c += 1) {
      for (let r = 0; r < rects[c].length; r += 1) {
        if (nodeTitle === rects[c][r]._name) return index;
        index += 1;
      }
    }
    return null;
  },

  _computeLinks(
    this: SankeyLayout,
    links: SankeyDataItem[],
    rects: NodeRect[][],
    cascades: Cascade[],
  ): LayoutLink[] {
    const yOffsets: Record<string, { in: number; out: number }> = {};
    const paths: LinkPath[] = [];
    const result: LayoutLink[] = [];

    cascades.forEach((cascade) => {
      Object.keys(cascade).forEach((nodeTitle) => {
        yOffsets[nodeTitle] = { in: 0, out: 0 };
      });
    });

    rects.forEach((rectsOfCascade) => {
      rectsOfCascade.forEach((nodeRect) => {
        const nodeTitle = nodeRect._name;
        const rectFrom = this._findRectByName(rects, nodeTitle) as NodeRect;
        const linksFromNode = links.filter(
          (link) => link[0] === nodeTitle,
        ) as unknown as SortableLink[]; // all outgoing links from the node

        // all outgoing links should be sorted according to the order of their target nodes
        linksFromNode.forEach((link) => {
          link.sort = this._findIndexByName(rects, link[1]) as number;
        });
        linksFromNode.sort((a, b) => a.sort - b.sort).forEach((link) => {
          const rectTo = this._findRectByName(rects, link[1]) as NodeRect;
          const height = Math.round(link[2] / (this._weightPerPixel as number));
          const yOffsetFrom = yOffsets[link[0]].out;
          const yOffsetTo = yOffsets[link[1]].in;
          // heights of left and right parts of the link must fit the nodes on it's left and right
          const heightFrom = yOffsets[link[0]].out + height > rectFrom.height
            ? rectFrom.height - yOffsets[link[0]].out
            : height;
          const heightTo = yOffsets[link[1]].in + height > rectTo.height
            ? rectTo.height - yOffsets[link[1]].in
            : height;
          paths.push({
            from: {
              x: rectFrom.x,
              y: rectFrom.y + yOffsetFrom,
              width: rectFrom.width,
              height: heightFrom,
              node: rectFrom,
              weight: link[2],
            },
            to: {
              x: rectTo.x,
              y: rectTo.y + yOffsetTo,
              width: rectTo.width,
              height: heightTo,
              node: rectTo,
            },
          });
          yOffsets[link[0]].out += height;
          yOffsets[link[1]].in += height;
        });
      });
    });

    paths.forEach((link) => {
      const path = {
        d: this._spline(link.from, link.to),
        _boundingRect: {
          x: link.from.x + link.from.width,
          y: Math.min(link.from.y, link.to.y),
          width: link.to.x - (link.from.x + link.from.width),
          height: Math.max(link.from.x + link.from.height, link.to.y + link.to.height)
            - Math.min(link.from.y, link.to.y),
        },
        _weight: link.from.weight,
        _from: link.from.node,
        _to: link.to.node,
      };
      result.push(path);
    });

    this._fitAllNodesHeight(rects, paths);
    return result;
  },

  _fitNodeHeight(
    this: SankeyLayout,
    nodeName: string,
    nodeRects: NodeRect[][],
    paths: LinkPath[],
  ): void {
    const targetRect = this._findRectByName(nodeRects, nodeName) as NodeRect;
    let heightOfLinksSummaryIn = 0;
    let heightOfLinksSummaryOut = 0;

    paths.forEach((path) => {
      if (path.from.node._name === nodeName) {
        heightOfLinksSummaryOut += path.from.height;
      }
      if (path.to.node._name === nodeName) {
        heightOfLinksSummaryIn += path.to.height;
      }
    });
    targetRect.height = Math.max(heightOfLinksSummaryIn, heightOfLinksSummaryOut);
  },

  _fitAllNodesHeight(this: SankeyLayout, nodeRects: NodeRect[][], paths: LinkPath[]): void {
    for (let c = 0; c < nodeRects.length; c += 1) {
      for (let r = 0; r < nodeRects[c].length; r += 1) {
        this._fitNodeHeight(nodeRects[c][r]._name, nodeRects, paths);
      }
    }
  },

  _spline(rectLeft: BBox, rectRight: BBox): string {
    const p_UpLeft = { x: rectLeft.x + rectLeft.width, y: rectLeft.y };
    const p_DownLeft = { x: rectLeft.x + rectLeft.width, y: rectLeft.y + rectLeft.height };
    const p_UpRight = { x: rectRight.x, y: rectRight.y };
    const p_DownRight = { x: rectRight.x, y: rectRight.y + rectRight.height };
    const curve_width = _SPLINE_TENSION * (p_UpRight.x - p_UpLeft.x);
    const result = `M ${p_UpLeft.x} ${p_UpLeft.y} C ${p_UpLeft.x + curve_width} ${p_UpLeft.y} ${p_UpRight.x - curve_width} ${p_UpRight.y} ${p_UpRight.x} ${p_UpRight.y} L ${p_DownRight.x} ${p_DownRight.y} C ${p_DownRight.x - curve_width} ${p_DownRight.y} ${p_DownLeft.x + curve_width} ${p_DownLeft.y} ${p_DownLeft.x} ${p_DownLeft.y} Z`;

    return result;
  },

  computeLayout(
    this: SankeyLayout,
    linksData: SankeyDataItem[],
    sortData: Record<string, number> | undefined,
    options: LayoutOptions,
    incidentOccurred: (errorCode: string) => void,
  ): LayoutResult {
    this._sort = sortData;
    const result: LayoutResult = {};
    const validateResult = validatorModule.validate(linksData, incidentOccurred);
    if (!validateResult) {
      result.cascades = this._computeCascades(linksData);
      result.nodes = this._computeNodes(
        result.cascades,
        {
          width: options.availableRect.width,
          height: options.availableRect.height,
          x: options.availableRect.x,
          y: options.availableRect.y,
          nodePadding: options.nodePadding,
          nodeWidth: options.nodeWidth,
          nodeAlign: options.nodeAlign,
        },
      );
      result.links = this._computeLinks(linksData, result.nodes, result.cascades);
    } else {
      result.error = validateResult;
    }
    return result;
  },

  overlap(box1: BBox, box2: BBox): boolean {
    return !(box2.x > box1.x + box1.width || box2.x + box2.width < box1.x
            || box2.y >= box1.y + box1.height || box2.y + box2.height <= box1.y);
  },
};
