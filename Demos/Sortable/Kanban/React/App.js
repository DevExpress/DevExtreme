import React from 'react';
import { tasks, employees } from './data.js';
import ScrollView from 'devextreme-react/scroll-view';
import Sortable from 'devextreme-react/sortable';

const statuses = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];

function Card({ task, employeesMap }) {
  return <div className="card dx-card dx-theme-text-color dx-theme-background-color">
    <div className={`card-priority priority-${task.Task_Priority}`}></div>
    <div className="card-subject">{task.Task_Subject}</div>
    <div className="card-assignee">{employeesMap[task.Task_Assigned_Employee_ID]}</div>
  </div>;
}

function List({ title, index, tasks, employeesMap, onTaskDragStart, onTaskDrop }) {
  return <div className="list">
    <div className="list-title dx-theme-text-color">{title}</div>
    <ScrollView
      className="scrollable-list"
      direction="vertical"
      showScrollbar="always">
      <Sortable
        className="sortable-cards"
        group="cardsGroup"
        data={index}
        onDragStart={onTaskDragStart}
        onReorder={onTaskDrop}
        onAdd={onTaskDrop}>
        {tasks.map(task =>
          <Card
            key={task.Task_ID}
            task={task}
            employeesMap={employeesMap}>
          </Card>
        )}
      </Sortable>
    </ScrollView>
  </div>;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    const employeesMap = {};

    employees.forEach(employee => {
      employeesMap[employee.ID] = employee.Name;
    });

    const lists = [];

    statuses.forEach(status => {
      lists.push(tasks.filter(task => task.Task_Status === status));
    });

    this.state = {
      statuses,
      lists,
      employeesMap
    };

    this.onListReorder = this.onListReorder.bind(this);
    this.onTaskDragStart = this.onTaskDragStart.bind(this);
    this.onTaskDrop = this.onTaskDrop.bind(this);
  }
  render() {
    const { lists, statuses, employeesMap } = this.state;
    return (
      <div id="kanban">
        <ScrollView
          className="scrollable-board"
          direction="horizontal"
          showScrollbar="always">
          <Sortable
            className="sortable-lists"
            itemOrientation="horizontal"
            handle=".list-title"
            onReorder={this.onListReorder}>
            {lists.map((tasks, listIndex) => {
              const status = statuses[listIndex];
              return <List
                key={status}
                title={status}
                index={listIndex}
                tasks={tasks}
                employeesMap={employeesMap}
                onTaskDragStart={this.onTaskDragStart}
                onTaskDrop={this.onTaskDrop}>
              </List>;
            })}
          </Sortable>
        </ScrollView>
      </div>
    );
  }

  onListReorder(e) {
    this.setState({
      lists: this.reorder(this.state.lists, this.state.lists[e.fromIndex], e.fromIndex, e.toIndex),
      statuses: this.reorder(this.state.statuses, this.state.statuses[e.fromIndex], e.fromIndex, e.toIndex)
    });
  }

  onTaskDragStart(e) {
    e.itemData = this.state.lists[e.fromData][e.fromIndex];
  }

  onTaskDrop(e) {
    this.updateTask(e.fromData, e.itemData, e.fromIndex, -1);
    this.updateTask(e.toData, e.itemData, -1, e.toIndex);
  }

  reorder(items, item, fromIndex, toIndex) {
    if(fromIndex >= 0) {
      items = [...items.slice(0, fromIndex), ...items.slice(fromIndex + 1)];
    }

    if(toIndex >= 0) {
      items = [...items.slice(0, toIndex), item, ...items.slice(toIndex)];
    }

    return items;
  }

  updateTask(listIndex, itemData, fromIndex, toIndex) {
    const lists = this.state.lists.slice();

    lists[listIndex] = this.reorder(lists[listIndex], itemData, fromIndex, toIndex);

    this.setState({
      lists
    });
  }
}

export default App;
