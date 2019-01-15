import { detectTouchEvents } from "core/utils/support";
import { noop } from "core/utils/common";
import { extend } from "core/utils/extend";

const getWidowMock = properties => extend(properties, { hasProperty: name => properties[name] });

QUnit.module("Touch events detection", () => {
    QUnit.test("Events are detected when the TouchEvent property of Window is defined", assert => {
        const windowMock = getWidowMock({
            "ontouchstart": undefined,
            callPhantom: undefined,
            TouchEvent: noop
        });

        assert.ok(detectTouchEvents(windowMock), "touch events are detected");
    });

    QUnit.test("Events are detected When the ontouchstart property of Window is defined", assert => {
        const windowMock = getWidowMock({
            "ontouchstart": noop,
            callPhantom: undefined,
            TouchEvent: undefined
        });

        assert.ok(detectTouchEvents(windowMock), "touch events are detected");
    });

    QUnit.test("Events are not detected when the callPhantom property of Window is defined", assert => {
        const windowMock = getWidowMock({
            "ontouchstart": noop,
            callPhantom: true,
            TouchEvent: undefined
        });

        assert.notOk(detectTouchEvents(windowMock), "touch events are not detected");
    });

    QUnit.test("Events are not detected when the ontouchstart and the TouchEvent properties are not defined", assert => {
        const windowMock = getWidowMock({
            "ontouchstart": undefined,
            callPhantom: undefined,
            TouchEvent: undefined
        });

        assert.notOk(detectTouchEvents(windowMock), "touch events are not detected");
    });
});
