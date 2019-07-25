import SchedulerTestHelper from '../../../../helpers/scheduler.test.helper';
import { createWidget, getContainerFileUrl } from '../../../../helpers/testHelper';
import { pinkData, blueData } from './appointments.data';

export const scheduler = new SchedulerTestHelper("#container");

export const createScheduler = async (mode) => {
    await createWidget("dxScheduler", {
        dataSource: (pinkData.concat(blueData)).reduce((data: any, element: any) => {
            return (data.concat(element.dataSource));
        }, []),
        resources: [{
            fieldExpr: "colorId",
            dataSource: [
                { id: 0, color: '#ff324a' },
                { id: 1, color: '#0090c6' }
            ],
            label: "Color"
        }],
        views: [mode],
        currentView: mode,
        currentDate: new Date(2018, 3, 20),
        startDayHour: 9,
        useColorAsDefault: true
    });
}
