interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

export const avatarUrl = 'data:image/png;base64,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';
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
