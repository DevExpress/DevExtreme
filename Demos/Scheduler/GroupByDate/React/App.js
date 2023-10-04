import React from 'react';

import Switch from 'devextreme-react/switch';
import Scheduler, { Resource, View } from 'devextreme-react/scheduler';

import { data, priorityData } from './data.js';

const currentDate = new Date(2021, 3, 21);

const groups = ['priorityId'];

const App = () => {
  const [groupByDate, setGroupByDate] = React.useState(true);

  const onGroupByDateChanged = React.useCallback((args) => {
    setGroupByDate(args.value);
  }, []);

  return (
    <div id="scheduler">
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        groups={groups}
        groupByDate={groupByDate}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        height={730}
        startDayHour={9}
        endDayHour={19}
        crossScrollingEnabled={true}
      >
        <Resource
          fieldExpr="priorityId"
          allowMultiple={false}
          dataSource={priorityData}
          label="Priority"
        />
        <View type="week" name="Week" />
        <View type="month" name="Month" />
      </Scheduler>
      <div className="options">
        <div className="caption">Group by Date First</div>
        <div className="option">
          <Switch
            value={groupByDate}
            onValueChanged={onGroupByDateChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
