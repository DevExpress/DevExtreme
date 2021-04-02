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

export default function TaskTemplate(item) {
  return (
    <div className={`custom-task ${getTaskColor(item.taskData.id)}`} style={ { width: `${item.taskSize.width}px` } }>
      <div className="custom-task-img-wrapper">
        <img className="custom-task-img" src={getImagePath(item.taskData.id)} />
      </div>
      <div className='custom-task-wrapper'>
        <div className='custom-task-title'>{item.taskData.title}</div>
        <div className='custom-task-row'>{item.taskResources[0].text}</div>
      </div>
      <div className='custom-task-progress' style={ { width: `${item.taskData.progress}%` } }></div>
    </div>
  );
}
