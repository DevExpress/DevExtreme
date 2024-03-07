import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';

import { appointments } from './data';

const currentDate = new Date(2021, 3, 29);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

const Render = () => (
    <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={appointments}
        views={views}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        height={730}
        startDayHour={9}
    />
);

export default Render
