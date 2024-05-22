import { Injectable } from '@angular/core';

export class Appointment {
  id: number;

  text: string;

  startDate: Date;

  endDate: Date;

  allDay?: boolean;

  assigneeId: number[];

  priorityId: number;

  recurrenceRule?: string;
}

export class Assignee {
  text: string;

  id: number;

  color: string;
}

export class Priority {
  text: string;

  id: number;

  color: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    text: 'Google AdWords Strategy',
    startDate: new Date('2021-05-03T16:00:00.000Z'),
    endDate: new Date('2021-05-03T17:30:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 2,
    text: 'New Brochures',
    startDate: new Date('2021-05-03T18:30:00.000Z'),
    endDate: new Date('2021-05-03T21:15:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 3,
    text: 'Brochure Design Review',
    startDate: new Date('2021-05-03T20:15:00.000Z'),
    endDate: new Date('2021-05-03T23:15:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 4,
    text: 'Website Re-Design Plan',
    startDate: new Date('2021-05-03T23:45:00.000Z'),
    endDate: new Date('2021-05-04T18:15:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 5,
    text: 'Rollout of New Website and Marketing Brochures',
    startDate: new Date('2021-05-04T15:15:00.000Z'),
    endDate: new Date('2021-05-04T17:45:00.000Z'),
    assigneeId: [4],
    priorityId: 2,
  }, {
    id: 6,
    text: 'Update Sales Strategy Documents',
    startDate: new Date('2021-05-04T19:00:00.000Z'),
    endDate: new Date('2021-05-04T20:45:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 7,
    text: 'Non-Compete Agreements',
    startDate: new Date('2021-05-05T15:15:00.000Z'),
    endDate: new Date('2021-05-05T16:00:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 8,
    text: 'Approve Hiring of John Jeffers',
    startDate: new Date('2021-05-05T17:00:00.000Z'),
    endDate: new Date('2021-05-05T18:15:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 9,
    text: 'Update NDA Agreement',
    startDate: new Date('2021-05-05T18:45:00.000Z'),
    endDate: new Date('2021-05-05T20:45:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 10,
    text: 'Update Employee Files with New NDA',
    startDate: new Date('2021-05-05T21:00:00.000Z'),
    endDate: new Date('2021-05-05T23:45:00.000Z'),
    assigneeId: [4],
    priorityId: 1,
  }, {
    id: 11,
    text: 'Submit Questions Regarding New NDA',
    startDate: new Date('2021-05-07T01:00:00.000Z'),
    endDate: new Date('2021-05-06T16:30:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 12,
    text: 'Submit Signed NDA',
    startDate: new Date('2021-05-06T19:45:00.000Z'),
    endDate: new Date('2021-05-06T21:00:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 13,
    text: 'Review Revenue Projections',
    startDate: new Date('2021-05-07T00:15:00.000Z'),
    endDate: new Date('2021-05-06T15:00:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 14,
    text: 'Comment on Revenue Projections',
    startDate: new Date('2021-05-07T16:15:00.000Z'),
    endDate: new Date('2021-05-07T18:15:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 15,
    text: 'Provide New Health Insurance Docs',
    startDate: new Date('2021-05-07T19:45:00.000Z'),
    endDate: new Date('2021-05-07T21:15:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 16,
    text: 'Review Changes to Health Insurance Coverage',
    startDate: new Date('2021-05-07T21:15:00.000Z'),
    endDate: new Date('2021-05-07T22:30:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 17,
    text: 'Review Training Course for any Omissions',
    startDate: new Date('2021-05-10T21:00:00.000Z'),
    endDate: new Date('2021-05-11T19:00:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 18,
    text: 'Recall Rebate Form',
    startDate: new Date('2021-05-10T19:45:00.000Z'),
    endDate: new Date('2021-05-10T20:15:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 19,
    text: 'Create Report on Customer Feedback',
    startDate: new Date('2021-05-11T22:15:00.000Z'),
    endDate: new Date('2021-05-12T00:30:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 20,
    text: 'Review Customer Feedback Report',
    startDate: new Date('2021-05-11T23:15:00.000Z'),
    endDate: new Date('2021-05-12T01:30:00.000Z'),
    assigneeId: [2],
    priorityId: 1,
  }, {
    id: 21,
    text: 'Customer Feedback Report Analysis',
    startDate: new Date('2021-05-12T16:30:00.000Z'),
    endDate: new Date('2021-05-12T17:30:00.000Z'),
    recurrenceRule: 'FREQ=WEEKLY',
    assigneeId: [4],
    priorityId: 2,
  }, {
    id: 22,
    text: 'Prepare Shipping Cost Analysis Report',
    startDate: new Date('2021-05-12T19:30:00.000Z'),
    endDate: new Date('2021-05-12T20:30:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 23,
    text: 'Provide Feedback on Shippers',
    startDate: new Date('2021-05-12T21:15:00.000Z'),
    endDate: new Date('2021-05-12T23:00:00.000Z'),
    assigneeId: [4],
    priorityId: 2,
  }, {
    id: 24,
    text: 'Select Preferred Shipper',
    startDate: new Date('2021-05-13T00:30:00.000Z'),
    endDate: new Date('2021-05-13T03:00:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 25,
    text: 'Complete Shipper Selection Form',
    startDate: new Date('2021-05-13T15:30:00.000Z'),
    endDate: new Date('2021-05-13T17:00:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 26,
    text: 'Upgrade Server Hardware',
    startDate: new Date('2021-05-13T19:00:00.000Z'),
    endDate: new Date('2021-05-13T21:15:00.000Z'),
    recurrenceRule: 'FREQ=WEEKLY',
    assigneeId: [2],
    priorityId: 1,
  }, {
    id: 27,
    text: 'Upgrade Personal Computers',
    startDate: new Date('2021-05-13T21:45:00.000Z'),
    endDate: new Date('2021-05-13T23:30:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 28,
    text: 'Upgrade Apps to Windows RT or stay with WinForms',
    startDate: new Date('2021-05-14T17:30:00.000Z'),
    endDate: new Date('2021-05-14T20:00:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 29,
    text: 'Estimate Time Required to Touch-Enable Apps',
    startDate: new Date('2021-05-14T21:45:00.000Z'),
    endDate: new Date('2021-05-14T23:30:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 30,
    text: 'Report on Tranistion to Touch-Based Apps',
    startDate: new Date('2021-05-15T01:30:00.000Z'),
    endDate: new Date('2021-05-15T02:00:00.000Z'),
    assigneeId: [4],
    priorityId: 1,
  }, {
    id: 31,
    text: 'Submit New Website Design',
    startDate: new Date('2021-05-17T15:00:00.000Z'),
    endDate: new Date('2021-05-17T17:00:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 32,
    text: 'Create Icons for Website',
    startDate: new Date('2021-05-17T18:30:00.000Z'),
    endDate: new Date('2021-05-17T20:15:00.000Z'),
    assigneeId: [4],
    priorityId: 2,
  }, {
    id: 33,
    text: 'Create New Product Pages',
    startDate: new Date('2021-05-18T16:45:00.000Z'),
    endDate: new Date('2021-05-18T18:45:00.000Z'),
    assigneeId: [2],
    priorityId: 1,
  }, {
    id: 34,
    text: 'Approve Website Launch',
    startDate: new Date('2021-05-18T19:00:00.000Z'),
    endDate: new Date('2021-05-18T22:15:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 35,
    text: 'Update Customer Shipping Profiles',
    startDate: new Date('2021-05-19T16:30:00.000Z'),
    endDate: new Date('2021-05-19T18:00:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 36,
    text: 'Create New Shipping Return Labels',
    startDate: new Date('2021-05-19T19:45:00.000Z'),
    endDate: new Date('2021-05-19T21:00:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 37,
    text: 'Get Design for Shipping Return Labels',
    startDate: new Date('2021-05-19T22:00:00.000Z'),
    endDate: new Date('2021-05-19T23:30:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 38,
    text: 'PSD needed for Shipping Return Labels',
    startDate: new Date('2021-05-20T15:30:00.000Z'),
    endDate: new Date('2021-05-20T16:15:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 39,
    text: 'Contact ISP and Discuss Payment Options',
    startDate: new Date('2021-05-20T18:30:00.000Z'),
    endDate: new Date('2021-05-20T23:00:00.000Z'),
    assigneeId: [4],
    priorityId: 1,
  }, {
    id: 40,
    text: 'Prepare Year-End Support Summary Report',
    startDate: new Date('2021-05-21T00:00:00.000Z'),
    endDate: new Date('2021-05-21T03:00:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 41,
    text: 'Review New Training Material',
    startDate: new Date('2021-05-21T15:00:00.000Z'),
    endDate: new Date('2021-05-21T16:15:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 42,
    text: 'Distribute Training Material to Support Staff',
    startDate: new Date('2021-05-21T19:45:00.000Z'),
    endDate: new Date('2021-05-21T21:00:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 43,
    text: 'Training Material Distribution Schedule',
    startDate: new Date('2021-05-21T21:15:00.000Z'),
    endDate: new Date('2021-05-21T23:15:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 44,
    text: 'Approval on Converting to New HDMI Specification',
    startDate: new Date('2021-05-24T16:30:00.000Z'),
    endDate: new Date('2021-05-24T17:15:00.000Z'),
    assigneeId: [4],
    priorityId: 2,
  }, {
    id: 45,
    text: 'Create New Spike for Automation Server',
    startDate: new Date('2021-05-24T17:00:00.000Z'),
    endDate: new Date('2021-05-24T19:30:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 46,
    text: 'Code Review - New Automation Server',
    startDate: new Date('2021-05-24T20:00:00.000Z'),
    endDate: new Date('2021-05-24T22:00:00.000Z'),
    assigneeId: [3],
    priorityId: 1,
  }, {
    id: 47,
    text: 'Confirm Availability for Sales Meeting',
    startDate: new Date('2021-05-25T17:15:00.000Z'),
    endDate: new Date('2021-05-25T22:15:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 48,
    text: 'Reschedule Sales Team Meeting',
    startDate: new Date('2021-05-25T23:15:00.000Z'),
    endDate: new Date('2021-05-26T01:00:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  }, {
    id: 49,
    text: 'Send 2 Remotes for Giveaways',
    startDate: new Date('2021-05-26T16:30:00.000Z'),
    endDate: new Date('2021-05-26T18:45:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 50,
    text: 'Discuss Product Giveaways with Management',
    startDate: new Date('2021-05-26T19:15:00.000Z'),
    endDate: new Date('2021-05-26T23:45:00.000Z'),
    assigneeId: [4],
    priorityId: 1,
  }, {
    id: 51,
    text: 'Replace Desktops on the 3rd Floor',
    startDate: new Date('2021-05-27T16:30:00.000Z'),
    endDate: new Date('2021-05-27T17:45:00.000Z'),
    assigneeId: [2],
    priorityId: 1,
  }, {
    id: 52,
    text: 'Update Database with New Leads',
    startDate: new Date('2021-05-27T19:00:00.000Z'),
    endDate: new Date('2021-05-27T21:15:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 53,
    text: 'Mail New Leads for Follow Up',
    startDate: new Date('2021-05-27T21:45:00.000Z'),
    endDate: new Date('2021-05-27T22:30:00.000Z'),
    assigneeId: [1],
    priorityId: 2,
  }, {
    id: 54,
    text: 'Send Territory Sales Breakdown',
    startDate: new Date('2021-05-28T01:00:00.000Z'),
    endDate: new Date('2021-05-28T03:00:00.000Z'),
    assigneeId: [2],
    priorityId: 2,
  }, {
    id: 55,
    text: 'Territory Sales Breakdown Report',
    startDate: new Date('2021-05-28T15:45:00.000Z'),
    endDate: new Date('2021-05-28T16:45:00.000Z'),
    assigneeId: [3],
    priorityId: 2,
  }, {
    id: 56,
    text: 'Report on the State of Engineering Dept',
    startDate: new Date('2021-05-28T21:45:00.000Z'),
    endDate: new Date('2021-05-28T22:30:00.000Z'),
    assigneeId: [4],
    priorityId: 1,
  }, {
    id: 57,
    text: 'Staff Productivity Report',
    startDate: new Date('2021-05-28T23:15:00.000Z'),
    endDate: new Date('2021-05-29T02:30:00.000Z'),
    assigneeId: [1],
    priorityId: 1,
  },
];

const assignees: Assignee[] = [
  {
    text: 'Samantha Bright',
    id: 1,
    color: '#727bd2',
  }, {
    text: 'John Heart',
    id: 2,
    color: '#32c9ed',
  }, {
    text: 'Todd Hoffman',
    id: 3,
    color: '#2a7ee4',
  }, {
    text: 'Sandra Johnson',
    id: 4,
    color: '#7b49d3',
  },
];

const priorities: Priority[] = [
  {
    text: 'High',
    id: 1,
    color: '#cc5c53',
  }, {
    text: 'Low',
    id: 2,
    color: '#ff9747',
  },
];

@Injectable()
export class Service {
  getAppointments(): Appointment[] {
    return appointments;
  }

  getAssignees(): Assignee[] {
    return assignees;
  }

  getPriorities(): Priority[] {
    return priorities;
  }
}
