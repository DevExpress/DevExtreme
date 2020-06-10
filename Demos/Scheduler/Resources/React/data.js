export const resourcesList = ['Owner', 'Room', 'Priority'];

export const data = [
  {
    text: 'Website Re-Design Plan',
    ownerId: 4, roomId: 1, priorityId: 2,
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30)
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    ownerId: 2, roomId: 2, priorityId: 1,
    startDate: new Date(2017, 4, 22, 12, 0),
    endDate: new Date(2017, 4, 22, 13, 0),
    allDay: true
  }, {
    text: 'Install New Router in Dev Room',
    ownerId: 1, roomId: 1, priorityId: 2,
    startDate: new Date(2017, 4, 22, 14, 30),
    endDate: new Date(2017, 4, 22, 15, 30)
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    ownerId: 3, roomId: 2, priorityId: 2,
    startDate: new Date(2017, 4, 23, 10, 0),
    endDate: new Date(2017, 4, 23, 11, 0)
  }, {
    text: 'Final Budget Review',
    ownerId: 1, roomId: 1, priorityId: 1,
    startDate: new Date(2017, 4, 23, 12, 0),
    endDate: new Date(2017, 4, 23, 13, 35)
  }, {
    text: 'New Brochures',
    ownerId: 4, roomId: 3, priorityId: 2,
    startDate: new Date(2017, 4, 23, 14, 30),
    endDate: new Date(2017, 4, 23, 15, 45)
  }, {
    text: 'Install New Database',
    ownerId: 2, roomId: 3, priorityId: 1,
    startDate: new Date(2017, 4, 24, 9, 45),
    endDate: new Date(2017, 4, 24, 11, 15)
  }, {
    text: 'Approve New Online Marketing Strategy',
    ownerId: 4, roomId: 2, priorityId: 1,
    startDate: new Date(2017, 4, 24, 12, 0),
    endDate: new Date(2017, 4, 24, 14, 0)
  }, {
    text: 'Upgrade Personal Computers',
    ownerId: 2, roomId: 2, priorityId: 2,
    startDate: new Date(2017, 4, 24, 15, 15),
    endDate: new Date(2017, 4, 24, 16, 30)
  }, {
    text: 'Customer Workshop',
    ownerId: 3, roomId: 3, priorityId: 1,
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 0),
    allDay: true
  }, {
    text: 'Prepare 2017 Marketing Plan',
    ownerId: 1, roomId: 1, priorityId: 2,
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 13, 30)
  }, {
    text: 'Brochure Design Review',
    ownerId: 4, roomId: 1, priorityId: 1,
    startDate: new Date(2017, 4, 25, 14, 0),
    endDate: new Date(2017, 4, 25, 15, 30)
  }, {
    text: 'Create Icons for Website',
    ownerId: 3, roomId: 3, priorityId: 1,
    startDate: new Date(2017, 4, 26, 10, 0),
    endDate: new Date(2017, 4, 26, 11, 30)
  }, {
    text: 'Upgrade Server Hardware',
    ownerId: 4, roomId: 2, priorityId: 2,
    startDate: new Date(2017, 4, 26, 14, 30),
    endDate: new Date(2017, 4, 26, 16, 0)
  }, {
    text: 'Submit New Website Design',
    ownerId: 1, roomId: 1, priorityId: 2,
    startDate: new Date(2017, 4, 26, 16, 30),
    endDate: new Date(2017, 4, 26, 18, 0)
  }, {
    text: 'Launch New Website',
    ownerId: 2, roomId: 3, priorityId: 1,
    startDate: new Date(2017, 4, 26, 12, 20),
    endDate: new Date(2017, 4, 26, 14, 0)
  }
];

export const owners = [
  {
    text: 'Samantha Bright',
    id: 1,
    color: '#727bd2'
  }, {
    text: 'John Heart',
    id: 2,
    color: '#32c9ed'
  }, {
    text: 'Todd Hoffman',
    id: 3,
    color: '#2a7ee4'
  }, {
    text: 'Sandra Johnson',
    id: 4,
    color: '#7b49d3'
  }
];

export const rooms = [
  {
    text: 'Room 1',
    id: 1,
    color: '#00af2c'
  }, {
    text: 'Room 2',
    id: 2,
    color: '#56ca85'
  }, {
    text: 'Room 3',
    id: 3,
    color: '#8ecd3c'
  }
];

export const priorities = [
  {
    text: 'High priority',
    id: 1,
    color: '#cc5c53'
  }, {
    text: 'Low priority',
    id: 2,
    color: '#ff9747'
  }
];
