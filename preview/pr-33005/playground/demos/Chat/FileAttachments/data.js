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
  avatarUrl: '../../../images/petersmith.png',
};

const messages = [
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: "Hi! I'm having trouble accessing my account.\nThe website says my password is incorrect. I'm sending a few screenshots so you can see where I get the error.",
    attachments: [
      {
        name: 'Pic1.png',
        url: '../../../images/Chat/FileAttachments/Pic1.png',
        size: 1024 * 10,
      },
      {
        name: 'Pic2.png',
        url: '../../../images/Chat/FileAttachments/Pic2.png',
        size: 1024 * 10,
      },
      {
        name: 'Pic3.png',
        url: '../../../images/Chat/FileAttachments/Pic3.png',
        size: 1024 * 10,
      },
    ],
  },
  {
    id: new DevExpress.data.Guid(),
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'Hello! Thanks for including screenshots. To restore access, please follow instructions in the attached file.\nLet me know if you need anything else.',
    attachments: [
      {
        name: 'Instructions.pdf',
        url: '../../../images/Chat/FileAttachments/Instructions.pdf',
        size: 1024 * 10,
      },
    ],
  },
];
