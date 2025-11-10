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

const createEmptyAttachment = (name, type) => {
  const blob = new Blob([''], { type });
  const url = URL.createObjectURL(blob);

  return {
    name,
    url,
    size: 1024 * 10,
  };
};

const screenshot1 = createEmptyAttachment('Screenshot1.jpg', 'image/jpeg');
const screenshot2 = createEmptyAttachment('Screenshot2.jpg', 'image/jpeg');
const screenshot3 = createEmptyAttachment('Screenshot3.jpg', 'image/jpeg');
const instructions = createEmptyAttachment('Instructions.pdf', 'application/pdf');

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
    attachments: [screenshot1, screenshot2, screenshot3],
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'Thanks for the screenshots! I can help you with that. Please refer to the attached file for instructions to restore access.',
    attachments: [instructions],
  },
];
