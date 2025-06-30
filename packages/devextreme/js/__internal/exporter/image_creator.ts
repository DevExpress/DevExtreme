import $ from '../core/renderer';
import Color from '../color';
import { isFunction, isPromise, isDefined, isRenderer } from '../core/utils/type';
import svgUtils from '../__internal/core/utils/m_svg';
import { each as _each, map as _map } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import domAdapter from '../core/dom_adapter';
import { contains } from '../core/utils/dom';
import { getWindow } from '../core/utils/window';
const window = getWindow();
import { camelize } from '../core/utils/inflector';
import { Deferred, fromPromise } from '../core/utils/deferred';

const _math = Math;
const PI = _math.PI;
const _min = _math.min;
const _abs = _math.abs;
const _sqrt = _math.sqrt;
const _pow = _math.pow;
const _atan2 = _math.atan2;
const _cos = _math.cos;
const _sin = _math.sin;
const _number = Number;

const IMAGE_QUALITY = 1;
const TEXT_DECORATION_LINE_WIDTH_COEFF = 0.05;
const DEFAULT_FONT_SIZE = '10px';
const DEFAULT_FONT_FAMILY = 'sans-serif';
const DEFAULT_TEXT_COLOR = '#000';

let parseAttributes;

function getStringFromCanvas(canvas, mimeType) {
    const dataURL = canvas.toDataURL(mimeType, IMAGE_QUALITY);
    const imageData = window.atob(dataURL.substring(('data:' + mimeType + ';base64,').length));

    return imageData;
}

function arcTo(x1, y1, x2, y2, radius, largeArcFlag, clockwise, context) {
    const cBx = (x1 + x2) / 2;
    const cBy = (y1 + y2) / 2;
    let aB = _atan2(y1 - y2, x1 - x2);
    const k = largeArcFlag ? 1 : -1;

    aB += 90 * (PI / 180) * (clockwise ? 1 : -1);

    const opSide = _sqrt(_pow(x2 - x1, 2) + _pow(y2 - y1, 2)) / 2;
    const adjSide = _sqrt(_abs(_pow(radius, 2) - _pow(opSide, 2)));

    const centerX = cBx + k * (adjSide * _cos(aB));
    const centerY = cBy + k * (adjSide * _sin(aB));

    const startAngle = _atan2(y1 - centerY, x1 - centerX);
    const endAngle = _atan2(y2 - centerY, x2 - centerX);

    context.arc(centerX, centerY, radius, startAngle, endAngle, !clockwise);
}

function getElementOptions(element, rootAppended) {
    const attr = parseAttributes(element.attributes || {});
    const options = extend({}, attr, {
        text: element.textContent.replace(/\s+/g, ' '),
        textAlign: attr['text-anchor'] === 'middle' ? 'center' : attr['text-anchor']
    });
    const transform = attr.transform;
    let coords;

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

        coords = transform.match(/scale\(-*\d+([.]\d+)*(,*\s*-*\d+([.]\d+)*)*/);
        if(coords) {
            coords = coords[0].match(/-*\d+([.]\d+)*/g);
            options.scaleX = _number(coords[0]);
            if(coords.length > 1) {
                options.scaleY = _number(coords[1]);
            } else {
                options.scaleY = options.scaleX;
            }
        }
    }

    parseStyles(element, options, rootAppended);

    return options;
}

function drawRect(context, options) {
    const x = options.x;
    const y = options.y;
    const width = options.width;
    const height = options.height;
    let cornerRadius = options.rx;

    if(!cornerRadius) {
        context.rect(x, y, width, height);
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

function drawImage(context, options, shared) {
    const d = new Deferred();
    const image = new window.Image();

    image.onload = function() {
        context.save();

        context.globalAlpha = options.globalAlpha;
        transformElement(context, options);
        clipElement(context, options, shared);

        context.drawImage(image, options.x || 0, options.y || 0, options.width, options.height);

        context.restore();
        d.resolve();
    };

    image.onerror = function() {
        d.resolve();
    };

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = options['href'] || options['xlink:href'];

    return d;
}

function drawPath(context, dAttr) {
    const dArray = dAttr.replace(/,/g, ' ').split(/([A-Z])/i).filter(item => item.trim() !== '');
    let i = 0;
    let params;
    let prevParams;
    let prevParamsLen;

    do {
        params = (dArray[i + 1] || '').trim().split(' ');
        switch(dArray[i]) {
            case 'M':
                context.moveTo(_number(params[0]), _number(params[1]));
                i += 2;
                break;
            case 'L':
                for(let j = 0; j < params.length / 2; j++) {
                    context.lineTo(_number(params[j * 2]), _number(params[j * 2 + 1]));
                }
                i += 2;
                break;
            case 'C':
                context.bezierCurveTo(_number(params[0]), _number(params[1]), _number(params[2]), _number(params[3]), _number(params[4]), _number(params[5]));
                i += 2;
                break;
            case 'a':
                prevParams = dArray[i - 1].trim().split(' ');
                prevParamsLen = prevParams.length - 1;
                arcTo(_number(prevParams[prevParamsLen - 1]), _number(prevParams[prevParamsLen]), _number(prevParams[prevParamsLen - 1]) + _number(params[5]), _number(prevParams[prevParamsLen]) + _number(params[6]), _number(params[0]), _number(params[3]), _number(params[4]), context);
                i += 2;
                break;
            case 'A':
                prevParams = dArray[i - 1].trim().split(' ');
                prevParamsLen = prevParams.length - 1;
                arcTo(_number(prevParams[prevParamsLen - 1]), _number(prevParams[prevParamsLen]), _number(params[5]), _number(params[6]), _number(params[0]), _number(params[3]), _number(params[4]), context);
                i += 2;
                break;
            case 'Z':
                context.closePath();
                i += 1;
                break;
            default:
                i++;
        }
    } while(i < dArray.length);
}

function parseStyles(element, options, rootAppended) {
    let style = element.style || {};
    let field;

    for(field in style) {
        if(style[field] !== '') {
            options[camelize(field)] = style[field];
        }
    }
    if(rootAppended && domAdapter.isElementNode(element)) {
        style = window.getComputedStyle(element);
        ['fill', 'stroke', 'stroke-width', 'font-family', 'font-size', 'font-style', 'font-weight'].forEach(function(prop) {
            if(prop in style && style[prop] !== '') {
                options[camelize(prop)] = style[prop];
            }
        });

        ['opacity', 'fill-opacity', 'stroke-opacity'].forEach(function(prop) {
            if(prop in style && style[prop] !== '' && style[prop] !== '1') {
                options[prop] = _number(style[prop]);
            }
        });
    }

    options.textDecoration = options.textDecoration || options.textDecorationLine;
    options.globalAlpha = isDefined(options.opacity) ? options.opacity : options.globalAlpha;
}

function parseUrl(urlString) {
    const matches = urlString && urlString.match(/url\(.*#(.*?)["']?\)/i);
    return matches && matches[1];
}

function setFontStyle(context, options) {
    const fontParams = [];

    options.fontSize = options.fontSize || DEFAULT_FONT_SIZE;
    options.fontFamily = options.fontFamily || DEFAULT_FONT_FAMILY;
    options.fill = options.fill || DEFAULT_TEXT_COLOR;

    options.fontStyle && fontParams.push(options.fontStyle);
    options.fontWeight && fontParams.push(options.fontWeight);
    fontParams.push(options.fontSize);
    fontParams.push(options.fontFamily);

    context.font = fontParams.join(' ');
    context.textAlign = options.textAlign;
    context.fillStyle = options.fill;
    context.globalAlpha = options.globalAlpha;
}

function drawText(context, options, shared) {
    setFontStyle(context, options);
    applyFilter(context, options, shared);
    options.text && context.fillText(options.text, options.x || 0, options.y || 0);
    strokeElement(context, options, true);
    drawTextDecoration(context, options, shared);
}

function drawTextDecoration(context, options, shared) {
    if(!options.textDecoration || options.textDecoration === 'none') {
        return;
    }

    const x = options.x;
    const textWidth = context.measureText(options.text).width;
    const textHeight = parseInt(options.fontSize, 10);
    const lineHeight = textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF < 1 ? 1 : textHeight * TEXT_DECORATION_LINE_WIDTH_COEFF;
    let y = options.y;

    switch(options.textDecoration) {
        case 'line-through':
            y -= textHeight / 3 + lineHeight / 2;
            break;
        case 'overline':
            y -= textHeight - lineHeight;
            break;
        case 'underline':
            y += lineHeight;
            break;
    }

    context.rect(x, y, textWidth, lineHeight);
    fillElement(context, options, shared);
    strokeElement(context, options);
}

function aggregateOpacity(options) {
    options.strokeOpacity = options['stroke-opacity'] !== undefined ? options['stroke-opacity'] : 1;
    options.fillOpacity = options['fill-opacity'] !== undefined ? options['fill-opacity'] : 1;

    if(options.opacity !== undefined) {
        options.strokeOpacity *= options.opacity;
        options.fillOpacity *= options.opacity;
    }
}

function hasTspan(element) {
    const nodes = element.childNodes;
    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].tagName === 'tspan') {
            return true;
        }
    }
    return false;
}

function drawTextElement(childNodes, context, options, shared) {
    const lines = [];
    let line;
    let offset = 0;

    for(let i = 0; i < childNodes.length; i++) {
        const element = childNodes[i];

        if(element.tagName === undefined) {
            drawElement(element, context, options, shared);
        } else if(element.tagName === 'tspan' || element.tagName === 'text') {
            const elementOptions = getElementOptions(element, shared.rootAppended);
            const mergedOptions = extend({}, options, elementOptions);

            if(element.tagName === 'tspan' && hasTspan(element)) {
                drawTextElement(element.childNodes, context, mergedOptions, shared);
                continue;
            }

            mergedOptions.textAlign = 'start';
            if(!line || elementOptions.x !== undefined) {
                line = {
                    elements: [],
                    options: [],
                    widths: [],
                    offsets: []
                };
                lines.push(line);
            }

            if(elementOptions.y !== undefined) {
                offset = 0;
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
        const commonWidth = line.widths.reduce(function(commonWidth, width) {
            return commonWidth + width;
        }, 0);
        let xDiff = 0;
        let currentOffset = 0;

        if(options.textAlign === 'center') {
            xDiff = commonWidth / 2;
        }

        if(options.textAlign === 'end') {
            xDiff = commonWidth;
        }

        line.options.forEach(function(o, index) {
            const width = line.widths[index];
            o.x = o.x - xDiff + currentOffset;
            o.y += line.offsets[index];
            currentOffset += width;
        });

        line.elements.forEach(function(element, index) {
            drawTextElement(element.childNodes, context, line.options[index], shared);
        });

    });
}

function drawElement(element, context, parentOptions, shared) {
    const tagName = element.tagName;
    const isText = tagName === 'text' || tagName === 'tspan' || tagName === undefined;
    const isImage = tagName === 'image';
    const isComment = element.nodeType === 8;
    const options = extend({}, parentOptions, getElementOptions(element, shared.rootAppended));

    if(options.visibility === 'hidden' || options[svgUtils.HIDDEN_FOR_EXPORT] || isComment) {
        return;
    }

    context.save();
    !isImage && transformElement(context, options);
    clipElement(context, options, shared);
    aggregateOpacity(options);

    let promise;

    context.beginPath();
    switch(element.tagName) {
        case undefined:
            drawText(context, options, shared);
            break;
        case 'text':
        case 'tspan':
            drawTextElement(element.childNodes, context, options, shared);
            break;
        case 'image':
            promise = drawImage(context, options, shared);
            break;
        case 'path':
            drawPath(context, options.d);
            break;
        case 'rect':
            drawRect(context, options);
            context.closePath(); // for valid clipping
            break;
        case 'circle':
            context.arc(options.cx, options.cy, options.r, 0, 2 * PI, 1);
            break;
    }

    if(!isText) {
        applyFilter(context, options, shared);
        if(!isImage) {
            promise = fillElement(context, options, shared);
        }
        strokeElement(context, options);
    }

    applyGradient(context, options, shared, element, 'linear');
    applyGradient(context, options, shared, element, 'radial');

    context.restore();

    return promise;
}

function applyGradient(context, options, { linearGradients, radialGradients }, element, type) {
    const gradients = type === 'linear' ? linearGradients : radialGradients;
    if(Object.keys(gradients).length === 0) {
        return;
    }
    const id = parseUrl(options.fill);
    if(id && gradients[id]) {
        const box = element.getBBox();
        const horizontalCenter = box.x + box.width / 2;
        const verticalCenter = box.y + box.height / 2;
        const maxRadius = Math.max(box.height / 2, box.width / 2);
        const gradient = type === 'linear' ?
            context.createLinearGradient(box.x, 0, box.x + box.width, 0) :
            context.createRadialGradient(horizontalCenter, verticalCenter, 0, horizontalCenter, verticalCenter, maxRadius);

        gradients[id].colors.forEach(opt => {
            const offset = parseInt(opt.offset.replace(/%/, ''));
            gradient.addColorStop(offset / 100, opt.stopColor);
        });

        if(type === 'linear') {
            const angle = (gradients[id].transform?.replace(/\D/g, '') || 0) * Math.PI / 180;
            context.translate(horizontalCenter, verticalCenter);
            context.rotate(angle);
            context.translate(-horizontalCenter, -verticalCenter);
        }
        context.globalAlpha = options.opacity;
        context.fillStyle = gradient;
        context.fill();
    }
}

function applyFilter(context, options, shared) {
    let filterOptions;
    const id = parseUrl(options.filter);

    if(id) {
        filterOptions = shared.filters[id];

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
    options.translateX = undefined;
    options.translateY = undefined;

    if(options.rotationAngle) {
        context.translate(options.rotationX || 0, options.rotationY || 0);
        context.rotate(options.rotationAngle * PI / 180);
        context.translate(-(options.rotationX || 0), -(options.rotationY || 0));
        options.rotationAngle = undefined;
        options.rotationX = undefined;
        options.rotationY = undefined;
    }

    if(isFinite(options.scaleX)) {
        context.scale(options.scaleX, options.scaleY);
        options.scaleX = undefined;
        options.scaleY = undefined;
    }
}

function clipElement(context, options, shared) {
    if(options['clip-path']) {
        drawElement(shared.clipPaths[parseUrl(options['clip-path'])], context, {}, shared);
        context.clip();
        options['clip-path'] = undefined;
    }
}

function hex2rgba(hexColor, alpha) {
    const color = new Color(hexColor);

    return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
}

function createGradient(element) {
    const options = { colors: [], transform: element.attributes.gradientTransform?.textContent };

    _each(element.childNodes, (_, { attributes }) => {
        options.colors.push({
            offset: attributes.offset.value,
            stopColor: attributes['stop-color'].value
        });
    });
    return options;
}

function createFilter(element) {
    let color;
    let opacity;
    const filterOptions = {};

    _each(element.childNodes, function(_, node) {
        const attr = node.attributes;

        if(!attr.result) {
            return;
        }

        switch(attr.result.value) {
            case 'gaussianBlurResult':
                filterOptions.blur = _number(attr.stdDeviation.value);
                break;
            case 'offsetResult':
                filterOptions.offsetX = _number(attr.dx.value);
                filterOptions.offsetY = _number(attr.dy.value);
                break;
            case 'floodResult':
                color = attr['flood-color'] ? attr['flood-color'].value : '#000';
                opacity = attr['flood-opacity'] ? attr['flood-opacity'].value : 1;
                filterOptions.color = hex2rgba(color, opacity);
                break;
        }
    });

    return filterOptions;
}

function asyncEach(array, callback, d = new Deferred()) {
    let i = 0;
    for(; i < array.length; i++) {
        const result = callback(array[i]);
        if(isPromise(result)) {
            result.then(() => {
                asyncEach(Array.prototype.slice.call(array, i + 1), callback, d);
            });
            break;
        }
    }

    if(i === array.length) {
        d.resolve();
    }

    return d;
}

///#DEBUG
export { asyncEach };
///#ENDDEBUG

function drawCanvasElements(elements, context, parentOptions, shared) {
    return asyncEach(elements, function(element) {
        switch(element.tagName && element.tagName.toLowerCase()) {
            case 'g':
            case 'svg': {
                const options = extend({}, parentOptions, getElementOptions(element, shared.rootAppended));

                context.save();

                transformElement(context, options);
                clipElement(context, options, shared);

                const onDone = () => {
                    context.restore();
                };
                const promise = drawCanvasElements(element.childNodes, context, options, shared);

                if(isPromise(promise)) {
                    promise.then(onDone);
                } else {
                    onDone();
                }
                return promise;
            }
            case 'defs':
                return drawCanvasElements(element.childNodes, context, {}, shared);
            case 'clippath':
                shared.clipPaths[element.attributes.id.textContent] = element.childNodes[0];
                break;
            case 'pattern':
                shared.patterns[element.attributes.id.textContent] = element;
                break;
            case 'filter':
                shared.filters[element.id] = createFilter(element);
                break;
            case 'lineargradient':
                shared.linearGradients[element.attributes.id.textContent] = createGradient(element);
                break;
            case 'radialgradient':
                shared.radialGradients[element.attributes.id.textContent] = createGradient(element);
                break;
            default:
                return drawElement(element, context, parentOptions, shared);
        }
    });
}

function setLineDash(context, options) {
    let matches = options['stroke-dasharray'] && options['stroke-dasharray'].match(/(\d+)/g);

    if(matches && matches.length) {
        matches = _map(matches, function(item) {
            return _number(item);
        });
        context.setLineDash(matches);
    }
}

function strokeElement(context, options, isText) {
    const stroke = options.stroke;

    if(stroke && stroke !== 'none' && options['stroke-width'] !== 0) {
        setLineDash(context, options);
        context.lineJoin = options['stroke-linejoin'];
        context.lineWidth = options['stroke-width'];
        context.globalAlpha = options.strokeOpacity;
        context.strokeStyle = stroke;
        isText ? context.strokeText(options.text, options.x, options.y) : context.stroke();
        context.globalAlpha = 1;
    }
}

function getPattern(context, pattern, shared, parentOptions) {
    const options = getElementOptions(pattern, shared.rootAppended);
    const patternCanvas = imageCreator._createCanvas(options.width, options.height, 0);
    const patternContext = patternCanvas.getContext('2d');

    const promise = drawCanvasElements(pattern.childNodes, patternContext, options, shared);
    const onDone = () => {
        context.fillStyle = context.createPattern(patternCanvas, 'repeat');
        context.globalAlpha = parentOptions.fillOpacity;
        context.fill();
        context.globalAlpha = 1;
    };

    if(isPromise(promise)) {
        promise.then(onDone);
    } else {
        onDone();
    }

    return promise;
}

function fillElement(context, options, shared) {
    const fill = options.fill;
    let promise;

    if(fill && fill !== 'none') {
        if(fill.search(/url/) === -1) {
            context.fillStyle = fill;

            context.globalAlpha = options.fillOpacity;
            context.fill();
            context.globalAlpha = 1;
        } else {
            const pattern = shared.patterns[parseUrl(fill)];
            if(!pattern) {
                return;
            }

            promise = getPattern(context, pattern, shared, options);
        }
    }

    return promise;
}

parseAttributes = function(attributes) {
    const newAttributes = {};
    let attr;

    _each(attributes, function(index, item) {
        attr = item.textContent;
        if(isFinite(attr)) {
            attr = _number(attr);
        }
        newAttributes[item.name.toLowerCase()] = attr; // lowerCase for Edge
    });

    return newAttributes;
};

function drawBackground(context, width, height, backgroundColor, margin) {
    context.fillStyle = backgroundColor || '#ffffff';
    context.fillRect(-margin, -margin, width + margin * 2, height + margin * 2);
}

function createInvisibleDiv() {
    const invisibleDiv = domAdapter.createElement('div');
    invisibleDiv.style.left = '-9999px';
    invisibleDiv.style.position = 'absolute';
    return invisibleDiv;
}

function convertSvgToCanvas(svg, canvas, rootAppended) {
    return drawCanvasElements(svg.childNodes, canvas.getContext('2d'), {}, {
        clipPaths: {},
        patterns: {},
        filters: {},
        linearGradients: {},
        radialGradients: {},
        rootAppended
    });
}

function getCanvasFromSvg(markup, { width, height, backgroundColor, margin, svgToCanvas = convertSvgToCanvas }) {
    const scaledScreenInfo = calcScaledInfo(width, height);
    const canvas = imageCreator._createCanvas(scaledScreenInfo.width, scaledScreenInfo.height, margin);
    const context = canvas.getContext('2d');
    context.setTransform(scaledScreenInfo.pixelRatio, 0, 0, scaledScreenInfo.pixelRatio, 0, 0);
    const svgElem = svgUtils.getSvgElement(markup);
    let invisibleDiv;
    const markupIsDomElement = domAdapter.isElementNode(markup) || isRenderer(markup);
    context.translate(margin, margin);

    domAdapter.getBody().appendChild(canvas);
    if(!markupIsDomElement) {
        invisibleDiv = createInvisibleDiv();
        invisibleDiv.appendChild(svgElem);
        domAdapter.getBody().appendChild(invisibleDiv);
    }
    // for rtl mode
    if(svgElem.attributes.direction) {
        canvas.dir = svgElem.attributes.direction.textContent;
    }
    drawBackground(context, width, height, backgroundColor, margin);

    return fromPromise(svgToCanvas(svgElem, canvas, markupIsDomElement && contains(domAdapter.getBody(), $(markup).get(0))))
        .then(() => canvas)
        .always(() => {
            invisibleDiv && domAdapter.getBody().removeChild(invisibleDiv);
            domAdapter.getBody().removeChild(canvas);
        });
}

export const imageCreator = {
    getImageData: function(markup, options) {
        const mimeType = 'image/' + options.format;
        // Injection for testing T403049
        if(isFunction(options.__parseAttributesFn)) {
            parseAttributes = options.__parseAttributesFn;
        }

        return getCanvasFromSvg(markup, options).then(canvas => getStringFromCanvas(canvas, mimeType));
    },

    getData: function(markup, options) {
        const that = this;

        return imageCreator.getImageData(markup, options).then(binaryData => {
            const mimeType = 'image/' + options.format;
            const data = isFunction(window.Blob) && !options.useBase64 ?
                that._getBlob(binaryData, mimeType) :
                that._getBase64(binaryData);
            return data;
        });
    },

    _getBlob: function(binaryData, mimeType) {
        let i;
        const dataArray = new Uint8Array(binaryData.length);

        for(i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
        }

        return new window.Blob([dataArray.buffer], { type: mimeType });
    },

    _getBase64: function(binaryData) {
        return window.btoa(binaryData);
    },

    _createCanvas(width, height, margin) {
        const canvas = $('<canvas>')[0];

        canvas.width = width + margin * 2;
        canvas.height = height + margin * 2;
        canvas.hidden = true;

        return canvas;
    }
};

export function getData(data, options) {
    return imageCreator.getData(data, options);
}

export function testFormats(formats) {
    const canvas = imageCreator._createCanvas(100, 100, 0);
    return formats.reduce(function(r, f) {
        const mimeType = ('image/' + f).toLowerCase();

        if(canvas.toDataURL(mimeType).indexOf(mimeType) !== -1) {
            r.supported.push(f);
        } else {
            r.unsupported.push(f);
        }
        return r;
    }, { supported: [], unsupported: [] });
}

export function calcScaledInfo(width, height) {
    const pixelRatio = window.devicePixelRatio || 1;

    return {
        pixelRatio,
        width: width * pixelRatio,
        height: height * pixelRatio
    };
}
