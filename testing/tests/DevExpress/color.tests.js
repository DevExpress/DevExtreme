var Color = require('color');

QUnit.module('Colors parsing', {
    beforeEach: function() {
        this.check = function(color, expected, message, assert) {
            if(typeof expected.colorIsInvalid === 'undefined') {
                expected.colorIsInvalid = false;
            }

            assert.ok(color instanceof Color, message + ' - instance');
            assert.equal(color.colorIsInvalid, expected.colorIsInvalid);
            assert.strictEqual(color.r, expected.r, message + ' - r');
            assert.strictEqual(color.g, expected.g, message + ' - g');
            assert.strictEqual(color.b, expected.b, message + ' - b');
            assert.strictEqual(color.a, expected.a, message + ' - a');
        };
        this.checkHsv = function(color, h, s, v, message, assert) {
            assert.ok(color instanceof Color, message + ' - instance');
            assert.strictEqual(color.hsv.h, h, message + ' - h');
            assert.strictEqual(color.hsv.s, s, message + ' - s');
            assert.strictEqual(color.hsv.v, v, message + ' - v');
        };
        this.checkHsl = function(color, h, s, l, message, assert) {
            assert.ok(color instanceof Color, message + ' - instance');
            assert.strictEqual(color.hsl.h, h, message + ' - h');
            assert.strictEqual(color.hsl.s, s, message + ' - s');
            assert.strictEqual(color.hsl.l, l, message + ' - l');
        };
    }
});

QUnit.test('named colors', function(assert) {
    this.check(new Color('red'), { r: 255, g: 0, b: 0, a: 1 }, 'red', assert);
    this.check(new Color('aqua'), { r: 0, g: 255, b: 255, a: 1 }, 'aqua', assert);
    this.check(new Color('green'), { r: 0, g: 128, b: 0, a: 1 }, 'green', assert);

    this.checkHsv(new Color('red'), 0, 100, 100, 'red', assert);
    this.checkHsv(new Color('aqua'), 180, 100, 100, 'aqua', assert);
    this.checkHsv(new Color('green'), 120, 100, 50, 'green', assert);
});

QUnit.test('#xxxxxx colors', function(assert) {
    this.check(new Color('#de12A7'), { r: 222, g: 18, b: 167, a: 1 }, '#de12A7', assert);
    this.check(new Color('#AF99ed'), { r: 175, g: 153, b: 237, a: 1 }, '#AF99ed', assert);
    this.check(new Color('#000dF1'), { r: 0, g: 13, b: 241, a: 1 }, '#000dF1', assert);

    this.checkHsv(new Color('#de12A7'), 316, 92, 87, '#de12A7', assert);
    this.checkHsv(new Color('#AF99ed'), 256, 35, 93, '#AF99ed', assert);
    this.checkHsv(new Color('#000dF1'), 237, 100, 95, '#000dF1', assert);
});

QUnit.test('#xxx colors', function(assert) {
    this.check(new Color('#8Ae'), { r: 136, g: 170, b: 238, a: 1 }, '#8Ae', assert);
    this.check(new Color('#012'), { r: 0, g: 17, b: 34, a: 1 }, '#012', assert);
    this.check(new Color('#AdF'), { r: 170, g: 221, b: 255, a: 1 }, '#AdF', assert);

    this.checkHsv(new Color('#8Ae'), 220, 43, 93, '#8Ae', assert);
    this.checkHsv(new Color('#012'), 210, 100, 13, '#012', assert);
    this.checkHsv(new Color('#AdF'), 204, 33, 100, '#AdF', assert);
});

QUnit.test('rgb(x,x,x) colors', function(assert) {
    this.check(new Color('rgb(10, 23, 140)'), { r: 10, g: 23, b: 140, a: 1 }, 'rgb(10, 23, 140)', assert);
    this.check(new Color('rgb(0,3,100)'), { r: 0, g: 3, b: 100, a: 1 }, 'rgb(0,3,100)', assert);
    this.check(new Color('rgb( 100, 244, 120 )'), { r: 100, g: 244, b: 120, a: 1 }, 'rgb( 100, 244, 120 )', assert);

    this.checkHsv(new Color('rgb(10, 23, 140)'), 234, 93, 55, 'rgb(10, 23, 140)', assert);
    this.checkHsv(new Color('rgb(0,3,100)'), 238, 100, 39, 'rgb(0,3,100)', assert);
    this.checkHsv(new Color('rgb( 100, 244, 120 )'), 128, 59, 96, 'rgb( 100, 244, 120 )', assert);

    this.checkHsl(new Color('rgb(10, 23, 140)'), 234, 87, 29, 'rgb(10, 23, 140)', assert);
    this.checkHsl(new Color('rgb(0,3,100)'), 238, 100, 20, 'rgb(0,3,100)', assert);
    this.checkHsl(new Color('rgb( 100, 244, 120 )'), 128, 87, 67, 'rgb( 100, 244, 120 )', assert);
});

QUnit.test('hsv(x,x,x) colors', function(assert) {
    this.check(new Color('hsv(234, 93, 55)'), { r: 10, g: 23, b: 140, a: 1 }, 'hsv(234, 93, 55)', assert);
    this.check(new Color('hsv(238,100,39)'), { r: 0, g: 3, b: 99, a: 1 }, 'hsv(238,100,39)', assert);
    this.check(new Color('hsv( 128, 59, 96 )'), { r: 100, g: 245, b: 120, a: 1 }, 'hsv( 128, 59, 96 )', assert);
    this.check(new Color('hsv(252, 0, 40 )'), { r: 102, g: 102, b: 102, a: 1 }, 'hsv(252, 0, 40)', assert);

    this.checkHsv(new Color('hsv(234, 93, 55)'), 234, 93, 55, 'hsv(234, 93, 55)', assert);
    this.checkHsv(new Color('hsv(238,100,39)'), 238, 100, 39, 'hsv(238,100,39)', assert);
    this.checkHsv(new Color('hsv( 128, 59, 96 )'), 128, 59, 96, 'hsv( 128, 59, 96 )', assert);
    this.checkHsv(new Color('hsv(252, 0, 40)'), 252, 0, 40, 'hsv(252, 0, 40)', assert);

    this.checkHsl(new Color('hsv(234, 93, 55)'), 234, 87, 29, 'hsv(234, 93, 55)', assert);
    this.checkHsl(new Color('hsv(238,100,39)'), 238, 100, 19, 'hsv(238,100,39)', assert);
    this.checkHsl(new Color('hsv( 128, 59, 96 )'), 128, 88, 68, 'hsv( 128, 59, 96 )', assert);
    this.checkHsl(new Color('hsv(252, 0, 40)'), 0, 0, 40, 'hsv(252, 0, 40)', assert);
});

QUnit.test('rgba(x,x,x,x) colors', function(assert) {
    this.check(new Color('rgba(10, 23, 140, 0.5)'), { r: 10, g: 23, b: 140, a: 0.5 }, 'rgba(10, 23, 140, 0.5)', assert);
    this.check(new Color('rgba(0, 3, 100, .7)'), { r: 0, g: 3, b: 100, a: 0.7 }, 'rgba(0, 3, 100, .7)', assert);
    this.check(new Color('rgba(100, 244, 120, 1)'), { r: 100, g: 244, b: 120, a: 1 }, 'rgba(100, 244, 120, 1)', assert);

    this.checkHsv(new Color('rgba(10, 23, 140, 0.5)'), 234, 93, 55, 'rgba(10, 23, 140, 0.5)', assert);
    this.checkHsv(new Color('rgba(0, 3, 100, .7)'), 238, 100, 39, 'rgba(0, 3, 100, .7)', assert);
    this.checkHsv(new Color('rgba(100, 244, 120, 1)'), 128, 59, 96, 'rgba(100, 244, 120, 1)', assert);
});

QUnit.test('hsl(x,x,x) colors', function(assert) {
    this.check(new Color('hsl(234, 93, 55)'), { r: 34, g: 55, b: 247, a: 1 }, 'hsv(234, 93, 55)', assert);
    this.check(new Color('hsl(238,100,39)'), { r: 0, g: 7, b: 199, a: 1 }, 'hsl(238,100,39)', assert);
    this.check(new Color('hsl( 128, 59, 96 )'), { r: 239, g: 251, b: 240, a: 1 }, 'hsl( 128, 59, 96 )', assert);
    this.check(new Color('hsl(252, 0, 40)'), { r: 102, g: 102, b: 102, a: 1 }, 'hsl(252, 0, 40)', assert);

    this.checkHsv(new Color('hsl(234, 93, 55)'), 234, 86, 97, 'hsl(234, 93, 55)', assert);
    this.checkHsv(new Color('hsl(238,100,39)'), 238, 100, 78, 'hsl(238,100,39)', assert);
    this.checkHsv(new Color('hsl( 128, 59, 96 )'), 125, 5, 98, 'hsl( 128, 59, 96 )', assert);
    this.checkHsv(new Color('hsl(252, 0, 40)'), 0, 0, 40, 'hsl(252, 0, 40)', assert);

    this.checkHsl(new Color('hsl(234, 93, 55)'), 234, 93, 55, 'hsl(234, 93, 55)', assert);
    this.checkHsl(new Color('hsl(238,100,39)'), 238, 100, 39, 'hsl(238,100,39)', assert);
    this.checkHsl(new Color('hsl( 128, 59, 96 )'), 128, 59, 96, 'hsl( 128, 59, 96 )', assert);
    this.checkHsl(new Color('hsl(252, 0, 40)'), 252, 0, 40, 'hsl(252, 0, 40)', assert);
});

QUnit.test('not valid values', function(assert) {
    this.check(new Color('unknown'), { r: 0, g: 0, b: 0, a: 1, colorIsInvalid: true }, 'unknown', assert);
    this.check(new Color(), { r: 0, g: 0, b: 0, a: 1, colorIsInvalid: true }, 'undefined', assert);
    this.check(new Color(null), { r: 0, g: 0, b: 0, a: 1, colorIsInvalid: true }, 'null', assert);

    this.checkHsv(new Color('unknown'), 0, 0, 0, 'unknown', assert);
    this.checkHsv(new Color(), 0, 0, 0, 'undefined', assert);
    this.checkHsv(new Color(null), 0, 0, 0, 'null', assert);
});

QUnit.test('transparent value', function(assert) {
    this.check(new Color('transparent'), { r: 0, g: 0, b: 0, a: 0 }, 'transparent', assert);
});

QUnit.test('get pure color', function(assert) {
    var pureColor = new Color('#1c4a12').getPureColor();
    this.check(pureColor, { r: 47, g: 255, b: 0, a: 1 }, 'pure color as rgb', assert);
    assert.strictEqual(pureColor.toHex(), '#2fff00', 'pure color as hex');
});

QUnit.module('Converting');

QUnit.test('to hex', function(assert) {
    assert.strictEqual(new Color('red').toHex(), '#ff0000', 'red');
    assert.strictEqual(new Color('rgb(10,20,40)').toHex(), '#0a1428', 'rgb(10,20,40)');
    assert.strictEqual(new Color('#A0df10').toHex(), '#a0df10', '#A0df10');
    assert.strictEqual(new Color('#ad9').toHex(), '#aadd99', '#ad9');
    assert.strictEqual(new Color('hsv(128, 70, 51)').toHex(), '#278233', 'hsv(128, 70, 51)');
    assert.strictEqual(new Color('rgba(10, 20, 40, .5)').toHex(), '#0a1428', 'rgba(10,20,40)');
});

QUnit.test('T266166 - color should be converted from hsv to rgb correctly when hue is 360', function(assert) {
    var color = new Color();
    color.hsv.h = 360;
    assert.equal(color.getPureColor().toHex(), '#ff0000', 'converted color is correct');
});

QUnit.module('Darkening and highlighting');

QUnit.test('Highlight color on the edge', function(assert) {
    // arrange
    // act
    var color = new Color('red');
    // assert
    assert.ok(color);
    assert.equal(color.highlight(), '#ff0a0a');

});

QUnit.test('Highlight intermediate color with custom step', function(assert) {
    // arrange
    // act
    var color = new Color('#010101');
    // assert
    assert.ok(color);
    assert.equal(color.highlight(11), '#0c0c0c');
});

QUnit.test('Highlight intermediate color', function(assert) {
    // arrange
    // act
    var color = new Color('#010101');
    // assert
    assert.ok(color);
    assert.equal(color.highlight(), '#0b0b0b');
});

QUnit.test('Darken color on the edge', function(assert) {
    // arrange
    // act
    var color = new Color('#001F00');
    // assert
    assert.equal(color.darken(), '#001500');
});

QUnit.test('Darken intermediate color', function(assert) {
    // arrange
    // act
    var color = new Color('#1F1F1F');
    // assert
    assert.equal(color.darken(), '#151515');
});

QUnit.test('Darken intermediate color with custom step', function(assert) {
    // arrange
    // act
    var color = new Color('#1F1F1F');
    // assert
    assert.equal(color.darken(11), '#141414');
});

QUnit.test('Alter color width positive step', function(assert) {
    var color = new Color('#1F1F1F'),
        newColor = color.alter(10).toHex();

    assert.equal(newColor, '#292929');
});

QUnit.test('Alter color with negative step', function(assert) {
    var color = new Color('#1F1F1F'),
        newColor = color.alter(-10).toHex();

    assert.equal(newColor, '#151515');
});

QUnit.module('Blending');

QUnit.test('blend', function(assert) {
    assert.strictEqual(new Color('#a9f302').blend('#90129a', 0.25).toHex(), '#a3bb28', '#a9f302 - #90129a 0.25');
    assert.strictEqual(new Color('#30fa9f').blend('#a78900', 0.4).toHex(), '#60cd5f', '#30fa9f - #a78900 0.4');
    assert.strictEqual(new Color('#09a0dd').blend('#8eefd4', 0.7).toHex(), '#66d7d7', '#09a0dd - #8eefd4 0.7');
});

QUnit.test('blend - paired', function(assert) {
    assert.strictEqual(new Color('#90129a').blend('#a9f302', 0.75).toHex(), '#a3bb28', '#90129a - #a9f302 0.75');
    assert.strictEqual(new Color('#a78900').blend('#30fa9f', 0.6).toHex(), '#60cd5f', '#a78900 - #30fa9f 0.6');
    assert.strictEqual(new Color('#8eefd4').blend('#09a0dd', 0.3).toHex(), '#66d7d7', '#8eefd4 - #09a0dd 0.3');
});

QUnit.module('Color validation');

QUnit.test('is valid hex', function(assert) {
    var color = new Color();
    assert.equal(color.isValidHex('#ff0000'), true);
    assert.equal(color.isValidHex('#0000FF'), true);
    assert.equal(color.isValidHex('#606060'), true);
    assert.equal(color.isValidHex('#FFF'), true);
    assert.equal(color.isValidHex('646400'), false);
    assert.equal(color.isValidHex('#0000ZZ'), false);
    assert.equal(color.isValidHex('100'), false);
    assert.equal(color.isValidHex('#FFX'), false);
});

QUnit.test('is valid RGB', function(assert) {
    var color = new Color();
    assert.equal(color.isValidRGB(0, 0, 0), true);
    assert.equal(color.isValidRGB(250, 100, 255), true);
    assert.equal(color.isValidRGB(-250, 100, 255), false);
    assert.equal(color.isValidRGB(250, 400, 255), false);
    assert.equal(color.isValidRGB(250, 'sdsd', 255), false);
    assert.equal(color.isValidRGB(250, null, 100), false);
    assert.equal(color.isValidRGB(250, 100), false);
    assert.equal(color.isValidRGB(250, 100, NaN), false);
    assert.equal(color.isValidRGB(250, 100, 123.5), false);
});

QUnit.test('is valid alpha', function(assert) {
    var color = new Color();
    assert.equal(color.isValidAlpha(0), true);
    assert.equal(color.isValidAlpha(0.8), true);
    assert.equal(color.isValidAlpha(1), true);
    assert.equal(color.isValidAlpha(-0.5), false);
    assert.equal(color.isValidAlpha(), false);
    assert.equal(color.isValidAlpha(100), false);
    assert.equal(color.isValidAlpha('sdss'), false);
});
