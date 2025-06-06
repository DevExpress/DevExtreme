import React from 'react';

export interface Priority {
  id: number;
  text: string;
  postfix: string;
}

const priorities: Priority[] = [{
    id: 1,
    text: 'Low',
    postfix: 'low', 
  },
  {
    id: 2,
    text: 'Normal',
    postfix: 'normal', 
  },
  {
    id: 3,
    text: 'Urgent',
    postfix: 'urgent',
  },
  {
    id: 4,
    text: 'High',
    postfix: 'high',
  },
];

const Priority = ({priorityID}) => {
    const priority = priorities.find(p => p.id === priorityID);
    return (
        <div>
            <div className={`task__priority task__priority--${priority.postfix}`}>
                <div className="task__indicator"></div>
                <div>{ priority.text }</div>
            </div>
        </div>
    );
}

export default Priority;
