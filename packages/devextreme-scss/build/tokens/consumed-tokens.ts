// Pure half of the consumed-token check in build-tokens.mjs, so the tests can run it without a build.

// A commented-out declaration still names a token, and a dead reference must not fail the build.
// Throws on an unpaired delimiter: it would shift the alternation and hide the rest of the file.
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

// Wider than kebab-case on purpose: `[a-z0-9-]` would truncate `ds.$spacing-40_typo` to a valid name.
export const collectTokenReferences = (content: string, source: string): string[] => [
  ...stripScssComments(content, source).matchAll(/\bds\.\$([\w-]+)/g),
].map(([, name]) => name);

// Bypassing the bridge compiles silently, so the raw form is collected too. Unused today.
export const collectCustomPropertyReferences = (content: string, source: string): string[] => [
  ...stripScssComments(content, source).matchAll(/var\(\s*--dxds-([\w-]+)/g),
].map(([, name]) => name);

// Demo code is CSS, HTML and framework markup, not Sass: `//` opens no comment there (it lives
// inside every URL), and an unpaired `/*` is normal in a string or a regex. So this collector
// strips only the delimited forms and never throws — a scan of somebody else's files must not be
// able to fail the build on their punctuation.
export const collectMarkupCustomPropertyReferences = (content: string): string[] => [
  ...content
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .matchAll(/var\(\s*--dxds-([\w-]+)/g),
].map(([, name]) => name);

// The index spans every design system and names repeat across them, so it is narrowed to the
// source files the bridge is generated from.
export const buildAvailableNames = (
  flatTokenKeys: Iterable<string>,
  consumedSourceFiles: ReadonlySet<string>,
): Set<string> => new Set(
  [...flatTokenKeys]
    .map((key) => key.split(':'))
    .filter(([sourceFile]) => consumedSourceFiles.has(sourceFile))
    .map(([, tokenPath]) => tokenPath.replace(/\//g, '-')),
);
