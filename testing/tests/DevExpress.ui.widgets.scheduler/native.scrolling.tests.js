import devices from "core/devices";
import fx from "animation/fx";
import { initTestMarkup, createWrapper } from './helpers.js';

import "common.css!";
import "generic_light.css!";

const { testStart, test, module } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

if(devices.real().deviceType !== "desktop") {
    module("Integration native scrolling", moduleConfig, () => {
        test("ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)", function(assert) {
            const date = new Date(2019, 5, 1, 9, 40);

            const scheduler = createWrapper({
                dataSource: [],
                views: ["timelineDay", "day", "timelineWeek", "week", "timelineMonth"],
                currentView: "timelineDay",
                currentDate: date,
                firstDayOfWeek: 0,
                startDayHour: 0,
                endDayHour: 20,
                cellDuration: 60,
                groups: ["priority"],
                height: 580,
            });

            scheduler.instance.scrollToTime(date.getHours() - 1, 30, date);

            assert.equal(scheduler.workSpace.getScrollPosition().left, 1700, "Container is scrolled in timelineDay");

            scheduler.option("currentView", "timelineWeek");
            scheduler.instance.scrollToTime(date.getHours() - 1, 30, date);

            assert.equal(scheduler.workSpace.getScrollPosition().left, 25500, "Container is scrolled in timelineWeek");
        });

        test("ScrollTo of dateTable scrollable shouldn't be called when dateTable scrollable scroll in timeLine view", function(assert) {
            const done = assert.async();

            const scheduler = createWrapper({
                currentDate: new Date(2017, 3, 16),
                dataSource: [],
                currentView: "timelineWeek",
                height: 500
            });

            const headerScrollable = scheduler.workSpace.getHeaderScrollable().dxScrollable("instance"),
                dateTableScrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable("instance"),
                headerScrollToSpy = sinon.spy(headerScrollable, "scrollTo"),
                dateTableScrollToSpy = sinon.spy(dateTableScrollable, "scrollTo");

            dateTableScrollable.scrollBy(1000);

            setTimeout(() => {
                assert.ok(headerScrollToSpy.calledOnce, "header scrollTo was called");
                assert.notOk(dateTableScrollToSpy.calledOnce, "dateTable scrollTo was not called");
                done();
            });
        });
    });
}
