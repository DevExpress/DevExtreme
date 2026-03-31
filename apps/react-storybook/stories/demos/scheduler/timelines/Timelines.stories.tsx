import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useRef, useState } from 'react';

import Scheduler, {
  Resource,
} from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';
import { data, resourcesData, priorityData } from './data';

import './timelines.css';
import { SnapToCellsMode } from 'devextreme/js/ui/scheduler';

const meta: Meta = {
  title: 'Demos/Scheduler/Timelines',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const Timelines: Story = {
  render: () => {
    const [snapToCellsMode, setSnapToCellsMode] = useState<SnapToCellsMode>('always');
    const schedulerInstanceRef = useRef<any>(null);
    const pendingScrollLeftRef = useRef<number | undefined>(undefined);

    return (
      <>
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth']}
          defaultCurrentView="timelineMonth"
          defaultCurrentDate={new Date(2021, 1, 2)}
          height={580}
          groups={['priority']}
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

            schedulerInstanceRef.current?.getWorkSpaceScrollable()?.scrollTo({ x: pendingScrollLeft });
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
              items={[
                { value: 'auto', text: 'Auto' },
                { value: 'always', text: 'Always' },
                { value: 'never', text: 'Never' },
              ]}
              valueExpr="value"
              displayExpr="text"
              value={snapToCellsMode}
              onValueChanged={(e) => {
                pendingScrollLeftRef.current = schedulerInstanceRef.current?.getWorkSpaceScrollable()?.scrollLeft() ?? 0;
                setSnapToCellsMode(e.value);
              }}
            />
          </div>
        </div>
      </>
    );
  },
};
