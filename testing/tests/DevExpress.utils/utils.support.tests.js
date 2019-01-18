import { detectTouchEvents } from "core/utils/support";

const createWindowMock = (...properties) => { return { hasProperty: name => properties.indexOf(name) > -1 }; };

QUnit.module("Touch events detection", () => {
    QUnit.test("Events are detected on the touch display for browser's window without the ontouchstart property", assert => {
        const windowMock = createWindowMock();

        assert.ok(detectTouchEvents(windowMock, 2), "touch events are detected");
    });

    QUnit.test("Events are detected on the touch display by the ontouchstart property of window", assert => {
        const windowMock = createWindowMock("ontouchstart");

        assert.ok(detectTouchEvents(windowMock, 2), "touch events are detected");
    });

    QUnit.test("Events are not detected on the touch display when the callPhantom property of Window is defined", assert => {
        const windowMock = createWindowMock("ontouchstart", "callPhantom");

        assert.notOk(detectTouchEvents(windowMock, 2), "touch events are not detected");
    });

    QUnit.test("Events are not detected on the not touch display", assert => {
        const windowMock = createWindowMock();

        assert.notOk(detectTouchEvents(windowMock, 0), "touch events are not detected");
    });
});
