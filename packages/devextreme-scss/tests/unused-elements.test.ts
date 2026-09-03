import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';

const VAR_NAME_CHARS = 'A-Za-z0-9_-';

const getFilePath = (fileName: string): string => {
  const relativePath = join(__dirname, '..', fileName);
  return resolve(relativePath);
};

const getImagesFromContent = (content: string): string[] => {
  const dataUriRegex = /data-uri\((?:['"](image\/svg\+xml;charset=UTF-8)['"],\s)?['"]?([^)'"]+)['"]?\)/g;
  const result: string[] = [];
  let match = dataUriRegex.exec(content);

  while (match !== null) {
    const imagePath = getFilePath(match[2]);
    result.push(imagePath);
    match = dataUriRegex.exec(content);
  }

  return result;
};

const getFilesFromDirectory = (directoryName: string, extensions: string[] = []): string[] => {
  const fullDirName = join(process.cwd(), directoryName);
  const result: string[] = [];

  const walkDirectory = (directory: string): void => {
    readdirSync(directory).forEach((file) => {
      const absolutePath = join(directory, file);
      if (statSync(absolutePath).isDirectory()) {
        walkDirectory(absolutePath);
      } else if (extensions.length === 0 || extensions.includes(extname(file))) {
        result.push(absolutePath);
      }
    });
  };

  walkDirectory(fullDirName);
  return result;
};

const removeAllCommentsFromContent = (content: string): string => content
  .replace(/\/\/.+(\n|\r\n|\r)/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

const variableRegex = new RegExp(`\\$[${VAR_NAME_CHARS}]+`, 'g');

type VariableUsage = { declared: Set<string>; read: Set<string> };

const collectVariableUsage = (filePath: string, usage: VariableUsage): void => {
  const content = removeAllCommentsFromContent(readFileSync(filePath, 'utf8'));
  let depth = 0;
  let index = 0;
  while (index < content.length) {
    const char = content[index];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === '$') {
      variableRegex.lastIndex = index;
      const [variable] = variableRegex.exec(content) ?? [''];
      const assigned = /^\s*:/.test(content.slice(index + variable.length));
      if (assigned && depth === 0) usage.declared.add(variable);
      if (!assigned) usage.read.add(variable);
      index += variable.length;
      continue;
    }
    index += 1;
  }
};

const variableUsageOf = (directories: string[]): VariableUsage => {
  const usage: VariableUsage = { declared: new Set(), read: new Set() };
  directories
    .flatMap((directory) => getFilesFromDirectory(join('scss', 'widgets', directory), ['.scss']))
    .forEach((filePath) => collectVariableUsage(filePath, usage));
  return usage;
};

test('There are no unused images in repository', () => {
  const fullImagesFileList = getFilesFromDirectory(join('images', 'widgets'))
    .map((fileName) => resolve(fileName).toLowerCase())
    .sort();

  const usedImagesFileList = getFilesFromDirectory('scss')
    .map((fileName) => {
      const fileContent = readFileSync(resolve(fileName)).toString();
      const imageNames = getImagesFromContent(fileContent);
      return imageNames.map((imageName) => resolve(imageName).toLowerCase());
    })
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  expect(fullImagesFileList).toEqual(usedImagesFileList);
});

const themes = ['generic', 'material', 'fluent'];
const readAnywhere = variableUsageOf(['base', ...themes]).read;

themes.forEach((themeName) => {
  test(`There are no unused variables in ${themeName} SCSS files`, () => {
    const { declared } = variableUsageOf(['base', themeName]);
    const unused = [...declared].filter((variable) => !readAnywhere.has(variable)).sort();

    expect(unused).toEqual([]);
  });
});
