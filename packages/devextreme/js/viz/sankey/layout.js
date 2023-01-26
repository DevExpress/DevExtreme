const _SPLINE_TENSION = 0.3;
const _ALIGNMENT_CENTER = 'center';
const _ALIGNMENT_BOTTOM = 'bottom';
const _ALIGNMENT_DEFAULT = _ALIGNMENT_CENTER;

import graphModule from './graph';
import validatorModule from './data_validator';

export const layout = {
    _weightPerPixel: null,

    _getCascadeIdx: function(nodeTitle, cascadesConfig) {
        const nodeInfo = cascadesConfig.filter((c) => { return c.name === nodeTitle; })[0];

        if(nodeInfo.outgoing.length > 0) {
            // in common case number of cascade is the longest path to the node
            return nodeInfo.lp;
        } else {
            // but if the node is last (ie has no outgoing edges) lets move it to the LAST cascade
            return graphModule.routines.maxOfArray(cascadesConfig.map(c => { return c.lp; }));
        }
    },

    _getInWeightForNode: function(nodeTitle, links) {
        let w = 0;
        links.forEach((link) => {
            if(link[1] === nodeTitle) {
                w += link[2];
            }
        });
        return w;
    },

    _getOutWeightForNode: function(nodeTitle, links) {
        let w = 0;
        links.forEach((link) => {
            if(link[0] === nodeTitle) {
                w += link[2];
            }
        });
        return w;
    },

    _computeCascades: function(links) {
        const cascadesConfig = graphModule.struct.computeLongestPaths(links);
        const maxCascade = graphModule.routines.maxOfArray(cascadesConfig.map(c => { return c.lp; }));

        const cascades = [];

        // init cascades
        for(let i = 0; i < maxCascade + 1; i++) {
            cascades.push({});
        }

        // add nodes to cascades
        links.forEach((link) => {
            let cascade = cascades[this._getCascadeIdx(link[0], cascadesConfig)];
            if(!cascade[link[0]]) {
                cascade[link[0]] = { nodeTitle: link[0] };
            }
            cascade = cascades[this._getCascadeIdx(link[1], cascadesConfig)];
            if(!cascade[link[1]]) {
                cascade[link[1]] = { nodeTitle: link[1] };
            }
        });

        // compute in and out weightes of all nodes of cascades
        cascades.forEach(cascade => {
            Object.keys(cascade).forEach(nodeTitle => {
                const node = cascade[nodeTitle];
                node.inWeight = this._getInWeightForNode(node.nodeTitle, links);
                node.outWeight = this._getOutWeightForNode(node.nodeTitle, links);
                node.maxWeight = Math.max(node.inWeight, node.outWeight);
            });
        });

        return cascades;
    },

    _getWeightForCascade: function(cascades, cascadeIdx) {
        let wMax = 0;
        const cascade = cascades[cascadeIdx];
        Object.keys(cascade).forEach(nodeTitle => {
            wMax += Math.max(cascade[nodeTitle].inWeight, cascade[nodeTitle].outWeight);
        });
        return wMax;
    },

    _getMaxWeightThroughCascades: function(cascades) {
        const max = [];
        cascades.forEach(cascade => {
            let mW = 0;
            Object.keys(cascade).forEach(nodeTitle => {
                const node = cascade[nodeTitle];
                mW += Math.max(node.inWeight, node.outWeight);
            });
            max.push(mW);
        });

        return graphModule.routines.maxOfArray(max);
    },

    _computeNodes: function(cascades, options) {
        const rects = [];
        const maxWeight = this._getMaxWeightThroughCascades(cascades);
        const maxNodeNum = graphModule.routines.maxOfArray(cascades.map(nodesInCascade => Object.keys(nodesInCascade).length));
        let nodePadding = options.nodePadding;
        let heightAvailable = options.height - nodePadding * (maxNodeNum - 1);

        if(heightAvailable < 0) { // when the available height is too small, e.g. sum of all paddings is more then available height
            nodePadding = 0;
            heightAvailable = options.height - nodePadding * (maxNodeNum - 1);
        }

        this._weightPerPixel = maxWeight / heightAvailable;

        // compute in and out weightes of all nodes of cascades
        let cascadeIdx = 0;
        cascades.forEach(cascade => {
            const cascadeRects = [];
            let y = 0;
            const nodesInCascade = Object.keys(cascade).length;
            const cascadeHeight = this._getWeightForCascade(cascades, cascadeIdx) / this._weightPerPixel + nodePadding * (nodesInCascade - 1);

            let cascadeAlign;

            if(Array.isArray(options.nodeAlign)) {
                cascadeAlign = cascadeIdx < options.nodeAlign.length ? options.nodeAlign[cascadeIdx] : _ALIGNMENT_DEFAULT;
            } else {
                cascadeAlign = options.nodeAlign;
            }

            if(cascadeAlign === _ALIGNMENT_BOTTOM) {
                y = options.height - cascadeHeight;
            } else if(cascadeAlign === _ALIGNMENT_CENTER) {
                y = 0.5 * (options.height - cascadeHeight);
            }
            y = Math.round(y);

            Object.keys(cascade).forEach(nodeTitle => {
                cascade[nodeTitle].sort = this._sort && Object.prototype.hasOwnProperty.call(this._sort, nodeTitle) ? this._sort[nodeTitle] : 1;
            });

            Object.keys(cascade).sort((a, b) => { return cascade[a].sort - cascade[b].sort; }).forEach(nodeTitle => {
                const node = cascade[nodeTitle];
                const height = Math.floor(heightAvailable * node.maxWeight / maxWeight);
                const x = Math.round(cascadeIdx * options.width / (cascades.length - 1)) - (cascadeIdx === 0 ? 0 : options.nodeWidth);
                const rect = {};

                rect._name = nodeTitle;
                rect.width = options.nodeWidth;
                rect.height = height;
                rect.x = x + options.x;
                rect.y = y + options.y;

                y += height + nodePadding;

                cascadeRects.push(rect);
            });
            cascadeIdx++;
            rects.push(cascadeRects);
        });

        return rects;
    },

    _findRectByName: function(rects, name) {
        for(let c = 0; c < rects.length; c++) {
            for(let r = 0; r < rects[c].length; r++) {
                if(name === rects[c][r]._name) return rects[c][r];
            }
        }
        return null;
    },

    _findIndexByName: function(rects, nodeTitle) {
        let index = 0;
        for(let c = 0; c < rects.length; c++) {
            for(let r = 0; r < rects[c].length; r++) {
                if(nodeTitle === rects[c][r]._name) return index;
                index++;
            }
        }
        return null;
    },

    _computeLinks: function(links, rects, cascades) {
        const yOffsets = {};
        const paths = [];
        const result = [];

        cascades.forEach(cascade => {
            Object.keys(cascade).forEach(nodeTitle => {
                yOffsets[nodeTitle] = { in: 0, out: 0 };
            });
        });

        rects.forEach(rectsOfCascade => {
            rectsOfCascade.forEach(nodeRect => {
                const nodeTitle = nodeRect._name;
                const rectFrom = this._findRectByName(rects, nodeTitle);
                const linksFromNode = links.filter(link => { return link[0] === nodeTitle; }); // all outgoing links from the node

                // all outgoing links should be sorted according to the order of their target nodes
                linksFromNode.forEach(link => {
                    link.sort = this._findIndexByName(rects, link[1]);
                });
                linksFromNode.sort((a, b) => { return a.sort - b.sort; }).forEach(link => {
                    const rectTo = this._findRectByName(rects, link[1]);
                    const height = Math.round(link[2] / this._weightPerPixel);
                    const yOffsetFrom = yOffsets[link[0]].out;
                    const yOffsetTo = yOffsets[link[1]].in;
                    // heights of left and right parts of the link must fit the nodes on it's left and right
                    const heightFrom = (yOffsets[link[0]].out + height > rectFrom.height) ? rectFrom.height - yOffsets[link[0]].out : height;
                    const heightTo = (yOffsets[link[1]].in + height > rectTo.height) ? rectTo.height - yOffsets[link[1]].in : height;
                    paths.push({
                        from: { x: rectFrom.x, y: rectFrom.y + yOffsetFrom, width: rectFrom.width, height: heightFrom, node: rectFrom, weight: link[2] },
                        to: { x: rectTo.x, y: rectTo.y + yOffsetTo, width: rectTo.width, height: heightTo, node: rectTo }
                    });
                    yOffsets[link[0]].out += height;
                    yOffsets[link[1]].in += height;
                });
            });
        });

        paths.forEach(link => {
            const path = {
                d: this._spline(link.from, link.to),
                _boundingRect: {
                    x: link.from.x + link.from.width,
                    y: Math.min(link.from.y, link.to.y),
                    width: link.to.x - (link.from.x + link.from.width),
                    height: Math.max(link.from.x + link.from.height, link.to.y + link.to.height) - Math.min(link.from.y, link.to.y)
                },
                _weight: link.from.weight,
                _from: link.from.node,
                _to: link.to.node
            };

            result.push(path);
        });

        this._fitAllNodesHeight(rects, paths);
        return result;
    },

    _fitNodeHeight: function(nodeName, nodeRects, paths) {
        const targetRect = this._findRectByName(nodeRects, nodeName);
        let heightOfLinksSummaryIn = 0;
        let heightOfLinksSummaryOut = 0;

        paths.forEach(function(path) {
            if(path.from.node._name === nodeName) {
                heightOfLinksSummaryOut += path.from.height;
            }
            if(path.to.node._name === nodeName) {
                heightOfLinksSummaryIn += path.to.height;
            }
        });
        targetRect.height = Math.max(heightOfLinksSummaryIn, heightOfLinksSummaryOut);
    },

    _fitAllNodesHeight: function(nodeRects, paths) {
        for(let c = 0; c < nodeRects.length; c++) {
            for(let r = 0; r < nodeRects[c].length; r++) {
                this._fitNodeHeight(nodeRects[c][r]._name, nodeRects, paths);
            }
        }
    },

    _spline: function(rectLeft, rectRight) {
        const p_UpLeft = { x: rectLeft.x + rectLeft.width, y: rectLeft.y };
        const p_DownLeft = { x: rectLeft.x + rectLeft.width, y: rectLeft.y + rectLeft.height };
        const p_UpRight = { x: rectRight.x, y: rectRight.y };
        const p_DownRight = { x: rectRight.x, y: rectRight.y + rectRight.height };
        const curve_width = _SPLINE_TENSION * (p_UpRight.x - p_UpLeft.x);
        const result = `M ${p_UpLeft.x} ${p_UpLeft.y} C ${p_UpLeft.x + curve_width} ${p_UpLeft.y} ${p_UpRight.x - curve_width} ${p_UpRight.y} ${p_UpRight.x} ${p_UpRight.y} L ${p_DownRight.x} ${p_DownRight.y} C ${p_DownRight.x - curve_width} ${p_DownRight.y} ${p_DownLeft.x + curve_width} ${p_DownLeft.y} ${p_DownLeft.x} ${p_DownLeft.y} Z`;

        return result;
    },

    computeLayout: function(linksData, sortData, options, incidentOccurred) {
        this._sort = sortData;
        const result = {};
        const validateResult = validatorModule.validate(linksData, incidentOccurred);
        if(!validateResult) {
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
                    nodeAlign: options.nodeAlign
                });
            result.links = this._computeLinks(linksData, result.nodes, result.cascades);
        } else {
            result.error = validateResult;
        }
        return result;
    },

    overlap: function(box1, box2) {
        return !(box2.x > box1.x + box1.width || box2.x + box2.width < box1.x ||
            box2.y >= box1.y + box1.height || box2.y + box2.height <= box1.y);
    }
};
