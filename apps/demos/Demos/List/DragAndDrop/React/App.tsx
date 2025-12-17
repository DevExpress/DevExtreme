import React, { useCallback, useState } from 'react';
import List, { ItemDragging } from 'devextreme-react/list';
import type { IItemDraggingProps } from 'devextreme-react/list';
import { plannedTasks, doingTasks } from './data.ts';
import type { Task } from './types.ts';
import type { AddEvent, DragStartEvent, RemoveEvent, ReorderEvent } from 'devextreme/ui/sortable';

const App = () => {
  const [plannedTasksState, setPlannedTasksState] = useState<Task[]>(plannedTasks);
  const [doingTasksState, setDoingTasksState] = useState<Task[]>(doingTasks);

  const onDragStart = useCallback<NonNullable<IItemDraggingProps['onDragStart']>>((e: DragStartEvent): void => {
    e.itemData = e.fromData === 'plannedTasks' ? plannedTasksState[e.fromIndex] : doingTasksState[e.fromIndex];
  }, [plannedTasksState, doingTasksState]);

  const onAdd = useCallback<NonNullable<IItemDraggingProps['onAdd']>>((e: AddEvent): void => {
    const tasks = e.toData === 'plannedTasks' ? plannedTasksState : doingTasksState;

    const updatedTasks = [...tasks];
    updatedTasks.splice(e.toIndex, 0, e.itemData);

    if (e.toData === 'plannedTasks') {
      setPlannedTasksState(updatedTasks);
    } else {
      setDoingTasksState(updatedTasks);
    }
  }, [plannedTasksState, doingTasksState]);

  const onRemove = useCallback<NonNullable<IItemDraggingProps['onRemove']>>((e: RemoveEvent): void => {
    const tasks: Task[] = e.fromData === 'plannedTasks' ? plannedTasksState : doingTasksState;
    const updatedTasks: Task[] = [...tasks];
    updatedTasks.splice(e.fromIndex, 1);

    if (e.fromData === 'plannedTasks') {
      setPlannedTasksState(updatedTasks);
    } else {
      setDoingTasksState(updatedTasks);
    }
  }, [plannedTasksState, doingTasksState]);

  const onReorder = useCallback<NonNullable<IItemDraggingProps['onReorder']>>((e: ReorderEvent): void => {
    if (e.fromData === e.toData) {
      const updateTasks = (tasks: Task[]): Task[] => {
        const updatedTasks: Task[] = [...tasks];
        const [movedTask] = updatedTasks.splice(e.fromIndex, 1);
        updatedTasks.splice(e.toIndex, 0, movedTask);
        return updatedTasks;
      };

      if (e.fromData === 'plannedTasks') {
        setPlannedTasksState((prevTasks: Task[]): Task[] => updateTasks(prevTasks));
      } else {
        setDoingTasksState((prevTasks: Task[]): Task[] => updateTasks(prevTasks));
      }
    } else {
      onRemove(e as RemoveEvent);
      onAdd(e as AddEvent);
    }
  }, [onAdd, onRemove]);

  return (
    <div className="widget-container">
      <List
        dataSource={plannedTasksState}
        keyExpr="id"
        repaintChangesOnly={true}
      >
        <ItemDragging
          allowReordering={true}
          group="tasks"
          data="plannedTasks"
          onDragStart={onDragStart}
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}>
        </ItemDragging>
      </List>
      <List
        dataSource={doingTasksState}
        keyExpr="id"
        repaintChangesOnly={true}
      >
        <ItemDragging
          allowReordering={true}
          group="tasks"
          data="doingTasks"
          onDragStart={onDragStart}
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}>
        </ItemDragging>
      </List>
    </div>
  );
};

export default App;
