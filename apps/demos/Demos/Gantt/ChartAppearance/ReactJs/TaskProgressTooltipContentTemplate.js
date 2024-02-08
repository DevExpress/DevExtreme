import React from 'react';

export default function TaskProgressTooltipContentTemplate({ progress }) {
  return (
    <div className="custom-task-edit-tooltip">
      <div className="custom-tooltip-title">{progress}%</div>
    </div>
  );
}
