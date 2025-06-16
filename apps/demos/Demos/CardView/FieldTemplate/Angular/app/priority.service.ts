import { Injectable } from '@angular/core';

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

@Injectable()
export class PriorityService {
  getPriorities() {
    return priorities;
  }
}
