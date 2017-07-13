"use strict";

var $ = require("../core/renderer"),
    Color = require("../color"),
    isFunction = require("../core/utils/type").isFunction,
    iteratorUtils = require("../core/utils/iterator"),
    extend = require("../core/utils/extend").extend,
    camelize = require("../core/utils/inflector").camelize,
    when = require("../integration/jquery/deferred").when,

    _math = Math,
    PI = _math.PI,
    _min = _math.min,
    _abs = _math.abs,
    _sqrt = _math.sqrt,
    _pow = _math.pow,
    _atan2 = _math.atan2,
    _cos = _math.cos,
    _sin = _math.sin,

    _each = $.each,
    _extend = extend,
    _number = Number,

    IMAGE_QUALITY = 1,
    TEXT_DECORATION_LINE_WIDTH_COEFF = 0.05,
    DEFAULT_MARGIN_SIZE = {
        x: 30,
        y: 20
    },
    DEFAULT_FONT_SIZE = "10px",
    DEFAULT_FONT_FAMILY = "sans-serif",
    DEFAULT_TEXT_COLOR = "#000",

    currentTspanY,
    clipPaths,
    textOffset,
    imageDeferreds,
    patterns,
    filters;

function createCanvas(width, height, withoutMargins) {
    var canvas = $("<canvas>")[0];

    canvas.width = width + (withoutMargins ? 0 : DEFAULT_MARGIN_SIZE.x * 2);
    canvas.height = height + (withoutMargins ? 0 : DEFAULT_MARGIN_SIZE.y * 2);

    return canvas;
}

function getStringFromCanvas(canvas, mimeType) {
    var dataURL = canvas.toDataURL(mimeType, IMAGE_QUALITY),
        imageData = atob(dataURL.substring(("data:" + mimeType + ";base64,").length));

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

function getElementOptions(element, isText) {
    var attr = parseAttributes(element.attributes || {}),
        style = element.style || {},
        options = _extend({}, attr, {
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

    parseStyles(style, options);
    isText && aggregateTextPosition(options);

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
    var d = $.Deferred(),
        image = new Image();

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
        // Warning TODO
        d.resolve();
    };

    imageDeferreds.push(d);

    image.setAttribute("crossOrigin", "anonymous");
    image.src = options["xlink:href"];
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

function parseStyles(style, options) {
    _each(style, function(_, field) {
        if(style[field] !== "") {
            options[camelize(field)] = style[field];
        }
    });

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
    options.text && context.fillText(options.text, options.x, options.y);
    strokeElement(context, options, true);
    drawTextDecoration(context, options);
    textOffset = options.x + context.measureText(options.text).width;
}

function drawTextDecoration(context, options) {
    if(!options.textDecoration || options.textDecoration === "none") {
        return;
    }

    var x = options.x,
        align = options.textAlign,
        textWidth = context.measureText(options.text).width,
        textHeight = parseInt(options.fontSize, 10),
        lineHeight = textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF < 1 ? 1 : textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF,
        y = options.y;

    if(align === "center") {
        x -= textWidth / 2;
    } else if(align === "end") {
        x -= textWidth;
    }

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

function aggregateTextPosition(options) {
    if(options.dy) {
        options.y = currentTspanY + _number(options.dy);
    }

    if(textOffset && options.x === undefined) {
        options.x = textOffset;
    }

    if(options.y !== undefined) {
        currentTspanY = options.y;
    } else {
        options.y = currentTspanY;
    }
}

function drawElement(element, context, parentOptions) {
    var tagName = element.tagName,
        isText = tagName === "text" || tagName === "tspan" || tagName === undefined,
        isImage = tagName === "image",
        options = _extend({}, parentOptions, getElementOptions(element, isText));

    if(options.visibility === "hidden") {
        return;
    }

    context.save();
    !isImage && transformElement(context, options);
    clipElement(context, options);
    aggregateOpacity(options);

    context.beginPath();
    switch(element.tagName) {
        case undefined:
            drawText(context, options);
            break;
        case "text":
        case "tspan":
            textOffset = 0;
            drawCanvasElements(element.childNodes, context, options);
            break;
        case "image":
            drawImage(context, options);
            break;
        case "path":
            drawPath(context, options.d);
            break;
        case "rect":
            drawRect(context, options);
            context.closePath(); //for valid clipping
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

//translate and clip are the special attributtes, they should not be inherited by child nodes
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
                if(attr.stdDeviation) { //T511738, IE10
                    filterOptions.blur = _number(attr.stdDeviation.value);
                }
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

function drawCanvasElements(elements, context, parentOptions) {
    var options;
    _each(elements, function(_, element) {
        switch(element.tagName && element.tagName.toLowerCase()) {
            case "g":
                options = _extend({}, parentOptions, getElementOptions(element));

                context.save();

                transformElement(context, options);
                clipElement(context, options);
                drawCanvasElements(element.childNodes, context, options);

                context.restore();

                break;
            case "defs":
                clipPaths = {};
                patterns = {};
                filters = {};

                drawCanvasElements(element.childNodes, context);
                break;
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
                drawElement(element, context, parentOptions);
        }
    });
}

function setLineDash(context, options) {
    var matches = options["stroke-dasharray"] && options["stroke-dasharray"].match(/(\d+)/g);

    if(matches && matches.length && context.setLineDash) { //IE10 does not have setLineDash
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
        patternCanvas = createCanvas(options.width, options.height, true),
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

    $.each(attributes, function(index, item) {
        attr = item.textContent;
        if(isFinite(attr)) {
            attr = _number(attr);
        }
        newAttributes[item.name.toLowerCase()] = attr; //lowerCase for Edge
    });

    return newAttributes;
};

function drawBackground(context, width, height, backgroundColor) {
    context.fillStyle = backgroundColor || "#ffffff";
    context.fillRect(-DEFAULT_MARGIN_SIZE.x, -DEFAULT_MARGIN_SIZE.y, width + DEFAULT_MARGIN_SIZE.x * 2, height + DEFAULT_MARGIN_SIZE.y * 2);
}

function getCanvasFromSvg(markup, width, height, backgroundColor) {
    var canvas = createCanvas(width, height),
        context = canvas.getContext("2d"),
        parser = new DOMParser(),
        elem = parser.parseFromString(markup, "image/svg+xml"),
        svgElem = elem.childNodes[0];

    context.translate(DEFAULT_MARGIN_SIZE.x, DEFAULT_MARGIN_SIZE.y);

    imageDeferreds = [];
    document.body.appendChild(canvas); // for rtl mode
    if(svgElem.attributes.direction) {
        canvas.dir = svgElem.attributes.direction.textContent;
    }

    drawBackground(context, width, height, backgroundColor);
    drawCanvasElements(svgElem.childNodes, context, {});

    document.body.removeChild(canvas);

    return canvas;
}

function resolveString(string, canvas, mimeType) {
    when.apply($, imageDeferreds).done(function() {
        var resultString = getStringFromCanvas(canvas, mimeType);
        string.resolve(resultString);
    });
}

exports.imageCreator = {
    getImageData: function(markup, options) {
        var mimeType = "image/" + options.format,
            string = $.Deferred(),
            width = options.width,
            height = options.height,
            backgroundColor = options.backgroundColor;
        // Injection for testing T403049
        if(isFunction(options.__parseAttributesFn)) {
            parseAttributes = options.__parseAttributesFn;
        }

        resolveString(string, getCanvasFromSvg(markup, width, height, backgroundColor), mimeType);

        return string;
    },

    getData: function(markup, options) {
        var that = this,
            imageData = exports.imageCreator.getImageData(markup, options),
            mimeType = "image/" + options.format,
            data = $.Deferred();

        when(imageData).done(function(binaryData) {
            imageData = isFunction(window.Blob) ?
               that._getBlob(binaryData, mimeType) :
               that._getBase64(binaryData);

            data.resolve(imageData);
        });

        return data;
    },

    _getBlob: function(binaryData, mimeType) {
        var i,
            dataArray = new Uint8Array(binaryData.length);

        for(i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
        }

        return new Blob([dataArray.buffer], { type: mimeType });
    },

    _getBase64: function(binaryData) {
        return window.btoa(binaryData);
    }
};

exports.getData = function(data, options, callback) {
    exports.imageCreator.getData(data, options).done(callback);
};
