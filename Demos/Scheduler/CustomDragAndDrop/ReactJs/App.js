import React from 'react';
import Scheduler, { AppointmentDragging } from 'devextreme-react/scheduler';
import Draggable from 'devextreme-react/draggable';
import ScrollView from 'devextreme-react/scroll-view';
import { appointments as defaultAppointments, tasks as defaultTasks } from './data.js';

const currentDate = new Date(2021, 3, 26);
const views = [{ type: 'day', intervalCount: 3 }];
const draggingGroupName = 'appointmentsGroup';
const onListDragStart = (e) => {
  e.cancel = true;
};
const onItemDragStart = (e) => {
  e.itemData = e.fromData;
};
const onItemDragEnd = (e) => {
  if (e.toData) {
    e.cancel = true;
  }
};
const App = () => {
  const [state, setState] = React.useState({
    tasks: defaultTasks,
    appointments: defaultAppointments,
  });
  const onAppointmentRemove = React.useCallback((e) => {
    setState((currentState) => {
      const { appointments, tasks } = currentState;
      const index = appointments.indexOf(e.itemData);
      if (index >= 0) {
        tasks.push(e.itemData);
        appointments.splice(index, 1);
      }
      return { appointments: [...appointments], tasks: [...tasks] };
    });
  }, []);
  const onAppointmentAdd = React.useCallback((e) => {
    setState((currentState) => {
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
          onDragStart={onListDragStart}
        >
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
        timeZone="America/Los_Angeles"
        id="scheduler"
        dataSource={state.appointments}
        views={views}
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9}
        editing={true}
      >
        <AppointmentDragging
          group={draggingGroupName}
          onRemove={onAppointmentRemove}
          onAdd={onAppointmentAdd}
        />
      </Scheduler>
    </React.Fragment>
  );
};
export default App;
