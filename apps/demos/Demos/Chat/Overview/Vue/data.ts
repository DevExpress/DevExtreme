export const MOCK_CHAT_HEADER_TEXT = 'Chat title';

const MOCK_CURRENT_USER_ID = Math.random();

export const userFirst = {
  id: Math.random(),
  name: 'First',
};

export const userSecond = {
  id: MOCK_CURRENT_USER_ID,
  name: 'Second',
};

const now = Date.now();

export const messages = Array.from({ length: 30 }, (_, i) => {
  const item = {
    timestamp: String(now + i),
    author: i % 4 === 0 ? userFirst : userSecond,
    text: String(Math.random()),
  };

  return item;
});
