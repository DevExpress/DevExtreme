"use strict";

var $ = require("jquery"),
    Color = require("color"),
    paletteModule = require("viz/palette");

var environment = {
    beforeEach: function() {
        this.registerPalette = paletteModule.registerPalette;
        this.getPalette = paletteModule.getPalette;
        this.Palette = paletteModule.Palette;
        this.DiscretePalette = paletteModule.DiscretePalette;
        this.palettes = paletteModule._DEBUG_palettes;
        this.__original_palettes = $.extend(true, {}, this.palettes);
    },
    afterEach: function() {
        $.each(this.palettes, $.proxy(function(name) {
            delete this.palettes[name];
        }, this));
        $.extend(true, this.palettes, this.__original_palettes);
    }
};

QUnit.module("registerPalette", environment);

QUnit.test('Register palette', function(assert) {
    //act
    this.registerPalette('Custom Palette', ['red', 'green', 'blue']);

    //assert
    assert.deepEqual(this.palettes['custom palette'], { simpleSet: ['red', 'green', 'blue'] });
});

QUnit.test('Register palette (new style)', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2'],
        gradientSet: ['g1', 'g2']
    });

    assert.deepEqual(this.palettes['custom palette'], {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2'],
        gradientSet: ['g1', 'g2']
    });
});

QUnit.test('Register palette with same name', function(assert) {
    //act
    this.registerPalette('Custom Palette', ['red', 'green', 'blue']);
    this.registerPalette('Custom Palette', ['black', 'grey']);

    //assert
    assert.deepEqual(this.palettes['custom palette'], { simpleSet: ['black', 'grey'] });
});

QUnit.test('Register palette with same name (new style)', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2', 'd3']
    });
    this.registerPalette('Custom Palette', {
        simpleSet: ['c4', 'c5'],
        gradientSet: ['g1', 'g2']
    });
    this.registerPalette('Custom Palette', {
        indicatingSet: ['d4', 'd5']
    });

    assert.deepEqual(this.palettes['custom palette'], {
        simpleSet: ['c4', 'c5'],
        indicatingSet: ['d4', 'd5'],
        gradientSet: ['g1', 'g2']
    });
});

QUnit.test('Register not valid palette', function(assert) {
    this.registerPalette('Custom Palette', 'test-value');

    assert.ok(!this.palettes['custom palette']);
});

QUnit.test('Register not valid palette over palette', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2'],
        gradientSet: ['g1', 'g2']
    });
    this.registerPalette('Custom Palette', null);

    assert.deepEqual(this.palettes['custom palette'], {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2'],
        gradientSet: ['g1', 'g2']
    });
});

QUnit.module('getPalette', environment);

QUnit.test('Get palette by name', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });
    assert.deepEqual(this.getPalette('custom PALETTE', {}).simpleSet, ['c1', 'c2', 'c3'], 'simpleSet');
    assert.deepEqual(this.getPalette('Custom Palette', { type: 'indicatingSet' }), ['d1', 'd2'], 'indicatingSet');
});

QUnit.test('Get palette by unknown name', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });

    assert.deepEqual(this.getPalette('Custom Palette 2', {}).simpleSet, this.palettes['default'].simpleSet, 'simpleSet');
    assert.deepEqual(this.getPalette('Custom Palette 2', { type: 'indicatingSet' }), this.palettes['default'].indicatingSet, 'indicatingSet');
});

QUnit.test('Get palette by name and theme', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });
    this.registerPalette('Custom Palette', {
        simpleSet: ['e1', 'e2', 'e3', 'e4'],
        indicatingSet: ['f1', 'f2', 'f3']
    }, 'Super Theme');

    assert.deepEqual(this.getPalette('Custom Palette').simpleSet, ['e1', 'e2', 'e3', 'e4'], 'simpleSet');
    assert.deepEqual(this.getPalette('Custom Palette', { type: 'indicatingSet' }), ['f1', 'f2', 'f3'], 'indicatingSet');
});

QUnit.test('Get palette by array', function(assert) {
    assert.deepEqual(this.getPalette(['a1', 'a2', 'a3']), ['a1', 'a2', 'a3']);
});

QUnit.module("Palette", $.extend({}, environment, {
    checkPalette: function(assert, palette, expectedColors, message) {
        var i = 0, ii = expectedColors.length * 2,
            actual = [],
            expected = expectedColors.concat(expectedColors);
        for(; i < ii; ++i) {
            actual.push(palette.getNextColor());
        }
        assert.deepEqual(actual, expected, message);
    }
}));

QUnit.test('Instance type', function(assert) {
    var palette = new this.Palette();
    assert.ok(palette instanceof this.Palette);
});

QUnit.test('Disposing', function(assert) {
    //arrange
    var palette = new this.Palette(['green', 'red'], { useHighlight: true });

    //act
    palette.dispose();

    //assert
    assert.strictEqual(palette._originalPalette, null, '_originalPalette');
    assert.strictEqual(palette._palette, null, '_palette');
    assert.strictEqual(palette._paletteSteps, null, '_paletteSteps');
});

QUnit.test('Custom palette by name', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });

    this.checkPalette(assert, new this.Palette('Custom Palette'), ['c1', 'c2', 'c3'], 'simpleSet');
    this.checkPalette(assert, new this.Palette('Custom Palette', { type: 'indicatingSet' }), ['d1', 'd2'], 'indicatingSet');
});

QUnit.test('Custom palette by unknown name', function(assert) {
    this.registerPalette('Custom Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });

    this.checkPalette(assert, new this.Palette('Custom Palette 2'), this.palettes['default'].simpleSet, 'simpleSet');
});

QUnit.test('Custom palette by array', function(assert) {
    this.checkPalette(assert, new this.Palette(['a1', 'a2', 'a3']), ['a1', 'a2', 'a3']);
});

QUnit.test('Lightening palette', function(assert) {
    //act
    var palette = new this.Palette(['green', 'red'], { useHighlight: true });

    //assert
    assert.strictEqual(palette.getNextColor(), 'green');
    assert.strictEqual(palette.getNextColor(), 'red');
    assert.strictEqual(palette.getNextColor(), "#32b232");
    assert.strictEqual(palette.getNextColor(), "#ff3232");
});

QUnit.test('Darkening palette after lightening', function(assert) {
    //act
    var palette = new this.Palette(['green', 'red'], { useHighlight: true });

    //assert
    assert.strictEqual(palette.getNextColor(), 'green');
    assert.strictEqual(palette.getNextColor(), 'red');

    assert.strictEqual(palette.getNextColor(), "#32b232");
    assert.strictEqual(palette.getNextColor(), "#ff3232");

    assert.strictEqual(palette.getNextColor(), "#199919");
    assert.strictEqual(palette.getNextColor(), "#cd0000");

    assert.strictEqual(palette.getNextColor(), "green");
    assert.strictEqual(palette.getNextColor(), "red");
});

QUnit.test('Lightening palette when color is too light', function(assert) {
    //act
    var palette = new this.Palette(['white'], { useHighlight: true });

    //assert
    assert.strictEqual(palette.getNextColor(), 'white');
    assert.strictEqual(palette.getNextColor(), "#e6e6e6");
});

QUnit.test('Darken palette when color is too dark', function(assert) {
    //act
    var palette = new this.Palette(['black'], { useHighlight: true });

    //assert
    assert.strictEqual(palette.getNextColor(), 'black');
    assert.strictEqual(palette.getNextColor(), "#000000");
    assert.strictEqual(palette.getNextColor(), "#191919");
    assert.strictEqual(palette.getNextColor(), 'black');
});

QUnit.test('Reset palette', function(assert) {
    //arrange
    var palette = new this.Palette(['green', 'red'], { useHighlight: true });
    palette.getNextColor();
    palette.getNextColor();
    palette.getNextColor();

    //act
    palette.reset();

    //assert
    assert.strictEqual(palette._currentColor, 0);
    assert.deepEqual(palette._palette, ['green', 'red']);

    assert.strictEqual(palette.getNextColor(), 'green');
    assert.strictEqual(palette.getNextColor(), 'red');

    assert.strictEqual(palette.getNextColor(), "#32b232");
    assert.strictEqual(palette.getNextColor(), "#ff3232");

    assert.strictEqual(palette.getNextColor(), "#199919");
    assert.strictEqual(palette.getNextColor(), "#cd0000");

    assert.strictEqual(palette.getNextColor(), "green");
    assert.strictEqual(palette.getNextColor(), "red");
});

QUnit.module('DiscretePalette', $.extend({}, environment, {
    createColors: function(count) {
        var i = 0, step = Math.round(255 / count), r = 0, g = 32, b = 64, list = [], color;
        for(; i < count; ++i) {
            color = new Color();
            color.r = r;
            color.g = g;
            color.b = b;
            list.push(color.toHex());
            r = (r + step) % 255;
            g = (g + step) % 255;
            b = (b + step) % 255;
        }
        return list;
    }
}));

QUnit.test('Instance type', function(assert) {
    var palette = new this.DiscretePalette();
    assert.ok(palette instanceof this.DiscretePalette);
});

QUnit.test('palette is not valid', function(assert) {
    assert.strictEqual(new this.DiscretePalette('', 2).getColor(0), this.palettes['default'].gradientSet[0], 'empty string');
    assert.strictEqual(new this.DiscretePalette(undefined, 2).getColor(0), this.palettes['default'].gradientSet[0], 'undefined');
    assert.strictEqual(new this.DiscretePalette(null, 2).getColor(0), this.palettes['default'].gradientSet[0], 'null');
    assert.strictEqual(new this.DiscretePalette('test', 2).getColor(0), this.palettes['default'].gradientSet[0], 'unknown name');
});

QUnit.test('palette is predefined', function(assert) {
    assert.strictEqual(new this.DiscretePalette('default', 2).getColor(0), this.palettes['default'].gradientSet[0], 'default');
    assert.strictEqual(new this.DiscretePalette('Soft Pastel', 2).getColor(0), this.palettes['soft pastel'].gradientSet[0], 'Soft Pastel');
    assert.strictEqual(new this.DiscretePalette('HARMONY LIGHT', 2).getColor(0), this.palettes['harmony light'].gradientSet[0], 'Harmony Light');
});

QUnit.test('palette is custom object', function(assert) {
    assert.strictEqual(new this.DiscretePalette(['#0fad71', '#d82900'], 2).getColor(0), '#0fad71', 'custom palette 1');
    assert.strictEqual(new this.DiscretePalette(['red', 'blue'], 2).getColor(0), '#ff0000', 'custom palette 2');
});

QUnit.test('palette size is 1', function(assert) {
    var start = new Color('#0f2e89'), end = new Color('#123fd7'),
        palette = new this.DiscretePalette([start.toHex(), end.toHex()], 1);
    assert.strictEqual(palette.getColor(0), start.blend(end, 0.5).toHex(), 'color 0');
    assert.strictEqual(palette.getColor(1), null, 'color 1');
});

QUnit.test('palette size is 2', function(assert) {
    var start = new Color('#ad8902'), end = new Color('#37e90a'),
        palette = new this.DiscretePalette([start.toHex(), end.toHex()], 2);
    assert.strictEqual(palette.getColor(0), start.toHex(), 'color 0');
    assert.strictEqual(palette.getColor(1), end.toHex(), 'color 1');
    assert.strictEqual(palette.getColor(2), null, 'color 2');
});

QUnit.test('palette size is 3', function(assert) {
    var start = new Color('red'), end = new Color('blue'),
        palette = new this.DiscretePalette([start.toHex(), end.toHex()], 3);
    assert.strictEqual(palette.getColor(0), start.toHex(), 'color 0');
    assert.strictEqual(palette.getColor(1), start.blend(end, 0.5).toHex(), 'color 1');
    assert.strictEqual(palette.getColor(2), end.toHex(), 'color 2');
    assert.strictEqual(palette.getColor(3), null, 'color 3');
});

QUnit.test('palette size is 51', function(assert) {
    var start = new Color('#000102'), end = new Color('#fff901'),
        palette = new this.DiscretePalette([start.toHex(), end.toHex()], 51),
        i = 0;
    for(; i < 51; ++i) {
        assert.strictEqual(palette.getColor(i), start.blend(end, i / 50).toHex(), 'color ' + i);
    }
});

QUnit.test('palette size is not valid', function(assert) {
    assert.strictEqual(new this.DiscretePalette('', 0).getColor(0), null, '0');
    assert.strictEqual(new this.DiscretePalette('', 'test').getColor(0), null, 'test');
    assert.strictEqual(new this.DiscretePalette('', -1).getColor(0), null, '-1');
});

QUnit.test('More than 2 colors in source', function(assert) {
    var colors = this.createColors(5),
        palette = new this.DiscretePalette(colors, 5);
    $.each(colors, function(i, color) {
        assert.strictEqual(palette.getColor(i), color, 'color ' + i);
    });
});

QUnit.test('More than 2 colors in source / greater then size / 1', function(assert) {
    var colors = this.createColors(7),
        palette = new this.DiscretePalette(colors, 4);
    assert.strictEqual(palette.getColor(0), colors[0], 'color 0');
    assert.strictEqual(palette.getColor(1), colors[2], 'color 1');
    assert.strictEqual(palette.getColor(2), colors[4], 'color 2');
    assert.strictEqual(palette.getColor(3), colors[6], 'color 3');
});

QUnit.test('More than 2 colors in source / greater then size / 2', function(assert) {
    var colors = this.createColors(4),
        palette = new this.DiscretePalette(colors, 3);
    assert.strictEqual(palette.getColor(0), colors[0], 'color 0');
    assert.strictEqual(palette.getColor(1), new Color(colors[1]).blend(colors[2], 1 / 2).toHex(), 'color 1');
    assert.strictEqual(palette.getColor(2), colors[3], 'color 2');
});

QUnit.test('More than 2 colors in source / less then size / 1', function(assert) {
    var colors = this.createColors(3),
        palette = new this.DiscretePalette(colors, 4);
    assert.strictEqual(palette.getColor(0), colors[0], 'color 0');
    assert.strictEqual(palette.getColor(1), new Color(colors[0]).blend(colors[1], 2 / 3).toHex(), 'color 1');
    assert.strictEqual(palette.getColor(2), new Color(colors[1]).blend(colors[2], 1 / 3).toHex(), 'color 2');
    assert.strictEqual(palette.getColor(3), colors[2], 'color 3');
});

QUnit.test('More than 2 colors in source / less then size / 2', function(assert) {
    var colors = this.createColors(4),
        palette = new this.DiscretePalette(colors, 5);
    assert.strictEqual(palette.getColor(0), colors[0], 'color 0');
    assert.strictEqual(palette.getColor(1), new Color(colors[0]).blend(colors[1], 3 / 4).toHex(), 'color 1');
    assert.strictEqual(palette.getColor(2), new Color(colors[1]).blend(colors[2], 1 / 2).toHex(), 'color 2');
    assert.strictEqual(palette.getColor(3), new Color(colors[2]).blend(colors[3], 1 / 4).toHex(), 'color 3');
    assert.strictEqual(palette.getColor(4), colors[3], 'color 4');
});

QUnit.module("GradientPalette");

QUnit.test("not valid", function(assert) {
    assert.strictEqual(new paletteModule.GradientPalette().getColor(0), paletteModule._DEBUG_palettes["default"].gradientSet[0], "undefined");
    assert.strictEqual(new paletteModule.GradientPalette().getColor(1), paletteModule._DEBUG_palettes["default"].gradientSet[1], "unknown");
});

QUnit.test("predefined", function(assert) {
    var palette = new paletteModule.GradientPalette("violet");
    assert.strictEqual(palette.getColor(0), paletteModule._DEBUG_palettes["violet"].gradientSet[0], "0");
    assert.strictEqual(palette.getColor(1), paletteModule._DEBUG_palettes["violet"].gradientSet[1], "1");
    assert.strictEqual(palette.getColor(0.7), new Color(paletteModule._DEBUG_palettes["violet"].gradientSet[0]).blend(
        paletteModule._DEBUG_palettes["violet"].gradientSet[1], 0.7).toHex(), "0.7");
    assert.strictEqual(palette.getColor("test"), null, "not valid");
    assert.strictEqual(palette.getColor(-1), null, "out of range 1");
    assert.strictEqual(palette.getColor(2), null, "out of range 2");
});

QUnit.test("custom", function(assert) {
    var palette = new paletteModule.GradientPalette(["#00ff00", "#ff0000"]);
    assert.strictEqual(palette.getColor(0), "#00ff00", "0");
    assert.strictEqual(palette.getColor(1), "#ff0000", "1");
    assert.strictEqual(palette.getColor(0.3), new Color("#00ff00").blend("#ff0000", 0.3).toHex(), "0.3");
    assert.strictEqual(palette.getColor(), null, "not valid");
    assert.strictEqual(palette.getColor(-1), null, "out of range 1");
    assert.strictEqual(palette.getColor(2), null, "out of range 2");
});

QUnit.module('Current palette', {
    beforeEach: function() {
        this.currentPalette = paletteModule.currentPalette;
        this.registerPalette = paletteModule.registerPalette;
        this.Palette = paletteModule.Palette;
    },
    afterEach: function() {
        this.currentPalette('default');
    }
});

QUnit.test('Getter', function(assert) {
    assert.strictEqual(this.currentPalette(), 'default');
});

QUnit.test('Setter', function(assert) {
    this.currentPalette('soft pastel');

    assert.strictEqual(this.currentPalette(), 'soft pastel');
});

QUnit.test('Setter - case sensitivity', function(assert) {
    this.currentPalette('Soft Pastel');

    assert.strictEqual(this.currentPalette(), 'soft pastel');
});

QUnit.test('Setter - unexisting palette', function(assert) {
    this.currentPalette('AAAAAAAAA');

    assert.strictEqual(this.currentPalette(), 'default');
});

QUnit.test('Setter - unexisting palette after correct change ', function(assert) {
    this.currentPalette('pastel');
    this.currentPalette('AAAAAAAAA');

    assert.strictEqual(this.currentPalette(), 'default');
});

QUnit.test('Create palette with current case', function(assert) {
    this.registerPalette('Current Palette', {
        simpleSet: ['c1', 'c2', 'c3'],
        indicatingSet: ['d1', 'd2']
    });

    this.currentPalette('Current Palette');

    var p = new this.Palette(undefined, {});

    assert.strictEqual(p.getNextColor(), 'c1');

});

QUnit.module('Integration');

QUnit.test('Lightening palette', function(assert) {
    assert.expect(0);

    var $div = $('<div>').appendTo(document.body);
    //act
    var palette = new paletteModule.Palette('default', { useHighlight: true });

    for(var i = 0; i < 70; i++) {
        $('<div>', {
            css: {
                width: 50,
                height: 50,
                backgroundColor: palette.getNextColor(),
                float: 'left'
            }
        }).appendTo($div);
    }
});
