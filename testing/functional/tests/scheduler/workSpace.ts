import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';

fixture `Scheduler: Workspace`
    .page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");
const disableAnimation = ClientFunction(() => (window as any).DevExpress.fx.off = true);

const createScheduler = async (options = {}) => {
    await disableAnimation();

    createWidget("dxScheduler", {...options, 
        dataSource: [],
        views: ["week"],
		currentView: "week",
		currentDate: new Date(2017, 4, 25),
		startDayHour: 9,
		height: 600
    });
}

test("Selection between two workspace cells should focus cells between (T804954)", async t => {
    await t
        .dragToElement(scheduler.getDateTableCell(0, 0),
            scheduler.getDateTableCell(3, 0))
        .expect(scheduler.getDateTableCells().filter('.dx-state-focused').count)
        .eql(4);

}).before(async () => await createScheduler({
        views: [{name: "2 Days", type: "day", intervalCount: 2}],
        currentDate: new Date(2015, 1, 9), 
        currentView: "day"
}));