var common = require("./common"),
    Node = require("./node"),

    _getTilingAlgorithm = require("./tiling").getAlgorithm,
    _getColorizer = require("./colorizing").getColorizer,
    _patchFontOptions = require("../core/utils").patchFontOptions,
    _buildRectAppearance = common.buildRectAppearance,
    _buildTextAppearance = common.buildTextAppearance,
    _noop = require("../../core/utils/common").noop,
    _max = Math.max,

    directions = {
        "lefttoprightbottom": [+1, +1],
        "leftbottomrighttop": [+1, -1],
        "righttopleftbottom": [-1, +1],
        "rightbottomlefttop": [-1, -1]
    };

// At least one algorithm is required.
require("./tiling.squarified");
require("./tiling").setDefaultAlgorithm("squarified");

// By design discrete colorizing is used by default.
require("./colorizing.discrete");
require("./colorizing").setDefaultColorizer("discrete");

function pickPositiveInteger(val) {
    return val > 0 ? Math.round(val) : 0;
}

var dxTreeMap = require("../core/base_widget").inherit({
    _handlers: {
        beginBuildNodes: _noop,

        buildNode: _noop,

        endBuildNodes: _noop,

        setTrackerData: _noop,

        calculateState: function(options) {
            return _buildRectAppearance(options);
        }
    },

    _rootClass: "dxtm-tree-map",

    _rootClassPrefix: "dxtm",

    _getDefaultSize: function() {
        return { width: 400, height: 400 };
    },

    _themeSection: "treeMap",

    _fontFields: ["tile.label.font", "group.label.font",
        "loadingIndicator.font", "title.font", "title.subtitle.font", "tooltip.font"],

    _init: function() {
        var that = this;
        that._rectOffsets = {};
        that._handlers = Object.create(that._handlers);
        that._context = {
            suspend: function() {
                if(!that._applyingChanges) {
                    that._suspendChanges();
                }
            },
            resume: function() {
                if(!that._applyingChanges) {
                    that._resumeChanges();
                }
            },
            change: function(codes) {
                that._change(codes);
            },
            settings: [{}, {}],
            calculateState: that._handlers.calculateState,
            calculateLabelState: _buildTextAppearance
        };
        that._root = that._topNode = { nodes: [] };
        that.callBase.apply(that, arguments);
    },

    _initialChanges: ["DATA_SOURCE"],

    _initCore: function() {
        var that = this,
            renderer = that._renderer;

        that._createProxyType();
        that._tilesGroup = renderer.g().linkOn(renderer.root, "tiles").linkAppend();
        that._labelsGroup = renderer.g().linkOn(renderer.root, "labels").linkAppend();
    },

    _createProxyType: _noop,

    _disposeCore: function() {
        var that = this;
        that._filter && that._filter.dispose();
        that._labelsGroup.linkOff();
        that._tilesGroup.linkOff();
    },

    _applySize: function(rect) {
        this._tilingRect = rect.slice();
        this._change(["TILING"]);
    },

    _optionChangesMap: {
        dataSource: "DATA_SOURCE",
        valueField: "NODES_CREATE",
        childrenField: "NODES_CREATE",
        colorField: "TILES",
        colorizer: "TILES",
        labelField: "LABELS",
        tile: "TILE_SETTINGS",
        group: "GROUP_SETTINGS",
        maxDepth: "MAX_DEPTH",
        layoutAlgorithm: "TILING",
        layoutDirection: "TILING",
        resolveLabelOverflow: "LABEL_OVERFLOW"
    },

    _themeDependentChanges: ["TILE_SETTINGS", "GROUP_SETTINGS", "MAX_DEPTH"],

    _changeDataSource: function() {
        var that = this;

        that._isDataExpected = that._isSyncData = true;
        that._updateDataSource();
        that._isSyncData = false;
        if(that._isDataExpected) {
            that._suspendChanges();
        }
    },

    _dataSourceChangedHandler: function() {
        var that = this;

        if(that._isDataExpected) {
            that._isDataExpected = false;
            that._change(["NODES_CREATE"]);
            if(!that._isSyncData) {
                that._resumeChanges();
            }
        } else {
            that._requestChange(["NODES_CREATE"]);
        }
    },

    _optionChangesOrder: ["DATA_SOURCE", "TILE_SETTINGS", "GROUP_SETTINGS", "MAX_DEPTH", "LABEL_OVERFLOW"],

    _change_DATA_SOURCE: function() {
        this._changeDataSource();
    },

    _change_TILE_SETTINGS: function() {
        this._changeTileSettings();
    },

    _change_GROUP_SETTINGS: function() {
        this._changeGroupSettings();
    },

    _change_LABEL_OVERFLOW: function() {
        this._changeTileSettings();
        this._changeGroupSettings();
    },

    _change_MAX_DEPTH: function() {
        this._changeMaxDepth();
    },

    _customChangesOrder: ["NODES_CREATE", "NODES_RESET", "TILES", "LABELS", "TILING", "LABELS_LAYOUT"],

    _change_NODES_CREATE: function() {
        this._buildNodes();
    },

    _change_NODES_RESET: function() {
        this._resetNodes();
    },

    _change_TILES: function() {
        this._applyTilesAppearance();
    },

    _change_LABELS: function() {
        this._applyLabelsAppearance();
    },

    _change_TILING: function() {
        this._performTiling();
    },

    _change_LABELS_LAYOUT: function() {
        this._performLabelsLayout();
    },

    _applyChanges: function() {
        var that = this;

        that.callBase.apply(that, arguments);
        // This looks dirty.
        if(!that._isDataExpected) {
            that._drawn();
        }
        // Looks dirty but let it stay so until there is only one such case.
        that._context.forceReset = false;
    },

    _buildNodes: function() {
        var that = this,
            root = that._root = that._topNode = new Node(),
            processedData;

        root._id = 0;
        root.parent = {};
        root.data = {};
        root.level = root.index = -1;
        root.ctx = that._context;
        root.label = null;
        that._nodes = [root];
        that._handlers.beginBuildNodes();
        processedData = that._processDataSourceItems(that._dataSourceItems() || []);
        traverseDataItems(root, processedData.items, 0, {
            itemsField: !processedData.isPlain && that._getOption("childrenField", true) || "items",
            valueField: that._getOption("valueField", true) || "value",
            buildNode: that._handlers.buildNode,
            ctx: that._context,
            nodes: that._nodes
        });
        that._onNodesCreated();
        that._handlers.endBuildNodes();
        that._change(["NODES_RESET"]);
    },

    _onNodesCreated: _noop,

    _processDataSourceItems: function(items) {
        return { items: items, isPlain: false };
    },

    _changeTileSettings: function() {
        var that = this,
            options = that._getOption("tile"),
            offsets = that._rectOffsets,
            borderWidth = pickPositiveInteger(options.border.width),
            edgeOffset = borderWidth / 2,
            innerOffset = borderWidth & 1 ? 0.5 : 0,
            labelOptions = options.label,
            settings = that._context.settings[0];

        that._change(["TILES", "LABELS"]);
        settings.state = that._handlers.calculateState(options);
        // TODO: There should be some way (option) to prevent filter creation
        that._filter = that._filter || that._renderer.shadowFilter("-50%", "-50%", "200%", "200%");
        that._filter.attr(labelOptions.shadow);
        that._calculateLabelSettings(settings, labelOptions, that._filter.id);
        if(offsets.tileEdge !== edgeOffset || offsets.tileInner !== innerOffset) {
            offsets.tileEdge = edgeOffset;
            offsets.tileInner = innerOffset;
            that._change(["TILING"]);
        }
    },

    _changeGroupSettings: function() {
        var that = this,
            options = that._getOption("group"),
            labelOptions = options.label,
            offsets = that._rectOffsets,
            borderWidth = pickPositiveInteger(options.border.width),
            edgeOffset = borderWidth / 2,
            innerOffset = borderWidth & 1 ? 0.5 : 0,
            headerHeight = 0,
            groupPadding = pickPositiveInteger(options.padding),
            settings = that._context.settings[1];

        that._change(["TILES", "LABELS"]);
        settings.state = that._handlers.calculateState(options);
        that._calculateLabelSettings(settings, labelOptions);
        if(options.headerHeight >= 0) {
            headerHeight = pickPositiveInteger(options.headerHeight);
        } else {
            headerHeight = settings.labelParams.height + 2 * pickPositiveInteger(labelOptions.paddingTopBottom);
        }
        if(that._headerHeight !== headerHeight) {
            that._headerHeight = headerHeight;
            that._change(["TILING"]);
        }
        if(that._groupPadding !== groupPadding) {
            that._groupPadding = groupPadding;
            that._change(["TILING"]);
        }
        if(offsets.headerEdge !== edgeOffset || offsets.headerInner !== innerOffset) {
            offsets.headerEdge = edgeOffset;
            offsets.headerInner = innerOffset;
            that._change(["TILING"]);
        }
    },

    _calculateLabelSettings: function(settings, options, filter) {
        var bBox = this._getTextBBox(options.font),
            paddingLeftRight = pickPositiveInteger(options.paddingLeftRight),
            paddingTopBottom = pickPositiveInteger(options.paddingTopBottom);

        settings.labelState = _buildTextAppearance(options, filter);
        settings.labelState.visible = !("visible" in options) || !!options.visible;
        settings.labelParams = {
            height: bBox.height,
            rtlEnabled: this._getOption("rtlEnabled", true),
            paddingTopBottom: paddingTopBottom,
            paddingLeftRight: paddingLeftRight,
            resolveLabelOverflow: this._getOption("resolveLabelOverflow", true)
        };
    },

    _changeMaxDepth: function() {
        var maxDepth = this._getOption("maxDepth", true);

        maxDepth = maxDepth >= 1 ? Math.round(maxDepth) : Infinity;
        if(this._maxDepth !== maxDepth) {
            this._maxDepth = maxDepth;
            this._change(["NODES_RESET"]);
        }
    },

    _resetNodes: function() {
        var that = this;

        that._tilesGroup.clear();
        that._renderer.initHatching();
        that._context.forceReset = true;
        that._context.minLevel = that._topNode.level + 1;
        that._context.maxLevel = that._context.minLevel + that._maxDepth - 1;
        that._change(["TILES", "LABELS", "TILING"]);
    },

    _processNodes: function(context, process) {
        processNodes(context, this._topNode, process);
    },

    _applyTilesAppearance: function() {
        var that = this,
            // Passing *themeManager* looks dirty but is excused by necessity of palettes (and default palette specifically).
            // Passing *topNode* looks awfully dirty and is performed only because of discrete group colorizing.
            // Aforementioned colorizing requires breadth-first tree traversal and nodes processing is performed in a depth-first order.
            // TODO: Find a way to stop passing *topNode*
            colorizer = _getColorizer(that._getOption("colorizer"), that._themeManager, that._topNode);

        that._processNodes({
            renderer: that._renderer,
            group: that._tilesGroup,
            setTrackerData: that._handlers.setTrackerData,
            colorField: that._getOption("colorField", true) || "color",
            getColor: colorizer
        }, processTileAppearance);
    },

    _applyLabelsAppearance: function() {
        var that = this;

        that._labelsGroup.clear();
        that._processNodes({
            renderer: that._renderer,
            group: that._labelsGroup,
            setTrackerData: that._handlers.setTrackerData,
            labelField: that._getOption("labelField", true) || "name"
        }, processLabelAppearance);
        // Actually that is strange - for example if just "font.color" is changed then there is no need to layout labels.
        // But for <text> element can change its size because of rather many reasons - so for simplicity layout is always performed.
        that._change(["LABELS_LAYOUT"]);
    },

    _performTiling: function() {
        var that = this,
            context = {
                algorithm: _getTilingAlgorithm(that._getOption("layoutAlgorithm", true)),
                directions: directions[String(that._getOption("layoutDirection", true)).toLowerCase()] || directions["lefttoprightbottom"],
                headerHeight: that._headerHeight,
                groupPadding: that._groupPadding,
                rectOffsets: that._rectOffsets
            };

        that._topNode.innerRect = that._tilingRect;
        calculateRects(context, that._topNode);
        that._processNodes(context, processTiling);
        that._change(["LABELS_LAYOUT"]);
        that._onTilingPerformed();
    },

    _onTilingPerformed: _noop,

    _performLabelsLayout: function() {
        this._processNodes(null, processLabelsLayout);
    },

    _getTextBBox: function(fontOptions) {
        var renderer = this._renderer,
            text = this._textForCalculations || renderer.text("0", 0, 0),
            bBox;

        this._textForCalculations = text;
        text.css(_patchFontOptions(fontOptions)).append(renderer.root);
        bBox = text.getBBox();
        text.remove();
        return bBox;
    }
});

function traverseDataItems(root, dataItems, level, params) {
    var nodes = [],
        allNodes = params.nodes,
        node,
        i,
        ii = dataItems.length,
        dataItem,
        totalValue = 0,
        items;

    for(i = 0; i < ii; ++i) {
        dataItem = dataItems[i];
        node = new Node();
        node._id = allNodes.length;
        node.ctx = params.ctx;
        node.parent = root;
        node.level = level;
        node.index = nodes.length;
        node.data = dataItem;
        params.buildNode(node);
        allNodes.push(node);
        nodes.push(node);
        items = dataItem[params.itemsField];
        if(items && items.length) {
            traverseDataItems(node, items, level + 1, params);
        }
        if(dataItem[params.valueField] > 0) {
            node.value = Number(dataItem[params.valueField]);
        }
        totalValue += node.value;
    }
    root.nodes = nodes;
    root.value = totalValue;
}

function processNodes(context, root, process) {
    var nodes = root.nodes,
        node,
        i,
        ii = nodes.length;

    for(i = 0; i < ii; ++i) {
        node = nodes[i];
        process(context, node);
        if(node.isNode()) {
            processNodes(context, node, process);
        }
    }
}

function processTileAppearance(context, node) {
    node.color = node.data[context.colorField] || context.getColor(node) || node.parent.color;
    node.updateStyles();
    node.tile = (!node.ctx.forceReset && node.tile) || createTile[Number(node.isNode())](context, node);
    node.applyState();
}

var createTile = [createLeaf, createGroup];

function createLeaf(context, node) {
    var tile = context.renderer.simpleRect().append(context.group);

    context.setTrackerData(node, tile);
    return tile;
}

function createGroup(context, node) {
    var outer = context.renderer.simpleRect().append(context.group),
        inner = context.renderer.simpleRect().append(context.group);

    context.setTrackerData(node, inner);
    return { outer: outer, inner: inner };
}

function processLabelAppearance(context, node) {
    node.updateLabelStyle();
    if(node.labelState.visible) {
        createLabel(context, node, node.labelState, node.labelParams);
    }
}

function createLabel(context, currentNode, settings, params) {
    var textData = currentNode.data[context.labelField];

    currentNode.label = textData ? String(textData) : null;
    textData = currentNode.customLabel || currentNode.label;
    if(textData) {
        currentNode.text = context.renderer.text(textData).attr(settings.attr).css(settings.css).append(context.group);
        context.setTrackerData(currentNode, currentNode.text);
    }
}

var emptyRect = [0, 0, 0, 0];

function calculateRects(context, root) {
    var nodes = root.nodes,
        items = [],
        rects = [],
        sum = 0,
        i,
        ii = items.length = rects.length = nodes.length;

    for(i = 0; i < ii; ++i) {
        sum += nodes[i].value;
        items[i] = { value: nodes[i].value, i: i };
    }
    if(sum > 0) {
        context.algorithm({
            items: items.slice(),
            sum: sum,
            rect: root.innerRect.slice(),
            isRotated: nodes[0].level & 1,
            directions: context.directions
        });
    }
    for(i = 0; i < ii; ++i) {
        rects[i] = items[i].rect || emptyRect;
    }
    root.rects = rects;
}

function processTiling(context, node) {
    var rect = node.parent.rects[node.index],
        rectOffsets = context.rectOffsets,
        headerHeight;

    if(node.isNode()) {
        setRectAttrs(node.tile.outer, buildTileRect(rect, node.parent.innerRect, rectOffsets.headerEdge, rectOffsets.headerInner));
        rect = marginateRect(rect, context.groupPadding);
        headerHeight = Math.min(context.headerHeight, rect[3] - rect[1]);
        node.rect = [rect[0], rect[1], rect[2], rect[1] + headerHeight];
        setRectAttrs(node.tile.inner, marginateRect(node.rect, rectOffsets.headerEdge));
        rect[1] += headerHeight;
        node.innerRect = rect;
        calculateRects(context, node);
    } else {
        node.rect = rect;
        setRectAttrs(node.tile, buildTileRect(rect, node.parent.innerRect, rectOffsets.tileEdge, rectOffsets.tileInner));
    }
}

function marginateRect(rect, margin) {
    return [rect[0] + margin, rect[1] + margin, rect[2] - margin, rect[3] - margin];
}

function buildTileRect(rect, outer, edgeOffset, innerOffset) {
    return [
        rect[0] + (rect[0] === outer[0] ? edgeOffset : +innerOffset),
        rect[1] + (rect[1] === outer[1] ? edgeOffset : +innerOffset),
        rect[2] - (rect[2] === outer[2] ? edgeOffset : -innerOffset),
        rect[3] - (rect[3] === outer[3] ? edgeOffset : -innerOffset)
    ];
}

function setRectAttrs(element, rect) {
    element.attr({ x: rect[0], y: rect[1], width: _max(rect[2] - rect[0], 0), height: _max(rect[3] - rect[1], 0) });
}

function processLabelsLayout(context, node) {
    if(node.text && node.labelState.visible) {
        layoutTextNode(node, node.labelParams);
    }
}

function layoutTextNode(node, params) {
    var rect = node.rect,
        text = node.text,
        bBox = text.getBBox(),
        paddingLeftRight = params.paddingLeftRight,
        paddingTopBottom = params.paddingTopBottom,
        effectiveWidth = rect[2] - rect[0] - paddingLeftRight,
        fitByHeight = bBox.height + paddingTopBottom <= rect[3] - rect[1],
        fitByWidth = bBox.width <= effectiveWidth;

    if(params.resolveLabelOverflow === "ellipsis" && fitByHeight) {
        text.applyEllipsis(effectiveWidth);
        if(!fitByWidth) {
            bBox = text.getBBox();
            fitByWidth = bBox.width <= effectiveWidth;
        }
    }

    text.attr({
        visibility: fitByHeight && fitByWidth ? "visible" : "hidden"
    });

    if(fitByHeight && fitByWidth) {
        text.move(
            params.rtlEnabled ? (rect[2] - paddingLeftRight - bBox.x - bBox.width) : (rect[0] + paddingLeftRight - bBox.x),
            rect[1] + paddingTopBottom - bBox.y
        );
    }
}

require("../../core/component_registrator")("dxTreeMap", dxTreeMap);

module.exports = dxTreeMap;

// PLUGINS_SECTION
dxTreeMap.addPlugin(require("../core/data_source").plugin);
