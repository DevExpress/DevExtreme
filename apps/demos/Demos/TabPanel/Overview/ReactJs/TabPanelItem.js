import React from 'react';
import TaskItem from './TaskItem.js';

function TabPanelItem({ data }) {
  const taskItems = data.tasks.map((task, index) => (
    <TaskItem
      key={index}
      prop={task}
    />
  ));
  return <div className="tabpanel-item">{taskItems}</div>;
}
export default TabPanelItem;
