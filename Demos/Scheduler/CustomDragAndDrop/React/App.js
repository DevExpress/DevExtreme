import React from 'react';

import Scheduler, { AppointmentDragging } from 'devextreme-react/scheduler';
import Draggable from 'devextreme-react/draggable';
import ScrollView from 'devextreme-react/scroll-view';

import { appointments, tasks } from './data.js';

const currentDate = new Date(2021, 4, 24);
const views = [{ type: 'day', intervalCount: 3 }];
const draggingGroupName = 'appointmentsGroup';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: tasks,
      appointments: appointments
    };
    this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
    this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
  }
  render() {
    const { tasks, appointments } = this.state;
    return (
      <React.Fragment>
        <ScrollView id="scroll">
          <Draggable
            id="list"
            data="dropArea"
            group={draggingGroupName}
            onDragStart={this.onListDragStart}>
            {tasks.map((task) => {
              return <Draggable
                key={task.text}
                className="item dx-card dx-theme-text-color dx-theme-background-color"
                clone={true}
                group={draggingGroupName}
                data={task}
                onDragStart={this.onItemDragStart}
                onDragEnd={this.onItemDragEnd}>
                {task.text}
              </Draggable>;
            })}
          </Draggable>
        </ScrollView>
        <Scheduler
          id="scheduler"
          dataSource={appointments}
          views={views}
          defaultCurrentDate={currentDate}
          height={600}
          startDayHour={9}
          editing={true}>
          <AppointmentDragging
            group={draggingGroupName}
            onRemove={this.onAppointmentRemove}
            onAdd={this.onAppointmentAdd}
          />
        </Scheduler>
      </React.Fragment>
    );
  }

  onAppointmentRemove(e) {
    const index = this.state.appointments.indexOf(e.itemData);

    if (index >= 0) {
      this.state.appointments.splice(index, 1);
      this.state.tasks.push(e.itemData);

      this.setState({
        tasks: [...this.state.tasks],
        appointments: [...this.state.appointments]
      });
    }
  }

  onAppointmentAdd(e) {
    const index = this.state.tasks.indexOf(e.fromData);

    if (index >= 0) {
      this.state.tasks.splice(index, 1);
      this.state.appointments.push(e.itemData);

      this.setState({
        tasks: [...this.state.tasks],
        appointments: [...this.state.appointments]
      });
    }
  }

  onListDragStart(e) {
    e.cancel = true;
  }

  onItemDragStart(e) {
    e.itemData = e.fromData;
  }

  onItemDragEnd(e) {
    if (e.toData) {
      e.cancel = true;
    }
  }
}

export default App;
