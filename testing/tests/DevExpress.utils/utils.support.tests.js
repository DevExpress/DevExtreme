import { detectTouchEvents, detectPointerEvent } from "core/utils/support";

const createHasPropertyMock = (...properties) => { return name => properties.indexOf(name) > -1; };

QUnit.module("Touch events detection", () => {
    QUnit.test("touch = true when 'ontouchstart' exists and 'maxTouchPoints' > 0 (e.g. Chrome 70+ w/ touch monitor)", assert => {
        const isWindowHasProperty = createHasPropertyMock();

        assert.ok(detectTouchEvents(isWindowHasProperty, 2), "touch events are detected");
    });

    QUnit.test("touch = true when window has 'ontouchstart' property (e.g. mobile devices, Chrome 69- w/ touch display)", assert => {
        const isWindowHasProperty = createHasPropertyMock("ontouchstart");

        assert.ok(detectTouchEvents(isWindowHasProperty, 2), "touch events are detected");
    });

    QUnit.test("touch = false when callPhantom is defined (PhantomJS)", assert => {
        const isWindowHasProperty = createHasPropertyMock("ontouchstart", "callPhantom");

        assert.notOk(detectTouchEvents(isWindowHasProperty, 2), "touch events are not detected");
    });

    QUnit.test("touch = false when 'ontouchstart' not exists and 'maxTouchPoints' = 0 (e.g. non-touch display)", assert => {
        const isWindowHasProperty = createHasPropertyMock();

        assert.notOk(detectTouchEvents(isWindowHasProperty, 0), "touch events are not detected");
    });
});

QUnit.module("Pointer event detection", () => {
    QUnit.test("pointerEvent isn't defined when 'PointerEvent' exists (Surface pro, edge 17+, latest IE11)", assert => {
        const isWindowHasProperty = createHasPropertyMock("PointerEvent");
        const pointerEnabled = undefined;

        assert.ok(detectPointerEvent(isWindowHasProperty, pointerEnabled), "PointerEvent detected");
    });

    QUnit.test("pointerEvent = true when 'pointerEnabled' exists (surface with old IE11)", assert => {
        const isWindowHasProperty = createHasPropertyMock();
        const pointerEnabled = true;

        assert.ok(detectPointerEvent(isWindowHasProperty, pointerEnabled), "PointerEvent detected");
    });

    QUnit.test("pointerEvent = false when 'pointerEnabled' exists (WebBrowser control)", assert => {
        const isWindowHasProperty = createHasPropertyMock("PointerEvent");
        const pointerEnabled = false;

        assert.notOk(detectPointerEvent(isWindowHasProperty, pointerEnabled), "PointerEvent isn't detected");
    });

    QUnit.test("pointerEvent = false when 'pointerEnabled' or 'PointerEvent' not exists", assert => {
        const isWindowHasProperty = createHasPropertyMock();
        const pointerEnabled = undefined;

        assert.notOk(detectPointerEvent(isWindowHasProperty, pointerEnabled), "PointerEvent isn't detected");
    });
});
