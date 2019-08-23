import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';

fixture `Scheduler: Appointment Tooltip`
    .page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");
const scrollBrowser = ClientFunction(() => window.scrollBy(0,500));
const disableAnimation = ClientFunction(() => (window as any).DevExpress.fx.off = true);

const createScheduler = async () => {
    await disableAnimation();

    createWidget("dxScheduler", {
        dataSource: [{
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }],
        views: ["week"],
		currentView: "week",
		currentDate: new Date(2017, 4, 25),
		startDayHour: 9,
		height: 600
    });
}

test("Tooltip shouldn't hide after scroll in browser height is small (T755449)", async t => {
    await t.resizeWindow(600, 400)
        .click(scheduler.getAppointment())
        .expect(scheduler.isTooltipVisible()).ok();

    await scrollBrowser();

    await t.expect(scheduler.isTooltipVisible()).notOk();

}).before(async () => await createScheduler());

test("Tooltip should hide after scroll", async t => {
    await t.resizeWindow(600, 600)
        .click(scheduler.getAppointment())
        .expect(scheduler.isTooltipVisible()).ok();

    await scrollBrowser();

    await t.expect(scheduler.isTooltipVisible()).notOk();
}).before(async () => await createScheduler());
