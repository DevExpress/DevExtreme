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
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: "Hi! I'm having trouble accessing my account.\nThe website says my password is incorrect. I'm sending a few screenshots so you can see where I get the error.",
    attachments: [screenshot1, screenshot2, screenshot3],
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'Hello! Thanks for including screenshots. To restore access, please follow instructions in the attached file. Let me know if you need anything else.',
    attachments: [instructions],
  },
];
