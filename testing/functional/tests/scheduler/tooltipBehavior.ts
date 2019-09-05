import { createWidget } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture `Scheduler: Appointment Tooltip`
    .page(url(__dirname, '../container.html'));

const scrollBrowser = ClientFunction(() => window.scrollBy(0,500));

const createScheduler = () => createWidget("dxScheduler", {
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
}, true);

test("Tooltip shouldn't hide after scroll in browser height is small (T755449)", async t => {
    const scheduler = new Scheduler("#container");

    await t
        .resizeWindow(600, 400)
        .click(scheduler.getAppointment(`Website Re-Design Plan`).element)
        .expect(scheduler.tooltip.exists).ok();

    await scrollBrowser();

    await t.expect(scheduler.tooltip.exists).notOk();

}).before(createScheduler);

test("Tooltip should hide after scroll", async t => {
    const scheduler = new Scheduler("#container");

    await t
        .resizeWindow(600, 600)
        .click(scheduler.getAppointment(`Website Re-Design Plan`).element)
        .expect(scheduler.tooltip.exists).ok();

    await scrollBrowser();

    await t.expect(scheduler.tooltip.exists).notOk();
}).before(createScheduler);
