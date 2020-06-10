export const data = [
  {
    text: 'Watercolor Landscape',
    roomId: [1],
    startDate: new Date(2017, 4, 1, 9, 30),
    endDate: new Date(2017, 4, 1, 11),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10'
  }, {
    text: 'Oil Painting for Beginners',
    roomId: [2],
    startDate: new Date(2017, 4, 1, 9, 30),
    endDate: new Date(2017, 4, 1, 11),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
  }, {
    text: 'Testing',
    roomId: [3],
    startDate: new Date(2017, 4, 1, 12, 0),
    endDate: new Date(2017, 4, 1, 13, 0),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;WKST=TU;INTERVAL=2;COUNT=2'
  }, {
    text: 'Meeting of Instructors',
    roomId: [4],
    startDate: new Date(2017, 4, 1, 9, 0),
    endDate: new Date(2017, 4, 1, 9, 15),
    recurrenceRule: 'FREQ=DAILY;BYDAY=WE;UNTIL=20170601'
  }, {
    text: 'Recruiting students',
    roomId: [5],
    startDate: new Date(2017, 4, 26, 10, 0),
    endDate: new Date(2017, 4, 26, 11, 0),
    recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=23',
    recurrenceException: '20170611T100000'
  }, {
    text: 'Final exams',
    roomId: [3],
    startDate: new Date(2017, 4, 26, 12, 0),
    endDate: new Date(2017, 4, 26, 13, 35),
    recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=24;BYDAY=TH,FR'
  }, {
    text: 'Monthly Planning',
    roomId: [4],
    startDate: new Date(2017, 4, 26, 14, 30),
    endDate: new Date(2017, 4, 26, 15, 45),
    recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=27;COUNT=1'
  }, {
    text: 'Open Day',
    roomId: [5],
    startDate: new Date(2017, 4, 1, 9, 30),
    endDate: new Date(2017, 4, 1, 13),
    recurrenceRule: 'FREQ=YEARLY;BYYEARDAY=148'
  }
];

export const resourcesData = [
  {
    text: 'Room 101',
    id: 1,
    color: '#bbd806'
  }, {
    text: 'Room 102',
    id: 2,
    color: '#f34c8a'
  }, {
    text: 'Room 103',
    id: 3,
    color: '#ae7fcc'
  }, {
    text: 'Meeting room',
    id: 4,
    color: '#ff8817'
  }, {
    text: 'Conference hall',
    id: 5,
    color: '#03bb92'
  }
];
