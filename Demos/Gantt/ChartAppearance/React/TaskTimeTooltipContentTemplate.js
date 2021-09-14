import React from 'react';

function getTime(date) {
  return date.toLocaleString();
}

export default function TaskTimeTooltipContentTemplate(task) {
  return (
    <div className="custom-task-edit-tooltip">
      <div className="custom-tooltip-title">Start: {getTime(task.start)}</div>
      <div className="custom-tooltip-title">End: {getTime(task.end)}</div>

    </div>
  );
}
