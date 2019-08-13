import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';

fixture `NativeScrolling`
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
    await scheduler.enableNativeScroll();
    await scrollToTime();
    await t.expect(scheduler.getWorkSpaceScroll().left).eql(1700, "Container is scrolled in timelineDay");

    await scheduler.setOption("currentView", "timelineWeek");

    await scheduler.enableNativeScroll();
    await scrollToTime();
    await t.expect(scheduler.getWorkSpaceScroll().left).eql(25700, "Container is scrolled in timelineWeek");
}).before(async () => createScheduler({
    dataSource: [],
    views: ["timelineDay", "day", "timelineWeek", "week", "timelineMonth"],
    currentView: "timelineDay",
    currentDate: new Date(2019, 5, 1, 9, 40),
    firstDayOfWeek: 0,
    startDayHour: 0,
    endDayHour: 20,
    cellDuration: 60,
    groups: ["priority"],
    height: 580
}));
