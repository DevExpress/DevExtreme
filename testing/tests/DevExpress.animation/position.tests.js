import $ from 'jquery';
import positionUtils from 'animation/position';
import translator from 'animation/translator';
import browser from 'core/utils/browser';
import fixtures from '../../helpers/positionFixtures.js';

const setupPosition = positionUtils.setup;
const calculatePosition = positionUtils.calculate;

const testPosition = (name, fixtureName, params, expectedLeft, expectedTop, debug) => {
    QUnit.test(name, function(assert) {
        if(!expectedLeft && !expectedTop) {
            assert.expect(0);
        }
        fixtures[fixtureName].create();
        try {
            if(debug);
            setupPosition.apply(this, params);
            const what = $(params[0]);
            const pos = what.position();
            expectedLeft && assert.equal(pos.left, expectedLeft);
            expectedTop && assert.equal(pos.top, expectedTop);
        } finally {
            fixtures[fixtureName].drop();
        }
    });
};


const testCollision = (name, fixtureName, params, expectedHorzDist, expectedVertDist, debug) => {
    QUnit.test(name, function(assert) {
        fixtures[fixtureName].create();
        try {
            if(debug);
            setupPosition.apply(this, params);

            const what = $(params[0]);
            const where = $(params[1].of);
            const whatOffset = what.offset();
            const whereOffset = where.offset();

            assert.equal(whatOffset.left - whereOffset.left, expectedHorzDist, 'horizontal coordinate');
            assert.equal(whatOffset.top - whereOffset.top, expectedVertDist, 'vertical coordinate');
        } finally {
            fixtures[fixtureName].drop();
        }
    });

};


(function defaultModule() {

    QUnit.module('default');

    QUnit.test('act as getter', assert => {
        fixtures.simple.create();
        try {
            const pos = setupPosition('#where');
            assert.equal(pos.left, 200);
            assert.equal(pos.top, 200);
        } finally {
            fixtures.simple.drop();
        }
    });

    testPosition(
        'non-exist target',
        'simple',
        ['#what', { of: '#non-exist' }]
    );

    testPosition(
        'defaults',
        'simple',
        ['#what', { of: '#where' }],
        225, 225
    );

    testPosition(
        'my defaults at top',
        'simple',
        ['#what', { at: 'top', of: '#where' }],
        225, 175
    );

    testPosition(
        'my defaults at bottom',
        'simple',
        ['#what', { at: 'bottom', of: '#where' }],
        225, 275
    );

    testPosition(
        'my defaults at left',
        'simple',
        ['#what', { at: 'left', of: '#where' }],
        175, 225
    );

    testPosition(
        'my defaults at right',
        'simple',
        ['#what', { at: 'right', of: '#where' }],
        275, 225
    );

    testPosition(
        'my top at defaults',
        'simple',
        ['#what', { my: 'top', of: '#where' }],
        225, 250
    );

    testPosition(
        'my bottom at defaults',
        'simple',
        ['#what', { my: 'bottom', of: '#where' }],
        225, 200
    );

    testPosition(
        'my left at defaults',
        'simple',
        ['#what', { my: 'left', of: '#where' }],
        250, 225
    );

    testPosition(
        'my right at defaults',
        'simple',
        ['#what', { my: 'right', of: '#where' }],
        200, 225
    );

    testPosition(
        'my top-left at top-left',
        'simple',
        ['#what', { my: 'TOP LEFT', at: 'left \t\n top', of: '#where' }],
        200, 200
    );

    testPosition(
        'my bottom-right at bottom-right',
        'simple',
        ['#what', { my: { x: 'right', y: 'bottom' }, at: { h: 'right', v: 'bottom' }, of: '#where' }],
        250, 250
    );

    testPosition(
        'separate positioned containers',
        'separatePositionedContainers',
        ['#what', { of: '#where' }],
        125, -75
    );

    testPosition(
        'offset, single',
        'simple',
        ['#what', { of: '#where', offset: 5 }],
        230, 230
    );

    testPosition(
        'offset, both',
        'simple',
        ['#what', { of: '#where', offset: '5 -5' }],
        230, 220
    );

    testPosition(
        'target is window',
        'simple',
        ['#what', { my: 'top left', at: 'top left', of: window }],
        0, 0
    );

    testPosition(
        'target is document',
        'simple',
        ['#what', { my: 'top left', at: 'top left', of: document }],
        0, 0
    );

    testPosition(
        'If a position object is passed to DX.position, calculatePosition should not be invoked',
        'simple',
        ['#what', { h: { location: 12345 }, v: { location: 123456 } }],
        12345, 123456
    );

})();

(function collisionTopLeftModule() {

    QUnit.module('collision, top-left corner');

    $.each({
        'none': {
            h: -55,
            v: -55
        },
        'none none': {
            h: -55,
            v: -55
        },
        'fit': {
            h: 0,
            v: 0
        },
        'flip': {
            h: 105,
            v: 105
        },
        'fit fit': {
            h: 0,
            v: 0
        },
        'flip flip': {
            h: 105,
            v: 105
        },
        'flip none': {
            h: 105,
            v: -55
        },
        'fit none': {
            h: 0,
            v: -55
        },
        'none fit': {
            h: -55,
            v: 0
        },
        'none flip': {
            h: -55,
            v: 105
        },
        'fit flip': {
            h: 0,
            v: 105
        },
        'flip fit': {
            h: 105,
            v: 0
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'collisionTopLeft',
            ['#what', { my: 'bottom right', at: 'top left', of: '#where', offset: -5, collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });
})();


(function collisionTopRightModule() {

    QUnit.module('collision, top-right corner');

    $.each({
        'none': {
            h: 105,
            v: -55
        },
        'none none': {
            h: 105,
            v: -55
        },
        'fit': {
            h: 50,
            v: 0
        },
        'flip': {
            h: -55,
            v: 105
        },
        'fit fit': {
            h: 50,
            v: 0
        },
        'flip flip': {
            h: -55,
            v: 105
        },
        'flip none': {
            h: -55,
            v: -55
        },
        'fit none': {
            h: 50,
            v: -55
        },
        'none fit': {
            h: 105,
            v: 0
        },
        'none flip': {
            h: 105,
            v: 105
        },
        'fit flip': {
            h: 50,
            v: 105
        },
        'flip fit': {
            h: -55,
            v: 0
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'collisionTopRight',
            ['#what', { my: 'bottom left', at: 'top right', of: '#where', offset: '5 -5', collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });

})();


(function collisionBottomLeftModule() {
    QUnit.module('collision, bottom-left corner');

    $.each({
        'none': {
            h: -55,
            v: 105
        },
        'none none': {
            h: -55,
            v: 105
        },
        'fit': {
            h: 0,
            v: 50
        },
        'flip': {
            h: 105,
            v: -55
        },
        'fit fit': {
            h: 0,
            v: 50
        },
        'flip flip': {
            h: 105,
            v: -55
        },
        'flip none': {
            h: 105,
            v: 105
        },
        'fit none': {
            h: 0,
            v: 105
        },
        'none fit': {
            h: -55,
            v: 50
        },
        'none flip': {
            h: -55,
            v: -55
        },
        'fit flip': {
            h: 0,
            v: -55
        },
        'flip fit': {
            h: 105,
            v: 50
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'collisionBottomLeft',
            ['#what', { my: 'top right', at: 'bottom left', of: '#where', offset: '-5 5', collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });

})();


(function collisionBottomRightModule() {

    QUnit.module('collision, bottom-right corner');

    $.each({
        'none': {
            h: 105,
            v: 105
        },
        'none none': {
            h: 105,
            v: 105
        },
        'fit': {
            h: 50,
            v: 50
        },
        'flip': {
            h: -55,
            v: -55
        },
        'fit fit': {
            h: 50,
            v: 50
        },
        'flip flip': {
            h: -55,
            v: -55
        },
        'flip none': {
            h: -55,
            v: 105
        },
        'fit none': {
            h: 50,
            v: 105
        },
        'none fit': {
            h: 105,
            v: 50
        },
        'none flip': {
            h: 105,
            v: -55
        },
        'fit flip': {
            h: 50,
            v: -55
        },
        'flip fit': {
            h: -55,
            v: 50
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'collisionBottomRight',
            ['#what', { my: 'top left', at: 'bottom right', of: '#where', offset: '5 5', collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });

})();


(function collisionReturnedValueModule() {

    QUnit.module('collision returned value');

    QUnit.test('returned value is correct when flip vertical', assert => {
        fixtures.collisionBottomRight.create();
        try {
            const result = calculatePosition('#what', { my: 'top right', at: 'bottom right', of: '#where', collision: 'flip' });
            assert.equal(result.h.flip, false, 'horizontal flip not occurred');
            assert.equal(result.v.flip, true, 'vertical flip occurred');
        } finally {
            fixtures.collisionBottomRight.drop();
        }
    });

    QUnit.test('position should be flipped to maximum free space', assert => {
        fixtures.customBoundaryWithLeftTopOffset.create();
        try {
            const $what = $('#what').height(300);
            const $where = $('#where');
            const $boundary = $('#boundary');

            const resultPosition = setupPosition($what, {
                my: 'bottom right',
                at: 'top left',
                of: $where,
                boundary: $boundary,
                collision: 'flip'
            });

            assert.equal(resultPosition.v.flip, true, 'vertical flip occurred');
        } finally {
            fixtures.customBoundaryWithLeftTopOffset.drop();
        }
    });

    QUnit.test('returned value is correct when flip horizontal', assert => {
        fixtures.collisionBottomRight.create();
        try {
            const result = calculatePosition('#what', { my: 'bottom left', at: 'top right', of: '#where', collision: 'flip' });

            assert.equal(result.h.flip, true, 'horizontal flip occurred');
            assert.equal(result.v.flip, false, 'vertical flip not occurred');
        } finally {
            fixtures.collisionBottomRight.drop();
        }
    });

    QUnit.test('returned value is correct when fit vertical', assert => {
        fixtures.collisionBottomRight.create();
        try {
            const result = calculatePosition('#what', { my: 'top right', at: 'bottom right', of: '#where', collision: 'fit' });
            assert.equal(result.h.fit, false, 'horizontal fit not occurred');
            assert.equal(result.v.fit, true, 'vertical fit occurred');
        } finally {
            fixtures.collisionBottomRight.drop();
        }
    });

    QUnit.test('returned value is correct when fit horizontal', assert => {
        fixtures.collisionBottomRight.create();
        try {
            const result = calculatePosition('#what', { my: 'bottom left', at: 'top right', of: '#where', collision: 'fit' });

            assert.equal(result.h.fit, true, 'horizontal fit occurred');
            assert.equal(result.v.fit, false, 'vertical fit not occurred');
        } finally {
            fixtures.collisionBottomRight.drop();
        }
    });

    QUnit.test('returned value is correct when expected flips did not happen because there is less space on the flip side', assert => {
        fixtures.collisionSmallWindow.create();
        try {
            const result = calculatePosition('#what', { my: 'top left', at: 'bottom right', of: '#where', collision: 'flip' });

            assert.equal(result.h.flip, false, 'horizontal flip did not occur');
            assert.equal(result.v.flip, false, 'vertical flip did not occur');
        } finally {
            fixtures.collisionSmallWindow.drop();
        }
    });
})();

(function collisionFlipFitModule() {

    QUnit.module('flipfit (flip without fit)');

    $.each({
        'flipfit none': {
            h: 100,
            v: -100
        },
        'none flipfit': {
            h: -100,
            v: 100
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'customBoundaryWithLeftTopOffset',
            ['#what', { my: 'bottom right', at: 'top left', of: '#where', boundary: '#boundary', collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });

    QUnit.module('flipfit (fit after flip)');

    $.each({
        'flipfit none': {
            h: -50,
            v: -100
        },
        'none flipfit': {
            h: -100,
            v: -50
        }
    }, (methodName, expectedPosition) => {
        testCollision(
            'decollide method \'' + methodName + '\'',
            'customBoundary',
            ['#what', { my: 'bottom right', at: 'top left', of: '#where', boundary: '#boundary', boundaryOffset: '50 50', collision: methodName }],
            expectedPosition.h,
            expectedPosition.v
        );
    });
})();

(function boundaryOffsetModule() {
    QUnit.module('boundary offset');

    testPosition(
        '\'boundaryOffset\' option affects on vertical position',
        'simple',
        ['#what', { my: 'right center', at: 'top left', of: '#where', boundaryOffset: '0 180', collision: 'fit' }],
        150, 180
    );

    testPosition(
        '\'boundaryOffset\' option affects on horizontal position',
        'simple',
        ['#what', { my: 'bottom center', at: 'top left', of: '#where', boundaryOffset: '180 0', collision: 'fit' }],
        180, 150
    );

})();

(function customBoundaryModule() {

    QUnit.module('custom boundary');

    testPosition(
        'custom boundary is used for collision \'fit\'',
        'customBoundary',
        ['#what', { my: 'top center', at: 'right top', collision: 'fit', boundary: '#boundary' }],
        210, 10
    );

    QUnit.test('custom boundary is used for collision \'flip\'', assert => {
        fixtures.customBoundary.create();
        try {
            $('#where').css({ top: '45px' });
            setupPosition('#what', { my: 'right center', at: 'left top', collision: 'flip', boundary: '#boundary', of: '#where' });

            const whatOffset = $('#what').offset();

            assert.equal(whatOffset.left, 10);
            assert.equal(whatOffset.top, 105);
        } finally {
            fixtures.customBoundary.drop();
        }
    });

    testPosition(
        'left boundary offset is applied correctly',
        'customBoundary',
        ['#what', { my: 'top center', at: 'bottom left', of: '#where', boundary: '#boundary', boundaryOffset: '60 0', collision: 'fit' }],
        70, 210
    );

    testPosition(
        'right boundary offset is applied correctly',
        'customBoundary',
        ['#what', { my: 'top center', at: 'bottom right', of: '#where', boundary: '#boundary', boundaryOffset: '60 0', collision: 'fit' }],
        150, 210
    );

    testPosition(
        'top boundary offset is applied correctly',
        'customBoundary',
        ['#what', { my: 'right center', at: 'left top', of: '#where', boundary: '#boundary', boundaryOffset: '0 60', collision: 'fit' }],
        10, 70
    );

    testPosition(
        'bottom boundary offset is applied correctly',
        'customBoundary',
        ['#what', { my: 'right center', at: 'left bottom', of: '#where', boundary: '#boundary', boundaryOffset: '0 60', collision: 'fit' }],
        10, 150
    );

    QUnit.test('bounds should be calculated properly when content is scrolled', assert => {
        fixtures.customBoundary.create();
        const $wrapper = $('<div>').appendTo('body');
        try {
            const $boundary = $('#boundary');

            $boundary.css({
                height: '100%',
                width: '100%',
                left: 0,
                top: 0
            });

            $('#where').css({
                top: $boundary.offset().top,
                left: $boundary.offset().left,
            });

            $wrapper.css({ height: '200%', width: '200%', position: 'absolute', top: '0', left: '0' });

            $('#what')
                .width($boundary.width())
                .height($boundary.height());

            $(window).scrollLeft(20);
            let position = calculatePosition('#what', { my: 'top left', at: 'top left', collision: 'fit', boundary: '#boundary', of: '#where' });

            assert.equal(position.h.oversize, 0, 'horizontal bounds are correct');

            $(window).scrollLeft(0);
            $(window).scrollTop(20);
            position = calculatePosition('#what', { my: 'top left', at: 'top left', collision: 'fit', boundary: '#boundary', of: '#where' });

            assert.equal(position.v.oversize, 0, 'vertical bounds are correct');
        } finally {
            fixtures.customBoundary.drop();
            $wrapper.remove();
        }
    });

})();

(function preciseModule() {

    QUnit.module('precise', {
        beforeEach() {
            fixtures.simple.create();
        },
        afterEach() {
            fixtures.simple.drop();
        }
    });

    QUnit.test('coordinates should not be rounded if option precise is true in calculatePosition method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        const pos = calculatePosition($('#what'), {
            precise: true,
            of: $where,
            at: 'top left',
            my: 'top left'
        });

        assert.equal(pos.h.location, location.top);
        assert.equal(pos.v.location, location.left);
    });

    QUnit.test('coordinates should be rounded if option precise is false in calculatePosition method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        const pos = calculatePosition($('#what'), {
            precise: false,
            of: $where,
            at: 'top left',
            my: 'top left'
        });

        assert.equal(pos.h.location, Math.round(location.top));
        assert.equal(pos.v.location, Math.round(location.left));
    });

    QUnit.test('coordinates should be rounded by default in calculatePosition method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        const pos = calculatePosition($('#what'), {
            of: $where,
            at: 'top left',
            my: 'top left'
        });

        assert.equal(pos.h.location, Math.round(location.top));
        assert.equal(pos.v.location, Math.round(location.left));
    });

    QUnit.test('coordinates should not be rounded if option precise is true in position method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        const $what = $('#what').css({ 'margin-top': 0.5, 'margin-left': 0.5 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        setupPosition($what, {
            precise: true,
            of: $where,
            at: 'top left',
            my: 'top left'
        });
        const pos = translator.locate($what);

        assert.equal(pos.top, location.top - $where.offset().top);
        assert.equal(pos.left, location.left - $where.offset().left);
    });

    QUnit.test('coordinates should be rounded if option precise is false in position method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        const $what = $('#what').css({ 'margin-top': 0.5, 'margin-left': 0.5 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        setupPosition($what, {
            precise: false,
            of: $where,
            at: 'top left',
            my: 'top left'
        });
        const pos = translator.locate($what);

        assert.equal(pos.top, Math.round(location.top - $where.offset().top));
        assert.equal(pos.left, Math.round(location.left - $where.offset().left));
    });

    QUnit.test('coordinates should be rounded by default in position method', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        const $what = $('#what').css({ 'margin-top': 0.5, 'margin-left': 0.5 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        setupPosition($what, {
            of: $where,
            at: 'top left',
            my: 'top left'
        });
        const pos = translator.locate($what);

        assert.equal(pos.top, Math.round(location.top - $where.offset().top));
        assert.equal(pos.left, Math.round(location.left - $where.offset().left));
    });

    QUnit.test('coordinates should not be rounded if option precise is true in calculatePosition used in position method as params', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        const $what = $('#what').css({ 'margin-top': 0.5, 'margin-left': 0.5 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        const positionResult = calculatePosition($what, {
            precise: true,
            of: $where,
            at: 'top left',
            my: 'top left'
        });
        setupPosition($what, positionResult);
        const pos = translator.locate($what);

        assert.equal(pos.top, location.top - $where.offset().top);
        assert.equal(pos.left, location.left - $where.offset().left);
    });

    QUnit.test('coordinates should be rounded if option precise is false in calculatePosition used in position method as params', assert => {
        const $where = $('#where').css({ top: 0, left: 0 });
        const $what = $('#what').css({ 'margin-top': 0.5, 'margin-left': 0.5 });
        translator.move($where, { top: 0.5, left: 0.5 });
        const location = translator.locate($where);

        const positionResult = calculatePosition($what, {
            precise: false,
            of: $where,
            at: 'top left',
            my: 'top left'
        });
        setupPosition($what, positionResult);
        const pos = translator.locate($what);

        assert.equal(pos.top, Math.round(location.top - $where.offset().top));
        assert.equal(pos.left, Math.round(location.left - $where.offset().left));
    });

})();

(function oversizeModule() {

    QUnit.module('oversize');

    QUnit.test('oversize should calculated when flip or fit', assert => {
        fixtures.customBoundaryWithLeftTopOffset.create();
        try {
            const $what = $('#what').height(300);
            const $where = $('#where');
            const $boundary = $('#boundary');

            const resultPosition = setupPosition($what, {
                my: 'bottom right',
                at: 'top left',
                of: $where,
                boundary: $boundary,
                collision: 'fit flip'
            });

            assert.equal(resultPosition.h.oversize, 50, 'horizontal oversize calculated correctly');
            assert.equal(resultPosition.v.oversize, 150, 'vertical oversize calculated correctly');
            assert.equal(resultPosition.h.collisionSide, 'left', 'horizontal collision side is correct');
            assert.equal(resultPosition.v.collisionSide, 'top', 'vertical collision side is correct');
        } finally {
            fixtures.customBoundaryWithLeftTopOffset.drop();
        }
    });

    QUnit.test('oversize should be 0 when collision is none', assert => {
        fixtures.customBoundaryWithLeftTopOffset.create();
        try {
            const $what = $('#what').height(300);
            const $where = $('#where');
            const $boundary = $('#boundary');

            const resultPosition = setupPosition($what, {
                my: 'bottom right',
                at: 'top left',
                of: $where,
                boundary: $boundary,
                collision: 'none none'
            });

            assert.equal(resultPosition.h.oversize, 0, 'horizontal oversize calculated correctly');
            assert.equal(resultPosition.v.oversize, 0, 'vertical oversize calculated correctly');
        } finally {
            fixtures.customBoundaryWithLeftTopOffset.drop();
        }
    });
})();


(function elementOffsetModule() {
    QUnit.module('offset module', {
        beforeEach() {
            fixtures.simple.create();
        },
        afterEach() {
            fixtures.simple.drop();
        }
    });

    QUnit.test('position offset should be equal jQuery offset for DOM nodes', assert => {
        const $element = $('#where').css({ top: 100, left: 40 });
        assert.deepEqual(positionUtils.offset($element), $element.offset(), 'position.offset() is correct');
    });

    QUnit.test('position offset should be null for window', assert => {
        assert.deepEqual(positionUtils.offset($(window)), null, 'position.offset() is correct');
    });

    QUnit.test('position offset should have pageX and pageY for Events', assert => {
        const position = { pageX: 100, pageY: 200 };
        const $event = new $.Event('dxpointerdown', position);

        assert.deepEqual(positionUtils.offset($event), { left: 100, top: 200 }, 'position.offset() is correct');
    });

    QUnit.test('position should return window.innerHeight for mobile safari if window.outerHeight < window.innerHeight', assert => {
        if(browser.msie && parseInt(browser.version.split('.')[0]) <= 11) {
            // skip for ie because we can not write window.innerHeight in IE
            assert.expect(0);
            return;
        }

        const $what = $('#what').height(300);
        const initialInnerHeight = window.innerHeight;
        const initialOuterHeight = window.outerHeight;

        try {
            window.innerHeight = 500;
            window.outerHeight = 200;

            const resultPosition = setupPosition($what, {
                of: $(window)
            });

            assert.roughEqual(resultPosition.v.location, 100, 50, 'vertical location is correct');
        } finally {
            window.innerHeight = initialInnerHeight;
            window.outerHeight = initialOuterHeight;
        }
    });

    // T509285
    QUnit.test('position should return window.innerWidth for mobile safari if window.outerWidth < window.innerWidth', assert => {
        if(browser.msie && parseInt(browser.version.split('.')[0]) <= 11) {
            // skip for ie because we can not write window.innerWidth in IE
            assert.expect(0);
            return;
        }

        const $what = $('#what').width(300);
        const initialInnerWidth = window.innerWidth;
        const initialOuterWidth = window.outerWidth;

        try {
            window.innerWidth = 500;
            window.outerWidth = 200;

            const resultPosition = setupPosition($what, {
                of: $(window)
            });

            assert.roughEqual(resultPosition.h.location, 100, 50, 'vertical location is correct');
        } finally {
            window.innerWidth = initialInnerWidth;
            window.outerWidth = initialOuterWidth;
        }
    });

    // T750017
    QUnit.test('position should return window.innerWidth for chrome on android if window.outerHeight === window.innerHeight but window height is less then innerHeight', assert => {
        if(browser.msie && parseInt(browser.version.split('.')[0]) <= 11) {
            // skip for ie because we can not write window.innerWidth in IE
            assert.expect(0);
            return;
        }

        const $what = $('#what').height(50);
        const initialInnerHeight = window.innerHeight;
        const initialOuterHeight = window.outerHeight;

        try {
            window.innerHeight = 2000;
            window.outerHeight = 2000;

            const resultPosition = setupPosition($what, {
                of: $(window)
            });

            assert.roughEqual(resultPosition.v.location, (window.innerHeight - 50) / 2, 25, 'innerHeight was used as window height');
        } finally {
            window.innerHeight = initialInnerHeight;
            window.outerHeight = initialOuterHeight;
        }
    });

    QUnit.test('position should return window.innerWidth for chrome on android if window.outerHeight < window.innerHeight but window.height is less then innerHeight in Safari', assert => {
        if(!browser.safari) {
            assert.expect(0);
            return;
        }

        const $what = $('#what').height(50);
        const initialInnerHeight = window.innerHeight;
        const initialOuterHeight = window.outerHeight;

        try {
            window.innerHeight = 2000;
            window.outerHeight = 2010;

            const resultPosition = setupPosition($what, {
                of: $(window)
            });

            assert.roughEqual(resultPosition.v.location, (window.innerHeight - 50) / 2, 25, 'innerHeight was used as window height');
        } finally {
            window.innerHeight = initialInnerHeight;
            window.outerHeight = initialOuterHeight;
        }
    });

    // T664522
    QUnit.test('setup should call resetPosition with finishTransition argument', assert => {
        const origResetPosition = translator.resetPosition;

        translator.resetPosition = ($element, finishTransition) => {
            assert.equal(finishTransition, true, 'finishTransition is true');
        };

        try {
            const $what = $('#what').width(100);

            setupPosition($what, {
                of: $(window)
            });
        } finally {
            translator.resetPosition = origResetPosition;
        }
    });
})();
