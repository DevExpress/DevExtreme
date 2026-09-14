import React, { useMemo } from 'react';

interface TaskTemplateProps {
  taskData: {
    id: number;
    title: string;
    progress: number;
  };
  taskSize: {
    width: number;
    height: number;
  };
  taskResources: { text: string }[];
}

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

export default function TaskTemplate({ taskData, taskSize, taskResources }: TaskTemplateProps) {
  const taskWrapperStyle = useMemo(() => ({ width: `${taskSize.width}px` }), [taskSize.width]);
  const progressStyle = useMemo(() => ({ width: `${taskData.progress}%` }), [taskData.progress]);
  return (
    <div className={`custom-task ${getTaskColor(taskData.id)}`} style={taskWrapperStyle}>
      <div className="custom-task-img-wrapper">
        <img className="custom-task-img" src={getImagePath(taskData.id)} />
      </div>
      <div className='custom-task-wrapper'>
        <div className='custom-task-title'>{taskData.title}</div>
        <div className='custom-task-row'>{taskResources[0].text}</div>
      </div>
      <div className='custom-task-progress' style={progressStyle}></div>
    </div>
  );
}
