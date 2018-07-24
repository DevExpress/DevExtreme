"use strict";

var $ = require("../../../core/renderer"),
    domAdapter = require("../../../core/dom_adapter"),
    windowUtils = require("../../../core/utils/window"),
    callOnce = require("../../../core/utils/call_once"),
    window = windowUtils.getWindow(),
    eventsEngine = require("../../../events/core/events_engine"),
    browser = require("../../../core/utils/browser"),
    getSvgMarkup = require("../../../core/utils/svg").getSvgMarkup,
    animation = require("./animation"),
    math = Math,
    mathMin = math.min,
    mathMax = math.max,
    mathFloor = math.floor,
    mathRound = math.round,
    mathSin = math.sin,
    mathCos = math.cos,
    mathAbs = math.abs,
    mathPI = math.PI,

    _isDefined = require("../../../core/utils/type").isDefined,
    vizUtils = require("../utils"),
    _normalizeEnum = vizUtils.normalizeEnum,
    _normalizeBBox = vizUtils.normalizeBBox,
    _rotateBBox = vizUtils.rotateBBox,
    PI_DIV_180 = mathPI / 180,
    _parseInt = parseInt,
    _parseFloat = parseFloat,
    SHARPING_CORRECTION = 0.5,
    ARC_COORD_PREC = 5;

var pxAddingExceptions = {
    "column-count": true,
    "fill-opacity": true,
    "flex-grow": true,
    "flex-shrink": true,
    "font-weight": true,
    "line-height": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "z-index": true,
    "zoom": true
};

var KEY_TEXT = "text",
    KEY_STROKE = "stroke",
    KEY_STROKE_WIDTH = "stroke-width",
    KEY_STROKE_OPACITY = "stroke-opacity",
    KEY_FONT_SIZE = "font-size",
    KEY_FONT_STYLE = "font-style",
    KEY_FONT_WEIGHT = "font-weight",
    KEY_TEXT_DECORATION = "text-decoration",
    NONE = "none",

    DEFAULT_FONT_SIZE = 12;

var objectCreate = (function() {
    if(!Object.create) {
        return function(proto) {
            var F = function() { };
            F.prototype = proto;
            return new F();
        };
    } else {
        return function(proto) {
            return Object.create(proto);
        };
    }
})();

var DEFAULTS = {
    scaleX: 1,
    scaleY: 1
};

var getBackup = callOnce(function() {
    var backupContainer = domAdapter.createElement("div"),
        backupCounter = 0;
    backupContainer.style.left = "-9999px";
    backupContainer.style.position = "absolute";

    return {
        backupContainer: backupContainer,
        backupCounter: backupCounter
    };
});

function backupRoot(root) {
    if(getBackup().backupCounter === 0) {
        domAdapter.getBody().appendChild(getBackup().backupContainer);
    }
    ++getBackup().backupCounter;
    root.append({ element: getBackup().backupContainer });
}

function restoreRoot(root, container) {
    root.append({ element: container });
    --getBackup().backupCounter;
    if(getBackup().backupCounter === 0) {
        domAdapter.getBody().removeChild(getBackup().backupContainer);
    }
}

var getNextDefsSvgId = (function() {
    var numDefsSvgElements = 1;
    return function() { return "DevExpress_" + numDefsSvgElements++; };
})();

function isObjectArgument(value) {
    return value && (typeof value !== "string");
}

function createElement(tagName) {
    return domAdapter.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function getFuncIri(id, pathModified) {
    return id !== null ? "url(" + (pathModified ? window.location.href.split("#")[0] : "") + "#" + id + ")" : id;
}

function extend(target, source) {
    var key;
    for(key in source) {
        target[key] = source[key];
    }
    return target;
}

function roundValue(value, exp) {
    value = value.toString().split('e');
    value = mathRound(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
    value = value.toString().split('e');

    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

function getBoundingClientRect(element) {
    var box;
    try {
        box = element.getBoundingClientRect();
    } catch(e) {}
    return box || { left: 0, top: 0 };
}

var preserveAspectRatioMap = {
    "full": NONE,
    "lefttop": "xMinYMin",
    "leftcenter": "xMinYMid",
    "leftbottom": "xMinYMax",
    "centertop": "xMidYMin",
    "center": "xMidYMid",
    "centerbottom": "xMidYMax",
    "righttop": "xMaxYMin",
    "rightcenter": "xMaxYMid",
    "rightbottom": "xMaxYMax"
};

//
// Build path segments
//

function normalizeArcParams(x, y, innerR, outerR, startAngle, endAngle) {
    var isCircle,
        noArc = true,
        angleDiff = roundValue(endAngle, 3) - roundValue(startAngle, 3);

    if(angleDiff) {
        if((mathAbs(angleDiff) % 360) === 0) {
            startAngle = 0;
            endAngle = 360;
            isCircle = true;
            endAngle -= 0.01;
        }

        if(startAngle > 360) {
            startAngle = startAngle % 360;
        }

        if(endAngle > 360) {
            endAngle = endAngle % 360;
        }

        if(startAngle > endAngle) {
            startAngle -= 360;
        }
        noArc = false;
    }

    startAngle = startAngle * PI_DIV_180;
    endAngle = endAngle * PI_DIV_180;

    return [
        x,
        y,
        mathMin(outerR, innerR),
        mathMax(outerR, innerR),
        mathCos(startAngle),
        mathSin(startAngle),
        mathCos(endAngle),
        mathSin(endAngle),
        isCircle,
        mathFloor(mathAbs(endAngle - startAngle) / mathPI) % 2 ? "1" : "0",
        noArc
    ];
}

var buildArcPath = function(x, y, innerR, outerR, startAngleCos, startAngleSin, endAngleCos, endAngleSin, isCircle, longFlag) {
    return [
        "M", (x + outerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * startAngleSin).toFixed(ARC_COORD_PREC),
        "A", outerR.toFixed(ARC_COORD_PREC), outerR.toFixed(ARC_COORD_PREC), 0, longFlag, 0, (x + outerR * endAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * endAngleSin).toFixed(ARC_COORD_PREC),
        (isCircle ? "M" : "L"), (x + innerR * endAngleCos).toFixed(5), (y - innerR * endAngleSin).toFixed(ARC_COORD_PREC),
        "A", innerR.toFixed(ARC_COORD_PREC), innerR.toFixed(ARC_COORD_PREC), 0, longFlag, 1, (x + innerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - innerR * startAngleSin).toFixed(ARC_COORD_PREC),
        "Z"
    ].join(" ");
};

function buildPathSegments(points, type) {
    var list = [["M", 0, 0]];
    switch(type) {
        case "line":
            list = buildLineSegments(points);
            break;
        case "area":
            list = buildLineSegments(points, true);
            break;
        case "bezier":
            list = buildCurveSegments(points);
            break;
        case "bezierarea":
            list = buildCurveSegments(points, true);
            break;
    }
    return list;
}

function buildLineSegments(points, close) {
    return buildSegments(points, buildSimpleLineSegment, close);
}

function buildCurveSegments(points, close) {
    return buildSegments(points, buildSimpleCurveSegment, close);
}

function buildSegments(points, buildSimpleSegment, close) {
    var i,
        ii,
        list = [];
    if(points[0] && points[0].length) {
        for(i = 0, ii = points.length; i < ii; ++i) {
            buildSimpleSegment(points[i], close, list);
        }
    } else {
        buildSimpleSegment(points, close, list);
    }
    return list;
}

function buildSimpleLineSegment(points, close, list) {
    var i = 0,
        k0 = list.length,
        k = k0,
        ii = (points || []).length;
    if(ii) {
        // backward compatibility
        if(points[0].x !== undefined) {
            for(; i < ii;) {
                list[k++] = ["L", points[i].x, points[i++].y];
            }
        } else {
            for(; i < ii;) {
                list[k++] = ["L", points[i++], points[i++]];
            }
        }
        list[k0][0] = "M";
    } else {
        list[k] = ["M", 0, 0];
    }
    close && list.push(["Z"]);
    return list;
}

function buildSimpleCurveSegment(points, close, list) {
    var i,
        k = list.length,
        ii = (points || []).length;
    if(ii) {
        // backward compatibility
        if(points[0].x !== undefined) {
            list[k++] = ["M", points[0].x, points[0].y];
            for(i = 1; i < ii;) {
                list[k++] = [
                    "C",
                    points[i].x,
                    points[i++].y,
                    points[i].x,
                    points[i++].y,
                    points[i].x,
                    points[i++].y
                ];
            }
        } else {
            list[k++] = ["M", points[0], points[1]];
            for(i = 2; i < ii;) {
                list[k++] = [
                    "C",
                    points[i++],
                    points[i++],
                    points[i++],
                    points[i++],
                    points[i++],
                    points[i++]
                ];
            }
        }
    } else {
        list[k] = ["M", 0, 0];
    }
    close && list.push(["Z"]);
    return list;
}

function combinePathParam(segments) {
    var d = [],
        k = 0,
        i,
        ii = segments.length,
        segment,
        j,
        jj;
    for(i = 0; i < ii; ++i) {
        segment = segments[i];
        for(j = 0, jj = segment.length; j < jj; ++j) {
            d[k++] = segment[j];
        }
    }
    return d.join(" ");
}

function compensateSegments(oldSegments, newSegments, type) {
    var oldLength = oldSegments.length,
        newLength = newSegments.length,
        i,
        originalNewSegments,
        makeEqualSegments = (type.indexOf("area") !== -1) ? makeEqualAreaSegments : makeEqualLineSegments;

    if(oldLength === 0) {
        for(i = 0; i < newLength; i++) {
            oldSegments.push(newSegments[i].slice(0));
        }
    } else if(oldLength < newLength) {
        makeEqualSegments(oldSegments, newSegments, type);
    } else if(oldLength > newLength) {
        originalNewSegments = newSegments.slice(0);
        makeEqualSegments(newSegments, oldSegments, type);
    }
    return originalNewSegments;
}

function prepareConstSegment(constSeg, type) {
    var x = constSeg[constSeg.length - 2],
        y = constSeg[constSeg.length - 1];
    switch(type) {
        case "line":
        case "area":
            constSeg[0] = "L";
            break;
        case "bezier":
        case "bezierarea":
            constSeg[0] = "C";
            constSeg[1] = constSeg[3] = constSeg[5] = x;
            constSeg[2] = constSeg[4] = constSeg[6] = y;
            break;
    }
}

function makeEqualLineSegments(short, long, type) {
    var constSeg = short[short.length - 1].slice(),
        i = short.length;
    prepareConstSegment(constSeg, type);
    for(; i < long.length; i++) {
        short[i] = constSeg.slice(0);
    }
}

function makeEqualAreaSegments(short, long, type) {
    var i,
        head,
        shortLength = short.length,
        longLength = long.length,
        constsSeg1,
        constsSeg2;

    if((shortLength - 1) % 2 === 0 && (longLength - 1) % 2 === 0) {
        i = (shortLength - 1) / 2 - 1;
        head = short.slice(0, i + 1);
        constsSeg1 = head[head.length - 1].slice(0);
        constsSeg2 = short.slice(i + 1)[0].slice(0);
        prepareConstSegment(constsSeg1, type);
        prepareConstSegment(constsSeg2, type);
        for(var j = i; j < (longLength - 1) / 2 - 1; j++) {
            short.splice(j + 1, 0, constsSeg1);
            short.splice(j + 3, 0, constsSeg2);
        }
    }
}

function baseCss(that, styles) {
    var elemStyles = that._styles,
        str = "",
        key,
        value;

    styles = styles || {};
    for(key in styles) {
        value = styles[key];
        if(_isDefined(value)) {
            if(typeof value === "number" && !pxAddingExceptions[key]) {
                value += "px";
            }
            elemStyles[key] = value !== "" ? value : null;
        }
    }
    // NOTE: Seems that [].concat is not faster when there are only few entries in the `styles` (and in most cases there are few of them)
    for(key in elemStyles) {
        // The alternative is to *delete* entries in the previous cycle, but it is *delete*!
        value = elemStyles[key];
        if(value) {
            str += key + ":" + value + ";";
        }
    }
    str && that.element.setAttribute("style", str);
    return that;
}

function fixFuncIri(wrapper, attribute) {
    var element = wrapper.element,
        id = wrapper.attr(attribute);

    if(id && id.indexOf("DevExpress") !== -1) {
        element.removeAttribute(attribute);
        element.setAttribute(attribute, getFuncIri(id, wrapper.renderer.pathModified));
    }
}

function baseAttr(that, attrs) {
    attrs = attrs || {};
    var settings = that._settings,
        attributes = {},
        key,
        value,
        elem = that.element,
        renderer = that.renderer,
        rtl = renderer.rtl,
        hasTransformations,
        recalculateDashStyle,
        sw,
        i;

    if(!isObjectArgument(attrs)) {
        if(attrs in settings) {
            return settings[attrs];
        }
        if(attrs in DEFAULTS) {
            return DEFAULTS[attrs];
        }
        return 0;
    }

    extend(attributes, attrs);

    for(key in attributes) {
        value = attributes[key];
        if(value === undefined) {
            continue;
        }
        settings[key] = value;

        if(key === "align") {
            key = "text-anchor";
            value = { left: rtl ? "end" : "start", center: "middle", right: rtl ? "start" : "end" }[value] || null;
        } else if(key === "dashStyle") {
            recalculateDashStyle = true;
            continue;
        } else if(key === KEY_STROKE_WIDTH) {
            recalculateDashStyle = true;
        } else if(value && (key === "fill" || key === "clip-path" || key === "filter") && value.indexOf("DevExpress") !== -1) {
            that._addFixIRICallback();
            value = getFuncIri(value, renderer.pathModified);
        } else if(/^(translate(X|Y)|rotate[XY]?|scale(X|Y)|sharp)$/i.test(key)) {
            hasTransformations = true;
            continue;
        } else if(/^(x|y|d)$/i.test(key)) {
            // TODO test it
            hasTransformations = true;
        }
        if(value === null) {
            elem.removeAttribute(key);
        } else {
            elem.setAttribute(key, value);
        }
    }

    if(recalculateDashStyle && ("dashStyle" in settings)) {
        value = settings.dashStyle;
        sw = (("_originalSW" in that) ? that._originalSW : settings[KEY_STROKE_WIDTH]) || 1;
        key = "stroke-dasharray";

        value = value === null ? "" : _normalizeEnum(value);

        if(value === "" || value === "solid" || value === NONE) {
            that.element.removeAttribute(key);
        } else {
            value = value.replace(/longdash/g, "8,3,").replace(/dash/g, "4,3,").replace(/dot/g, "1,3,").replace(/,$/, "").split(",");
            i = value.length;
            while(i--) {
                value[i] = _parseInt((value[i])) * sw;
            }
            that.element.setAttribute(key, value.join(","));
        }
    }

    if(hasTransformations) {
        that._applyTransformation();
    }

    return that;
}

function pathAttr(attrs) {
    var that = this,
        segments;

    if(isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        segments = attrs.segments;
        if("points" in attrs) {
            segments = buildPathSegments(attrs.points, that.type);
            delete attrs.points;
        }
        if(segments) {
            attrs.d = combinePathParam(segments);
            that.segments = segments;
            delete attrs.segments;
        }
    }
    return baseAttr(that, attrs);
}

function arcAttr(attrs) {
    var settings = this._settings,
        x, y, innerRadius, outerRadius, startAngle, endAngle;

    if(isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        if("x" in attrs || "y" in attrs || "innerRadius" in attrs || "outerRadius" in attrs || "startAngle" in attrs || "endAngle" in attrs) {
            settings.x = x = "x" in attrs ? attrs.x : settings.x; delete attrs.x;
            settings.y = y = "y" in attrs ? attrs.y : settings.y; delete attrs.y;
            settings.innerRadius = innerRadius = "innerRadius" in attrs ? attrs.innerRadius : settings.innerRadius; delete attrs.innerRadius;
            settings.outerRadius = outerRadius = "outerRadius" in attrs ? attrs.outerRadius : settings.outerRadius; delete attrs.outerRadius;
            settings.startAngle = startAngle = "startAngle" in attrs ? attrs.startAngle : settings.startAngle; delete attrs.startAngle;
            settings.endAngle = endAngle = "endAngle" in attrs ? attrs.endAngle : settings.endAngle; delete attrs.endAngle;

            attrs.d = buildArcPath.apply(null, normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle));
        }
    }
    return baseAttr(this, attrs);
}

function rectAttr(attrs) {
    var that = this,
        x,
        y,
        width,
        height,
        sw,
        maxSW,
        newSW;

    if(isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        if(attrs.x !== undefined
            || attrs.y !== undefined
            || attrs.width !== undefined
            || attrs.height !== undefined
            || attrs[KEY_STROKE_WIDTH] !== undefined) {

            attrs.x !== undefined ? (x = that._originalX = (attrs.x)) : (x = that._originalX || 0);
            attrs.y !== undefined ? (y = that._originalY = (attrs.y)) : (y = that._originalY || 0);
            attrs.width !== undefined ? (width = that._originalWidth = (attrs.width)) : (width = that._originalWidth || 0);
            attrs.height !== undefined ? (height = that._originalHeight = (attrs.height)) : (height = that._originalHeight || 0);
            attrs[KEY_STROKE_WIDTH] !== undefined ? (sw = that._originalSW = (attrs[KEY_STROKE_WIDTH])) : (sw = that._originalSW);

            maxSW = ~~((width < height ? width : height) / 2);
            newSW = (sw || 0) < maxSW ? (sw || 0) : maxSW;

            attrs.x = x + newSW / 2;
            attrs.y = y + newSW / 2;
            attrs.width = width - newSW;
            attrs.height = height - newSW;
            (((sw || 0) !== newSW) || !(newSW === 0 && sw === undefined)) && (attrs[KEY_STROKE_WIDTH] = newSW);
        }

        if("sharp" in attrs) {
            delete attrs.sharp;
        }
    }
    return baseAttr(that, attrs);
}

function textAttr(attrs) {
    var that = this,
        settings,
        isResetRequired,
        wasStroked,
        isStroked;

    if(!isObjectArgument(attrs)) {
        return baseAttr(that, attrs);
    }

    attrs = extend({}, attrs);
    settings = that._settings;
    wasStroked = _isDefined(settings[KEY_STROKE]) && _isDefined(settings[KEY_STROKE_WIDTH]);

    if(attrs[KEY_TEXT] !== undefined) {
        settings[KEY_TEXT] = attrs[KEY_TEXT];
        delete attrs[KEY_TEXT];
        isResetRequired = true;
    }
    if(attrs[KEY_STROKE] !== undefined) {
        settings[KEY_STROKE] = attrs[KEY_STROKE];
        delete attrs[KEY_STROKE];
    }
    if(attrs[KEY_STROKE_WIDTH] !== undefined) {
        settings[KEY_STROKE_WIDTH] = attrs[KEY_STROKE_WIDTH];
        delete attrs[KEY_STROKE_WIDTH];
    }
    if(attrs[KEY_STROKE_OPACITY] !== undefined) {
        settings[KEY_STROKE_OPACITY] = attrs[KEY_STROKE_OPACITY];
        delete attrs[KEY_STROKE_OPACITY];
    }

    isStroked = _isDefined(settings[KEY_STROKE]) && _isDefined(settings[KEY_STROKE_WIDTH]);
    baseAttr(that, attrs);
    isResetRequired = isResetRequired || (isStroked !== wasStroked && settings[KEY_TEXT]);
    if(isResetRequired) {
        createTextNodes(that, settings.text, isStroked);
        that._hasEllipsis = false;
    }
    if(isResetRequired || attrs["x"] !== undefined || attrs["y"] !== undefined) {
        locateTextNodes(that);
    }
    if(isStroked) {
        strokeTextNodes(that);
    }
    return that;
}

function textCss(styles) {
    styles = styles || {};
    baseCss(this, styles);
    if(KEY_FONT_SIZE in styles) {
        locateTextNodes(this);
    }
    return this;
}

function orderHtmlTree(list, line, node, parentStyle, parentClassName) {
    var style,
        realStyle,
        i,
        ii,
        nodes;

    if(node.wholeText !== undefined) {
        list.push({ value: node.wholeText, style: parentStyle, className: parentClassName /* EXPERIMENTAL */, line: line, height: parentStyle[KEY_FONT_SIZE] || 0 });
    } else if(node.tagName === "BR") {
        ++line;
    } else if(domAdapter.isElementNode(node)) {
        extend(style = {}, parentStyle);
        switch(node.tagName) {
            case "B":
            case "STRONG":
                style[KEY_FONT_WEIGHT] = "bold";
                break;
            case "I":
            case "EM":
                style[KEY_FONT_STYLE] = "italic";
                break;
            case "U":
                style[KEY_TEXT_DECORATION] = "underline";
                break;
        }
        realStyle = node.style;
        realStyle.color && (style.fill = realStyle.color);
        realStyle.fontSize && (style[KEY_FONT_SIZE] = realStyle.fontSize);
        realStyle.fontStyle && (style[KEY_FONT_STYLE] = realStyle.fontStyle);
        realStyle.fontWeight && (style[KEY_FONT_WEIGHT] = realStyle.fontWeight);
        realStyle.textDecoration && (style[KEY_TEXT_DECORATION] = realStyle.textDecoration);
        for(i = 0, nodes = node.childNodes, ii = nodes.length; i < ii; ++i) {
            line = orderHtmlTree(list, line, nodes[i], style, node.className || parentClassName);
        }
    }
    return line;
}

function adjustLineHeights(items) {
    var i, ii,
        currentItem = items[0],
        item;
    for(i = 1, ii = items.length; i < ii; ++i) {
        item = items[i];
        if(item.line === currentItem.line) {
            // T177039
            currentItem.height = maxLengthFontSize(currentItem.height, item.height);
            currentItem.inherits = currentItem.inherits || _parseFloat(item.height) === 0;
            item.height = NaN;
        } else {
            currentItem = item;
        }
    }
}

function removeExtraAttrs(html) {
    var findTagAttrs = /(?:(<[a-z0-9]+\s*))([\s\S]*?)(>|\/>)/gi,
        findStyleAndClassAttrs = /(style|class)\s*=\s*(["'])(?:(?!\2).)*\2\s?/gi;

    return html.replace(findTagAttrs, function(allTagAttrs, p1, p2, p3) {
        p2 = (p2 && p2.match(findStyleAndClassAttrs) || []).map(function(str) {
            return str;
        }).join(" ");

        return p1 + p2 + p3;
    });
}

function parseHTML(text) {
    var items = [],
        div = domAdapter.createElement("div");
    div.innerHTML = text.replace(/\r/g, "").replace(/\n/g, "<br/>");
    orderHtmlTree(items, 0, div, {}, "");
    adjustLineHeights(items);
    return items;
}

function parseMultiline(text) {
    var texts = text.replace(/\r/g, "").split(/\n/g),
        i = 0,
        items = [];
    for(; i < texts.length; i++) {
        items.push({ value: texts[i].trim(), height: 0 });
    }
    return items;
}

function createTspans(items, element, fieldName) {
    var i, ii, item;
    for(i = 0, ii = items.length; i < ii; ++i) {
        item = items[i];
        item[fieldName] = createElement("tspan");
        item[fieldName].appendChild(domAdapter.createTextNode(item.value));
        item.style && baseCss({ element: item[fieldName], _styles: {} }, item.style);
        item.className && item[fieldName].setAttribute("class", item.className);    // EXPERIMENTAL
        element.appendChild(item[fieldName]);
    }
}

function restoreText() {
    if(this._hasEllipsis) {
        this.attr({ text: this._settings.text });
    }
}

function applyEllipsis(maxWidth) {
    var that = this,
        lines,
        hasEllipsis = false,
        i,
        ii,
        lineParts,
        j,
        jj,
        text,
        ellipsis,
        ellipsisWidth;

    restoreText.call(that);

    ellipsis = that.renderer.text("...").attr(that._styles).append(that.renderer.root);
    ellipsisWidth = ellipsis.getBBox().width;
    if(that._getElementBBox().width > maxWidth) {
        if(maxWidth - ellipsisWidth < 0) {
            maxWidth = 0;
        } else {
            maxWidth -= ellipsisWidth;
        }
        lines = prepareLines(that.element, that._texts, maxWidth);

        for(i = 0, ii = lines.length; i < ii; ++i) {
            lineParts = lines[i].parts;
            if(lines[i].commonLength === 1) {
                continue;
            }
            for(j = 0, jj = lineParts.length; j < jj; ++j) {
                text = lineParts[j];
                if(_isDefined(text.endIndex)) {
                    setNewText(text, text.endIndex);
                    hasEllipsis = true;
                } else if(text.startBox > maxWidth) {
                    removeTextSpan(text);
                }
            }
        }
    }

    ellipsis.remove();
    that._hasEllipsis = hasEllipsis;

    return hasEllipsis;
}

function getIndexForEllipsis(text, maxWidth, startBox, endBox) {
    var k,
        kk;
    if(startBox <= maxWidth && endBox > maxWidth) {
        for(k = 1, kk = text.value.length; k <= kk; ++k) {
            if(startBox + text.tspan.getSubStringLength(0, k) > maxWidth) {
                return k - 1;
            }
        }
    }
}

function prepareLines(element, texts, maxWidth) {
    var lines = [],
        i,
        ii,
        text,
        startBox,
        endBox;

    if(texts) {
        for(i = 0, ii = texts.length; i < ii; ++i) {
            text = texts[i];
            if(!lines[text.line]) {
                text.startBox = startBox = 0;
                lines.push({ commonLength: text.value.length, parts: [text] });
            } else {
                text.startBox = startBox;
                lines[text.line].parts.push(text);
                lines[text.line].commonLength += text.value.length;
            }
            endBox = startBox + text.tspan.getSubStringLength(0, text.value.length);
            text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
            startBox = endBox;
        }
    } else {
        text = { value: element.textContent, tspan: element };
        text.startBox = startBox = 0;
        endBox = text.value.length ? startBox + text.tspan.getSubStringLength(0, text.value.length) : 0;
        text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
        lines = [{ commonLength: element.textContent.length, parts: [text] }];
    }
    return lines;
}

function setNewText(text, index) {
    var newText = text.value.substr(0, index) + "...";
    text.tspan.textContent = newText;
    text.stroke && (text.stroke.textContent = newText);
}

function removeTextSpan(text) {
    text.tspan.parentNode.removeChild(text.tspan);
    text.stroke && text.stroke.parentNode.removeChild(text.stroke);
}

function createTextNodes(wrapper, text, isStroked) {
    var items,
        parsedHtml;

    wrapper._texts = null;
    wrapper.clear();

    if(text === null) return;

    text = "" + text;
    if(!wrapper.renderer.encodeHtml && (/<[a-z][\s\S]*>/i.test(text) || text.indexOf("&") !== -1)) {
        parsedHtml = removeExtraAttrs(text);
        items = parseHTML(parsedHtml);
        ///#DEBUG
        wrapper.DEBUG_parsedHtml = parsedHtml;
        ///#ENDDEBUG
    } else if(/\n/g.test(text)) {
        items = parseMultiline(text);
    } else if(isStroked) {
        items = [{ value: text.trim(), height: 0 }];
    }
    if(items) {
        if(items.length) {     // T227388
            wrapper._texts = items;
            if(isStroked) {
                createTspans(items, wrapper.element, KEY_STROKE);
            }
            createTspans(items, wrapper.element, "tspan");
        }
    } else {
        wrapper.element.appendChild(domAdapter.createTextNode(text));
    }
}

function setTextNodeAttribute(item, name, value) {
    item.tspan.setAttribute(name, value);
    item.stroke && item.stroke.setAttribute(name, value);
}

function locateTextNodes(wrapper) {
    if(!wrapper._texts) return;
    var items = wrapper._texts,
        x = wrapper._settings.x,
        lineHeight = !isNaN(_parseFloat(wrapper._styles[KEY_FONT_SIZE])) ? wrapper._styles[KEY_FONT_SIZE] : DEFAULT_FONT_SIZE,
        i, ii,
        item = items[0];
    setTextNodeAttribute(item, "x", x);
    setTextNodeAttribute(item, "y", wrapper._settings.y);
    for(i = 1, ii = items.length; i < ii; ++i) {
        item = items[i];
        if(_parseFloat(item.height) >= 0) {
            setTextNodeAttribute(item, "x", x);
            setTextNodeAttribute(item, "dy", item.inherits ? maxLengthFontSize(item.height, lineHeight) : (item.height || lineHeight));   // T177039
        }
    }
}

function maxLengthFontSize(fontSize1, fontSize2) {
    var parsedHeight1 = _parseFloat(fontSize1),
        parsedHeight2 = _parseFloat(fontSize2),
        height1 = parsedHeight1 || DEFAULT_FONT_SIZE,
        height2 = parsedHeight2 || DEFAULT_FONT_SIZE;

    return height1 > height2 ? (!isNaN(parsedHeight1) ? fontSize1 : height1) : (!isNaN(parsedHeight2) ? fontSize2 : height2);
}

function strokeTextNodes(wrapper) {
    if(!wrapper._texts) return;
    var items = wrapper._texts,
        stroke = wrapper._settings[KEY_STROKE],
        strokeWidth = wrapper._settings[KEY_STROKE_WIDTH],
        strokeOpacity = wrapper._settings[KEY_STROKE_OPACITY] || 1,
        tspan, i, ii;
    for(i = 0, ii = items.length; i < ii; ++i) {
        tspan = items[i].stroke;
        tspan.setAttribute(KEY_STROKE, stroke);
        tspan.setAttribute(KEY_STROKE_WIDTH, strokeWidth);
        tspan.setAttribute(KEY_STROKE_OPACITY, strokeOpacity);
        tspan.setAttribute("stroke-linejoin", "round");
    }
}

function baseAnimate(that, params, options, complete) {
    options = options || {};
    var key,
        value,
        renderer = that.renderer,
        settings = that._settings,
        animationParams = {};

    var defaults = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        rotateX: 0,
        rotateY: 0
    };

    if(complete) {
        options.complete = complete;
    }

    if(renderer.animationEnabled()) {
        for(key in params) {
            value = params[key];
            if(/^(translate(X|Y)|rotate[XY]?|scale(X|Y))$/i.test(key)) {
                animationParams.transform = animationParams.transform || { from: {}, to: {} };
                animationParams.transform.from[key] = key in settings ? Number(settings[key].toFixed(3)) : defaults[key]; // T338486
                animationParams.transform.to[key] = value;
            } else if(key === "arc" || key === "segments") {
                animationParams[key] = value;
            } else {
                animationParams[key] = {
                    from: (key in settings) ? settings[key] : parseFloat((that.element.getAttribute(key) || 0)),
                    to: value
                };
            }
        }
        renderer.animateElement(that, animationParams, extend(extend({}, renderer._animation), options));
    } else {
        options.step && options.step.call(that, 1, 1);
        options.complete && options.complete.call(that);

        that.attr(params);
    }
    return that;
}

function pathAnimate(params, options, complete) {
    var that = this,
        curSegments = that.segments || [],
        newSegments,
        endSegments;

    if(that.renderer.animationEnabled() && "points" in params) {
        newSegments = buildPathSegments(params.points, that.type);
        endSegments = compensateSegments(curSegments, newSegments, that.type);

        params.segments = { from: curSegments, to: newSegments, end: endSegments };
        delete params.points;
    }

    return baseAnimate(that, params, options, complete);
}

function arcAnimate(params, options, complete) {
    var that = this,
        settings = that._settings,
        arcParams = { from: {}, to: {} };

    if(that.renderer.animationEnabled() &&
        ("x" in params || "y" in params || "innerRadius" in params || "outerRadius" in params || "startAngle" in params || "endAngle" in params)) {

        arcParams.from.x = settings.x || 0;
        arcParams.from.y = settings.y || 0;
        arcParams.from.innerRadius = settings.innerRadius || 0;
        arcParams.from.outerRadius = settings.outerRadius || 0;
        arcParams.from.startAngle = settings.startAngle || 0;
        arcParams.from.endAngle = settings.endAngle || 0;

        arcParams.to.x = "x" in params ? params.x : settings.x; delete params.x;
        arcParams.to.y = "y" in params ? params.y : settings.y; delete params.y;
        arcParams.to.innerRadius = "innerRadius" in params ? params.innerRadius : settings.innerRadius; delete params.innerRadius;
        arcParams.to.outerRadius = "outerRadius" in params ? params.outerRadius : settings.outerRadius; delete params.outerRadius;
        arcParams.to.startAngle = "startAngle" in params ? params.startAngle : settings.startAngle; delete params.startAngle;
        arcParams.to.endAngle = "endAngle" in params ? params.endAngle : settings.endAngle; delete params.endAngle;

        params.arc = arcParams;
    }

    return baseAnimate(that, params, options, complete);
}

///#DEBUG
exports.DEBUG_set_getNextDefsSvgId = function(newFunction) {
    getNextDefsSvgId = newFunction;
};

exports.DEBUG_removeBackupContainer = function() {
    if(getBackup().backupCounter) {
        getBackup().backupCounter = 0;
        domAdapter.getBody().removeChild(getBackup().backupContainer);
    }
};
///#ENDDEBUG

function buildLink(target, parameters) {
    var obj = { is: false, name: parameters.name || parameters, after: parameters.after };
    if(target) {
        obj.to = target;
    } else {
        obj.virtual = true;
    }
    return obj;
}

// SvgElement
function SvgElement(renderer, tagName, type) {
    var that = this;
    that.renderer = renderer;
    that.element = createElement(tagName);
    that._settings = {};
    that._styles = {};

    if(tagName === "path") {
        that.type = type || "line";
    }
}

function removeFuncIriCallback(callback) {
    fixFuncIriCallbacks.remove(callback);
}

exports.SvgElement = SvgElement;

SvgElement.prototype = {
    constructor: SvgElement,

    _getJQElement: function() {
        return (this._$element || (this._$element = $(this.element)));
    },

    _addFixIRICallback: function() {
        var that = this,
            fn = function() {
                fixFuncIri(that, "fill");
                fixFuncIri(that, "clip-path");
                fixFuncIri(that, "filter");
            };

        that.element._fixFuncIri = fn;
        fn.renderer = that.renderer;
        fixFuncIriCallbacks.add(fn);
        that._addFixIRICallback = function() {};
    },

    dispose: function() {
        var clearChildren = function(element) {
            var i;

            for(i = 0; i < element.childNodes.length; i++) {
                removeFuncIriCallback(element.childNodes[i]._fixFuncIri);
                clearChildren(element.childNodes[i]);
            }
        };

        removeFuncIriCallback(this.element._fixFuncIri);
        clearChildren(this.element);


        this._getJQElement().remove();
        return this;
    },

    append: function(parent) {
        (parent || this.renderer.root).element.appendChild(this.element);
        return this;
    },

    remove: function() {
        var element = this.element;
        element.parentNode && element.parentNode.removeChild(element);
        return this;
    },

    // NOTE: Though it is not actually required I think it would be better to explicitly declare usage of link mechanism
    enableLinks: function() {
        this._links = [];
        return this;
    },

    ///#DEBUG
    checkLinks: function() {
        var count = 0,
            links = this._links,
            i,
            ii = links.length;
        for(i = 0; i < ii; ++i) {
            if(!links[i]._link.virtual) {
                ++count;
            }
        }
        if(count > 0) {
            throw new Error("There are non disposed links!");
        }
    },
    ///#ENDDEBUG

    virtualLink: function(parameters) {
        linkItem({ _link: buildLink(null, parameters) }, this);
        return this;
    },

    linkAfter: function(name) {
        this._linkAfter = name;
        return this;
    },

    linkOn: function(target, parameters) {
        this._link = buildLink(target, parameters);
        linkItem(this, target);
        return this;
    },

    linkOff: function() {
        unlinkItem(this);
        this._link = null;
        return this;
    },

    // It might be better to traverse list to start (not to end) as widget components more likely will be rendered in the same order as they were created
    linkAppend: function() {
        var link = this._link,
            items = link.to._links,
            i,
            next;
        for(i = link.i + 1; (next = items[i]) && !next._link.is; ++i) { }
        this._insert(link.to, next);
        link.is = true;
        return this;
    },

    // The method exists only for being overridden in vml
    _insert: function(parent, next) {
        parent.element.insertBefore(this.element, next ? next.element : null);
    },

    linkRemove: function() {
        this.remove();
        this._link.is = false;
        return this;
    },

    clear: function() {
        this._getJQElement().empty();
        return this;
    },

    toBackground: function() {
        var elem = this.element,
            parent = elem.parentNode;
        parent && parent.insertBefore(elem, parent.firstChild);
        return this;
    },

    toForeground: function() {
        var elem = this.element,
            parent = elem.parentNode;
        parent && parent.appendChild(elem);
        return this;
    },

    attr: function(attrs) {
        return baseAttr(this, attrs);
    },

    smartAttr: function(attrs) {
        var that = this;
        if(attrs.hatching && _normalizeEnum(attrs.hatching.direction) !== "none") {
            attrs = extend({}, attrs);
            attrs.fill = that._hatching = that.renderer.lockHatching(attrs.fill, attrs.hatching, that._hatching);
            delete attrs.hatching;
        } else if(that._hatching) {
            that.renderer.releaseHatching(that._hatching);
            that._hatching = null;
        }
        return that.attr(attrs);
    },

    css: function(styles) {
        return baseCss(this, styles);
    },

    animate: function(params, options, complete) {
        return baseAnimate(this, params, options, complete);
    },

    sharp: function(pos) {
        return this.attr({ sharp: pos || true });
    },

    _applyTransformation: function() {
        var tr = this._settings,
            scaleXDefined,
            scaleYDefined,
            transformations = [],
            rotateX,
            rotateY,
            sharpMode = tr.sharp,
            strokeOdd = tr[KEY_STROKE_WIDTH] % 2,
            correctionX = (strokeOdd && (sharpMode === "h" || sharpMode === true)) ? SHARPING_CORRECTION : 0,
            correctionY = (strokeOdd && (sharpMode === "v" || sharpMode === true)) ? SHARPING_CORRECTION : 0;

        transformations.push("translate(" + ((tr.translateX || 0) + correctionX) + "," + ((tr.translateY || 0) + correctionY) + ")");

        if(tr.rotate) {
            if("rotateX" in tr) {
                rotateX = tr.rotateX;
            } else {
                rotateX = tr.x;
            }

            if("rotateY" in tr) {
                rotateY = tr.rotateY;
            } else {
                rotateY = tr.y;
            }

            transformations.push("rotate(" + tr.rotate + "," + (rotateX || 0) + "," + (rotateY || 0) + ")");
        }
        scaleXDefined = _isDefined(tr.scaleX);
        scaleYDefined = _isDefined(tr.scaleY);
        if(scaleXDefined || scaleYDefined) {
            transformations.push("scale(" + (scaleXDefined ? tr.scaleX : 1) + "," + (scaleYDefined ? tr.scaleY : 1) + ")");
        }

        if(transformations.length) {
            this.element.setAttribute("transform", transformations.join(" "));
        }
    },

    move: function(x, y, animate, animOptions) {
        var obj = {};

        _isDefined(x) && (obj.translateX = x);
        _isDefined(y) && (obj.translateY = y);

        if(!animate) {
            this.attr(obj);
        } else {
            this.animate(obj, animOptions);
        }
        return this;
    },

    rotate: function(angle, x, y, animate, animOptions) {
        var obj = {
            rotate: angle || 0
        };

        _isDefined(x) && (obj.rotateX = x);
        _isDefined(y) && (obj.rotateY = y);

        if(!animate) {
            this.attr(obj);
        } else {
            this.animate(obj, animOptions);
        }
        return this;
    },

    _getElementBBox: function() {
        var elem = this.element,
            bBox;

        try {
            bBox = elem.getBBox && elem.getBBox();
        } catch(e) { }

        return bBox || { x: 0, y: 0, width: elem.offsetWidth || 0, height: elem.offsetHeight || 0 };
    },

    // TODO do we need to round results and consider rotation coordinates?
    getBBox: function() {
        var transformation = this._settings,
            bBox = this._getElementBBox();

        if(transformation.rotate) {
            bBox = _rotateBBox(bBox, [
                (("rotateX" in transformation) ? transformation.rotateX : transformation.x) || 0,
                (("rotateY" in transformation) ? transformation.rotateY : transformation.y) || 0
            ], -transformation.rotate);     // Angle is transformed from svg to right-handed cartesian space
        } else {
            bBox = _normalizeBBox(bBox);
        }
        return bBox;
    },

    markup: function() {
        return getSvgMarkup(this.element);
    },

    getOffset: function() {
        return this._getJQElement().offset();
    },

    stopAnimation: function(disableComplete) {
        var animation = this.animation;
        animation && animation.stop(disableComplete);
        return this;
    },

    setTitle: function(text) {
        var titleElem = createElement('title');
        titleElem.textContent = text || '';
        this.element.appendChild(titleElem);
    },

    data: function(obj, val) {
        var elem = this.element,
            key;
        if(val !== undefined) {
            elem[obj] = val;
        } else {
            for(key in obj) {
                elem[key] = obj[key];
            }
        }
        return this;
    },

    on: function() {
        var args = [ this._getJQElement() ];
        args.push.apply(args, arguments);
        eventsEngine.on.apply(eventsEngine, args);
        return this;
    },

    off: function() {
        var args = [ this._getJQElement() ];
        args.push.apply(args, arguments);
        eventsEngine.off.apply(eventsEngine, args);
        return this;
    },

    trigger: function() {
        var args = [ this._getJQElement() ];
        args.push.apply(args, arguments);
        eventsEngine.trigger.apply(eventsEngine, args);
        return this;
    }
};
// SvgElement

// PathSvgElement
function PathSvgElement(renderer, type) {
    SvgElement.call(this, renderer, "path", type);
}
exports.PathSvgElement = PathSvgElement;

PathSvgElement.prototype = objectCreate(SvgElement.prototype);

extend(PathSvgElement.prototype, {
    constructor: PathSvgElement,
    attr: pathAttr,
    animate: pathAnimate
});
// PathSvgElement

// ArcSvgElement
function ArcSvgElement(renderer) {
    SvgElement.call(this, renderer, "path", "arc");
}
exports.ArcSvgElement = ArcSvgElement;

ArcSvgElement.prototype = objectCreate(SvgElement.prototype);

extend(ArcSvgElement.prototype, {
    constructor: ArcSvgElement,
    attr: arcAttr,
    animate: arcAnimate
});
// ArcSvgElement

// RectSvgElement
function RectSvgElement(renderer) {
    SvgElement.call(this, renderer, "rect");
}
exports.RectSvgElement = RectSvgElement;

RectSvgElement.prototype = objectCreate(SvgElement.prototype);

extend(RectSvgElement.prototype, {
    constructor: RectSvgElement,
    attr: rectAttr
});
// RectSvgElement

// TextSvgElement
function TextSvgElement(renderer) {
    SvgElement.call(this, renderer, "text");
    this.css({ "white-space": "pre" });
}
exports.TextSvgElement = TextSvgElement;

TextSvgElement.prototype = objectCreate(SvgElement.prototype);

extend(TextSvgElement.prototype, {
    constructor: TextSvgElement,
    attr: textAttr,
    css: textCss,
    applyEllipsis: applyEllipsis,
    restoreText: restoreText
});
// TextSvgElement

function updateIndexes(items, k) {
    var i,
        item;
    for(i = k; !!(item = items[i]); ++i) {
        item._link.i = i;
    }
}

function linkItem(target, container) {
    var items = container._links,
        key = (target._link.after = target._link.after || container._linkAfter),
        i,
        item;
    if(key) {
        for(i = 0; (item = items[i]) && item._link.name !== key; ++i) { }
        if(item) {
            for(++i; (item = items[i]) && item._link.after === key; ++i) { }
        }
    } else {
        i = items.length;
    }
    items.splice(i, 0, target);
    updateIndexes(items, i);
}

function unlinkItem(target) {
    var i,
        items = target._link.to._links;
    for(i = 0; items[i] !== target; ++i) { }
    items.splice(i, 1);
    updateIndexes(items, i);
}

function Renderer(options) {
    var that = this;
    that.root = that._createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        version: "1.1",

        // Backward compatibility
        fill: NONE,
        stroke: NONE,
        "stroke-width": 0
    }).attr({ "class": options.cssClass }).css({
        "line-height": "normal", // T179515
        "-ms-user-select": NONE,
        "-moz-user-select": NONE,
        "-webkit-user-select": NONE,
        "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        display: "block",
        overflow: "hidden"
    });

    that._init();
    that.pathModified = !!options.pathModified;
    that._$container = $(options.container);
    that.root.append({ element: options.container });
    that.fixPlacement();
    that._locker = 0;
    that._backed = false;
}

exports.Renderer = Renderer;

Renderer.prototype = {
    constructor: Renderer,

    _init: function() {
        var that = this;
        that._defs = that._createElement("defs").append(that.root);

        that._animationController = new animation.AnimationController(that.root.element);
        that._animation = { enabled: true, duration: 1000, easing: "easeOutCubic" };
    },

    fixPlacement: function() {
        if(!browser.mozilla && !browser.msie) {
            return;
        }

        var box = getBoundingClientRect(this._$container.get(0)),
            dx = roundValue(box.left % 1, 2),
            dy = roundValue(box.top % 1, 2);

        if(browser.msie) {
            this.root.css({
                transform: "translate(" + -dx + "px," + -dy + "px)"
            });
        } else if(browser.mozilla) {
            this.root.move(-dx, -dy);
        }
    },

    removePlacementFix: function() {
        if(!browser.mozilla && !browser.msie) {
            return;
        }

        if(browser.msie) {
            this.root.css({ transform: "" });
        } else if(browser.mozilla) {
            this.root.attr({ transform: null });
        }
    },

    setOptions: function(options) {
        var that = this;
        that.rtl = !!options.rtl;
        that.encodeHtml = !!options.encodeHtml;

        that.updateAnimationOptions(options.animation || {});

        that.root.attr({ direction: that.rtl ? "rtl" : "ltr" });
        return that;
    },

    _createElement: function(tagName, attr, type) {
        var elem = new exports.SvgElement(this, tagName, type);
        attr && elem.attr(attr);
        return elem;
    },

    lock: function() {
        var that = this;
        if(that._locker === 0) {
            that._backed = !that._$container.is(":visible");
            if(that._backed) {
                backupRoot(that.root);
            }
        }
        ++that._locker;
        return that;
    },

    unlock: function() {
        var that = this;
        --that._locker;
        if(that._locker === 0) {
            if(that._backed) {
                restoreRoot(that.root, that._$container[0]);
                that.fixPlacement();
            }
            that._backed = false;
        }
        return that;
    },

    resize: function(width, height) {
        if(width >= 0 && height >= 0) {
            this.root.attr({ width: width, height: height });
        }
        return this;
    },

    dispose: function() {
        var that = this,
            key;
        that.root.dispose();
        that._defs.dispose();
        that._animationController.dispose();

        fixFuncIriCallbacks.removeByRenderer(that);

        for(key in that) {
            that[key] = null;
        }
        return that;
    },

    animationEnabled: function() {
        return !!this._animation.enabled;
    },

    updateAnimationOptions: function(newOptions) {
        extend(this._animation, newOptions);
        return this;
    },

    stopAllAnimations: function(lock) {
        this._animationController[lock ? "lock" : "stop"]();
        return this;
    },

    animateElement: function(element, params, options) {
        this._animationController.animateElement(element, params, options);
        return this;
    },

    svg: function() {
        this.removePlacementFix();
        var markup = this.root.markup();
        this.fixPlacement();
        return markup;
    },

    getRootOffset: function() {
        return this.root.getOffset();
    },

    onEndAnimation: function(endAnimation) {
        this._animationController.onEndAnimation(endAnimation);
    },

    rect: function(x, y, width, height) {
        var elem = new exports.RectSvgElement(this);
        return elem.attr({ x: x || 0, y: y || 0, width: width || 0, height: height || 0 });
    },

    simpleRect: function() {
        return this._createElement("rect");
    },

    circle: function(x, y, r) {
        return this._createElement("circle", { cx: x || 0, cy: y || 0, r: r || 0 });
    },

    g: function() {
        return this._createElement("g");
    },

    image: function(x, y, w, h, href, location) {
        var image = this._createElement("image", {
            x: x || 0, y: y || 0, width: w || 0, height: h || 0,
            preserveAspectRatio: preserveAspectRatioMap[_normalizeEnum(location)] || NONE
        });

        image.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", href || "");
        return image;
    },

    // to combine different d attributes use helper methods
    path: function(points, type) {
        var elem = new exports.PathSvgElement(this, type);
        return elem.attr({ points: points || [] });
    },

    // TODO check B232257
    // TODO animate end angle special case
    arc: function(x, y, innerRadius, outerRadius, startAngle, endAngle) {
        var elem = new exports.ArcSvgElement(this);
        return elem.attr({ x: x || 0, y: y || 0, innerRadius: innerRadius || 0, outerRadius: outerRadius || 0, startAngle: startAngle || 0, endAngle: endAngle || 0 });
    },

    text: function(text, x, y) {
        var elem = new exports.TextSvgElement(this);
        return elem.attr({ text: text, x: x || 0, y: y || 0 });
    },

    linearGradient: function(stops) {
        var gradient,
            id = getNextDefsSvgId(),
            that = this;
        gradient = that._createElement("linearGradient", { id: id }).append(that._defs);
        gradient.id = id;

        stops.forEach((stop) => {
            that._createElement("stop", { offset: stop.offset, 'stop-color': stop['stop-color'] }).append(gradient);
        });

        return gradient;
    },

    // appended automatically
    pattern: function(color, hatching, _id) {
        hatching = hatching || {};

        var that = this,
            id,
            d,
            pattern,
            rect,
            path,
            step = hatching.step || 6,
            stepTo2 = step / 2,
            stepBy15 = step * 1.5;

        id = _id || getNextDefsSvgId();

        d = (_normalizeEnum(hatching.direction) === "right" ?
            "M " + stepTo2 + " " + (-stepTo2) + " L " + (-stepTo2) + " " + stepTo2 + " M 0 " + step + " L " + step + " 0 M " + stepBy15 + " " + stepTo2 + " L " + stepTo2 + " " + stepBy15
            : "M 0 0 L " + step + " " + step + " M " + (-stepTo2) + " " + stepTo2 + " L " + stepTo2 + " " + stepBy15 + " M " + stepTo2 + " " + (-stepTo2) + " L " + stepBy15 + " " + stepTo2);

        pattern = that._createElement("pattern", { id: id, width: step, height: step, patternUnits: "userSpaceOnUse" }).append(that._defs);
        pattern.id = id;

        rect = that.rect(0, 0, step, step).attr({ fill: color, opacity: hatching.opacity }).append(pattern);
        path = (new exports.PathSvgElement(this)).attr({ d: d, "stroke-width": hatching.width || 1, stroke: color }).append(pattern);

        ///#DEBUG
        pattern.rect = rect;
        pattern.path = path;
        ///#ENDDEBUG

        return pattern;
    },

    _getPointsWithYOffset: function(points, offset) {
        return points.map(function(point, index) {
            if(index % 2 !== 0) {
                return point + offset;
            }
            return point;
        });
    },

    // appended automatically
    clipRect: function(x, y, width, height) {
        var that = this,
            id = getNextDefsSvgId(),
            clipPath = that._createElement("clipPath", { id: id }).append(that._defs),
            rect = that.rect(x, y, width, height).append(clipPath);
        rect.id = id;

        ///#DEBUG
        rect.clipPath = clipPath;
        ///#ENDDEBUG

        rect.remove = function() { throw "Not implemented"; };
        rect.dispose = function() {
            clipPath.dispose();
            clipPath = null;
            return this;
        };
        return rect;
    },

    // appended automatically
    shadowFilter: function(x, y, width, height, offsetX, offsetY, blur, color, opacity) {
        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", { id: id, x: x || 0, y: y || 0, width: width || 0, height: height || 0 }).append(that._defs),
            gaussianBlur = that._createElement("feGaussianBlur", { "in": "SourceGraphic", "result": "gaussianBlurResult", "stdDeviation": blur || 0 }).append(filter),
            offset = that._createElement("feOffset", { "in": "gaussianBlurResult", "result": "offsetResult", "dx": offsetX || 0, "dy": offsetY || 0 }).append(filter),
            flood = that._createElement("feFlood", { "result": "floodResult", "flood-color": color || "", "flood-opacity": opacity }).append(filter),
            composite = that._createElement("feComposite", { "in": "floodResult", "in2": "offsetResult", "operator": "in", "result": "compositeResult" }).append(filter),
            finalComposite = that._createElement("feComposite", { "in": "SourceGraphic", "in2": "compositeResult", "operator": "over" }).append(filter);

        filter.id = id;
        filter.gaussianBlur = gaussianBlur;
        filter.offset = offset;
        filter.flood = flood;
        filter.composite = composite;
        filter.finalComposite = finalComposite;

        filter.attr = function(attrs) {
            var that = this,
                filterAttrs = {},
                offsetAttrs = {},
                floodAttrs = {};

            ("x" in attrs) && (filterAttrs.x = attrs.x);
            ("y" in attrs) && (filterAttrs.y = attrs.y);
            ("width" in attrs) && (filterAttrs.width = attrs.width);
            ("height" in attrs) && (filterAttrs.height = attrs.height);
            baseAttr(that, filterAttrs);

            ("blur" in attrs) && that.gaussianBlur.attr({ "stdDeviation": attrs.blur });

            ("offsetX" in attrs) && (offsetAttrs.dx = attrs.offsetX);
            ("offsetY" in attrs) && (offsetAttrs.dy = attrs.offsetY);
            that.offset.attr(offsetAttrs);

            ("color" in attrs) && (floodAttrs["flood-color"] = attrs.color);
            ("opacity" in attrs) && (floodAttrs["flood-opacity"] = attrs.opacity);
            that.flood.attr(floodAttrs);

            return that;
        };

        return filter;
    },

    brightFilter: function(type, slope) {
        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", { id: id }).append(that._defs),
            componentTransferElement = that._createElement("feComponentTransfer").append(filter),
            attrs = {
                type: type,
                slope: slope
            };

        filter.id = id;
        that._createElement("feFuncR", attrs).append(componentTransferElement);
        that._createElement("feFuncG", attrs).append(componentTransferElement);
        that._createElement("feFuncB", attrs).append(componentTransferElement);
        return filter;
    },

    getGrayScaleFilter: function() {
        if(this._grayScaleFilter) {
            return this._grayScaleFilter;
        }

        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", { id: id }).append(that._defs);

        that._createElement("feColorMatrix")
            .attr({ type: "matrix", values: "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0" })
            .append(filter);

        filter.id = id;
        that._grayScaleFilter = filter;

        return filter;
    },

    initHatching: function() {
        var storage = this._hatchingStorage = this._hatchingStorage || { byHash: {}, baseId: getNextDefsSvgId() },
            byHash = storage.byHash,
            name;

        for(name in byHash) {
            byHash[name].pattern.dispose();
        }
        storage.byHash = {};
        storage.refToHash = {};
        storage.nextId = 0;
    },

    lockHatching: function(color, hatching, ref) {
        var storage = this._hatchingStorage,
            hash = getHatchingHash(color, hatching),
            storageItem,
            pattern;

        if(storage.refToHash[ref] !== hash) {
            if(ref) {
                this.releaseHatching(ref);
            }
            storageItem = storage.byHash[hash];
            if(!storageItem) {
                pattern = this.pattern(color, hatching, storage.baseId + "-hatching-" + storage.nextId++);
                storageItem = storage.byHash[hash] = { pattern: pattern, count: 0 };
                storage.refToHash[pattern.id] = hash;
            }
            ++storageItem.count;
            ref = storageItem.pattern.id;
        }
        return ref;
    },

    releaseHatching: function(ref) {
        var storage = this._hatchingStorage,
            hash = storage.refToHash[ref],
            storageItem = storage.byHash[hash];

        if(--storageItem.count === 0) {
            storageItem.pattern.dispose();
            delete storage.byHash[hash];
            delete storage.refToHash[ref];
        }
    }
};

function getHatchingHash(color, hatching) {
    return "@" + color + "::" + hatching.step + ":" + hatching.width + ":" + hatching.opacity + ":" + hatching.direction;
}

// paths modifier
var fixFuncIriCallbacks = (function() {
    var callbacks = [];

    return {
        add: function(fn) {
            callbacks.push(fn);
        },
        remove: function(fn) {
            callbacks = callbacks.filter(function(el) { return el !== fn; });
        },
        removeByRenderer: function(renderer) {
            callbacks = callbacks.filter(function(el) { return el.renderer !== renderer; });
        },
        fire: function() {
            callbacks.forEach(function(fn) { fn(); });
        }
    };
})();

exports.refreshPaths = function() {
    fixFuncIriCallbacks.fire();
};


