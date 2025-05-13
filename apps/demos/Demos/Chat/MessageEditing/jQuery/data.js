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
    text: "Hi, I'm having trouble accessing my account.",
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: 'It says my password is incorrect.',
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    isDeleted: true,
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'I can help you with that. Can you please confirm your UserID for security purposes?',
    isEdited: true,
  },
];

const editingOptions = [
  { text: 'Enabled', key: 'enabled' },
  { text: 'Disabled', key: 'disabled' },
  { text: 'Only the last message (custom)', key: 'custom' },
];
