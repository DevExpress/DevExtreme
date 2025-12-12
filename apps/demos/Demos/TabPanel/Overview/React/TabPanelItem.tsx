import React from 'react';
import TaskItem from './TaskItem.tsx';
import type { Task } from './data.ts';

interface TabPanelItemProps {
  data: {
    tasks: Task[];
  };
}

function TabPanelItem({ data }: TabPanelItemProps) {
  const taskItems = data.tasks.map((task: Task, index: number) => <TaskItem key={index} prop={task} />);

  return (
    <div className="tabpanel-item">
      {taskItems}
    </div>
  );
}

export default TabPanelItem;
