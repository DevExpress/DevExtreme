import React from 'react';

function getTimeEstimate({ start, end }) {
  return Math.abs(start - end) / 36e5;
}
function getTimeLeft({ start, end, progress }) {
  const timeEstimate = Math.abs(start - end) / 36e5;
  return Math.floor(((100 - progress) / 100) * timeEstimate);
}
export default function TaskTooltipTemplate(task) {
  return (
    <div className="custom-task-edit-tooltip">
      <div className="custom-tooltip-title">{task.title}</div>
      <div className="custom-tooltip-row">
        <span> Estimate: </span>
        {getTimeEstimate(task)}
        <span> hours </span>
      </div>
      <div className="custom-tooltip-row">
        <span> Left: </span>
        {getTimeLeft(task)}
        <span> hours </span>
      </div>
    </div>
  );
}
