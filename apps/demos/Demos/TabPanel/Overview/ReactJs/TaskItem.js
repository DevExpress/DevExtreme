import React from 'react';

function TaskItem({ prop }) {
  return (
    <div className={`task-item task-item-priority-${prop.priority}`}>
      <span className="task-item-text">{prop.text}</span>

      <span className="task-item-info">{`${prop.date} by ${prop.assignedBy}`}</span>

      <i className="task-item-pseudo-button dx-icon dx-icon-overflow"></i>
    </div>
  );
}
export default TaskItem;
