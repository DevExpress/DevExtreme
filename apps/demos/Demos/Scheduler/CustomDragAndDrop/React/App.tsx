import React, { useCallback, useState } from 'react';

import Scheduler, { AppointmentDragging, SchedulerTypes } from 'devextreme-react/scheduler';
import Draggable, { DraggableTypes } from 'devextreme-react/draggable';
import ScrollView from 'devextreme-react/scroll-view';

import { Task, appointments as defaultAppointments, tasks as defaultTasks } from './data.ts';

const currentDate = new Date(2021, 3, 26);
const views: SchedulerTypes.Properties['views'] = [{ type: 'day', intervalCount: 3 }];
const draggingGroupName = 'appointmentsGroup';

const onListDragStart = (e: DraggableTypes.DragStartEvent) => {
  e.cancel = true;
};

const onItemDragStart = (e: DraggableTypes.DragStartEvent) => {
  e.itemData = e.fromData;
};

const onItemDragEnd = (e: DraggableTypes.DragEndEvent) => {
  if (e.toData) {
    e.cancel = true;
  }
};

const App = () => {
  const [state, setState] = useState({
    tasks: defaultTasks, appointments: defaultAppointments,
  });

  const onAppointmentRemove = useCallback((e: SchedulerTypes.AppointmentDraggingRemoveEvent) => {
    setState((currentState: { appointments: SchedulerTypes.Appointment[]; tasks: Task[]; }) => {
      const { appointments, tasks } = currentState;

      const index = appointments.indexOf(e.itemData);

      if (index >= 0) {
        tasks.push(e.itemData);
        appointments.splice(index, 1);
      }

      return { appointments: [...appointments], tasks: [...tasks] };
    });
  }, []);

  const onAppointmentAdd = useCallback((e: SchedulerTypes.AppointmentDraggingAddEvent) => {
    setState((currentState: { appointments: SchedulerTypes.Appointment[]; tasks: Task[]; }) => {
      const { appointments, tasks } = currentState;

      const index = tasks.indexOf(e.fromData);

      if (index >= 0) {
        tasks.splice(index, 1);
        appointments.push(e.itemData);
      }

      return { appointments: [...appointments], tasks: [...tasks] };
    });
  }, []);

  return (
    <React.Fragment>
      <ScrollView id="scroll">
        <Draggable
          id="list"
          data="dropArea"
          group={draggingGroupName}
          onDragStart={onListDragStart}>
          {state.tasks.map((task) => (
            <Draggable
              key={task.text}
              className="item dx-card dx-theme-text-color dx-theme-background-color"
              clone={true}
              group={draggingGroupName}
              data={task}
              onDragStart={onItemDragStart}
              onDragEnd={onItemDragEnd}
            >
              {task.text}
            </Draggable>
          ))}
        </Draggable>
      </ScrollView>
      <Scheduler
        id="scheduler"
        timeZone="America/Los_Angeles"
        dataSource={state.appointments}
        views={views}
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9}
        editing={true}
      >
        <AppointmentDragging
          group={draggingGroupName}
          onRemove={onAppointmentRemove as any}
          onAdd={onAppointmentAdd as any}
        />
      </Scheduler>
    </React.Fragment>
  );
};

export default App;
