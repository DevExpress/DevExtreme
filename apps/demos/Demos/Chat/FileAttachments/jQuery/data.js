const getTimestamp = function (date, offsetMinutes = 0) {
  return date.getTime() + offsetMinutes * 60000;
};

const date = new Date();
date.setHours(0, 0, 0, 0);

const currentUser = {
  id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
  name: 'John Doe',
};

const supportAgent = {
  id: 'd16d1a4c-5c67-4e20-b70e-2991c22747c3',
  name: 'Support Agent',
  avatarUrl: '../../../../images/petersmith.png',
};

const messages = [
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -9),
    author: supportAgent,
    text: 'Hello, John!\nHow can I assist you today?',
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: "Hi, I'm having trouble accessing my account.\nIt says my password is incorrect. I’ve attached some screenshots for you to check.",
    attachments: [
      {
        name: 'Screenshot1.jpg',
        size: 0,
      },
      {
        name: 'Screenshot2.jpg',
        size: 0,
      },
      {
        name: 'Screenshot3.jpg',
        size: 0,
      },
    ],
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'Thanks for the screenshots!  I can help you with that. Please refer to the attached file for instructions to restore access.',
    attachments: [
      {
        name: 'Instructions.pdf',
        size: 0,
      },
    ],
  },
];

const editingOptions = [
  { text: 'Enabled', key: 'enabled' },
  { text: 'Disabled', key: 'disabled' },
  { text: 'Only the last message (custom)', key: 'custom' },
];
