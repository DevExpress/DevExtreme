import { detectTouchEvents } from "core/utils/support";

const createWindowMock = (...properties) => { return { hasProperty: name => properties.indexOf(name) > -1 }; };

QUnit.module("Touch events detection", () => {
    QUnit.test("touch = true when 'ontouchstart' exists and 'maxTouchPoints' > 0 (e.g. Chrome 70+ w/ touch monitor)", assert => {
        const windowMock = createWindowMock();

        assert.ok(detectTouchEvents(windowMock, 2), "touch events are detected");
    });

    QUnit.test("touch = true when window has 'ontouchstart' property (e.g. mobile devices, Chrome 69- w/ touch display)", assert => {
        const windowMock = createWindowMock("ontouchstart");

        assert.ok(detectTouchEvents(windowMock, 2), "touch events are detected");
    });

    QUnit.test("touch = false when callPhantom is defined (PhantomJS)", assert => {
        const windowMock = createWindowMock("ontouchstart", "callPhantom");

        assert.notOk(detectTouchEvents(windowMock, 2), "touch events are not detected");
    });

    QUnit.test("touch = false when 'ontouchstart' not exists and 'maxTouchPoints' = 0 (e.g. non-touch display)", assert => {
        const windowMock = createWindowMock();

        assert.notOk(detectTouchEvents(windowMock, 0), "touch events are not detected");
    });
});
