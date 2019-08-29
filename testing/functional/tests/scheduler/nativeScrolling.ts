import { createWidget } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture `Scheduler: NativeScrolling`
    .page(url(__dirname, '../container.html'));

const createScheduler = (options) => createWidget("dxScheduler", options, true);

const scrollToTime = ClientFunction(() => {
    const date = new Date(2019, 5, 1, 9, 40);
    const instance = ($("#container") as any)["dxScheduler"]("instance");

    instance.scrollToTime(date.getHours() - 1, 30, date);
});

test("ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)", async t => {
    const scheduler = new Scheduler("#container");

    const views = [{
        name: "timelineDay",
        initValue: 0,
        expectedValue: 1700
    }, {
        name: "timelineWeek",
        initValue: 0,
        expectedValue: 25700
    }];

    for(let view of views) {
        const { name, initValue, expectedValue } = view;

        await scheduler.setOption("currentView", name);
        await scheduler.enableNativeScroll();

        await t
            .expect(scheduler.workSpaceScroll.left).eql(initValue, `Work space has init scroll position in ${name} view`)
            .expect(scheduler.headerSpaceScroll.left).eql(initValue, `Header space has init scroll position in ${name} view`);

        await scrollToTime();

        await t
            .expect(scheduler.workSpaceScroll.left).eql(expectedValue, `Work space is scrolled in ${name} view`)
            .expect(scheduler.headerSpaceScroll.left).eql(expectedValue, `Header space is scrolled in ${name} view`);
    }
}).before(() => createScheduler({
    dataSource: [],
    views: ["timelineDay", "timelineWeek"],
    currentView: "timelineDay",
    currentDate: new Date(2019, 5, 1, 9, 40),
    firstDayOfWeek: 0,
    startDayHour: 0,
    endDayHour: 20,
    cellDuration: 60,
    groups: ["priority"],
    height: 580
}));
