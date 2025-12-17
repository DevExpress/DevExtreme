import React from 'react';
import TaskItem from './TaskItem.tsx';
import type { Task } from './types.ts';

interface TabPanelItemProps {
  data: {
    tasks: Task[];
  };
}

function TabPanelItem({ data }: TabPanelItemProps) {
  const taskItems = data.tasks.map((task: Task, index: number) => <TaskItem key={index} task={task} />);

  return (
    <div className="tabpanel-item">
      {taskItems}
    </div>
  );
}

export default TabPanelItem;
