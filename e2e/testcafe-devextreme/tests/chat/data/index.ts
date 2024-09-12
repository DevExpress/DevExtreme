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

export const getLongText = (useLineBreaks = false, length = 1): string => {
  const UUID = '9138cf2e-ced3-426a-bb53-4478536f690b';
  const longItem = '1826403415222858765740359115719081097182452189907242163763639765588452014727158270738379423360950761826403415222858765740359115719081097182452189907';
  const longItemArray = Array(length).fill(longItem);
  const longString = longItemArray.join('');

  const result = `${UUID}:${useLineBreaks ? lineBreaks : ''}${longString}`;

  return result;
};

export const getShortText = (useLineBreaks = false): string => {
  const value = `Short${useLineBreaks ? lineBreaks : ' '}text`;

  return value;
};

export const generateMessages = (
  length: number,
  userFirst: User,
  userSecond = userFirst,
  useLongText = false,
  useLineBreaks = false,
  coefficient = 4,
  n = 1,
): any => {
  const messages = Array.from({ length: length * n }, (_, i) => {
    const text = useLongText
      ? getLongText(useLineBreaks)
      : getShortText(useLineBreaks);

    const getAuthor = () => {
      if (n > 1) {
        return i >= length ? userSecond : userFirst;
      }

      return i % coefficient === 0 ? userFirst : userSecond;
    };

    const item = {
      timestamp,
      author: getAuthor(),
      text,
    };

    return item;
  });

  return messages;
};
