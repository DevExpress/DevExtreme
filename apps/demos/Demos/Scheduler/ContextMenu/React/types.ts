import { SchedulerTypes } from 'devextreme-react/scheduler';

export type Appointment = SchedulerTypes.Appointment & { roomId: number[] };

export type Resource = {
  id?: number;
  text: string;
  color?: string;
};

