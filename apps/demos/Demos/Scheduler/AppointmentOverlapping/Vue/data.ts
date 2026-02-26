export interface Appointment {
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
  projectId: number;
}

export const projects = [
  { id: 1, color: '#A7E3A5' },
  { id: 2, color: '#CFE4FA' },
  { id: 3, color: '#F9E2AE' },
  { id: 4, color: '#F1BBBC' },
];

export const data: Appointment[] = [
  // Mon Feb 9
  { id: 1, text: 'Website Re-Design Plan', startDate: new Date(2026, 1, 9, 9, 30), endDate: new Date(2026, 1, 9, 11, 30), projectId: 2 },
  { id: 2, text: 'Install New Router in Dev Room', startDate: new Date(2026, 1, 9, 14, 30), endDate: new Date(2026, 1, 9, 15, 30), projectId: 3 },
  // Tue Feb 10
  { id: 3, text: 'Approve Personal Computer Upgrade Plan', startDate: new Date(2026, 1, 10, 10, 0), endDate: new Date(2026, 1, 10, 11, 0), projectId: 1 },
  { id: 4, text: 'Final Budget Review', startDate: new Date(2026, 1, 10, 12, 0), endDate: new Date(2026, 1, 10, 13, 35), projectId: 1 },
  // Wed Feb 11
  { id: 5, text: 'Install New Database', startDate: new Date(2026, 1, 11, 9, 45), endDate: new Date(2026, 1, 11, 11, 15), projectId: 4 },
  { id: 6, text: 'Approve New Online Marketing Strategy', startDate: new Date(2026, 1, 11, 12, 0), endDate: new Date(2026, 1, 11, 14, 0), projectId: 2 },
  // Thu Feb 12
  { id: 7, text: 'Prepare 2021 Marketing Plan', startDate: new Date(2026, 1, 12, 11, 0), endDate: new Date(2026, 1, 12, 13, 30), projectId: 3 },
  { id: 8, text: 'Brochure Design Review', startDate: new Date(2026, 1, 12, 14, 0), endDate: new Date(2026, 1, 12, 15, 30), projectId: 2 },
  // Fri Feb 13
  { id: 9, text: 'Create Icons for Website', startDate: new Date(2026, 1, 13, 10, 0), endDate: new Date(2026, 1, 13, 11, 30), projectId: 1 },
  { id: 10, text: 'Launch New Website', startDate: new Date(2026, 1, 13, 12, 20), endDate: new Date(2026, 1, 13, 14, 0), projectId: 4 },
  { id: 11, text: 'Upgrade Server Hardware', startDate: new Date(2026, 1, 13, 14, 30), endDate: new Date(2026, 1, 13, 16, 0), projectId: 2 },
];
