import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';

fixture `Scheduler: NativeScrolling`
    .page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

const createScheduler = async (options: any) => {
    createWidget("dxScheduler", options, true);
}

const scrollToTime = ClientFunction(() => {
    const date = new Date(2019, 5, 1, 9, 40);
    const instance = ($("#container") as any)["dxScheduler"]("instance");
    instance.scrollToTime(date.getHours() - 1, 30, date);
});

test("ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)", async t => {
    const views = [{
        name: "timelineDay",
        initValue: 0,
        expectedValue: 1700
    }, {
        name: "timelineWeek",
        initValue: 0,
        expectedValue: 25700
    }];

    for(let i = 0; i < views.length; i++) {
        const view = views[i];
        await scheduler.setOption("currentView", view.name);
        await scheduler.enableNativeScroll();

        await t.expect(scheduler.getWorkSpaceScroll().left).eql(view.initValue, `Work space has init scroll position in ${view.name} view`);
        await t.expect(scheduler.getHeaderSpaceScroll().left).eql(view.initValue, `Header space has init scroll position in ${view.name} view`);

        await scrollToTime();

        await t.expect(scheduler.getWorkSpaceScroll().left).eql(view.expectedValue, `Work space is scrolled in ${view.name} view`);
        await t.expect(scheduler.getHeaderSpaceScroll().left).eql(view.expectedValue, `Header space is scrolled in ${view.name} view`);
    }
}).before(async () => createScheduler({
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
