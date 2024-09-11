interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

export const avatarUrl = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+DQo8L3N2Zz4NCg==';
export const lineBreaks = '\n\n';

export const createUser = (id: number, name: string, url = ''): User => ({
  id,
  name,
  avatarUrl: url,
});

export const timestamp = new Date(1721747399083);

export const getLongText = (useLineBreaks = false): string => {
  const uUID = '9138cf2e-ced3-426a-bb53-4478536f690b';
  const longString = '182640341522285876574035911571908109718245218990724216376363976558845201472715827073837942336095076';

  const result = `${uUID}:${useLineBreaks ? lineBreaks : ''}${longString}`;

  return result;
};

export const getShortText = (useLineBreaks = false): string => {
  const value = `Short${useLineBreaks ? lineBreaks : ' '}text`;

  return value;
};

export const generateMessages = (
  length: number,
  userFirst: User,
  useLongText = false,
  useLineBreaks = false,
  userSecond: User | null = null,
  coefficient = 4,
): any => {
  const messages = Array.from({ length }, (_, i) => {
    const text = useLongText
      ? getLongText(useLineBreaks)
      : getShortText(useLineBreaks);

    const item = {
      timestamp,
      author: i % coefficient === 0 ? userFirst : userSecond ?? userFirst,
      text,
    };

    return item;
  });

  return messages;
};

export const generateSpecifiedNumberOfMessagesInRow = (
  n: number,
  userFirst: User,
  userSecond: User,
): any => {
  const messages = Array.from({ length: n * 2 }, (_, i) => {
    const item = {
      timestamp,
      author: i >= n ? userSecond : userFirst,
      text: getShortText(),
    };

    return item;
  });

  return messages;
};
