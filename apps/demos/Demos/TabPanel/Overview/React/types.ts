export type Task = {
  status: string;
  priority: 'low' | 'medium' | 'high';
  text: string;
  date: string;
  assignedBy: string;
};
