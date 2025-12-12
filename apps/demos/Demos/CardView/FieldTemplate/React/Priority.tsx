import React, { useMemo } from 'react';
import { priorities } from './data.ts';
import type { Priority } from './data.ts';

interface PriorityProps {
  priorityID: number;
}

const PriorityComponent = ({ priorityID }: PriorityProps) => {
  const priority = useMemo<Priority | undefined>(
    () => priorities.find((p: Priority) => p.id === priorityID),
    [priorityID]
  );

  return (
    <div className={`task__priority task__priority--${priority?.postfix}`}>
      <div className="task__indicator" />
      <div>{ priority?.text }</div>
    </div>
  );
};

export default PriorityComponent;
