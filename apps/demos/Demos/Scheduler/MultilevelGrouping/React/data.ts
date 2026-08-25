import type { SchedulerTypes } from 'devextreme-react/scheduler';

type Appointment = SchedulerTypes.Appointment & { assigneeId: number[] };

type Assignee = {
  id: number | string;
  text: string;
  parentId: string | null;
  shortText?: string;
  color?: string;
};

export const assignees: Assignee[] = [
  {
    id: 'room-1', text: '🏢 Room 1', shortText: 'Room 1', parentId: null,
  },
  {
    id: 1, text: 'Samantha Bright', parentId: 'room-1', color: '#A7E3A5',
  },
  {
    id: 2, text: 'John Heart', parentId: 'room-1', color: '#F9E2AE',
  },
  {
    id: 'room-2', text: '🏢 Room 2', shortText: 'Room 2', parentId: null,
  },
  {
    id: 3, text: 'Todd Hoffman', parentId: 'room-2', color: '#F1BBBC',
  },
  {
    id: 4, text: 'Sandra Johnson', parentId: 'room-2', color: '#CFE4FA',
  },
];

export const appointments: Appointment[] = [
  {
    text: 'Upgrade Personal Computers',
    assigneeId: [1],
    startDate: new Date(2026, 6, 13, 9, 30),
    endDate: new Date(2026, 6, 13, 11, 30),
  }, {
    text: 'Install New Database',
    assigneeId: [1],
    startDate: new Date(2026, 6, 13, 13, 0),
    endDate: new Date(2026, 6, 13, 15, 30),
  }, {
    text: 'Install New Router in Dev Room',
    assigneeId: [1],
    startDate: new Date(2026, 6, 14, 9, 0),
    endDate: new Date(2026, 6, 14, 12, 15),
  }, {
    text: 'Brochure Design Review',
    assigneeId: [1],
    startDate: new Date(2026, 6, 15, 11, 0),
    endDate: new Date(2026, 6, 15, 13, 30),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    assigneeId: [1],
    startDate: new Date(2026, 6, 16, 10, 0),
    endDate: new Date(2026, 6, 16, 12, 0),
  }, {
    text: 'Upgrade Server Hardware',
    assigneeId: [1],
    startDate: new Date(2026, 6, 17, 9, 0),
    endDate: new Date(2026, 6, 17, 15, 0),
  }, {
    text: 'Google AdWords Strategy',
    assigneeId: [2],
    startDate: new Date(2026, 6, 13, 9, 0),
    endDate: new Date(2026, 6, 13, 12, 0),
  }, {
    text: 'Rollout of New Website and Marketing Brochures',
    assigneeId: [2],
    startDate: new Date(2026, 6, 13, 13, 0),
    endDate: new Date(2026, 6, 13, 15, 30),
  }, {
    text: 'Update NDA Agreement',
    assigneeId: [2],
    startDate: new Date(2026, 6, 14, 11, 0),
    endDate: new Date(2026, 6, 14, 14, 15),
  }, {
    text: 'Submit Questions Regarding New NDA',
    assigneeId: [2],
    startDate: new Date(2026, 6, 15, 10, 0),
    endDate: new Date(2026, 6, 15, 11, 30),
  }, {
    text: 'Submit Signed NDA',
    assigneeId: [2],
    startDate: new Date(2026, 6, 15, 13, 0),
    endDate: new Date(2026, 6, 15, 15, 0),
  }, {
    text: 'Review Training Course for any Omissions',
    assigneeId: [2],
    startDate: new Date(2026, 6, 16, 11, 0),
    endDate: new Date(2026, 6, 16, 14, 0),
  }, {
    text: 'Update Employee Files with New NDA',
    assigneeId: [2],
    startDate: new Date(2026, 6, 17, 9, 0),
    endDate: new Date(2026, 6, 17, 11, 45),
  }, {
    text: 'Website Re-Design Plan',
    assigneeId: [3],
    startDate: new Date(2026, 6, 13, 9, 30),
    endDate: new Date(2026, 6, 13, 11, 30),
  }, {
    text: 'New Brochures',
    assigneeId: [3],
    startDate: new Date(2026, 6, 13, 13, 0),
    endDate: new Date(2026, 6, 13, 15, 15),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    assigneeId: [3],
    startDate: new Date(2026, 6, 14, 10, 0),
    endDate: new Date(2026, 6, 14, 11, 0),
  }, {
    text: 'Final Budget Review',
    assigneeId: [3],
    startDate: new Date(2026, 6, 14, 12, 0),
    endDate: new Date(2026, 6, 14, 13, 35),
  }, {
    text: 'Approve New Online Marketing Strategy',
    assigneeId: [3],
    startDate: new Date(2026, 6, 15, 12, 0),
    endDate: new Date(2026, 6, 15, 14, 0),
  }, {
    text: 'Prepare 2026 Marketing Plan',
    assigneeId: [3],
    startDate: new Date(2026, 6, 16, 11, 0),
    endDate: new Date(2026, 6, 16, 13, 30),
  }, {
    text: 'Create Icons for Website',
    assigneeId: [3],
    startDate: new Date(2026, 6, 17, 10, 0),
    endDate: new Date(2026, 6, 17, 11, 30),
  }, {
    text: 'Launch New Website',
    assigneeId: [3],
    startDate: new Date(2026, 6, 17, 12, 20),
    endDate: new Date(2026, 6, 17, 14, 0),
  }, {
    text: 'Comment on Revenue Projections',
    assigneeId: [4],
    startDate: new Date(2026, 6, 13, 10, 0),
    endDate: new Date(2026, 6, 13, 13, 0),
  }, {
    text: 'Approve Hiring of John Jeffers',
    assigneeId: [4],
    startDate: new Date(2026, 6, 14, 9, 0),
    endDate: new Date(2026, 6, 14, 12, 0),
  }, {
    text: 'Non-Compete Agreements',
    assigneeId: [4],
    startDate: new Date(2026, 6, 14, 13, 0),
    endDate: new Date(2026, 6, 14, 15, 45),
  }, {
    text: 'Review Revenue Projections',
    assigneeId: [4],
    startDate: new Date(2026, 6, 15, 11, 0),
    endDate: new Date(2026, 6, 15, 14, 0),
  }, {
    text: 'Review Changes to Health Insurance Coverage',
    assigneeId: [4],
    startDate: new Date(2026, 6, 16, 9, 0),
    endDate: new Date(2026, 6, 16, 13, 0),
  }, {
    text: 'Provide New Health Insurance Docs',
    assigneeId: [4],
    startDate: new Date(2026, 6, 17, 12, 0),
    endDate: new Date(2026, 6, 17, 15, 0),
  },
];
