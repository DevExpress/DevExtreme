export interface Priority {
  id: number;
  text: string;
  postfix: string;
}

export const priorities: Priority[] = [{
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
