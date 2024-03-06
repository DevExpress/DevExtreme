import React from 'react';

function getImagePath(taskId: number) {
  const imgPath = '../../../../images/employees';
  let img = taskId < 10 ? `0${taskId}` : taskId;
  img = `${imgPath}/${img}.png`;
  return img;
}

function getTaskColor(taskId: number) {
  const color = taskId % 6;
  return `custom-task-color-${color}`;
}

export default function TaskTemplate({ taskData, taskSize, taskResources }) {
  return (
    <div className={`custom-task ${getTaskColor(taskData.id)}`} style={ { width: `${taskSize.width}px` } }>
      <div className="custom-task-img-wrapper">
        <img className="custom-task-img" src={getImagePath(taskData.id)} />
      </div>
      <div className='custom-task-wrapper'>
        <div className='custom-task-title'>{taskData.title}</div>
        <div className='custom-task-row'>{taskResources[0].text}</div>
      </div>
      <div className='custom-task-progress' style={ { width: `${taskData.progress}%` } }></div>
    </div>
  );
}
