import { Injectable } from '@angular/core';

export interface Appointment {
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
  assigneeId: number[];
  recurrenceRule?: string;
  allDay?: boolean;
}

export interface Assignee {
  id: number;
  text: string;
  color: string;
}

export const assignees: Assignee[] = [
  { id: 1, text: 'Samantha Bright', color: '#A7E3A5' },
  { id: 2, text: 'John Heart', color: '#CFE4FA' },
  { id: 3, text: 'Todd Hoffman', color: '#F9E2AE' },
  { id: 4, text: 'Sandra Johnson', color: '#F1BBBC' },
];

const appointments: Appointment[] = [
  {
    id: 1,
    text: 'Website Re-Design Plan',
    startDate: new Date(2026, 1, 9, 9, 30),
    endDate: new Date(2026, 1, 9, 11, 30),
    assigneeId: [2],
  },
  {
    id: 2,
    text: 'Install New Router in Dev Room',
    startDate: new Date(2026, 1, 9, 14, 30),
    endDate: new Date(2026, 1, 9, 15, 30),
    assigneeId: [3],
  },
  {
    id: 3,
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2026, 1, 10, 10, 0),
    endDate: new Date(2026, 1, 10, 11, 0),
    assigneeId: [1],
  },
  {
    id: 4,
    text: 'Final Budget Review',
    startDate: new Date(2026, 1, 10, 12, 0),
    endDate: new Date(2026, 1, 10, 13, 35),
    assigneeId: [1],
  },
  {
    id: 5,
    text: 'Install New Database',
    startDate: new Date(2026, 1, 11, 9, 45),
    endDate: new Date(2026, 1, 11, 11, 15),
    assigneeId: [4],
  },
  {
    id: 6,
    text: 'Approve New Online Marketing Strategy',
    startDate: new Date(2026, 1, 11, 12, 0),
    endDate: new Date(2026, 1, 11, 14, 0),
    assigneeId: [2],
  },
  {
    id: 7,
    text: 'Prepare 2021 Marketing Plan',
    startDate: new Date(2026, 1, 12, 11, 0),
    endDate: new Date(2026, 1, 12, 13, 30),
    assigneeId: [3],
  },
  {
    id: 8,
    text: 'Brochure Design Review',
    startDate: new Date(2026, 1, 12, 14, 0),
    endDate: new Date(2026, 1, 12, 15, 30),
    assigneeId: [2],
  },
  {
    id: 9,
    text: 'Create Icons for Website',
    startDate: new Date(2026, 1, 13, 10, 0),
    endDate: new Date(2026, 1, 13, 11, 30),
    assigneeId: [1],
  },
  {
    id: 10,
    text: 'Launch New Website',
    startDate: new Date(2026, 1, 13, 12, 20),
    endDate: new Date(2026, 1, 13, 14, 0),
    assigneeId: [4],
  },
  {
    id: 11,
    text: 'Upgrade Server Hardware',
    startDate: new Date(2026, 1, 13, 14, 30),
    endDate: new Date(2026, 1, 13, 16, 0),
    assigneeId: [2],
  },
];

@Injectable()
export class Service {
  getAppointments(): Appointment[] {
    return appointments;
  }
}
