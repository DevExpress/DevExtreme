import React from 'react';

function getImagePath(taskId) {
  const imgPath = '../../../../images/employees';
  let img = taskId < 10 ? `0${taskId}` : taskId;
  img = `${imgPath}/${img}.png`;
  return img;
}
function getTaskColor(taskId) {
  const color = taskId % 6;
  return `custom-task-color-${color}`;
}
const getTaskWrapperStyle = (taskSize) => ({ width: `${taskSize.width}px` });
const getProgressStyle = (progress) => ({ width: `${progress}%` });
export default function TaskTemplate({ taskData, taskSize, taskResources }) {
  return (
    <div
      className={`custom-task ${getTaskColor(taskData.id)}`}
      style={getTaskWrapperStyle(taskSize)}
    >
      <div className="custom-task-img-wrapper">
        <img
          className="custom-task-img"
          src={getImagePath(taskData.id)}
        />
      </div>
      <div className="custom-task-wrapper">
        <div className="custom-task-title">{taskData.title}</div>
        <div className="custom-task-row">{taskResources[0].text}</div>
      </div>
      <div
        className="custom-task-progress"
        style={getProgressStyle(taskData.progress)}
      ></div>
    </div>
  );
}
