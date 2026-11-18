export const lineBreaks = '\n\n';

export const getLongText = (useLineBreaks = false, length = 1): string => {
  const UUID = '9138cf2e-ced3-426a-bb53-4478536f690b';
  const longItem = '1826403415222858765740359115719081097182452189907242163763639765588452014727158270738379423360950761826403415222858765740359115719081097182452189907';
  const longItemArray = Array(length).fill(longItem);
  const longString = longItemArray.join('');

  return `${UUID}:${useLineBreaks ? lineBreaks : ''}${longString}`;
};
