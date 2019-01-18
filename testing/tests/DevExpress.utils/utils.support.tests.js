import { detectTouchEvents } from "core/utils/support";
import { noop } from "core/utils/common";
import { extend } from "core/utils/extend";

const getWindowMock = properties => extend(properties, { hasProperty: name => properties[name] });

QUnit.module("Touch events detection", () => {
    QUnit.test("Events are detected when the maxTouchPoints property of Navigator is defined", assert => {
        const windowMock = getWindowMock({
            "ontouchstart": undefined,
            callPhantom: undefined
        });

        assert.ok(detectTouchEvents(windowMock, 2), "touch events are detected");
    });

    QUnit.test("Events are detected When the ontouchstart property of Window is defined", assert => {
        const windowMock = getWindowMock({
            "ontouchstart": noop,
            callPhantom: undefined
        });

        assert.ok(detectTouchEvents(windowMock, 0), "touch events are detected");
    });

    QUnit.test("Events are not detected when the callPhantom property of Window is defined", assert => {
        const windowMock = getWindowMock({
            "ontouchstart": noop,
            callPhantom: true
        });

        assert.notOk(detectTouchEvents(windowMock, 2), "touch events are not detected");
    });

    QUnit.test("Events are not detected when the ontouchstart and the maxTouchPoints properties are not defined", assert => {
        const windowMock = getWindowMock({
            "ontouchstart": undefined,
            callPhantom: undefined
        });

        assert.notOk(detectTouchEvents(windowMock, 0), "touch events are not detected");
    });
});
