import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';
import { extend } from '../../../../js/core/utils/extend';

fixture `Scheduler: Workspace`
    .page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");
const disableAnimation = ClientFunction(() => (window as any).DevExpress.fx.off = true);

const createScheduler = async (options = {}) => {
    await disableAnimation();

    createWidget("dxScheduler", extend(options, {
        dataSource: [],
		startDayHour: 9,
		height: 600
    }));
}

test("Vertical selection between two workspace cells should focus cells between them (T804954)", async t => {
    await t
        .resizeWindow(1200, 800)
        .dragToElement(scheduler.getDateTableCell(0, 0),
            scheduler.getDateTableCell(3, 0)) 
        .expect(scheduler.getDateTableCells().filter('.dx-state-focused').count)
        .eql(4);

}).before(async () => await createScheduler({
        views: [{name: "2 Days", type: "day", intervalCount: 2}],
        currentDate: new Date(2015, 1, 9), 
        currentView: "day"
}));

test("Horizontal selection between two workspace cells should focus cells between them", async t => {
    await t
        .dragToElement(scheduler.getDateTableCell(0, 0),
            scheduler.getDateTableCell(0, 3))
        .expect(scheduler.getDateTableCells().filter('.dx-state-focused').count)
        .eql(4);

}).before(async () => await createScheduler({
        views: ['timelineWeek'],
        currentDate: new Date(2015, 1, 9), 
        currentView: "timelineWeek",
        groups: ["roomId"],
        resources: [{
            fieldExpr: "roomId",
            label: "Room",
            dataSource: [{ 
                text: '1', id: 1
            }, {
                text: '2', id: 2
            }]
        }]
}));