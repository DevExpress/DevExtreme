import React, { useRef, useState } from 'react';

import Scheduler, {
  Resource,
  type SchedulerTypes,
} from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';

import { data, resourcesData, priorityData } from './data.ts';

const currentDate = new Date(2021, 1, 2);
const views: SchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];

type SnapToCellsMode = 'auto' | 'always' | 'never';

const snapToCellsModeItems: { value: SnapToCellsMode; text: string }[] = [
  { value: 'auto', text: 'Auto' },
  { value: 'always', text: 'Always' },
  { value: 'never', text: 'Never' },
];

const App = () => {
  const [snapToCellsMode, setSnapToCellsMode] = useState<SnapToCellsMode>('always');
  const schedulerInstanceRef = useRef<any>(null);
  const pendingScrollLeftRef = useRef<number | undefined>(undefined);

  const getWorkSpaceScrollable = () => schedulerInstanceRef.current?.getWorkSpaceScrollable?.();

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
        onInitialized={(e) => {
          schedulerInstanceRef.current = e.component;
        }}
        onContentReady={() => {
          const pendingScrollLeft = pendingScrollLeftRef.current;

          if (pendingScrollLeft === undefined) {
            return;
          }

          getWorkSpaceScrollable()?.scrollTo?.({ x: pendingScrollLeft });
          pendingScrollLeftRef.current = undefined;
        }}
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
        <div className="option">
          <span>Snap to Cells Mode:</span>
          <SelectBox
            items={snapToCellsModeItems}
            valueExpr="value"
            displayExpr="text"
            value={snapToCellsMode}
            onValueChanged={(e: SelectBoxTypes.ValueChangedEvent) => {
              pendingScrollLeftRef.current = getWorkSpaceScrollable()?.scrollLeft?.() ?? 0;
              setSnapToCellsMode(e.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
