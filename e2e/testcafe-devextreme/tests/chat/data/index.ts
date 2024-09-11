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

export const generateLongText = (useLineBreaks: boolean, length = 10): string => {
  const randomUUID = crypto.randomUUID();
  const randomArray = crypto.getRandomValues(new Uint32Array(length));
  const randomString = randomArray.reduce((acc, i) => `${acc}${i}`, '');

  const result = `${randomUUID}:${useLineBreaks ? lineBreaks : ''}${randomString}`;

  return result;
};

export const generateShortText = (useLineBreaks: boolean): string => {
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
      ? generateLongText(useLineBreaks)
      : generateShortText(useLineBreaks);

    const item = {
      timestamp,
      author: i % coefficient === 0 ? userFirst : userSecond ?? userFirst,
      text,
    };

    return item;
  });

  return messages;
};
