export const stripScssComments = (content: string, source: string): string => {
  const delimiters = content.replace(/\/\/[^\n\r]*/g, '').match(/\/\*|\*\//g) ?? [];
  const paired = delimiters.length % 2 === 0
    && delimiters.every((delimiter, index) => delimiter === (index % 2 === 0 ? '/*' : '*/'));

  if (!paired) {
    throw new Error(`Unpaired block comment delimiter in ${source}: code cannot be told from comment`);
  }

  return content
    .replace(/\/\/[^\n\r]*/g, '')
    .split(/\/\*|\*\//)
    .filter((_, index) => index % 2 === 0)
    .join('');
};

export const collectTokenReferences = (content: string, source: string): string[] => [
  ...stripScssComments(content, source).matchAll(/\bds\.\$([\w-]+)/g),
].map(([, name]) => name);

export const collectCustomPropertyReferences = (content: string, source: string): string[] => [
  ...stripScssComments(content, source).matchAll(/var\(\s*--dxds-([\w-]+)/g),
].map(([, name]) => name);

export const collectMarkupCustomPropertyReferences = (content: string): string[] => [
  ...content
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .matchAll(/var\(\s*--dxds-([\w-]+)/g),
].map(([, name]) => name);

export const buildAvailableNames = (
  flatTokenKeys: Iterable<string>,
  consumedSourceFiles: ReadonlySet<string>,
): Set<string> => new Set(
  [...flatTokenKeys]
    .map((key) => key.split(':'))
    .filter(([sourceFile]) => consumedSourceFiles.has(sourceFile))
    .map(([, tokenPath]) => tokenPath.replace(/\//g, '-')),
);
