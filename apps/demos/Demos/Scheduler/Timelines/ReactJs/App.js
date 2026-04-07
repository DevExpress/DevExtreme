import React, { useCallback, useState } from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';
import { data, resourcesData, priorityData } from './data.js';

const currentDate = new Date(2021, 1, 2);
const views = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const snapToCellsModeItems = ['auto', 'always', 'never'];

const App = () => {
  const [snapToCellsMode, setSnapToCellsMode] = useState('always');
  const onSnapToCellsModeChanged = useCallback((e) => {
    setSnapToCellsMode(e.value);
  }, []);
  return (
    <>
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="timelineMonth"
        defaultCurrentDate={currentDate}
        height={580}
        groups={groups}
        cellDuration={60}
        firstDayOfWeek={0}
        startDayHour={8}
        endDayHour={20}
        snapToCellsMode={snapToCellsMode}
      >
        <Resource
          fieldExpr="ownerId"
          allowMultiple={true}
          dataSource={resourcesData}
          label="Owner"
          useColorAsDefault={true}
          icon="user"
        />
        <Resource
          fieldExpr="priority"
          allowMultiple={false}
          dataSource={priorityData}
          label="Priority"
          icon="tags"
        />
      </Scheduler>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Snap to Grid:</span>
          <SelectBox
            items={snapToCellsModeItems}
            value={snapToCellsMode}
            onValueChanged={onSnapToCellsModeChanged}
          />
        </div>
      </div>
    </>
  );
};
export default App;
