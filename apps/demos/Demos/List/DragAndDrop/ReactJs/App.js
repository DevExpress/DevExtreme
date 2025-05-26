import React, { useCallback, useState } from 'react';
import List, { ItemDragging } from 'devextreme-react/list';
import { plannedTasks, doingTasks } from './data.js';

const App = () => {
  const [plannedTasksState, setPlannedTasksState] = useState(plannedTasks);
  const [doingTasksState, setDoingTasksState] = useState(doingTasks);
  const onDragStart = useCallback(
    (e) => {
      e.itemData = e.fromData === 'plannedTasks'
        ? plannedTasksState[e.fromIndex]
        : doingTasksState[e.fromIndex];
    },
    [plannedTasksState, doingTasksState],
  );
  const onAdd = useCallback(
    (e) => {
      const tasks = e.toData === 'plannedTasks' ? plannedTasksState : doingTasksState;
      const updatedTasks = [...tasks];
      updatedTasks.splice(e.toIndex, 0, e.itemData);
      if (e.toData === 'plannedTasks') {
        setPlannedTasksState(updatedTasks);
      } else {
        setDoingTasksState(updatedTasks);
      }
    },
    [setPlannedTasksState, setDoingTasksState, plannedTasksState, doingTasksState],
  );
  const onRemove = useCallback(
    (e) => {
      const tasks = e.fromData === 'plannedTasks' ? plannedTasksState : doingTasksState;
      const updatedTasks = [...tasks];
      updatedTasks.splice(e.fromIndex, 1);
      if (e.fromData === 'plannedTasks') {
        setPlannedTasksState(updatedTasks);
      } else {
        setDoingTasksState(updatedTasks);
      }
    },
    [setPlannedTasksState, setDoingTasksState, plannedTasksState, doingTasksState],
  );
  const onReorder = useCallback(
    (e) => {
      if (e.fromData === e.toData) {
        const updateTasks = (tasks) => {
          const updatedTasks = [...tasks];
          const [movedTask] = updatedTasks.splice(e.fromIndex, 1);
          updatedTasks.splice(e.toIndex, 0, movedTask);
          return updatedTasks;
        };
        if (e.fromData === 'plannedTasks') {
          setPlannedTasksState((prevTasks) => updateTasks(prevTasks));
        } else {
          setDoingTasksState((prevTasks) => updateTasks(prevTasks));
        }
      } else {
        onRemove(e);
        onAdd(e);
      }
    },
    [onAdd, onRemove],
  );
  return (
    <div className="widget-container">
      <List
        dataSource={plannedTasksState}
        keyExpr="id"
      >
        <ItemDragging
          allowReordering={true}
          group="tasks"
          data="plannedTasks"
          onDragStart={onDragStart}
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}
        ></ItemDragging>
      </List>
      <List
        dataSource={doingTasksState}
        keyExpr="id"
      >
        <ItemDragging
          allowReordering={true}
          group="tasks"
          data="doingTasks"
          onDragStart={onDragStart}
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}
        ></ItemDragging>
      </List>
    </div>
  );
};
export default App;
