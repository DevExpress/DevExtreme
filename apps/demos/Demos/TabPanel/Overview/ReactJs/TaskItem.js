import React from 'react';

function TaskItem({ task }) {
  const {
    priority, text, date, assignedBy,
  } = task;
  return (
    <div className={`task-item task-item-priority-${priority}`}>
      <span className="task-item-text">{text}</span>

      <span className="task-item-info">{`${date} by ${assignedBy}`}</span>

      <i className="task-item-pseudo-button dx-icon dx-icon-overflow"></i>
    </div>
  );
}
export default TaskItem;
