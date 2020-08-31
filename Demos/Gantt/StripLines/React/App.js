import React from 'react';
import Gantt, { Tasks, Column, Validation, StripLine } from 'devextreme-react/gantt';
import { tasks, currentDate } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Gantt
        taskListWidth={300}
        height={700}
        taskTitlePosition="none">

        <StripLine start={tasks[0].start} title="Start" />
        <StripLine start={tasks[tasks.length - 3].start} end={tasks[tasks.length - 1].end} title="Final Phase" />
        <StripLine start={currentDate} title="Current Time" cssClass="current-time" />

        <Validation autoUpdateParentTasks={true} />

        <Tasks dataSource={tasks} />

        <Column dataField="title" caption="Task" width={300} />
      </Gantt>
    );
  }
}

export default App;
