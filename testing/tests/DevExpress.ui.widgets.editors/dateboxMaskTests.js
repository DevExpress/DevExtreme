"use strict";

import $ from "jquery";
import { renderDateParts, getDatePartIndexByPosition } from "ui/date_box/ui.date_box.mask.parts";
import { noop } from "core/utils/common";

QUnit.testStart(() => {
    $("#qunit-fixture").html("<div id='dateBox'></div>");
});

QUnit.module("Date parts", {
    beforeEach: () => {
        this.parts = renderDateParts("Tuesday, July 2, 2024 16:19", "EEEE, MMMM d, yyyy HH:mm");
    }
}, () => {

    let checkAndRemoveAccessors = (part, stub, assert) => {
        assert.equal(part.getter(), stub, "stub getter");
        assert.deepEqual(part.setter, noop, "stub setter");

        delete part.setter;
        delete part.getter;
    };

    QUnit.test("Check parts length", (assert) => {
        assert.equal(this.parts.length, 13);
    });

    QUnit.test("Day of week", (assert) => {
        assert.deepEqual(this.parts[0], {
            index: 0,
            isStub: false,
            caret: { start: 0, end: 7 },
            getter: "getDate",
            setter: "setDate",
            pattern: "EEEE",
            text: "Tuesday"
        });
    });

    QUnit.test("Month", (assert) => {
        assert.deepEqual(this.parts[3], {
            index: 3,
            isStub: false,
            caret: { start: 9, end: 13 },
            getter: "getMonth",
            setter: "setMonth",
            pattern: "MMMM",
            text: "July"
        });
    });

    QUnit.test("Day", (assert) => {
        assert.deepEqual(this.parts[5], {
            index: 5,
            isStub: false,
            caret: { start: 14, end: 15 },
            getter: "getDate",
            setter: "setDate",
            pattern: "d",
            text: "2"
        });
    });

    QUnit.test("Year", (assert) => {
        assert.deepEqual(this.parts[8], {
            index: 8,
            isStub: false,
            caret: { start: 17, end: 21 },
            getter: "getFullYear",
            setter: "setFullYear",
            pattern: "yyyy",
            text: "2024"
        });
    });

    QUnit.test("Hours", (assert) => {
        assert.deepEqual(this.parts[10], {
            index: 10,
            isStub: false,
            caret: { start: 22, end: 24 },
            getter: "getHours",
            setter: "setHours",
            pattern: "HH",
            text: "16"
        });
    });

    QUnit.test("Minutes", (assert) => {
        assert.deepEqual(this.parts[12], {
            index: 12,
            isStub: false,
            caret: { start: 25, end: 27 },
            getter: "getMinutes",
            setter: "setMinutes",
            pattern: "mm",
            text: "19"
        });
    });

    QUnit.test("Comma stub", (assert) => {
        checkAndRemoveAccessors(this.parts[1], ",", assert);

        assert.deepEqual(this.parts[1], {
            index: 1,
            isStub: true,
            caret: { start: 7, end: 8 },
            pattern: ",",
            text: ","
        });
    });

    QUnit.test("Space stub", (assert) => {
        checkAndRemoveAccessors(this.parts[2], "\\", assert);

        assert.deepEqual(this.parts[2], {
            index: 2,
            isStub: true,
            caret: { start: 8, end: 9 },
            pattern: "\\ ",
            text: " "
        });
    });

    QUnit.test("Colon stub", (assert) => {
        checkAndRemoveAccessors(this.parts[11], ":", assert);

        assert.deepEqual(this.parts[11], {
            index: 11,
            isStub: true,
            caret: { start: 24, end: 25 },
            pattern: ":",
            text: ":"
        });
    });
});

QUnit.module("Get date part index by position", {
    beforeEach: () => {
        this.parts = renderDateParts("Tuesday, July 2, 2024 16:19", "EEEE, MMMM d, yyyy HH:mm");
    }
}, () => {
    QUnit.test("Find day of week", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 0), 0, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 3), 0, "middle position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 7), 0, "end position of the group");
    });

    QUnit.test("Find month", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 9), 3, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 10), 3, "middle position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 13), 3, "end position of the group");
    });

    QUnit.test("Find day", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 14), 5, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 15), 5, "end position of the group");
    });

    QUnit.test("Find year", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 17), 8, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 19), 8, "middle position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 21), 8, "end position of the group");
    });

    QUnit.test("Find hours", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 22), 10, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 23), 10, "middle position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 24), 10, "end position of the group");
    });

    QUnit.test("Find minutes", (assert) => {
        assert.equal(getDatePartIndexByPosition(this.parts, 25), 12, "start position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 26), 12, "middle position of the group");
        assert.equal(getDatePartIndexByPosition(this.parts, 27), 12, "end position of the group");
    });
});
