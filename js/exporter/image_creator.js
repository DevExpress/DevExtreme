import $ from "../core/renderer";
import Color from "../color";
import { isFunction, isDeferred } from "../core/utils/type";
import svgUtils from "../core/utils/svg";
import iteratorUtils from "../core/utils/iterator";
import { extend } from "../core/utils/extend";
import domAdapter from "../core/dom_adapter";
import domUtils from "../core/utils/dom";
import windowUtils from "../core/utils/window";
const window = windowUtils.getWindow();
import { camelize } from "../core/utils/inflector";
import { Deferred } from "../core/utils/deferred";

const _math = Math;
const PI = _math.PI;
const _min = _math.min;
const _abs = _math.abs;
const _sqrt = _math.sqrt;
const _pow = _math.pow;
const _atan2 = _math.atan2;
const _cos = _math.cos;
const _sin = _math.sin;
const _each = iteratorUtils.each;
const _number = Number;

const IMAGE_QUALITY = 1;
const TEXT_DECORATION_LINE_WIDTH_COEFF = 0.05;
const DEFAULT_FONT_SIZE = "10px";
const DEFAULT_FONT_FAMILY = "sans-serif";
const DEFAULT_TEXT_COLOR = "#000";

let clipPaths,
    patterns,
    filters;

function createCanvas(width, height, margin) {
    var canvas = $("<canvas>")[0];

    canvas.width = width + margin * 2;
    canvas.height = height + margin * 2;
    canvas.hidden = true;

    return canvas;
}

function getStringFromCanvas(canvas, mimeType) {
    var dataURL = canvas.toDataURL(mimeType, IMAGE_QUALITY),
        imageData = window.atob(dataURL.substring(("data:" + mimeType + ";base64,").length));

    return imageData;
}

function arcTo(x1, y1, x2, y2, radius, largeArcFlag, clockwise, context) {
    var cBx = (x1 + x2) / 2,
        cBy = (y1 + y2) / 2,
        aB = _atan2(y1 - y2, x1 - x2),
        k = largeArcFlag ? 1 : -1,
        opSide,
        adjSide,
        centerX,
        centerY,
        startAngle,
        endAngle;

    aB += 90 * (PI / 180) * (clockwise ? 1 : -1);

    opSide = _sqrt(_pow(x2 - x1, 2) + _pow(y2 - y1, 2)) / 2;
    adjSide = _sqrt(_abs(_pow(radius, 2) - _pow(opSide, 2)));

    centerX = cBx + k * (adjSide * _cos(aB));
    centerY = cBy + k * (adjSide * _sin(aB));

    startAngle = _atan2(y1 - centerY, x1 - centerX);
    endAngle = _atan2(y2 - centerY, x2 - centerX);

    context.arc(centerX, centerY, radius, startAngle, endAngle, !clockwise);
}

function getElementOptions(element) {
    var attr = parseAttributes(element.attributes || {}),
        options = extend({}, attr, {
            text: element.textContent.replace(/\s+/g, " "),
            textAlign: attr["text-anchor"] === "middle" ? "center" : attr["text-anchor"]
        }),
        transform = attr.transform,
        coords;

    if(transform) {
        coords = transform.match(/translate\(-*\d+([.]\d+)*(,*\s*-*\d+([.]\d+)*)*/);
        if(coords) {
            coords = coords[0].match(/-*\d+([.]\d+)*/g);
            options.translateX = _number(coords[0]);
            options.translateY = coords[1] ? _number(coords[1]) : 0;
        }

        coords = transform.match(/rotate\(-*\d+([.]\d+)*(,*\s*-*\d+([.]\d+)*,*\s*-*\d+([.]\d+)*)*/);
        if(coords) {
            coords = coords[0].match(/-*\d+([.]\d+)*/g);
            options.rotationAngle = _number(coords[0]);
            options.rotationX = coords[1] && _number(coords[1]);
            options.rotationY = coords[2] && _number(coords[2]);
        }
    }

    parseStyles(element, options);

    return options;
}

function drawRect(context, options) {
    var x = options.x,
        y = options.y,
        width = options.width,
        height = options.height,
        cornerRadius = options.rx;

    if(!cornerRadius) {
        context.rect(options.x, options.y, options.width, options.height);
    } else {
        cornerRadius = _min(cornerRadius, width / 2, height / 2);
        context.save();
        context.translate(x, y);
        context.moveTo(width / 2, 0);
        context.arcTo(width, 0, width, height, cornerRadius);
        context.arcTo(width, height, 0, height, cornerRadius);
        context.arcTo(0, height, 0, 0, cornerRadius);
        context.arcTo(0, 0, cornerRadius, 0, cornerRadius);
        context.lineTo(width / 2, 0);
        context.restore();
    }
}

function drawImage(context, options) {
    var d = new Deferred(),
        image = new window.Image();

    image.onload = function() {
        context.save();

        context.globalAlpha = options.globalAlpha;
        transformElement(context, options);
        clipElement(context, options);

        context.drawImage(image, options.x, options.y, options.width, options.height);

        context.restore();
        d.resolve();
    };

    image.onerror = function() {
        d.resolve();
    };

    image.setAttribute("crossOrigin", "anonymous");
    image.src = options["href"] || options["xlink:href"];

    return d;
}

function drawPath(context, dAttr) {
    var dArray = dAttr.split(" "),
        i = 0,
        param1,
        param2;

    do {
        param1 = _number(dArray[i + 1]);
        param2 = _number(dArray[i + 2]);
        switch(dArray[i]) {
            case "M":
                context.moveTo(param1, param2);
                i += 3;
                break;
            case "L":
                context.lineTo(param1, param2);
                i += 3;
                break;
            case "C":
                context.bezierCurveTo(param1, param2, _number(dArray[i + 3]), _number(dArray[i + 4]), _number(dArray[i + 5]), _number(dArray[i + 6]));
                i += 7;
                break;
            case "A":
                arcTo(_number(dArray[i - 2]), _number(dArray[i - 1]), _number(dArray[i + 6]), _number(dArray[i + 7]), param1, _number(dArray[i + 4]), _number(dArray[i + 5]), context);
                i += 8;
                break;
            case "Z":
                context.closePath();
                i += 1;
                break;
        }
    } while(i < dArray.length);
}

function parseStyles(element, options) {
    var style = element.style || {},
        field;

    for(field in style) {
        if(style[field] !== "") {
            options[camelize(field)] = style[field];
        }
    }
    if(domAdapter.isElementNode(element) && domUtils.contains(domAdapter.getBody(), element)) {
        style = window.getComputedStyle(element);
        ["fill", "stroke", "stroke-width", "font-family", "font-size", "font-style", "font-weight" ].forEach(function(prop) {
            if(prop in style && style[prop] !== "") {
                options[camelize(prop)] = style[prop];
            }
        });

        ["opacity", "fill-opacity", "stroke-opacity"].forEach(function(prop) {
            if(prop in style && style[prop] !== "" && style[prop] !== "1") {
                options[prop] = _number(style[prop]);
            }
        });
    }

    options.textDecoration = options.textDecoration || options.textDecorationLine;
    options.globalAlpha = options.opacity || options.globalAlpha;
}

function parseUrl(urlString) {
    var matches = urlString && urlString.match(/url\(.*\#(.*?)["']?\)/i);
    return matches && matches[1];
}

function setFontStyle(context, options) {
    var fontParams = [];

    options.fontSize = options.fontSize || DEFAULT_FONT_SIZE;
    options.fontFamily || DEFAULT_FONT_FAMILY;
    options.fill = options.fill || DEFAULT_TEXT_COLOR;

    options.fontStyle && fontParams.push(options.fontStyle);
    options.fontWeight && fontParams.push(options.fontWeight);
    fontParams.push(options.fontSize);
    fontParams.push(options.fontFamily);

    context.font = fontParams.join(" ");
    context.textAlign = options.textAlign;
    context.fillStyle = options.fill;
    context.globalAlpha = options.globalAlpha;
}

function drawText(context, options) {
    setFontStyle(context, options);
    options.text && context.fillText(options.text, options.x || 0, options.y || 0);
    strokeElement(context, options, true);
    drawTextDecoration(context, options);
}

function drawTextDecoration(context, options) {
    if(!options.textDecoration || options.textDecoration === "none") {
        return;
    }

    var x = options.x,
        textWidth = context.measureText(options.text).width,
        textHeight = parseInt(options.fontSize, 10),
        lineHeight = textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF < 1 ? 1 : textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF,
        y = options.y;

    switch(options.textDecoration) {
        case "line-through":
            y -= textHeight / 3 + lineHeight / 2;
            break;
        case "overline":
            y -= textHeight - lineHeight;
            break;
        case "underline":
            y += lineHeight;
            break;
    }

    context.rect(x, y, textWidth, lineHeight);
    fillElement(context, options);
    strokeElement(context, options);
}

function createClipPath(element) {
    clipPaths[element.attributes.id.textContent] = element.childNodes[0];
}

function createPattern(element) {
    patterns[element.attributes.id.textContent] = element;
}

function aggregateOpacity(options) {
    options.strokeOpacity = options["stroke-opacity"] !== undefined ? options["stroke-opacity"] : 1;
    options.fillOpacity = options["fill-opacity"] !== undefined ? options["fill-opacity"] : 1;

    if(options.opacity !== undefined) {
        options.strokeOpacity *= options.opacity;
        options.fillOpacity *= options.opacity;
    }
}

function hasTspan(element) {
    var nodes = element.childNodes;
    for(var i = 0; i < nodes.length; i++) {
        if(nodes[i].tagName === "tspan") {
            return true;
        }
    }
    return false;
}

function drawTextElement(childNodes, context, options) {
    var lines = [],
        line,
        offset = 0;

    for(var i = 0; i < childNodes.length; i++) {
        var element = childNodes[i];

        if(element.tagName === undefined) {
            drawElement(element, context, options);
        } else if(element.tagName === "tspan" || element.tagName === "text") {
            var elementOptions = getElementOptions(element),
                mergedOptions = extend({}, options, elementOptions);

            if(element.tagName === "tspan" && hasTspan(element)) {
                drawTextElement(element.childNodes, context, mergedOptions);
                continue;
            }

            mergedOptions.textAlign = "start";
            if(!line || elementOptions.x !== undefined) {
                line = {
                    elements: [],
                    options: [],
                    widths: [],
                    offsets: []
                };
                lines.push(line);
            }

            if(elementOptions.dy !== undefined) {
                offset += parseFloat(elementOptions.dy);
            }

            line.elements.push(element);
            line.options.push(mergedOptions);
            line.offsets.push(offset);
            setFontStyle(context, mergedOptions);
            line.widths.push(context.measureText(mergedOptions.text).width);
        }
    }

    lines.forEach(function(line) {
        var commonWidth = line.widths.reduce(function(commonWidth, width) {
                return commonWidth + width;
            }, 0),
            xDiff = 0,
            currentOffset = 0;

        if(options.textAlign === "center") {
            xDiff = commonWidth / 2;
        }

        if(options.textAlign === "end") {
            xDiff = commonWidth;
        }

        line.options.forEach(function(o, index) {
            var width = line.widths[index];
            o.x = o.x - xDiff + currentOffset;
            o.y += line.offsets[index];
            currentOffset += width;
        });

        line.elements.forEach(function(element, index) {
            drawTextElement(element.childNodes, context, line.options[index]);
        });

    });
}

function drawElement(element, context, parentOptions) {
    var tagName = element.tagName,
        isText = tagName === "text" || tagName === "tspan" || tagName === undefined,
        isImage = tagName === "image",
        options = extend({}, parentOptions, getElementOptions(element));

    if(options.visibility === "hidden") {
        return;
    }

    context.save();
    !isImage && transformElement(context, options);
    clipElement(context, options);
    aggregateOpacity(options);

    let d;

    context.beginPath();
    switch(element.tagName) {
        case undefined:
            drawText(context, options);
            break;
        case "text":
        case "tspan":
            drawTextElement(element.childNodes, context, options);
            break;
        case "image":
            d = drawImage(context, options);
            break;
        case "path":
            drawPath(context, options.d);
            break;
        case "rect":
            drawRect(context, options);
            context.closePath(); // for valid clipping
            break;
        case "circle":
            context.arc(options.cx, options.cy, options.r, 0, 2 * PI, 1);
            break;
    }

    applyFilter(context, options);

    if(!isText) {
        fillElement(context, options);
        strokeElement(context, options);
    }

    context.restore();

    return d;
}

function applyFilter(context, options) {
    var filterOptions,
        id = parseUrl(options.filter);

    if(id) {
        filterOptions = filters && filters[id];

        if(!filterOptions) {
            filterOptions = {
                offsetX: 0,
                offsetY: 0,
                blur: 0,
                color: '#000'
            };
        }

        context.shadowOffsetX = filterOptions.offsetX;
        context.shadowOffsetY = filterOptions.offsetY;
        context.shadowColor = filterOptions.color;
        context.shadowBlur = filterOptions.blur;
    }
}

// translate and clip are the special attributtes, they should not be inherited by child nodes
function transformElement(context, options) {
    context.translate(options.translateX || 0, options.translateY || 0);
    delete options.translateX;
    delete options.translateY;

    if(options.rotationAngle) {
        context.translate(options.rotationX || 0, options.rotationY || 0);
        context.rotate(options.rotationAngle * PI / 180);
        context.translate(-(options.rotationX || 0), -(options.rotationY || 0));
        delete options.rotationAngle;
        delete options.rotationX;
        delete options.rotationY;
    }
}

function clipElement(context, options) {
    if(options["clip-path"]) {
        drawElement(clipPaths[parseUrl(options["clip-path"])], context, {});
        context.clip();
        delete options["clip-path"];
    }
}

function hex2rgba(hexColor, alpha) {
    var color = new Color(hexColor);

    return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
}

function createFilter(element) {
    var color,
        opacity,
        filterOptions = {};

    _each(element.childNodes, function(_, node) {
        var attr = node.attributes;

        if(!attr.result) {
            return;
        }

        switch(attr.result.value) {
            case "gaussianBlurResult":
                filterOptions.blur = _number(attr.stdDeviation.value);
                break;
            case "offsetResult":
                filterOptions.offsetX = _number(attr.dx.value);
                filterOptions.offsetY = _number(attr.dy.value);
                break;
            case "floodResult":
                color = attr["flood-color"] ? attr["flood-color"].value : "#000";
                opacity = attr["flood-opacity"] ? attr["flood-opacity"].value : 1;
                filterOptions.color = hex2rgba(color, opacity);
                break;
        }
    });

    filters[element.id] = filterOptions;
}

function asyncEach(array, callback, d) {
    d = d || new Deferred();
    if(array.length === 0) {
        return d.resolve();
    }

    const result = callback(array[0]);
    function next() {
        asyncEach(Array.prototype.slice.call(array, 1), callback, d);
    }
    if(isDeferred(result)) {
        result.then(next);
    } else {
        next();
    }

    return d;
}

function drawCanvasElements(elements, context, parentOptions) {
    return asyncEach(elements, function(element) {
        switch(element.tagName && element.tagName.toLowerCase()) {
            case "g":
                const options = extend({}, parentOptions, getElementOptions(element));

                context.save();

                transformElement(context, options);
                clipElement(context, options);

                function onDone() {
                    context.restore();
                    d.resolve();
                }
                const d = drawCanvasElements(element.childNodes, context, options);
                if(isDeferred(d)) {
                    d.then(onDone);
                } else {
                    onDone();
                }
                return d;

            case "defs":
                clipPaths = {};
                patterns = {};
                filters = {};
                return drawCanvasElements(element.childNodes, context);
            case "clippath":
                createClipPath(element);
                break;
            case "pattern":
                createPattern(element);
                break;
            case "filter":
                createFilter(element);
                break;
            default:
                return drawElement(element, context, parentOptions);
        }
    });
}

function setLineDash(context, options) {
    var matches = options["stroke-dasharray"] && options["stroke-dasharray"].match(/(\d+)/g);

    if(matches && matches.length) {
        matches = iteratorUtils.map(matches, function(item) {
            return _number(item);
        });
        context.setLineDash(matches);
    }
}

function strokeElement(context, options, isText) {
    var stroke = options.stroke;

    if(stroke && stroke !== "none" && options["stroke-width"] !== 0) {
        setLineDash(context, options);
        context.lineJoin = options["stroke-linejoin"];
        context.lineWidth = options["stroke-width"];
        context.globalAlpha = options.strokeOpacity;
        context.strokeStyle = stroke;
        isText ? context.strokeText(options.text, options.x, options.y) : context.stroke();
    }
}

function getPattern(context, fill) {
    var pattern = patterns[parseUrl(fill)],
        options = getElementOptions(pattern),
        patternCanvas = createCanvas(options.width, options.height, 0),
        patternContext = patternCanvas.getContext("2d");

    drawCanvasElements(pattern.childNodes, patternContext, options);

    return context.createPattern(patternCanvas, "repeat");
}

function fillElement(context, options) {
    var fill = options.fill;

    if(fill && fill !== "none") {
        context.fillStyle = fill.search(/url/) === -1 ? fill : getPattern(context, fill);
        context.globalAlpha = options.fillOpacity;
        context.fill();
    }
}

var parseAttributes = function(attributes) {
    var newAttributes = {},
        attr;

    iteratorUtils.each(attributes, function(index, item) {
        attr = item.textContent;
        if(isFinite(attr)) {
            attr = _number(attr);
        }
        newAttributes[item.name.toLowerCase()] = attr; // lowerCase for Edge
    });

    return newAttributes;
};

function drawBackground(context, width, height, backgroundColor, margin) {
    context.fillStyle = backgroundColor || "#ffffff";
    context.fillRect(-margin, -margin, width + margin * 2, height + margin * 2);
}

function getCanvasFromSvg(markup, width, height, backgroundColor, margin) {
    var d = new Deferred(),
        canvas = createCanvas(width, height, margin),
        context = canvas.getContext("2d"),
        svgElem = svgUtils.getSvgElement(markup);

    context.translate(margin, margin);

    domAdapter.getBody().appendChild(canvas); // for rtl mode
    if(svgElem.attributes.direction) {
        canvas.dir = svgElem.attributes.direction.textContent;
    }

    drawBackground(context, width, height, backgroundColor, margin);
    drawCanvasElements(svgElem.childNodes, context, {}).then(() => {
        domAdapter.getBody().removeChild(canvas);
        d.resolve(canvas);
    });

    return d;
}

exports.imageCreator = {
    getImageData: function(markup, options) {
        var mimeType = "image/" + options.format,
            width = options.width,
            height = options.height,
            backgroundColor = options.backgroundColor;
        // Injection for testing T403049
        if(isFunction(options.__parseAttributesFn)) {
            parseAttributes = options.__parseAttributesFn;
        }

        return getCanvasFromSvg(markup, width, height, backgroundColor, options.margin).then(canvas => getStringFromCanvas(canvas, mimeType));
    },

    getData: function(markup, options) {
        var that = this;

        return exports.imageCreator.getImageData(markup, options).then(binaryData => {
            const mimeType = "image/" + options.format;

            return isFunction(window.Blob) && !options.forceProxy ?
                that._getBlob(binaryData, mimeType) :
                that._getBase64(binaryData);
        });
    },

    _getBlob: function(binaryData, mimeType) {
        var i,
            dataArray = new Uint8Array(binaryData.length);

        for(i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
        }

        return new window.Blob([dataArray.buffer], { type: mimeType });
    },

    _getBase64: function(binaryData) {
        return window.btoa(binaryData);
    }
};

exports.getData = function(data, options, callback) {
    exports.imageCreator.getData(data, options).then(callback);
};

exports.testFormats = function(formats) {
    var canvas = createCanvas(100, 100, 0);
    return formats.reduce(function(r, f) {
        var mimeType = ("image/" + f).toLowerCase();

        if(canvas.toDataURL(mimeType).indexOf(mimeType) !== -1) {
            r.supported.push(f);
        } else {
            r.unsupported.push(f);
        }
        return r;
    }, { supported: [], unsupported: [] });
};
