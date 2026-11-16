export const hierarchicalRooms = [
  { id: 'A', text: 'Building A', parentId: null },
  { id: 'A1', text: 'Floor 1', parentId: 'A' },
  {
    id: 101, text: 'Room 101', parentId: 'A1', color: '#3f51b5',
  },
  {
    id: 102, text: 'Room 102', parentId: 'A1', color: '#8e24aa',
  },
  { id: 'A2', text: 'Floor 2', parentId: 'A' },
  {
    id: 201, text: 'Room 201', parentId: 'A2', color: '#00897b',
  },
  { id: 'B', text: 'Building B', parentId: null },
  {
    id: 301, text: 'Room 301', parentId: 'B', color: '#e65100',
  },
  {
    id: 'lobby', text: 'Lobby', parentId: null, color: '#c62828',
  },
];

export const hierarchicalAppointments = [
  {
    text: 'Standup', roomId: 101, startDate: new Date(2021, 3, 26, 9), endDate: new Date(2021, 3, 26, 10),
  },
  {
    text: 'Interview', roomId: 102, startDate: new Date(2021, 3, 26, 11), endDate: new Date(2021, 3, 26, 12, 30),
  },
  {
    text: 'Retro', roomId: 201, startDate: new Date(2021, 3, 26, 10), endDate: new Date(2021, 3, 26, 11),
  },
  {
    text: 'Training', roomId: 301, startDate: new Date(2021, 3, 26, 13), endDate: new Date(2021, 3, 26, 15),
  },
  {
    text: 'Welcome coffee', roomId: 'lobby', startDate: new Date(2021, 3, 26, 9, 30), endDate: new Date(2021, 3, 26, 10, 30),
  },
  {
    text: 'Workshop', roomId: [102, 201], startDate: new Date(2021, 3, 26, 16), endDate: new Date(2021, 3, 26, 17),
  },
  {
    text: 'All-day event', roomId: 101, startDate: new Date(2021, 3, 26), endDate: new Date(2021, 3, 27), allDay: true,
  },
  {
    text: 'Multi-day', roomId: 301, startDate: new Date(2021, 3, 27, 10), endDate: new Date(2021, 3, 29, 12),
  },
];
