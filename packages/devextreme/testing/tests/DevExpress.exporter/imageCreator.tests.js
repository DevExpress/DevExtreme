import $ from 'jquery';
import exporter from 'exporter';
const imageCreator = exporter.image.creator;
import typeUtils from 'core/utils/type';
const testingMarkupStart = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'>';
const testingMarkupEnd = '</svg>';
import svgUtils from '__internal/core/utils/m_svg';
import { Deferred } from 'core/utils/deferred';
import { getWindow } from 'core/utils/window';

const window = getWindow();

function createSvgElement(markup) {
    return new window.DOMParser().parseFromString(markup, 'image/svg+xml').childNodes[0];
}

const pathNameByUrl = (url) => {
    const a = document.createElement('a');
    a.href = url;

    return a.pathname.charAt(0) === '/'
        ? a.pathname
        : '/' + a.pathname;
};

function setupCanvasStub(drawnElements, paths) {
    const prototype = window.CanvasRenderingContext2D.prototype;
    const canvasPrototype = window.HTMLCanvasElement.prototype;

    sinon.spy(exporter.image.creator, '_createCanvas');

    // image
    sinon.stub(prototype, 'drawImage').callsFake(function(img, x, y, width, height) {
        drawnElements.push({
            type: 'image',
            args: {
                node: img.nodeName,
                src: pathNameByUrl(img.src),
                x: x,
                y: y,
                width: width,
                height: height
            }
        });
    });

    // image
    sinon.spy(canvasPrototype, 'toDataURL');

    // stroke, fill
    sinon.stub(prototype, 'stroke').callsFake(function() {
        drawnElements.push({
            type: 'stroke',
            style: {
                strokeStyle: this.strokeStyle,
                strokeLinejoin: this.lineJoin,
                lineWidth: this.lineWidth,
                globalAlpha: this.globalAlpha
            }
        });
    });
    sinon.stub(prototype, 'fill').callsFake(function() {
        const style = {
            fillStyle: this.fillStyle,
            globalAlpha: this.globalAlpha
        };

        if(this.shadowBlur) {
            style.shadow = {
                offsetX: this.shadowOffsetX,
                offsetY: this.shadowOffsetY,
                color: this.shadowColor,
                blur: this.shadowBlur
            };
        }

        drawnElements.push({
            type: 'fill',
            style: style
        });
    });
    sinon.stub(prototype, 'fillRect').callsFake(function(x, y, w, h) {
        drawnElements.push({
            type: 'fillRect',
            args: {
                x: x,
                y: y,
                width: w,
                height: h
            },
            style: {
                fillStyle: this.fillStyle,
                globalAlpha: this.globalAlpha
            }
        });
    });

    // paths, rect, circle
    sinon.stub(prototype, 'beginPath').callsFake(function() {
        paths.push([]);
    });
    sinon.stub(prototype, 'moveTo').callsFake(function(x, y) {
        paths[paths.length - 1].push({
            action: 'M',
            x: x,
            y: y
        });
    });
    sinon.stub(prototype, 'lineTo').callsFake(function(x, y) {
        paths[paths.length - 1].push({
            action: 'L',
            x: x,
            y: y
        });
    });
    sinon.stub(prototype, 'bezierCurveTo').callsFake(function(x1, y1, x2, y2, x, y) {
        paths[paths.length - 1].push({
            action: 'C',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            x: x,
            y: y
        });
    });
    sinon.stub(prototype, 'arc').callsFake(function(x, y, r, sa, ea, c) {
        drawnElements.push({
            type: 'arc',
            args: {
                x: x,
                y: y,
                radius: r,
                startAngle: sa,
                endAngle: ea,
                anticlockwise: c
            },
            style: {}
        });

        if(paths.length) {
            paths[paths.length - 1].push({
                action: 'A',
                x: x,
                y: y,
                r: r,
                sa: sa,
                ea: ea,
                c: c
            });
        }
    });
    sinon.stub(prototype, 'closePath').callsFake(function() {
        paths[paths.length - 1].push({
            action: 'Z'
        });
    });
    sinon.stub(prototype, 'rect').callsFake(function(x, y, width, height) {
        drawnElements.push({
            type: 'rect',
            args: {
                x: x,
                y: y,
                width: width,
                height: height
            },
            style: {}
        });
    });
    sinon.stub(prototype, 'arcTo').callsFake(function(x1, y1, x2, y2, radius) {
        drawnElements.push({
            action: 'arcTo',
            args: {
                x1: x1, y1: y1,
                x2: x2,
                y2: y2,
                radius: radius
            }
        });
    });

    sinon.stub(prototype, 'createLinearGradient').callsFake(function(x0, y0, x1, y1) {
        const addColorStop = sinon.spy();
        drawnElements.push({
            type: 'linearGradient',
            args: {
                x0,
                y0,
                x1,
                y1
            },
            addColorStop
        });
        return {
            addColorStop,
            toString() {
                return '#aaa';
            }
        };
    });

    sinon.stub(prototype, 'createRadialGradient').callsFake(function(x0, y0, r0, x1, y1, r1) {
        const addColorStop = sinon.spy();
        drawnElements.push({
            type: 'radialGradient',
            args: {
                x0,
                y0,
                r0,
                x1,
                y1,
                r1
            },
            addColorStop
        });
        return {
            addColorStop,
            toString() {
                return '#aaa';
            }
        };
    });

    function getFontParam(fontString, paramType) {
        const patterns = {
            weight: '(bold|bolder)',
            style: '(italic|oblique)',
            size: '(\\d+[px|em|pt]+)'
        };
        const matches = patterns[paramType] &&
                fontString.match(new RegExp(patterns[paramType], 'i'));

        return matches && matches[0];
    }
    prototype._font = '';

    Object.defineProperty(prototype, 'font', {
        get: function() {
            return prototype._font;
        },
        set: function(v) {
            prototype._font = v;
        }
    });

    sinon.stub(prototype, 'measureText').returns({
        width: 100,
        height: 50
    });

    // texts
    sinon.stub(prototype, 'fillText').callsFake(function() {
        const tempFont = this.font.replace(/px\s/g, 'px__');
        const fontParts = tempFont.split('__');
        const style = {
            weight: getFontParam(fontParts[0], 'weight'),
            style: getFontParam(fontParts[0], 'style'),
            size: getFontParam(fontParts[0], 'size'),
            font: fontParts[1].replace(/,\s+/g, ','),
            fillStyle: this.fillStyle,
            textAlign: this.textAlign,
            globalAlpha: this.globalAlpha
        };

        if(this.shadowBlur) {
            style.shadow = {
                offsetX: this.shadowOffsetX,
                offsetY: this.shadowOffsetY,
                color: this.shadowColor,
                blur: this.shadowBlur
            };
        }

        drawnElements.push({
            type: 'text',
            args: arguments,
            style: style
        });
    });

    sinon.stub(prototype, 'strokeText').callsFake(function() {
        const tempFont = this.font.replace(/px\s/g, 'px__');
        const fontParts = tempFont.split('__');
        const style = {
            weight: getFontParam(fontParts[0], 'weight'),
            style: getFontParam(fontParts[0], 'style'),
            size: getFontParam(fontParts[0], 'size'),
            font: fontParts[1].replace(/,\s+/g, ','),
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth,
            textAlign: this.textAlign,
            globalAlpha: this.globalAlpha
        };

        if(this.shadowBlur) {
            style.shadow = {
                offsetX: this.shadowOffsetX,
                offsetY: this.shadowOffsetY,
                color: this.shadowColor,
                blur: this.shadowBlur
            };
        }

        drawnElements.push({
            type: 'strokeText',
            args: arguments,
            style: style
        });
    });

    sinon.stub(prototype, 'setTransform');

    // clips & patterns
    sinon.stub(prototype, 'clip');
    sinon.stub(prototype, 'save');
    sinon.stub(prototype, 'restore');
    sinon.stub(prototype, 'createPattern').callsFake(function() {
        drawnElements.push({
            type: 'pattern'
        });
    });

    // translation
    sinon.stub(prototype, 'translate');
    sinon.stub(prototype, 'rotate');
    sinon.stub(prototype, 'scale');

    // line dash
    sinon.stub(prototype, 'setLineDash');
}

function teardownCanvasStub() {
    const prototype = window.CanvasRenderingContext2D.prototype;
    const canvasPrototype = window.HTMLCanvasElement.prototype;

    exporter.image.creator._createCanvas.restore();

    // image
    prototype.drawImage.restore();
    canvasPrototype.toDataURL.restore();

    // stroke, fill
    prototype.stroke.restore();
    prototype.fill.restore();
    prototype.fillRect.restore();

    // paths, rect, arcTo, circle
    prototype.beginPath.restore();
    prototype.moveTo.restore();
    prototype.lineTo.restore();
    prototype.bezierCurveTo.restore();
    prototype.arc.restore();
    prototype.closePath.restore();
    prototype.rect.restore();
    prototype.arcTo.restore();

    // texts
    prototype.fillText.restore();
    prototype.strokeText.restore();

    // clips & patterns
    prototype.clip.restore();
    prototype.save.restore();
    prototype.restore.restore();
    prototype.createPattern.restore();

    // translation
    prototype.translate.restore();
    prototype.rotate.restore();
    prototype.scale.restore();

    // line dash
    prototype.setLineDash.restore();

    prototype.measureText.restore();

    // createLinearGradient
    prototype.createLinearGradient.restore();

    // createRadialGradient
    prototype.createRadialGradient.restore();

    prototype.setTransform.restore();
}

function getData(markup, isFullMode) {
    return imageCreator.getData(markup, { width: 500, height: 250, format: 'png', margin: 10 }, isFullMode !== undefined ? isFullMode : true);
}

QUnit.module('Svg to image to canvas', {
    beforeEach: function() {
        this.drawnElements = [];
        this.paths = [];
        setupCanvasStub(this.drawnElements, this.paths);
    },
    afterEach: function() {
        teardownCanvasStub();
    }
});

QUnit.test('Canvas size', function(assert) {
    const done = assert.async();
    const imageBlob = exporter.image.getData(testingMarkupStart + testingMarkupEnd, {
        format: 'png', width: 500,
        height: 250, margin: 10
    });

    $.when(imageBlob).done(function() {
        const createCanvas = exporter.image.creator._createCanvas;

        assert.strictEqual(createCanvas.callCount, 1);
        assert.deepEqual(createCanvas.getCall(0).args, [500, 250, 10]);
        done();
    });
});

QUnit.test('Canvas size. Scaled screen', function(assert) {
    const done = assert.async();
    const srcPixelRatio = window.devicePixelRatio;
    window.devicePixelRatio = 2;

    try {
        const imageBlob = exporter.image.getData(testingMarkupStart + testingMarkupEnd, {
            format: 'png', width: 500,
            height: 250, margin: 10
        });

        $.when(imageBlob).done(function() {
            const createCanvas = exporter.image.creator._createCanvas;

            assert.strictEqual(createCanvas.callCount, 1);
            assert.deepEqual(createCanvas.getCall(0).args, [1000, 500, 10]);
            done();
        });
    } finally {
        window.devicePixelRatio = srcPixelRatio;
    }
});

QUnit.test('toDataURL ImageQuality', function(assert) {
    const done = assert.async();
    const imageBlob = exporter.image.getData(testingMarkupStart + testingMarkupEnd, { format: 'png' });

    assert.expect(2);
    $.when(imageBlob).done(function() {
        try {
            const spy = window.HTMLCanvasElement.prototype.toDataURL.getCall(0);
            const args = spy.args;

            assert.equal(args[0], 'image/png', 'Mime type correct');
            assert.equal(args[1], 1, 'Image quality is correct');
        } finally {
            done();
        }
    });
});

// T374627
QUnit.test('Special symbols drown on canvas correct', function(assert) {
    const that = this;
    const done = assert.async();
    const imageBlob = imageCreator.getData(testingMarkupStart + '<g class=\'dxc-title\' transform=\'translate(0,0)\'><text x=\'0\' y=\'30\' transform=\'translate(160,0)\' text-anchor=\'middle\'>Symboles spéciaux</text></g>' + testingMarkupEnd,
        {
            width: 500,
            height: 250,
            format: 'png'
        });

    assert.expect(2);
    $.when(imageBlob).done(function() {
        try {
            assert.equal(that.drawnElements[1].type, 'text', 'Text element was drawned correct');
            assert.equal(that.drawnElements[1].args[0], 'Symboles spéciaux', 'The text symbols is correct');
        } finally {
            done();
        }
    });
});

QUnit.test('Defined background', function(assert) {
    const that = this;
    const done = assert.async();
    const imageBlob = imageCreator.getData(testingMarkupStart + '<polygon points=\'220,10 300,210 170,250 123,234\' style=\'fill:lime;stroke:purple;stroke-width:1\'/>' + testingMarkupEnd,
        {
            width: 560,
            height: 290,
            margin: 10,
            format: 'png',
            backgroundColor: '#ff0000'
        });

    assert.expect(3);
    $.when(imageBlob).done(function() {
        try {
            const backgroundElem = that.drawnElements[0];

            assert.equal(backgroundElem.type, 'fillRect', 'Fill rect');
            assert.deepEqual(backgroundElem.args, {
                x: -10,
                y: -10,
                width: 580,
                height: 310
            }, 'Background args');
            assert.deepEqual(backgroundElem.style, {
                fillStyle: '#ff0000',
                globalAlpha: 1
            }, 'Background style');
        } finally {
            done();
        }
    });
});

QUnit.test('Transformation of canvas context args (T892041, T1020859)', function(assert) {
    const done = assert.async();
    const srcPixelRatio = window.devicePixelRatio;
    window.devicePixelRatio = 2;
    const context = window.CanvasRenderingContext2D.prototype;
    const imageBlob = imageCreator.getData(testingMarkupStart + '<polygon points=\'220,10 300,210 170,250 123,234\' style=\'fill:lime;stroke:purple;stroke-width:1\'/>' + testingMarkupEnd,
        {
            width: 560,
            height: 290,
            format: 'png'
        });

    assert.expect(1);
    $.when(imageBlob).done(function() {
        try {
            assert.deepEqual(context.setTransform.getCall(0).args, [2, 0, 0, 2, 0, 0], 'setTransform');
        } finally {
            done();
            window.devicePixelRatio = srcPixelRatio;
        }
    });
});

QUnit.module('Svg to canvas', {
    beforeEach: function() {
        this.drawnElements = [];
        this.paths = [];
        setupCanvasStub(this.drawnElements, this.paths);
    },
    afterEach: function() {
        teardownCanvasStub();
        this.getComputedStyle && this.getComputedStyle.restore();
    },
    stubGetComputedStyle: function(testElement, testStyle) {
        const getComputedStyle = window.getComputedStyle;

        this.getComputedStyle = sinon.stub(window, 'getComputedStyle').callsFake(function(element) {
            if(element === testElement) {
                return testStyle;
            }
            return getComputedStyle.apply(window, arguments);
        });
    }
});

QUnit.test('Path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 L 331 280" stroke-width="2" stroke="#FF0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(8);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'stroke', 'The second element on canvas is stroke');
            assert.deepEqual(that.drawnElements[1].style, {
                strokeStyle: '#ff0000',
                strokeLinejoin: 'miter',
                lineWidth: 2,
                globalAlpha: 1
            }, 'Style of stroke');

            assert.equal(that.paths.length, 1, 'One path');
            assert.equal(that.paths[0].length, 3, 'Three components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 36,
                y: 181
            }, 'First component of path');
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 184,
                y: 98
            }, 'Second component of path');
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 331,
                y: 280
            }, 'Third component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Path with missed L directive', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 200 100 300 200 L 331 280" stroke-width="2" stroke="#FF0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(7);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths.length, 1, 'One path');
            assert.equal(that.paths[0].length, 5, 'Five components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 36,
                y: 181
            }, 'First component of path');
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 184,
                y: 98
            }, 'Second component of path');
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 200,
                y: 100
            }, 'Third component of path');
            assert.deepEqual(that.paths[0][3], {
                action: 'L',
                x: 300,
                y: 200
            }, 'Fourth component of path');
            assert.deepEqual(that.paths[0][4], {
                action: 'L',
                x: 331,
                y: 280
            }, 'Fifth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Path with no spaces between directives and with comma separated coords', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M36,181L184,98,200,100,300,200L331,280" stroke-width="2" stroke="#FF0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(7);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths.length, 1, 'One path');
            assert.equal(that.paths[0].length, 5, 'Five components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 36,
                y: 181
            }, 'First component of path');
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 184,
                y: 98
            }, 'Second component of path');
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 200,
                y: 100
            }, 'Third component of path');
            assert.deepEqual(that.paths[0][3], {
                action: 'L',
                x: 300,
                y: 200
            }, 'Fourth component of path');
            assert.deepEqual(that.paths[0][4], {
                action: 'L',
                x: 331,
                y: 280
            }, 'Fifth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Closed path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 L 331 280 Z" stroke-width="2" stroke="#FF0000" fill="none"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths[0].length, 4, 'Four components on path');
            assert.deepEqual(that.paths[0][3], {
                action: 'Z'
            }, 'Fourth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Several closed paths (T809807)', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 L 331 280 Z M 36 181 L 184 98 L 331 280 Z" stroke-width="2" stroke="#FF0000" fill="none"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths[0].length, 8, 'Four components on path');
            assert.deepEqual(that.paths[0][3], { action: 'Z' }, 'Fourth component of path');
            assert.deepEqual(that.paths[0][7], { action: 'Z' }, 'Eighth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Filled path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 L 331 280 Z" stroke-width="0" stroke="none" opacity="0.5" fill="#ff0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements[1].type, 'fill', 'The second element on canvas is fill');
            assert.deepEqual(that.drawnElements[1].style, {
                fillStyle: '#ff0000',
                globalAlpha: 0.5
            }, 'Style of stroke');
        } finally {
            done();
        }
    });
});

QUnit.test('Bezier path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 61 53 C 61 53 45 53 87 50 C 29 45 71 47 13 26" stroke-width="2" stroke="#FF0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(4);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths[0].length, 3, 'Two components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 61,
                y: 53
            }, 'First component of path');
            assert.deepEqual(that.paths[0][1], {
                action: 'C',
                x1: 61,
                y1: 53,
                x2: 45,
                y2: 53,
                x: 87,
                y: 50
            }, 'Second component of path');
            assert.deepEqual(that.paths[0][2], {
                action: 'C',
                x1: 29,
                y1: 45,
                x2: 71,
                y2: 47,
                x: 13,
                y: 26
            }, 'Third component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Path with fill none and parent fill', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<g fill="#FF0000"><path d="M 86 373 C 86 373 124 373 143 369 C 161.66666666666666 364.3746312684366 180.33333333333334 368 199 345 C 217.66666666666666 322 236.33333333333334 267.1666666666667 255 231 C 273.6666666666667 194.83333333333334 292.3333333333333 150.13569321533922 311 128 C 330 105.46902654867256 368 97 368 97" fill="none" stroke="#955f71" stroke-width="2"></path></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'stroke', 'The second element on canvas is stroke');
            assert.deepEqual(that.drawnElements[1].style, {
                strokeStyle: '#955f71',
                strokeLinejoin: 'miter',
                lineWidth: 2,
                globalAlpha: 1
            }, 'Style of stroke');
        } finally {
            done();
        }
    });
});

QUnit.test('Arc path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 10 10 L 20 20 16 28 A 15 15 0 0 0 14 15 L 99 15 A 0 0 0 0 1 99 15" stroke-width="1" stroke="#ffffff" stroke-linejoin="round" fill="#ff0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(15);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 5, 'Canvas elements count');
            assert.equal(that.drawnElements[4].type, 'stroke', 'The fourth element on canvas is stroke');
            assert.deepEqual(that.drawnElements[4].style, {
                strokeStyle: '#ffffff',
                strokeLinejoin: 'round',
                lineWidth: 1,
                globalAlpha: 1
            }, 'Style of stroke');
            assert.equal(that.paths[0].length, 6, 'Four components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 10,
                y: 10
            });
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 20,
                y: 20
            });
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 16,
                y: 28
            });
            assert.equal(that.paths[0][3].action, 'A', 'action');
            assert.equal(that.paths[0][3].r, 15, 'radius');
            assert.roughEqual(that.paths[0][3].sa, 0.3012034806537296, 0.1, 'start angle');
            assert.roughEqual(that.paths[0][3].ea, -0.6065021374442598, 0.1, 'end angle');
            assert.roughEqual(that.paths[0][3].x, 1.6752978321738201, 0.1, 'x');
            assert.roughEqual(that.paths[0][3].y, 23.549954179665566, 0.1, 'y');
            assert.deepEqual(that.paths[0][4], {
                action: 'L',
                x: 99,
                y: 15
            }, 'Third component of path');
            assert.deepEqual(that.paths[0][5], {
                action: 'A',
                c: false,
                r: 0,
                sa: 0,
                ea: 0,
                x: 99,
                y: 15
            }, 'Fourth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Arc path (relative coords)', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 10 10 L 20 20 16 28 a 15 15 0 0 0 -2 -13 L 99 15 a 0 0 0 0 1 0 0" stroke-width="1" stroke="#ffffff" stroke-linejoin="round" fill="#ff0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(12);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.paths[0].length, 6, 'Four components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 10,
                y: 10
            });
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 20,
                y: 20
            });
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 16,
                y: 28
            }, 'First component of path');
            assert.equal(that.paths[0][3].action, 'A', 'action');
            assert.equal(that.paths[0][3].r, 15, 'radius');
            assert.roughEqual(that.paths[0][3].sa, 0.3012034806537296, 0.1, 'start angle');
            assert.roughEqual(that.paths[0][3].ea, -0.6065021374442598, 0.1, 'end angle');
            assert.roughEqual(that.paths[0][3].x, 1.6752978321738201, 0.1, 'x');
            assert.roughEqual(that.paths[0][3].y, 23.549954179665566, 0.1, 'y');
            assert.deepEqual(that.paths[0][4], {
                action: 'L',
                x: 99,
                y: 15
            }, 'Third component of path');
            assert.deepEqual(that.paths[0][5], {
                action: 'A',
                c: false,
                r: 0,
                sa: 0,
                ea: 0,
                x: 99,
                y: 15
            }, 'Fourth component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Skip unknown command', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<path d="M 36 181 L 184 98 L 331 280 V8 Z" stroke-width="2" stroke="#FF0000"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(9);
    $.when(imageBlob).done(function() {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'stroke', 'The second element on canvas is stroke');
            assert.deepEqual(that.drawnElements[1].style, {
                strokeStyle: '#ff0000',
                strokeLinejoin: 'miter',
                lineWidth: 2,
                globalAlpha: 1
            }, 'Style of stroke');

            assert.equal(that.paths.length, 1, 'One path');
            assert.equal(that.paths[0].length, 4, 'Three components on path');
            assert.deepEqual(that.paths[0][0], {
                action: 'M',
                x: 36,
                y: 181
            }, 'First component of path');
            assert.deepEqual(that.paths[0][1], {
                action: 'L',
                x: 184,
                y: 98
            }, 'Second component of path');
            assert.deepEqual(that.paths[0][2], {
                action: 'L',
                x: 331,
                y: 280
            }, 'Third component of path');
            assert.deepEqual(that.paths[0][3], {
                action: 'Z'
            }, 'Third component of path');
        } finally {
            done();
        }
    });
});

QUnit.test('Comments should not to be exported(T1168423)', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<!-- text -->' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 1, 'Canvas elements count');
            assert.equal(that.drawnElements[0].type, 'fillRect', 'Drawn "fillRect" only');
        } finally {
            done();
        }
    });
});

QUnit.test('Rect', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="81" y="24" width="118" height="168" transform="translate(250,230)" stroke-dasharray="8,6" opacity="0.5" stroke-width="12" stroke="#955f71" fill="#955f71"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(10);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 4, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'rect', 'Canvas drawn rect element');

            assert.equal(context.setLineDash.callCount, 1, 'setLineDash was called one time');
            assert.deepEqual(context.setLineDash.getCall(0).args[0], [8, 6], 'Canvas dashLineStyle');

            assert.equal(context.translate.callCount, 2, 'translate was called two times');
            assert.deepEqual(context.translate.getCall(1).args, [250, 230], 'Canvas is translated');

            assert.equal(context.beginPath.callCount, 1, 'one begin path');

            assert.deepEqual(that.drawnElements[1].args, {
                x: 81,
                y: 24,
                width: 118,
                height: 168
            }, 'Rect function called with right arguments: left, right, width, height');

            assert.deepEqual(that.drawnElements[3].style, {
                strokeStyle: '#955f71',
                strokeLinejoin: 'miter',
                lineWidth: 12,
                globalAlpha: 0.5
            }, 'Style of stroke');

            assert.deepEqual(that.drawnElements[2].style, {
                fillStyle: '#955f71',
                globalAlpha: 0.5
            }, 'Style of fill');

        } finally {
            done();
        }
    });
});

QUnit.test('Image margins', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="81" y="24" width="118" height="168" transform="translate(250,230)" stroke-dasharray="8,6" opacity="0.5" stroke-width="12" stroke="#955f71" fill="#955f71"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(context.translate.callCount, 2, 'translate was called two times');
            assert.deepEqual(context.translate.getCall(0).args, [10, 10], 'Canvas translated to margin offset');
        } finally {
            done();
        }
    });
});

QUnit.test('Rect with cornerRadius', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="21" y="100" rx="10" ry="10" width="118" height="168" transform="translate(250,230)" stroke-width="7" stroke="#955f71" fill="#955f71"></rect>'
                                    + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(10);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 7, 'Canvas elements count');
            assert.equal(context.arcTo.callCount, 4, 'arcTo was called four times');
            assert.deepEqual(context.translate.getCall(1).args, [250, 230], 'Canvas is translated');
            assert.equal(context.translate.callCount, 3, 'Translate was called two times');
            assert.equal(context.save.callCount, 2, 'Context saving count');
            assert.equal(context.restore.callCount, 2, 'Context restoring count');

            assert.deepEqual(that.drawnElements[1].args, {
                radius: 10,
                x1: 118,
                y1: 0,
                x2: 118,
                y2: 168
            }, 'First arcTo function called with right arguments: radius, x1, y1, x2, y2');

            assert.deepEqual(that.drawnElements[2].args, {
                radius: 10,
                x1: 118,
                y1: 168,
                x2: 0,
                y2: 168
            }, 'Second arcTo function called with right arguments: radius, x1, y1, x2, y2');

            assert.deepEqual(that.drawnElements[3].args, {
                radius: 10,
                x1: 0,
                y1: 168,
                x2: 0,
                y2: 0
            }, 'Fird arcTo function called with right arguments: radius, x1, y1, x2, y2');

            assert.deepEqual(that.drawnElements[4].args, {
                radius: 10,
                x1: 0,
                y1: 0,
                x2: 10,
                y2: 0
            }, 'Fourth arcTo function called with right arguments: radius, x1, y1, x2, y2');
        } finally {
            done();
        }
    });
});

QUnit.test('Rect width cornerRadius exceed 1/2 height or 1/2 width', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="21" y="100" rx="30" ry="30" width="118" height="30" transform="translate(250,230)" stroke-width="7" stroke="#955f71" fill="#955f71"></rect>'
                                    + '<rect x="21" y="100" rx="30" ry="30" width="50" height="100" transform="translate(250,230)" stroke-width="7" stroke="#955f71" fill="#955f71"></rect>'
                                    + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements[1].args.radius, 15, 'First rect: cornerRadius set 1/2 height');
            assert.equal(that.drawnElements[8].args.radius, 25, 'Second rect: cornerRadius set 1/2 width');

        } finally {
            done();
        }
    });
});

QUnit.test('Stroke-opacity / Fill-opacity', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="21" y="100" width="118" height="30" transform="translate(250,230)" stroke-width="7" stroke-opacity="0.7" fill-opacity="0.5" stroke="#955f71" fill="#955f71"></rect>'
                                    + '<rect x="21" y="100" width="118" height="30" transform="translate(250,230)" stroke-width="7" opacity="0.5" stroke="#955f71" fill="#955f71"></rect>'
                                    + '<rect x="21" y="100" width="118" height="30" transform="translate(250,230)" stroke-width="7" stroke-opacity="0.7" fill-opacity="0.5" opacity="0.5" stroke="#955f71" fill="#955f71"></rect>'
                                    + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(6);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.roughEqual(that.drawnElements[2].style.globalAlpha, 0.5, 0.1, 'First rect(stroke-opacity, fill-opacity): fill opacity');
            assert.roughEqual(that.drawnElements[3].style.globalAlpha, 0.7, 0.1, 'First rect(stroke-opacity, fill-opacity): stroke opacity');

            assert.roughEqual(that.drawnElements[5].style.globalAlpha, 0.5, 0.1, 'Second rect(opacity attr): fill opacity');
            assert.roughEqual(that.drawnElements[6].style.globalAlpha, 0.5, 0.1, 'Second rect(opacity attr): stroke opacity');

            assert.roughEqual(that.drawnElements[8].style.globalAlpha, 0.25, 0.1, 'First rect(stroke-opacity, fill-opacity and opacity attr): fill opacity');
            assert.roughEqual(that.drawnElements[9].style.globalAlpha, 0.35, 0.1, 'First rect(stroke-opacity, fill-opacity and opacity attr): stroke opacity');
        } finally {
            done();
        }
    });
});

QUnit.test('Filter shadow', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
                    '<defs>' +
                    '<filter id="testFilter1" x="-40%" y="-40%" width="180%" height="200%" transform="translate(0,0)"><feGaussianBlur in="SourceGraphic" result="gaussianBlurResult" stdDeviation="1"></feGaussianBlur><feOffset in="gaussianBlurResult" result="offsetResult" dx="0" dy="1"></feOffset><feFlood result="floodResult" flood-color="#223387" flood-opacity="0.2"></feFlood><feComposite in="floodResult" in2="offsetResult" operator="in" result="compositeResult"></feComposite><feComposite in="SourceGraphic" in2="compositeResult" operator="over"></feComposite></filter>' +
                    '<filter id="testFilter1-part-1" x="-40%" y="-40%" width="180%" height="200%" transform="translate(0,0)"><feGaussianBlur in="SourceGraphic" result="gaussianBlurResult" stdDeviation="1"></feGaussianBlur><feOffset in="gaussianBlurResult" result="offsetResult" dx="0" dy="1"></feOffset><feFlood result="floodResult" flood-color="#223387" flood-opacity="0.2"></feFlood><feComposite in="floodResult" in2="offsetResult" operator="in" result="compositeResult"></feComposite><feComposite in="SourceGraphic" in2="compositeResult" operator="over"></feComposite></filter>' +
                    '<filter id="testFilter1-part-2" x="-40%" y="-40%" width="180%" height="200%" transform="translate(0,0)"><feGaussianBlur in="SourceGraphic" result="gaussianBlurResult" stdDeviation="1"></feGaussianBlur><feOffset in="gaussianBlurResult" result="offsetResult" dx="0" dy="1"></feOffset><feFlood result="floodResult" flood-color="#223387" flood-opacity="0.2"></feFlood><feComposite in="floodResult" in2="offsetResult" operator="in" result="compositeResult"></feComposite><feComposite in="SourceGraphic" in2="compositeResult" operator="over"></feComposite></filter>' +
                    '</defs>' +
                    '<circle cx="0" cy="0" r="4" transform="translate(0,0)" filter="none" stroke="none" stroke-width="0" fill="#ffffff" opacity="0.32"></circle>' +
                    '<circle cx="0" cy="0" r="4" transform="translate(0,0)" filter="url(#testFilter1-part-2)" stroke="#ffffff" stroke-width="2" fill="#ba4d51"></circle>' +
                    '<circle cx="20" cy="20" r="4" filter="url(someurlpart#testFilter2-part-1)" fill="#ba4d51"></circle>' +
                    testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(4);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 8, 'Canvas elements count');
            assert.equal(that.drawnElements[2].style.shadow, undefined, 'First element has no shadow filter');
            assert.deepEqual(that.drawnElements[4].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            }, 'Second element has shadow filter');
            assert.deepEqual(that.drawnElements[7].style.shadow, undefined, 'Last element has no shadow filter(filter not exists)');
        } finally {
            done();
        }
    });
});

QUnit.test('lineargradient', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart +
        '<defs>' +

        '<linearGradient id="testlineargradient1">' +
        '<stop offset="0%" stop-color="red"></stop>' +
        '<stop offset="100%" stop-color="blue"></stop>' +
        '</linearGradient>' +

        '</defs>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient1)" opacity="0.3"></path>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient2)" opacity="0.3"></path>' +
        testingMarkupEnd;

    const imageBlob = getData(markup);

    $.when(imageBlob).done(() => {
        try {
            assert.strictEqual(this.drawnElements.length, 3, 'Canvas elements count');
            assert.strictEqual(this.drawnElements[1].type, 'linearGradient', 'First element is linearGradient');
            assert.deepEqual(this.drawnElements[1].args, { x0: 0, y0: 0, x1: 30, y1: 0 });
            assert.strictEqual(this.drawnElements[1].addColorStop.callCount, 2);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(0).args, [0, 'red']);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(1).args, [1, 'blue']);

            assert.roughEqual(this.drawnElements[2].style.globalAlpha, 0.3, 0.1);
            assert.strictEqual(this.drawnElements[2].style.fillStyle, '#aaaaaa');
            assert.strictEqual(this.drawnElements[2].type, 'fill', 'fill');
        } finally {
            done();
        }
    });
});

QUnit.test('lineargradient with rotation angle', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart +
        '<defs>' +

        '<linearGradient id="testlineargradient1" gradientTransform="rotate(45)">' +
        '<stop offset="0%" stop-color="red"></stop>' +
        '<stop offset="100%" stop-color="blue"></stop>' +
        '</linearGradient>' +

        '</defs>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient1)" opacity="0.3"></path>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient2)" opacity="0.3"></path>' +
        testingMarkupEnd;

    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    $.when(imageBlob).done(() => {
        try {
            assert.strictEqual(this.drawnElements.length, 3, 'Canvas elements count');
            assert.strictEqual(this.drawnElements[1].type, 'linearGradient', 'First element is linearGradient');
            assert.deepEqual(this.drawnElements[1].args, { x0: 0, y0: 0, x1: 30, y1: 0 });
            assert.strictEqual(this.drawnElements[1].addColorStop.callCount, 2);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(0).args, [0, 'red']);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(1).args, [1, 'blue']);

            assert.roughEqual(this.drawnElements[2].style.globalAlpha, 0.3, 0.1);
            assert.strictEqual(this.drawnElements[2].style.fillStyle, '#aaaaaa');
            assert.strictEqual(this.drawnElements[2].type, 'fill', 'fill');

            assert.strictEqual(context.translate.callCount, 5, 'translate call count');
            assert.deepEqual(context.translate.getCall(2).args, [15, 10]);
            assert.deepEqual(context.translate.getCall(3).args, [-15, -10]);

            assert.strictEqual(context.rotate.callCount, 1, 'rotate call count');
            assert.roughEqual(context.rotate.getCall(0).args[0], 0.78, 0.01);
        } finally {
            done();
        }
    });
});

QUnit.test('lineargradient with undefined rotation angle', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart +
        '<defs>' +

        '<linearGradient id="testlineargradient1">' +
        '<stop offset="0%" stop-color="red"></stop>' +
        '<stop offset="100%" stop-color="blue"></stop>' +
        '</linearGradient>' +

        '</defs>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient1)" opacity="0.3"></path>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testlineargradient2)" opacity="0.3"></path>' +
        testingMarkupEnd;

    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    $.when(imageBlob).done(() => {
        try {
            assert.strictEqual(context.rotate.callCount, 1, 'rotate call count');
            assert.strictEqual(context.rotate.getCall(0).args[0], 0);
        } finally {
            done();
        }
    });
});

QUnit.test('radialgradient', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart +
        '<defs>' +

        '<radialGradient id="testradialgradient">' +
        '<stop offset="0%" stop-color="red"></stop>' +
        '<stop offset="100%" stop-color="blue"></stop>' +
        '</radialGradient>' +

        '</defs>' +
        '<path d="M 0 0 C 10 10 20 20 30 20 Z" fill="url(#testradialgradient)" opacity="0.3"></path>' +
        testingMarkupEnd;

    const imageBlob = getData(markup);

    $.when(imageBlob).done(() => {
        try {
            assert.strictEqual(this.drawnElements.length, 3, 'Canvas elements count');
            assert.strictEqual(this.drawnElements[1].type, 'radialGradient', 'First element is radialGradient');
            assert.deepEqual(this.drawnElements[1].args, { r0: 0, r1: 15, x0: 15, x1: 15, y0: 10, y1: 10 });
            assert.strictEqual(this.drawnElements[1].addColorStop.callCount, 2);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(0).args, [0, 'red']);
            assert.deepEqual(this.drawnElements[1].addColorStop.getCall(1).args, [1, 'blue']);

            assert.roughEqual(this.drawnElements[2].style.globalAlpha, 0.3, 0.1);
            assert.strictEqual(this.drawnElements[2].style.fillStyle, '#aaaaaa');
            assert.strictEqual(this.drawnElements[2].type, 'fill', 'fill');
        } finally {
            done();
        }
    });
});

QUnit.test('Circle', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<circle cx="0" cy="0" r="140" transform="translate(250,230)" stroke-dasharray="5,10" opacity="0.5" fill="#F05B41" stroke="#955f71"></circle>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(5);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 4, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'arc', 'Canvas drawn rect element');

            assert.deepEqual(that.drawnElements[1].args, {
                x: 0,
                y: 0,
                radius: 140,
                startAngle: 0,
                endAngle: 6.283185307179586,
                anticlockwise: 1
            }, 'Arc function called with right arguments: x, y, radius, startAngle, endAngle, anticlockwise');

            assert.deepEqual(that.drawnElements[3].style, {
                strokeStyle: '#955f71',
                strokeLinejoin: 'miter',
                lineWidth: 1,
                globalAlpha: 0.5
            }, 'Style of stroke');

            assert.deepEqual(that.drawnElements[2].style, {
                fillStyle: '#f05b41',
                globalAlpha: 0.5
            }, 'Style of fill');

        } finally {
            done();
        }
    });
});

QUnit.test('Image with xlink:href', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><clipPath id="clippath1"><rect x="0" y="30" width="500" height="30"></rect></clipPath></defs><image x="-10" y="-15" width="20" height="25" preserveAspectRatio="xMidYMid" transform="translate(427,82)" xlink:href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" visibility="visible" clip-path="url(#clippath1)"></image>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(8);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 3, 'Canvas elements count');

            assert.equal(that.drawnElements[2].type, 'image', 'Canvas drawn rect element');
            assert.deepEqual(that.drawnElements[2].args, {
                node: 'IMG',
                src: '/packages/devextreme/testing/content/exporterTestsContent/test-image.png',
                x: -10,
                y: -15,
                width: 20,
                height: 25
            });
            assert.deepEqual(context.translate.getCall(2).args, [427, 82]);

            assert.deepEqual(that.drawnElements[1].args, {
                height: 30,
                width: 500,
                x: 0,
                y: 30
            }, 'clippath args');

            assert.equal(context.clip.callCount, 1, 'Two clips');
            assert.equal(context.save.callCount, 3, 'Two saving');
            assert.equal(context.restore.callCount, 3, 'Two restoring');
        } finally {
            done();
        }
    });
});

QUnit.test('Image drawing. Default x&y coordinates', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><clipPath id="clippath1"><rect x="0" y="30" width="500" height="30"></rect></clipPath></defs><image width="20" height="25" preserveAspectRatio="xMidYMid" transform="translate(427,82)" xlink:href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" visibility="visible" clip-path="url(#clippath1)"></image>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 3, 'Canvas elements count');
            assert.equal(that.drawnElements[2].type, 'image', 'Canvas drawn rect element');
            assert.deepEqual(that.drawnElements[2].args, {
                node: 'IMG',
                src: '/packages/devextreme/testing/content/exporterTestsContent/test-image.png',
                x: 0,
                y: 0,
                width: 20,
                height: 25
            });

        } finally {
            done();
        }
    });
});

QUnit.test('Image with href', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<image x="-10" y="-15" width="20" height="25" preserveAspectRatio="xMidYMid" href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" visibility="visible"></image>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');

            assert.equal(that.drawnElements[1].type, 'image', 'Canvas drawn rect element');
            assert.deepEqual(that.drawnElements[1].args, {
                node: 'IMG',
                src: '/packages/devextreme/testing/content/exporterTestsContent/test-image.png',
                x: -10,
                y: -15,
                width: 20,
                height: 25
            });
        } finally {
            done();
        }
    });
});

QUnit.test('Image with 404 href', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<image x="-10" y="-15" width="20" height="25" preserveAspectRatio="xMidYMid" href="/wrongurl" visibility="visible"></image>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(1);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 1, 'Canvas elements count');
        } finally {
            done();
        }
    });
});

QUnit.test('Export image in group', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<g transform="translate(10, 10)"><image x="-10" y="-15" width="20" height="25" preserveAspectRatio="xMidYMid" href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" visibility="visible"></image></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(5);
    $.when(imageBlob).done(() => {
        try {
            assert.equal(this.drawnElements.length, 2, 'Canvas elements count');
            assert.equal(this.drawnElements[1].type, 'image');
            assert.equal(context.save.callCount, 3);
            assert.equal(context.restore.callCount, 3);
            assert.ok(context.restore.secondCall.calledAfter(context.save.lastCall));
        } finally {
            done();
        }
    });
});

QUnit.test('Export draws into hidden canvas', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<g transform="translate(10, 10)"><image x="-10" y="-15" width="20" height="25" preserveAspectRatio="xMidYMid" href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" visibility="visible"></image></g>' + testingMarkupEnd;

    getData(markup).then(done);

    assert.strictEqual($('canvas')[0].hidden, true);
});

QUnit.test('Text', function(assert) {
    const that = this;
    const done = assert.async();
    const element = createSvgElement(testingMarkupStart + '<text x="20" y="30" text-anchor="middle">Test</text>' + testingMarkupEnd);

    element.querySelector('text').style = `
        font-style: italic;
        font-size: 16px;
        font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
        font-weight: bold;
        fill: #232323;
        opacity: 0.3;
    `;

    const imageBlob = getData(element);

    assert.expect(12);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');

            const textElem = that.drawnElements[1];

            assert.equal(textElem.style.weight, 'bold', 'Style weight');

            assert.equal(textElem.type, 'text', 'The second element on canvas is text');
            assert.equal(textElem.style.font, '"Segoe UI Light","Helvetica Neue Light","Segoe UI","Helvetica Neue","Trebuchet MS",Verdana', 'Style font');
            assert.equal(textElem.style.size, '16px', 'Style size');
            assert.equal(textElem.style.style, 'italic', 'Style');
            assert.equal(textElem.style.fillStyle, '#232323', 'Style fill');
            assert.equal(textElem.style.textAlign, 'center', 'Style text align');
            assert.roughEqual(textElem.style.globalAlpha, 0.3, 0.1, 'Style opacity');

            assert.equal(textElem.args[0], 'Test', 'Text');
            assert.equal(textElem.args[1], 20, 'X coord');
            assert.equal(textElem.args[2], 30, 'Y coord');
        } finally {
            done();
        }
    });
});

QUnit.test('Defaults of text', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="20" y="30" text-anchor="middle" style="font-style: italic; font-weight:bold; opacity: 0.3;">Test</text>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(4);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');

            const { style } = that.drawnElements[1];

            assert.equal(style.font, 'sans-serif', 'Style font');
            assert.equal(style.size, '10px', 'Style size');
            assert.equal(style.fillStyle, '#000000', 'Style fill');
        } finally {
            done();
        }
    });
});

// T849504
QUnit.test('Text with zero opacity in parent group', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<g opacity="0"><text x="20" y="30">Test</text></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    $.when(imageBlob).done(function() {
        try {
            assert.equal(that.drawnElements.length, 2, 'Canvas elements count');

            const textElem = that.drawnElements[1];

            assert.roughEqual(textElem.style.globalAlpha, 0, 0.1, 'Style opacity');
            assert.equal(textElem.args[0], 'Test', 'Text');
        } finally {
            done();
        }
    });
});

QUnit.test('Text offset position calculation with start alignment', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text x="10" y="30" style="font-size:28px; fill:#232323; font-family: sans-serif;">' +
            '<tspan x="10" y="30">World</tspan><tspan>Population</tspan><tspan>by Decade</tspan></text>' +

            testingMarkupEnd;
    const imageBlob = getData(markup);
    const canvas = $('<canvas width=\'1000\' height=\'1000\'>').appendTo('#qunit-fixture')[0];
    const ctx = canvas.getContext('2d');

    ctx.font = '28px sans-serif';

    assert.expect(10);

    $.when(imageBlob).done(function(blob) {
        try {
            const part1Width = ctx.measureText('World').width;
            const part2Width = ctx.measureText('Population').width;

            assert.equal(that.drawnElements.length, 4, 'Canvas elements count');

            assert.equal(that.drawnElements[1].args[1], 10, 'Text out of tspanElement position X');
            assert.equal(that.drawnElements[1].args[2], 30, 'Text out of tspanElement position Y');
            assert.equal(that.drawnElements[1].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[2].args[1], 10 + part1Width, 'tSpan text element without x,y,dx,dy attributes position X');
            assert.equal(that.drawnElements[2].args[2], 30, 'tSpan text element without x,y,dx,dy attributes position Y');
            assert.equal(that.drawnElements[2].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[3].args[1], 10 + part1Width + part2Width, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[3].args[2], 30, 'tSpan text element with dx,dy attributes position Y');
            assert.equal(that.drawnElements[3].style.textAlign, 'start', 'text align');
        } finally {
            done();
        }
    });
});

QUnit.test('Text with default coordinates', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text text-anchor="middle" style="font-size:28px; fill:#232323; font-family: sans-serif;">Text</text>' +
            testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(2);

    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements[1].args[1], 0, 'X');
            assert.equal(that.drawnElements[1].args[2], 0, 'Y');
        } finally {
            done();
        }
    });
});

QUnit.test('tspan element inside other tspan', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text x="100" y="100" text-anchor="middle" style="font-size:28px; fill:#232323; font-family: sans-serif;">' +
            '<tspan x="0" y="30" text-anchor="start">' +
            '<tspan>Imports, Dec 2014 - May 2015</tspan>' +
            '<tspan style="font-size:13px;" dy="-5">(Mod)</tspan>' +
            '</tspan>' +

            '<tspan x="0" y="100" text-anchor="start">' +
            '<tspan>Second Line</tspan>' +
            '</tspan>' +

            '</text > ' +
            testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(6);

    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 5, 'Canvas elements count');
            assert.equal(that.drawnElements[1].args[1], 0, 'X');
            assert.equal(that.drawnElements[1].args[2], 30, 'Y');

            assert.equal(that.drawnElements[3].args[1], 0, 'X');
            assert.equal(that.drawnElements[3].args[2], 100, 'Y');
            assert.equal(that.drawnElements[3].args[0], 'Second Line');
        } finally {
            done();
        }
    });
});

QUnit.test('Text offset position calculation with center alignment', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text x="10" y="30" text-anchor="middle" style="font-size:28px; fill:#232323; font-family: sans-serif;">' +
            '<tspan x="10" y="30">World</tspan><tspan>Population</tspan><tspan>by Decade</tspan></text>' +
            testingMarkupEnd;
    const imageBlob = getData(markup);
    const canvas = $('<canvas width=\'1000\' height=\'1000\'>').appendTo('#qunit-fixture')[0];
    const ctx = canvas.getContext('2d');

    ctx.font = '28px sans-serif';

    assert.expect(7);

    $.when(imageBlob).done(function(blob) {
        try {
            const part1Width = ctx.measureText('World').width;
            const part2Width = ctx.measureText('Population').width;
            const part3Width = ctx.measureText('by Decade').width;
            const center = (part1Width + part2Width + part3Width) / 2;

            assert.equal(that.drawnElements.length, 4, 'Canvas elements count');

            assert.equal(that.drawnElements[1].args[1], 10 - center, 'Text out of tspanElement position X');
            assert.equal(that.drawnElements[1].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[2].args[1], 10 - center + part1Width, 'tSpan text element without x,y,dx,dy attributes position X');
            assert.equal(that.drawnElements[2].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[3].args[1], 10 - center + part1Width + part2Width, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[3].style.textAlign, 'start', 'text align');
        } finally {
            done();
        }
    });
});

QUnit.test('Text offset position calculation with end alignment', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text x="10" y="30" text-anchor="end" style="font-size:28px; fill:#232323; font-family: sans-serif;">' +
            '<tspan x="10" y="30">World</tspan><tspan>Population</tspan><tspan>by Decade</tspan></text>' +

            testingMarkupEnd;
    const imageBlob = getData(markup);
    const canvas = $('<canvas width=\'1000\' height=\'1000\'>').appendTo('#qunit-fixture')[0];
    const ctx = canvas.getContext('2d');

    ctx.font = '28px sans-serif';

    assert.expect(10);

    $.when(imageBlob).done(function(blob) {
        try {
            const part1Width = ctx.measureText('World').width;
            const part2Width = ctx.measureText('Population').width;
            const part3Width = ctx.measureText('by Decade').width;
            const commonWidth = (part1Width + part2Width + part3Width);

            assert.equal(that.drawnElements.length, 4, 'Canvas elements count');

            assert.equal(that.drawnElements[1].args[1], 10 - commonWidth, 'Text out of tspanElement position X');
            assert.equal(that.drawnElements[1].args[2], 30, 'Text out of tspanElement position Y');
            assert.equal(that.drawnElements[1].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[2].args[1], 10 - commonWidth + part1Width, 'tSpan text element without x,y,dx,dy attributes position X');
            assert.equal(that.drawnElements[2].args[2], 30, 'tSpan text element without x,y,dx,dy attributes position Y');
            assert.equal(that.drawnElements[2].style.textAlign, 'start', 'text align');

            assert.strictEqual(that.drawnElements[3].args[1], 10 - commonWidth + part1Width + part2Width, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[3].args[2], 30, 'tSpan text element with dx,dy attributes position Y');
            assert.equal(that.drawnElements[3].style.textAlign, 'start', 'text align');
        } finally {
            done();
        }
    });
});

QUnit.test('Multiline text', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart +
            '<text x="10" y="30" text-anchor="start" style="font-size:28px; fill:#232323; font-family: sans-serif;">' +
            '<tspan x="10" y="30">World </tspan>' +
            '<tspan x="10" dy="28">Populationby</tspan>' +
            '<tspan x="10" y="30">World </tspan>' +
            '<tspan x="10" dy="34px">Populationby</tspan>' +
            '<tspan x="10" dy="16">Populationby</tspan>' +
            '</text>' +

            testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(11);

    $.when(imageBlob).done(function(blob) {
        try {

            assert.equal(that.drawnElements.length, 6, 'Canvas elements count');

            assert.equal(that.drawnElements[1].args[1], 10, 'Text out of tspanElement position X');
            assert.equal(that.drawnElements[1].args[2], 30, 'Text out of tspanElement position Y');

            assert.strictEqual(that.drawnElements[2].args[1], 10, 'tSpan text element without x,y,dx,dy attributes position X');
            assert.equal(that.drawnElements[2].args[2], 30 + 28, 'tSpan text element without x,y,dx,dy attributes position Y');

            assert.strictEqual(that.drawnElements[3].args[1], 10, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[3].args[2], 30, 'tSpan text element with dx,dy attributes position Y');

            assert.strictEqual(that.drawnElements[4].args[1], 10, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[4].args[2], 30 + 34, 'tSpan text element with dx,dy attributes position Y');

            assert.strictEqual(that.drawnElements[5].args[1], 10, 'tSpan text element with dx,dy attributes position X');
            assert.equal(that.drawnElements[5].args[2], 30 + 34 + 16, 'tSpan text element with dx,dy attributes position Y');
        } finally {
            done();
        }
    });
});

// T434703
QUnit.test('Text with big amount of spaces', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="48" y="393" transform="translate(0,0)" style="fill:#ffffff;font-size:12px;font-family:\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:400;cursor:default;" text-anchor="middle"><tspan x="48" y="393">              </tspan><tspan style="font-weight:bold;">Sold in Coal</tspan><tspan x="48" dy="12">              204.8 retained by India</tspan><tspan x="48" dy="12">            </tspan></text>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    function checkLines(lines) {
        for(let i = 1; i < that.drawnElements.length; i++) {
            assert.equal(that.drawnElements[i].type, 'text', 'The ' + i + ' element on canvas is text');

            assert.equal(that.drawnElements[i].args[0], lines[i - 1], i - 1 + 'line. Text');
        }
    }

    assert.expect(9);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 5, 'Canvas elements count');
            checkLines([' ', 'Sold in Coal', ' 204.8 retained by India', ' ']);
        } finally {
            done();
        }
    });
});

QUnit.test('Stroke text', function(assert) {
    const that = this;
    const done = assert.async();
    const element = createSvgElement(testingMarkupStart + '<text x="50" y="50" text-anchor="start" stroke-width="5"><tspan stroke-opacity="0.7">Age</tspan></text>' + testingMarkupEnd);
    element.querySelector('text').style = `
        fill: #222;
        font-family: 'Trebuchet MS', Verdana;
        stroke: #F2f2f2;
        stroke-width: 5px;
    `;
    element.querySelector('tspan').style = `
        font-weight: bold;
        font-style: italic; 
    `;

    const imageBlob = getData(element);

    assert.expect(14);
    $.when(imageBlob).done(function(blob) {
        try {
            const strokeText = that.drawnElements[2];

            assert.equal(that.drawnElements.length, 3, 'Canvas elements count');
            assert.equal(strokeText.type, 'strokeText', 'The third element on canvas is strokeText');

            assert.equal(strokeText.style.weight, 'bold', 'Stroke element style weight');

            assert.equal(strokeText.style.font, '"Trebuchet MS",Verdana', 'First line. Style font');
            assert.equal(strokeText.style.size, '10px', 'Stroke element font-size');
            assert.equal(strokeText.style.style, 'italic', 'Stroke element font-style');
            assert.equal(strokeText.style.fillStyle, '#222222', 'Stroke element fill color');
            assert.equal(strokeText.style.strokeStyle, '#f2f2f2', 'Stroke element stroke color');
            assert.roughEqual(strokeText.style.globalAlpha, 0.7, 0.05, 'Stroke element stroke opacity');
            assert.equal(strokeText.style.lineWidth, 5, 'Stroke element stroke width');
            assert.equal(strokeText.style.textAlign, 'start', 'Stroke element stroke textAlign');
            assert.equal(strokeText.args[0], 'Age', 'First line. Text');
            assert.equal(strokeText.args[1], 50, 'First line. X coord');
            assert.equal(strokeText.args[2], 50, 'First line. Y coord');

        } finally {
            done();
        }
    });
});

// T697125
QUnit.test('Multiline text with shadow and stroked texts', function(assert) {
    const that = this;
    const done = assert.async();
    const element = createSvgElement(testingMarkupStart +
        '<defs>' +
        '<filter id="testFilter1" x="-40%" y="-40%" width="180%" height="200%" transform="translate(0,0)"><feGaussianBlur in="SourceGraphic" result="gaussianBlurResult" stdDeviation="1"></feGaussianBlur><feOffset in="gaussianBlurResult" result="offsetResult" dx="0" dy="1"></feOffset><feFlood result="floodResult" flood-color="#223387" flood-opacity="0.2"></feFlood><feComposite in="floodResult" in2="offsetResult" operator="in" result="compositeResult"></feComposite><feComposite in="SourceGraphic" in2="compositeResult" operator="over"></feComposite></filter>' +
        '</defs>' +
        '<text filter="url(#testFilter1)" x="0" y="0" transform="translate(463,51)">' +
        '<tspan x="0" y="0" stroke="#f2f2f2" stroke-width="1" stroke-opacity="0.3" stroke-linejoin="round">Text1</tspan>' +
        '<tspan x="0" dy="13px" stroke="#f2f2f2" stroke-width="1" stroke-opacity="0.3" stroke-linejoin="round">Text2</tspan>' +
        '<tspan x="0" y="0">Text1</tspan>' +
        '<tspan x="0" dy="13px">Text2</tspan>' +
        '</text>' + testingMarkupEnd);
    element.querySelector('text').style = `
        white-space: pre;
        fill: #232323;
        font-style: italic;
        font-weight: bold;
        font-family: 'Trebuchet MS', Verdana;
        font-size: 14px;
        cursor: default;
    `;
    const imageBlob = getData(element);

    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 7, 'Canvas elements count');

            assert.equal(that.drawnElements[1].type, 'text', '1st stroked element\'s fillText');
            assert.equal(that.drawnElements[1].style.weight, 'bold', 'Style weight');
            assert.equal(that.drawnElements[1].style.font, '"Trebuchet MS",Verdana', 'Style font');
            assert.equal(that.drawnElements[1].style.size, '14px', 'Style size');
            assert.equal(that.drawnElements[1].style.style, 'italic', 'Style');
            assert.equal(that.drawnElements[1].style.fillStyle, '#232323', 'Style fill');
            assert.equal(that.drawnElements[1].style.textAlign, 'start', 'Text element textAlign');
            assert.equal(that.drawnElements[1].style.globalAlpha, 1, 'Style opacity');
            assert.equal(that.drawnElements[1].args[0], 'Text1', 'Text');
            assert.equal(that.drawnElements[1].args[1], 0, 'X coord');
            assert.equal(that.drawnElements[1].args[2], 0, 'Y coord');
            assert.deepEqual(that.drawnElements[1].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });

            assert.equal(that.drawnElements[2].type, 'strokeText', '1st stroked element\'s strokeText');
            assert.equal(that.drawnElements[2].style.weight, 'bold', 'Stroke element style weight');
            assert.equal(that.drawnElements[2].style.font, '"Trebuchet MS",Verdana', 'First line. Style font');
            assert.equal(that.drawnElements[2].style.size, '14px', 'Stroke element font-size');
            assert.equal(that.drawnElements[2].style.style, 'italic', 'Stroke element font-style');
            assert.equal(that.drawnElements[2].style.fillStyle, '#232323', 'Stroke element fill color');
            assert.equal(that.drawnElements[2].style.strokeStyle, '#f2f2f2', 'Stroke element stroke color');
            assert.roughEqual(that.drawnElements[2].style.globalAlpha, 0.3, 0.1, 'Stroke element stroke opacity');
            assert.equal(that.drawnElements[2].style.lineWidth, 1, 'Stroke element stroke width');
            assert.equal(that.drawnElements[2].style.textAlign, 'start', 'Stroke element stroke textAlign');
            assert.equal(that.drawnElements[2].args[0], 'Text1', 'First line. Text');
            assert.equal(that.drawnElements[2].args[1], 0, 'First line. X coord');
            assert.equal(that.drawnElements[2].args[2], 0, 'First line. Y coord');
            assert.deepEqual(that.drawnElements[2].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });

            assert.equal(that.drawnElements[3].type, 'text', '2nd stroked element\'s fillText');
            assert.equal(that.drawnElements[3].style.weight, 'bold', 'Style weight');
            assert.equal(that.drawnElements[3].style.font, '"Trebuchet MS",Verdana', 'Style font');
            assert.equal(that.drawnElements[3].style.size, '14px', 'Style size');
            assert.equal(that.drawnElements[3].style.style, 'italic', 'Style');
            assert.equal(that.drawnElements[3].style.fillStyle, '#232323', 'Style fill');
            assert.equal(that.drawnElements[3].style.textAlign, 'start', 'Text element textAlign');
            assert.equal(that.drawnElements[3].style.globalAlpha, 1, 'Style opacity');
            assert.equal(that.drawnElements[3].args[0], 'Text2', 'Text');
            assert.equal(that.drawnElements[3].args[1], 0, 'X coord');
            assert.equal(that.drawnElements[3].args[2], 13, 'Y coord');
            assert.deepEqual(that.drawnElements[3].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });

            assert.equal(that.drawnElements[4].type, 'strokeText', '2nd stroked element\'s strokeText');
            assert.equal(that.drawnElements[4].style.weight, 'bold', 'Stroke element style weight');
            assert.equal(that.drawnElements[4].style.font, '"Trebuchet MS",Verdana', 'First line. Style font');
            assert.equal(that.drawnElements[4].style.size, '14px', 'Stroke element font-size');
            assert.equal(that.drawnElements[4].style.style, 'italic', 'Stroke element font-style');
            assert.equal(that.drawnElements[4].style.fillStyle, '#232323', 'Stroke element fill color');
            assert.equal(that.drawnElements[4].style.strokeStyle, '#f2f2f2', 'Stroke element stroke color');
            assert.roughEqual(that.drawnElements[4].style.globalAlpha, 0.3, 0.1, 'Stroke element stroke opacity');
            assert.equal(that.drawnElements[4].style.lineWidth, 1, 'Stroke element stroke width');
            assert.equal(that.drawnElements[4].style.textAlign, 'start', 'Stroke element stroke textAlign');
            assert.equal(that.drawnElements[4].args[0], 'Text2', 'First line. Text');
            assert.equal(that.drawnElements[4].args[1], 0, 'First line. X coord');
            assert.equal(that.drawnElements[4].args[2], 13, 'First line. Y coord');
            assert.deepEqual(that.drawnElements[4].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });

            assert.equal(that.drawnElements[5].type, 'text', '3rd element\'s fillText');
            assert.equal(that.drawnElements[5].style.weight, 'bold', 'Style weight');
            assert.equal(that.drawnElements[5].style.font, '"Trebuchet MS",Verdana', 'Style font');
            assert.equal(that.drawnElements[5].style.size, '14px', 'Style size');
            assert.equal(that.drawnElements[5].style.style, 'italic', 'Style');
            assert.equal(that.drawnElements[5].style.fillStyle, '#232323', 'Style fill');
            assert.equal(that.drawnElements[5].style.textAlign, 'start', 'Text element textAlign');
            assert.equal(that.drawnElements[5].style.globalAlpha, 1, 'Style opacity');
            assert.equal(that.drawnElements[5].args[0], 'Text1', 'Text');
            assert.equal(that.drawnElements[5].args[1], 0, 'X coord');
            assert.equal(that.drawnElements[5].args[2], 0, 'Y coord');
            assert.deepEqual(that.drawnElements[5].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });

            assert.equal(that.drawnElements[6].type, 'text', '4th element\'s fillText');
            assert.equal(that.drawnElements[6].style.weight, 'bold', 'Style weight');
            assert.equal(that.drawnElements[6].style.font, '"Trebuchet MS",Verdana', 'Style font');
            assert.equal(that.drawnElements[6].style.size, '14px', 'Style size');
            assert.equal(that.drawnElements[6].style.style, 'italic', 'Style');
            assert.equal(that.drawnElements[6].style.fillStyle, '#232323', 'Style fill');
            assert.equal(that.drawnElements[6].style.textAlign, 'start', 'Text element textAlign');
            assert.equal(that.drawnElements[6].style.globalAlpha, 1, 'Style opacity');
            assert.equal(that.drawnElements[6].args[0], 'Text2', 'Text');
            assert.equal(that.drawnElements[6].args[1], 0, 'X coord');
            assert.equal(that.drawnElements[6].args[2], 13, 'Y coord');
            assert.deepEqual(that.drawnElements[6].style.shadow, {
                blur: 1,
                color: 'rgba(34, 51, 135, 0.2)',
                offsetX: 0,
                offsetY: 1
            });
        } finally {
            done();
        }
    });
});

QUnit.test('Text with ellipsis', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="50" y="30" transform="translate(0,0)" text-anchor="middle" style="font-size:28px;font-family:\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:200;fill:#232323;cursor:default;">Test...<title>Test test</title></text>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(5);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.filter(function(e) { return e.type === 'text'; }).length, 1, 'Canvas text elements count');

            const text = that.drawnElements[1];
            assert.equal(text.type, 'text', 'Type of first element');
            assert.equal(text.args[0], 'Test...', 'Text');
            assert.equal(text.args[1], 50, 'X coord');
            assert.equal(text.args[2], 30, 'Y coord');
        } finally {
            done();
        }
    });
});

QUnit.test('Text with title does not break context. T450370', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="50" y="30" transform="translate(0,0)" text-anchor="middle" style="font-size:28px;font-family:\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:200;fill:#232323;cursor:default;">Test...<title>Test test</title></text>' + testingMarkupEnd;
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(2);
    $.when(getData(markup)).done(function(blob) {
        try {
            assert.equal(context.save.callCount, 2, 'Context saving count');
            assert.equal(context.restore.callCount, 2, 'Context restoring count');
        } finally {
            done();
        }
    });
});

QUnit.test('Text with °. On error behavior', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="0" y="0" transform="translate(100,10) rotate(270,100,10)" style="fill:#767676;font-size:16px;font-family:\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:400;" text-anchor="middle">Temperature, °C</text>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 2, 'drawn elements length');
            assert.equal(that.drawnElements[1].type, 'text', 'text');
            assert.equal(that.drawnElements[1].args[0], 'Temperature, °C', 'Text');
        } finally {
            done();
        }
    });
});

QUnit.test('Text decoration', function(assert) {
    const that = this;
    const done = assert.async();
    const context = window.CanvasRenderingContext2D.prototype;
    const element = createSvgElement(
        testingMarkupStart
            + '<text x="0" y="50" text-anchor="start">'
                + '<tspan>Before text... </tspan>'
                + '<tspan x="500" y="90" text-anchor="end">Underlined text</tspan>'
                + '<tspan x="250" y="30" text-anchor="center">Overlined text</tspan>'
                + '<tspan x="0" y="160" text-anchor="start">Line-through text</tspan>'
                + '<tspan x="250" y="190" text-anchor="middle">After text</tspan>'
                + '<tspan x="250" y="190" text-anchor="middle" fill="none" stroke="none">No filled text(no display)</tspan>'
                + '<tspan x="250" y="190" text-anchor="middle" fill="none" stroke="#222">No filled text(no display)</tspan>'
            + '</text>'
            + testingMarkupEnd
    );

    element.querySelector('text').style = `
        font-family: 'Segoe UI Light'
    `;
    element.querySelectorAll('text > tspan')[1].style = `
        text-decoration: underline;
        font-size: 38px;
        fill: #23FF23;
    `;
    element.querySelectorAll('text > tspan')[2].style = `
        text-decoration: overline;
        font-size: 24px;
        fill: #AAFF23;
    `;
    element.querySelectorAll('text > tspan')[3].style = `
        text-decoration: line-through;
        font-size: 14px;
        fill: #23FFFF;
    `;
    element.querySelectorAll('text > tspan')[5].style = `
        text-decoration: line-through;
    `;
    element.querySelectorAll('text > tspan')[6].style = `
        text-decoration: line-through;
    `;

    context.measureText.withArgs('Underlined text').returns({
        width: 50
    });

    const imageBlob = getData(element, {
        width: 500, height: 250, format: 'png'
    });

    assert.expect(29);
    $.when(imageBlob).done(function(blob) {
        try {
            const underlineDecoration = that.drawnElements[3];
            const overlineDecoration = that.drawnElements[6];
            const lineThroughDecoration = that.drawnElements[9];
            const noDisplayDecoration = that.drawnElements[13];
            const noFillDecoration = that.drawnElements[16];

            // Text decoration common assert
            assert.equal(that.drawnElements.length, 18, 'Canvas elements count');
            assert.equal(context.fillText.callCount, 7, 'fillText called 6 times');
            assert.equal(context.rect.callCount, 5, 'Rect function called 4 times');

            // Underline decoration assert
            assert.equal(underlineDecoration.args.x, 500, 'Underline decoration line x');
            assert.roughEqual(underlineDecoration.args.y, 91.9, 0.5, 'Underline decoration line y');
            assert.roughEqual(underlineDecoration.args.height, 1.9, 0.1, 'Underline decoration line height');
            assert.strictEqual(underlineDecoration.args.width, 50, 'Underline decoration line width');
            assert.equal(that.drawnElements[4].style.fillStyle, '#23ff23', 'Underline decoration line fill color');

            // Overline decoration assert
            assert.equal(overlineDecoration.args.x, 250, 'Overline decoration line x');
            assert.roughEqual(overlineDecoration.args.y, 7.2, 0.5, 'Overline decoration line y');
            assert.roughEqual(overlineDecoration.args.height, 1.2, 0.1, 'Overline decoration line height');
            assert.strictEqual(overlineDecoration.args.width, 100, 'Overline decoration line width');
            assert.equal(that.drawnElements[7].style.fillStyle, '#aaff23', 'Overline decoration line fill color');

            // Line-through decoration assert
            assert.equal(lineThroughDecoration.args.x, 0, 'Line-through decoration line x');
            assert.roughEqual(lineThroughDecoration.args.y, 154.8, 0.5, 'Line-through decoration line y');
            assert.equal(lineThroughDecoration.args.height, 1, 'Line-through decoration line height');
            assert.strictEqual(lineThroughDecoration.args.width, 100, 'Line-through decoration line width');
            assert.equal(that.drawnElements[10].style.fillStyle, '#23ffff', 'Line-through decoration line fill color');


            // noDisplay decoration (no stroke, no fill) assert
            assert.equal(noDisplayDecoration.args.x, 250, 'noDisplay line-through decoration line x');
            assert.roughEqual(noDisplayDecoration.args.y, 186.16, 0.5, 'noDisplay line-through decoration line y');
            assert.equal(noDisplayDecoration.args.height, 1, 'noDisplay line-through decoration line height');
            assert.strictEqual(noDisplayDecoration.args.width, 100, ' noDisplay line-through decoration line width');
            assert.notStrictEqual(that.drawnElements[14].type, 'stroke', 'noDisplay line-through decoration has no stroke');
            assert.notStrictEqual(that.drawnElements[14].type, 'fill', 'noDisplay line-through decoration has no fill');

            // noFill (only stroke) decoration assert
            assert.equal(noFillDecoration.args.x, 250, 'noFill line-through decoration line x');
            assert.roughEqual(noFillDecoration.args.y, 186.16, 0.5, 'noFill line-through decoration line y');
            assert.equal(noFillDecoration.args.height, 1, 'noFill line-through decoration line height');
            assert.strictEqual(noFillDecoration.args.width, 100, ' noFill line-through decoration line width');
            assert.strictEqual(that.drawnElements[17].type, 'stroke', 'noFill line-through decoration has stroke');
        } finally {
            done();
        }
    });
});

QUnit.test('Nested groups', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<g><g stroke-width="4" stroke="#00FF00" opacity="0.5" fill="#ff0000" stroke-linejoin="round"><path d="M 100 20 L 150 25 L 200 58 L 250 40 L 300 30 L 350 12"></path><path d="M 100 10 L 150 15 L 200 48 L 250 30 L 300 20 L 350 2" stroke-width="2" stroke="#FF0000" opacity="1" fill="#0000ff" stroke-linejoin="miter"></path></g></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(9);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 5, 'Canvas elements count');
            assert.equal(that.drawnElements[2].type, 'stroke', 'The element on canvas is stroke');
            assert.equal(that.drawnElements[1].type, 'fill', 'The element on canvas is fill');
            assert.equal(that.drawnElements[4].type, 'stroke', 'The element on canvas is stroke');
            assert.equal(that.drawnElements[3].type, 'fill', 'The element on canvas is fill');

            assert.deepEqual(that.drawnElements[2].style, {
                strokeStyle: '#00ff00',
                strokeLinejoin: 'round',
                lineWidth: 4,
                globalAlpha: 0.5
            }, 'Style of first stroke');
            assert.deepEqual(that.drawnElements[1].style, {
                fillStyle: '#ff0000',
                globalAlpha: 0.5
            }, 'Style of first fill');
            assert.deepEqual(that.drawnElements[4].style, {
                strokeStyle: '#ff0000',
                strokeLinejoin: 'miter',
                lineWidth: 2,
                globalAlpha: 1
            }, 'Style of second stroke');
            assert.deepEqual(that.drawnElements[3].style, {
                fillStyle: '#0000ff',
                globalAlpha: 1
            }, 'Style of second fill');
        } finally {
            done();
        }
    });
});

QUnit.test('Nested translate options', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<g transform="translate(10,10)"><g transform="translate(20,20)"><rect transform="translate(30,30)" x="0" y="0" width="50" height="50" fill="#FF0000"></rect><rect transform="translate(60,0)" x="0" y="0" width="50" height="50" fill="#0000FF"></rect></g><g transform="translate(40,0)"><rect transform="translate(30,30)" x="0" y="0" width="50" height="50" fill="#00FF00"></rect></g></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(9);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(context.translate.callCount, 7, 'translate call count');

            assert.deepEqual(context.translate.getCall(1).args, [10, 10], 'Translation of main group');
            assert.deepEqual(context.translate.getCall(2).args, [20, 20], 'Translation of first child group');
            assert.deepEqual(context.translate.getCall(3).args, [30, 30], 'Translation of first rect');
            assert.deepEqual(context.translate.getCall(4).args, [60, 0], 'Translation of second rect');
            assert.deepEqual(context.translate.getCall(5).args, [40, 0], 'Translation of second child group');
            assert.deepEqual(context.translate.getCall(6).args, [30, 30], 'Translation of third rect');

            assert.equal(context.save.callCount, 6, 'Context saving count');
            assert.equal(context.restore.callCount, 6, 'Context restoring count');
        } finally {
            done();
        }
    });
});

QUnit.test('Order of clip and translate', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><clipPath id="DevExpress_13"><rect x="62" y="78" width="736" height="309" transform="translate(0,0)"></rect></clipPath></defs><g fill="#00ced1" stroke="#00ced1" stroke-width="0" clip-path="url(#DevExpress_13)"><circle cx="0" cy="0" r="28" opacity="0.5" transform="translate(404,245)"></circle></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(13);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(context.translate.callCount, 4, 'Context translation count');
            assert.equal(context.save.callCount, 3, 'Context saving count');
            assert.equal(context.restore.callCount, 3, 'Context restoring count');
            assert.equal(context.clip.callCount, 1, 'Context clipping count');

            assert.ok(context.save.getCall(0).calledBefore(context.translate.getCall(1)), '1 step - save');
            assert.ok(context.translate.getCall(0).calledBefore(context.save.getCall(1)), '2 step - translate');
            assert.ok(context.save.getCall(1).calledBefore(context.translate.getCall(2)), '3 step - save');
            assert.ok(context.translate.getCall(1).calledBefore(context.restore.getCall(0)), '4 step - translate');
            assert.ok(context.restore.getCall(0).calledBefore(context.clip.getCall(0)), '5 step - restore');
            assert.ok(context.clip.getCall(0).calledBefore(context.save.getCall(2)), '6 step - clip');
            assert.ok(context.save.getCall(2).calledBefore(context.translate.getCall(3)), '7 step - save');
            assert.ok(context.translate.getCall(2).calledBefore(context.restore.getCall(1)), '8 step - translate');
            assert.ok(context.restore.getCall(1).calledBefore(context.restore.getCall(2)), '9 step - restore');
        } finally {
            done();
        }
    });
});

QUnit.test('Filled paths with clip path', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><clipPath id="clippath1-part-1"><rect x="0" y="0" width="500" height="30"></rect></clipPath><clipPath id="clippath2"><rect x="0" y="30" width="500" height="30"></rect></clipPath></defs><path d="M 100 10 L 150 15 L 350 2" clip-path="url(someurl#clippath1-part-1)" stroke-width="2" stroke="#FF0000" fill="#0000FF" opacity="0.5"></path><path d="M 100 20 L 150 25 L 350 12" clip-path="url(#clippath2)" stroke-width="2" stroke="#00FF00" fill="#00FF00" opacity="0.5"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const canvasPrototype = window.CanvasRenderingContext2D.prototype;

    assert.expect(19);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 7, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'rect', 'The fourth element on canvas is rect');
            assert.equal(that.drawnElements[4].type, 'rect', 'The seventh element on canvas is rect');

            assert.deepEqual(that.drawnElements[1].args, {
                height: 30,
                width: 500,
                x: 0,
                y: 0
            }, 'First clippath args');
            assert.deepEqual(that.drawnElements[4].args, {
                height: 30,
                width: 500,
                x: 0,
                y: 30
            }, 'Second clippath args');

            assert.equal(canvasPrototype.clip.callCount, 2, 'Two clips');
            assert.equal(canvasPrototype.save.callCount, 4, 'Two saving');
            assert.equal(canvasPrototype.restore.callCount, 4, 'Two restoring');

            assert.ok(canvasPrototype.save.getCall(0).calledBefore(canvasPrototype.beginPath.getCall(0)), 'First - save');
            assert.ok(canvasPrototype.beginPath.getCall(0).calledBefore(canvasPrototype.rect.getCall(0)), 'Second - begin path, for valid clipping');
            assert.ok(canvasPrototype.rect.getCall(0).calledBefore(canvasPrototype.closePath.getCall(0)), 'Third - rect');
            assert.ok(canvasPrototype.closePath.getCall(0).calledBefore(canvasPrototype.stroke.getCall(0)), 'Fourth - close path, for valid clipping');
            assert.ok(canvasPrototype.stroke.getCall(0).calledBefore(canvasPrototype.restore.getCall(1)), 'Fifth - drawing');
            assert.ok(canvasPrototype.restore.getCall(0).calledBefore(canvasPrototype.save.getCall(2)), 'Sixth - restore canvas before new saving');

            assert.equal(that.paths.length, 4, 'There are 4 paths');
            assert.equal(that.paths[0].length, 1, 'One action in first path');
            assert.equal(that.paths[0][0].action, 'Z', 'Closed first path');
            assert.equal(that.paths[2].length, 1, 'One action in third path');
            assert.equal(that.paths[2][0].action, 'Z', 'Closed third path');
        } finally {
            done();
        }
    });
});

QUnit.test('Rect with pattern', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><pattern id="DevExpress_3-hatching-2" width="6" height="6"><rect x="0" y="0" width="6" height="6" fill="#ffa500" opacity="0.75"></rect><path d="M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9" stroke-width="2" stroke="#ffa500"></path></pattern></defs><rect x="10" y="10" width="70" height="150" stroke-width="0" fill="url(someurl#DevExpress_3-hatching-2)" stroke="#ffa500"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(10);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 7, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'rect', 'The first element on canvas is rect');
            assert.equal(that.drawnElements[2].type, 'rect', 'The third element on canvas is rect - pattern');
            assert.equal(that.drawnElements[3].type, 'fill', 'The fourth element on canvas is fill - pattern');
            assert.equal(that.drawnElements[4].type, 'stroke', 'The fifth element on canvas is stroke - pattern');
            assert.equal(that.drawnElements[5].type, 'pattern', 'The sixth element on canvas is pattern');
            assert.equal(that.drawnElements[6].type, 'fill', 'The eight element on canvas is rect');

            assert.deepEqual(that.drawnElements[2].args, {
                height: 6,
                width: 6,
                x: 0,
                y: 0
            }, 'pattern rect args');
            assert.deepEqual(that.drawnElements[3].style, {
                fillStyle: '#ffa500',
                globalAlpha: 0.75
            }, 'pattern rect fill style');
            assert.deepEqual(that.drawnElements[4].style, {
                globalAlpha: 1,
                lineWidth: 2,
                strokeLinejoin: 'miter',
                strokeStyle: '#ffa500'
            }, 'pattern path stroke style');
        } finally {
            done();
        }
    });
});

QUnit.test('Pattern canvas has same siza as pattern', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><pattern id="DevExpress_3" width="6" height="6"><rect x="0" y="0" width="6" height="6" fill="#ffa500" opacity="0.75"></rect><path d="M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9" stroke-width="2" stroke="#ffa500"></path></pattern></defs><rect x="10" y="10" width="70" height="150" stroke-width="0" fill="url(#DevExpress_3)" stroke="#ffa500"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;
    let canvas;

    assert.expect(2);
    $.when(imageBlob).done(function(blob) {
        try {
            canvas = context.createPattern.lastCall.args[0];
            assert.strictEqual(canvas.width, 6);
            assert.strictEqual(canvas.height, 6);
        } finally {
            done();
        }
    });
});

QUnit.test('Pattern with image', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<defs><pattern id="DevExpress_3-hatching-2" width="30" height="30"><image href="/packages/devextreme/testing/content/exporterTestsContent/test-image.png" x="0" y="0" width="30" height="30" preserveAspectRatio="none"></image></pattern></defs><rect x="10" y="10" width="70" height="150" stroke-width="0" fill="url(#DevExpress_3-hatching-2)" stroke="#ffa500"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(6);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 5, 'Canvas elements count');
            assert.equal(that.drawnElements[1].type, 'rect', 'The first element on canvas is rect');
            assert.equal(that.drawnElements[2].type, 'image', 'The third element on canvas is image - pattern');
            assert.equal(that.drawnElements[3].type, 'pattern', 'The fourth element on canvas is pattern');
            assert.equal(that.drawnElements[4].type, 'fill', 'The fifth element on canvas is fill');

            assert.deepEqual(that.drawnElements[2].args, {
                height: 30,
                node: 'IMG',
                src: '/packages/devextreme/testing/content/exporterTestsContent/test-image.png',
                width: 30,
                x: 0,
                y: 0
            }, 'pattern image args');
        } finally {
            done();
        }
    });
});

QUnit.test('Rotated elements', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="0" y="0" transform="translate(-70.5,90.5) rotate(-270,-100.5,10.5)" style="fill:#767676;font-size:16px;font-family:\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:400;" text-anchor="middle">Test text</text><path d="M 150 125 L 300 125" transform="translate(0.5,0.5) rotate(330,300,125)" stroke="#d3d3d3" stroke-width="1"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    assert.expect(15);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(context.translate.callCount, 8, 'translate call count');

            assert.deepEqual(context.translate.getCall(1).args, [-70.5, 90.5], 'first translate args');
            assert.deepEqual(context.translate.getCall(2).args, [-100.5, 10.5], 'second translate args');
            assert.deepEqual(context.translate.getCall(3).args, [100.5, -10.5], 'third translate args');
            assert.deepEqual(context.translate.getCall(4).args, [0, 0], 'fourth translate args');
            assert.deepEqual(context.translate.getCall(5).args, [0.5, 0.5], 'fourth translate args');
            assert.deepEqual(context.translate.getCall(6).args, [300, 125], 'fifth translate args');
            assert.deepEqual(context.translate.getCall(7).args, [-300, -125], 'sixth translate args');

            assert.ok(context.translate.getCall(2).calledBefore(context.rotate.getCall(0)), '1 step - translate');
            assert.ok(context.rotate.getCall(0).calledBefore(context.translate.getCall(3)), '2 step - rotate and translate');

            assert.ok(context.translate.getCall(6).calledBefore(context.rotate.getCall(1)), '3 step - translate');
            assert.ok(context.rotate.getCall(1).calledBefore(context.translate.getCall(7)), '4 step - rotate and translate');

            assert.equal(context.rotate.callCount, 2, 'rotate call count');

            assert.equal(context.rotate.getCall(0).args[0], (-270 * Math.PI) / 180, 'first rotate args');
            assert.equal(context.rotate.getCall(1).args[0], (330 * Math.PI) / 180, 'second rotate args');
        } finally {
            done();
        }
    });
});

QUnit.test('Scaled elements', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<text x="0" y="0" transform="translate(-70.5,90.5) rotate(-270,-100.5,10.5) scale(2)" style="fill:#767676;font-size:16px;font-family:\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:400;" text-anchor="middle">Test text</text><path d="M 150 125 L 300 125" transform="translate(0.5,0.5) rotate(330,300,125) scale(3, 0.5)" stroke="#d3d3d3" stroke-width="1"></path>' + testingMarkupEnd;
    const imageBlob = getData(markup);
    const context = window.CanvasRenderingContext2D.prototype;

    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(context.scale.callCount, 2, 'scale call count');

            assert.deepEqual(context.scale.getCall(0).args, [2, 2]);
            assert.deepEqual(context.scale.getCall(1).args, [3, 0.5]);

            assert.ok(context.rotate.getCall(0).calledBefore(context.scale.getCall(0)));
            assert.ok(context.rotate.getCall(1).calledBefore(context.scale.getCall(1)));
        } finally {
            done();
        }
    });
});

QUnit.test('Elements with visibility', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<g visibility="hidden"><rect x="20" y="20" width="200" height="200" fill="#FF0000"></rect><rect x="50" y="50" width="200" height="200" fill="#00FF00" visibility="visible"></rect></g>' + testingMarkupEnd;
    const imageBlob = getData(markup);

    assert.expect(3);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 3, 'Canvas elements count');
            assert.deepEqual(that.drawnElements[1].args, {
                x: 50,
                y: 50,
                width: 200,
                height: 200
            }, 'Rect args');
            assert.deepEqual(that.drawnElements[2].style, {
                fillStyle: '#00ff00',
                globalAlpha: 1
            }, 'Rect style');
        } finally {
            done();
        }
    });
});

QUnit.test('Do not export elements with \'hidden-for-export\' attribute', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + '<g hidden-for-export="true"><rect x="20" y="20" width="200" height="200" fill="#FF0000"></rect></g><rect x="50" y="50" width="200" height="200" fill="#00FF00"></rect>' + testingMarkupEnd;

    assert.expect(3);
    getData(markup).then(() => {
        try {
            assert.equal(this.drawnElements.length, 3, 'Canvas elements count');
            assert.deepEqual(this.drawnElements[1].args, {
                x: 50,
                y: 50,
                width: 200,
                height: 200
            }, 'Rect args');
            assert.deepEqual(this.drawnElements[2].style, {
                fillStyle: '#00ff00',
                globalAlpha: 1
            }, 'Rect style');
        } finally {
            done();
        }
    });
});

QUnit.test('Defined background color', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="50" y="50" width="200" height="200" fill="#00FF00" visibility="visible"></rect>' + testingMarkupEnd;
    const imageBlob = imageCreator.getData(markup, { width: 500, height: 250, format: 'png', backgroundColor: '#ff0000', margin: 10 }, true);

    assert.expect(4);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.equal(that.drawnElements.length, 3, 'Canvas elements count');
            assert.equal(that.drawnElements[0].type, 'fillRect', 'Fill rect');
            assert.deepEqual(that.drawnElements[0].args, {
                x: -10,
                y: -10,
                width: 520,
                height: 270
            }, 'Background args');
            assert.deepEqual(that.drawnElements[0].style, {
                fillStyle: '#ff0000',
                globalAlpha: 1
            }, 'Background style');
        } finally {
            done();
        }
    });
});

QUnit.test('Undefined background color', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="50" y="50" width="200" height="200" fill="#00FF00" visibility="visible"></rect>' + testingMarkupEnd;
    const imageBlob = imageCreator.getData(markup, { width: 500, height: 250, format: 'png', backgroundColor: '#123456' });

    assert.expect(1);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.deepEqual(that.drawnElements[0].style, {
                fillStyle: '#123456',
                globalAlpha: 1
            }, 'Background style is correct');
        } finally {
            done();
        }
    });
});

QUnit.test('Export.color option', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="50" y="50" width="200" height="200" fill="#00FF00" visibility="visible"></rect>' + testingMarkupEnd;
    const imageBlob = getData(markup, { color: '#aaaaaa' });

    assert.expect(1);
    $.when(imageBlob).done(function(blob) {
        try {
            assert.deepEqual(that.drawnElements[0].style, {
                fillStyle: '#ffffff',
                globalAlpha: 1
            }, 'Background style');
        } finally {
            done();
        }
    });
});

QUnit.test('Read computed style of elements if export target is attached element', function(assert) {
    const that = this;
    const done = assert.async();
    const element = createSvgElement(testingMarkupStart + '<text x="20" y="30">Test</text>' + testingMarkupEnd);
    element.querySelector('text').style = `
        font-style: italic;
        font-size: 16px;
        font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
        font-weight: bold;
        fill: #232323;
        opacity: 0.3;
    `;

    $('#qunit-fixture').append(element);
    this.stubGetComputedStyle(element.childNodes[0], { fill: '#ff0000', 'font-size': '25px', 'font-style': '' });

    const imageBlob = getData($(element));

    assert.expect(9);
    $.when(imageBlob).done(function() {
        try {
            const textElem = that.drawnElements[1];

            assert.equal(textElem.style.weight, 'bold', 'Style weight');

            assert.equal(textElem.type, 'text', 'The second element on canvas is text');
            assert.equal(textElem.style.font, '"Segoe UI Light","Helvetica Neue Light","Segoe UI","Helvetica Neue","Trebuchet MS",Verdana', 'Style font');
            assert.equal(textElem.style.size, '25px', 'Size from computed');
            assert.equal(textElem.style.style, 'italic', 'Style');
            assert.equal(textElem.style.fillStyle, '#ff0000', 'Style fill');
            assert.roughEqual(textElem.style.globalAlpha, 0.3, 0.1, 'Style opacity');
            assert.strictEqual($('#qunit-fixture').children().length, 1);
            assert.strictEqual($('#qunit-fixture').children()[0].nodeName, 'svg');
        } finally {
            done();
        }
    });
});

QUnit.test('Read computed style of elements if export target is attached element. Element passed as renderer', function(assert) {
    const that = this;
    const done = assert.async();
    const element = createSvgElement(testingMarkupStart + '<text x="20" y="30">Test</text>' + testingMarkupEnd);
    element.querySelector('text').style = `
        font-style: italic;
        font-size: 16px;
        font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
        font-weight: bold;
        fill: #232323;
        opacity: 0.3;
    `;

    $('#qunit-fixture').append(element);
    this.stubGetComputedStyle(element.childNodes[0], { fill: '#ff0000', 'font-size': '25px', 'font-style': '' });

    const imageBlob = getData($(element));

    assert.expect(9);
    $.when(imageBlob).done(function() {
        try {
            const textElem = that.drawnElements[1];

            assert.equal(textElem.style.weight, 'bold', 'Style weight');

            assert.equal(textElem.type, 'text', 'The second element on canvas is text');
            assert.equal(textElem.style.font, '"Segoe UI Light","Helvetica Neue Light","Segoe UI","Helvetica Neue","Trebuchet MS",Verdana', 'Style font');
            assert.equal(textElem.style.size, '25px', 'Size from computed');
            assert.equal(textElem.style.style, 'italic', 'Style');
            assert.equal(textElem.style.fillStyle, '#ff0000', 'Style fill');
            assert.roughEqual(textElem.style.globalAlpha, 0.3, 0.1, 'Style opacity');
            assert.strictEqual($('#qunit-fixture').children().length, 1);
            assert.strictEqual($('#qunit-fixture').children()[0].nodeName, 'svg');
        } finally {
            done();
        }
    });
});

QUnit.test('Read computed style of elements. Ignore default opacity', function(assert) {
    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="20" y="30" width="100" height="200" fill="#232323" stroke="#454545" stroke-width="1" stroke-opacity="0.5" fill-opacity="0.5" opacity="0.3" ></rect>' + testingMarkupEnd;
    const element = new window.DOMParser().parseFromString(markup, 'image/svg+xml').childNodes[0];

    $('#qunit-fixture').append(element);
    this.stubGetComputedStyle(element.childNodes[0], { fill: '#ff0000', 'opacity': '1', 'stroke-opacity': '0.1', 'fill-opacity': '' });

    const imageBlob = getData(element);

    assert.expect(4);
    $.when(imageBlob).done(function() {
        try {
            assert.equal(that.drawnElements[2].style.fillStyle, '#ff0000', 'fill');
            assert.roughEqual(that.drawnElements[2].style.globalAlpha, 0.15, 0.001, 'fill opacity');

            assert.equal(that.drawnElements[3].style.strokeStyle, '#454545', 'stroke');
            assert.roughEqual(that.drawnElements[3].style.globalAlpha, 0.03, 0.001, 'stroke opacity');
        } finally {
            done();
        }
    });
});

QUnit.test('Processing of inner SVG', function(assert) {
    const done = assert.async();
    const markup = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="820px" height="420px"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="1" y="2" width="10" height="30"></rect></svg></svg>';
    const context = window.CanvasRenderingContext2D.prototype;
    const imageBlob = getData(markup);

    assert.expect(1);
    $.when(imageBlob).done(function() {
        try {
            assert.deepEqual(context.rect.lastCall.args, [1, 2, 10, 30]);
        } finally {
            done();
        }
    });

});

// T403049
QUnit.test('getElementOptions should work correctly with empty attributs element', function(assert) {
    const done = assert.async();
    const markup = '<svg>Brazil</svg>';
    let parsedAttributes;
    const imageBlob = imageCreator.getData(markup, {
        __parseAttributesFn: function(attributes) {
            parsedAttributes = attributes;
            return {};
        }
    });

    assert.expect(1);
    $.when(imageBlob).done(function() {
        try {
            assert.ok(typeUtils.isDefined(parsedAttributes), 'Attributes are always defined');
        } finally {
            done();
        }
    });
});

QUnit.test('Can use custom parser', function(assert) {
    sinon.spy(svgUtils, 'getSvgElement');

    const that = this;
    const done = assert.async();
    const markup = testingMarkupStart + '<rect x="50" y="50" width="200" height="200" fill="#00FF00" visibility="visible"></rect>' + testingMarkupEnd;
    const svgToCanvas = sinon.spy();
    const imageBlob = imageCreator.getData(markup, {
        width: 500,
        height: 250,
        format: 'png',
        backgroundColor: '#ff0000',
        margin: 10,
        svgToCanvas: svgToCanvas
    }, true);

    $.when(imageBlob).done(() => {
        assert.equal(that.drawnElements.length, 1, 'Canvas elements count');
        assert.equal(that.drawnElements[0].type, 'fillRect', 'Fill rect');
        assert.deepEqual(that.drawnElements[0].args, {
            x: -10,
            y: -10,
            width: 520,
            height: 270
        }, 'Background args');
        assert.deepEqual(that.drawnElements[0].style, {
            fillStyle: '#ff0000',
            globalAlpha: 1
        }, 'Background style');

        assert.equal(svgToCanvas.callCount, 1);
        assert.equal(svgToCanvas.lastCall.args[0], svgUtils.getSvgElement.lastCall.returnValue);
        assert.equal(svgToCanvas.lastCall.args[1], window.CanvasRenderingContext2D.prototype.fillRect.lastCall.thisValue.canvas);
    }).always(() => {
        svgUtils.getSvgElement.restore();
        done();
    });
});

QUnit.test('Custom parser can be asynchronous', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + testingMarkupEnd;
    const deferred = new Deferred();
    const imageBlob = imageCreator.getData(markup, {
        width: 500,
        height: 250,
        format: 'png',
        backgroundColor: '#ff0000',
        margin: 10,
        svgToCanvas() {
            return deferred;
        }
    }, true);
    let i = 0;

    $.when(imageBlob).done(() => {
        assert.equal(i, 1);
    }).always(done);

    setTimeout(function() {
        i = 1;
        deferred.resolve();
    });
});

QUnit.test('Remove canvas if rejected', function(assert) {
    const done = assert.async();
    const markup = testingMarkupStart + testingMarkupEnd;
    const deferred = new Deferred();
    const imageBlob = imageCreator.getData(markup, {
        width: 500,
        height: 250,
        format: 'png',
        backgroundColor: '#ff0000',
        margin: 10,
        svgToCanvas() {
            return deferred;
        }
    }, true);

    $.when(imageBlob).fail(() => {
        assert.strictEqual(window.CanvasRenderingContext2D.prototype.fillRect.lastCall.thisValue.canvas.parentElement, null);
    }).always(done);

    deferred.reject();
});


// T943072
QUnit.module('asyncEach');

QUnit.test('Large array items. All items sync', function(assert) {
    const done = assert.async();
    const arraySize = 7000;
    const callbackSpy = sinon.spy();

    const asyncEachDeferred = exporter.image.asyncEach(new Array(arraySize), callbackSpy);

    asyncEachDeferred.then(() => {
        assert.strictEqual(callbackSpy.callCount, arraySize);
        done();
    });
});

QUnit.test('Some items is async', function(assert) {
    const done = assert.async();
    let callsCounter = 0;
    const arraySize = 5;
    function getDeferred() {
        const d = new Deferred();
        setTimeout(() => {
            d.resolve();
        }, 0);
        return d;
    }
    const callbackSpy = sinon.spy(() => {
        return (callsCounter >= 1 && callsCounter++ <= 3) ? undefined : getDeferred();
    });

    const asyncEachDeferred = exporter.image.asyncEach(new Array(arraySize), callbackSpy);

    asyncEachDeferred.then(function() {
        assert.strictEqual(callbackSpy.callCount, arraySize);
        for(let i = 0; i < arraySize - 1; i++) {
            assert.ok(callbackSpy.getCall(i).calledBefore(callbackSpy.getCall(i + 1)), `Order of calls. ${i}`);
        }
        done();
    });
});

QUnit.module('Tests with private API usage', {
    beforeEach() {
        this.originalGetBlob = imageCreator._getBlob;
        this.originalGetBase64 = imageCreator._getBase64;

        imageCreator._getBlob = () => 'blobData';
        imageCreator._getBase64 = () => 'base64Data';
    },
    afterEach() {
        imageCreator._getBlob = this.originalGetBlob;
        imageCreator._getBase64 = this.originalGetBase64;
    }
}, () => {

    QUnit.test('getData returns Blob when it supported by Browser', function(assert) {
        if(!typeUtils.isFunction(window.Blob)) {
            assert.ok(true, 'Skip if there isn\'t blob');
            return;
        }

        const done = assert.async();
        const markup = '<svg></svg>';

        const deferred = imageCreator.getData(markup, { backgroundColor: '#aaa' });

        assert.expect(1);
        $.when(deferred).done(function(data) {
            assert.strictEqual(data, 'blobData', '_getBlob was called');
            done();
        });
    });

    QUnit.test('data has base64 format if useBase64 is true(T1136337)', function(assert) {
        const done = assert.async();
        const markup = '<svg></svg>';

        const deferred = imageCreator.getData(markup, { useBase64: true });

        assert.expect(1);
        $.when(deferred).done(function(data) {
            assert.strictEqual(data, 'base64Data', 'data has base64 format');
            done();
        });
    });

    QUnit.test('getData returns Base64 when Blob not supported by Browser', function(assert) {
        if(typeUtils.isFunction(window.Blob)) {
            assert.ok(true, 'Skip if there isn\'t Blob');
            return;
        }

        const done = assert.async();
        const markup = '<svg></svg>';

        const deferred = imageCreator.getData(markup, { backgroundColor: '#aaa' });

        assert.expect(1);
        $.when(deferred).done(function(data) {
            assert.strictEqual(data, 'base64Data', '_getBase64 was called');
            done();
        });
    });

});
