import SchedulerTestHelper from '../../../../helpers/scheduler.test.helper';

import {
    createWidget,
    getContainerFileUrl
} from '../../../../helpers/testHelper';

import {
    schedulerDataSource,
    schedulerResources
} from './widget.data';

export const scheduler = new SchedulerTestHelper("#container");

export const createScheduler = async (mode) => {
    await createWidget("dxScheduler", {
        dataSource: schedulerDataSource,
        resources: [{
            fieldExpr: "resourceId",
            dataSource: schedulerResources,
            label: "Color"
        }],
        views: [mode],
        currentView: mode,
        currentDate: new Date(2018, 3, 20),
        startDayHour: 9,
        useColorAsDefault: true
    });
}
