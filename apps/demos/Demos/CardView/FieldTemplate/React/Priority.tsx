import React, { useMemo } from 'react';
import { priorities, Priority } from './data.ts';

interface PriorityProps {
  priorityID: number;
}

const Priority = ({ priorityID }: PriorityProps) => {
  const priority = useMemo<Priority>(() => {
    return priorities.find((p) => p.id === priorityID);
  }, [priorityID, priorities]);

  return (
    <div className={`task__priority task__priority--${priority.postfix}`}>
      <div className="task__indicator" />
      <div>{ priority.text }</div>
    </div>
  );
};

export default Priority;
