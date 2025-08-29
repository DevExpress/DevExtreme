import React, { useMemo } from 'react';
import { priorities } from './data.js';

const Priority = ({ priorityID }) => {
  const priority = useMemo(() => priorities.find((p) => p.id === priorityID), [priorityID]);
  return (
    <div className={`task__priority task__priority--${priority.postfix}`}>
      <div className="task__indicator" />
      <div>{priority.text}</div>
    </div>
  );
};
export default Priority;
