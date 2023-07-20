import { detectTouchEvents, detectPointerEvent } from 'core/utils/support';

const createHasPropertyMock = (...properties) => { return name => properties.indexOf(name) > -1; };

QUnit.module('Touch events detection', () => {
    QUnit.test('touch = true when \'ontouchstart\' exists and \'maxTouchPoints\' > 0 (e.g. Chrome 70+ w/ touch monitor)', function(assert) {
        const hasWindowProperty = createHasPropertyMock();

        assert.ok(detectTouchEvents(hasWindowProperty, 2), 'touch events are detected');
    });

    QUnit.test('touch = true when window has \'ontouchstart\' property (e.g. mobile devices, Chrome 69- w/ touch display)', function(assert) {
        const hasWindowProperty = createHasPropertyMock('ontouchstart');

        assert.ok(detectTouchEvents(hasWindowProperty, 2), 'touch events are detected');
    });

    QUnit.test('touch = false when callPhantom is defined (PhantomJS)', function(assert) {
        const hasWindowProperty = createHasPropertyMock('ontouchstart', 'callPhantom');

        assert.notOk(detectTouchEvents(hasWindowProperty, 2), 'touch events are not detected');
    });

    QUnit.test('touch = false when \'ontouchstart\' not exists and \'maxTouchPoints\' = 0 (e.g. non-touch display)', function(assert) {
        const hasWindowProperty = createHasPropertyMock();

        assert.notOk(detectTouchEvents(hasWindowProperty, 0), 'touch events are not detected');
    });
});

QUnit.module('Pointer event detection', () => {
    QUnit.test('pointerEvent defined when \'PointerEvent\' exists (Surface pro, edge 17+, latest IE11)', function(assert) {
        const hasWindowProperty = createHasPropertyMock('PointerEvent');

        assert.ok(detectPointerEvent(hasWindowProperty), 'PointerEvent detected');
    });

    QUnit.test('pointerEvent = false when \'PointerEvent\' not exists', function(assert) {
        const hasWindowProperty = createHasPropertyMock();

        assert.notOk(detectPointerEvent(hasWindowProperty), 'PointerEvent isn\'t detected');
    });
});
