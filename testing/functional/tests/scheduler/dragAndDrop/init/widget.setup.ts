
import SchedulerTestHelper from '../../../../helpers/scheduler.test.helper';
import { createWidget } from '../../../../helpers/testHelper';

export const scheduler = new SchedulerTestHelper("#container");

export const widgetHeight = 833;
export const maxAppointmentsPerCell = 5;
export const startDayHour = 9;
export const currentDate = new Date(2018, 3, 20);

export const resources = [
    { id: 'Primary', color: '#ff005c' },
    { id: 'Secondary', color: '#4d8dff' }
]

export const createScheduler = async (mode, dataSource, firstDayOfWeek = 2) => {
    await createWidget("dxScheduler", {
        dataSource: dataSource,
        resources: [{
            fieldExpr: "resourceId",
            dataSource: resources,
            label: "Color"
        }],
        height: widgetHeight,
        startDayHour: startDayHour,
        firstDayOfWeek: firstDayOfWeek,
        maxAppointmentsPerCell: maxAppointmentsPerCell,
        views: [mode],
        currentView: mode,
        currentDate: currentDate
    });
}
