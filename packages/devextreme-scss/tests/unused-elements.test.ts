import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';

const VAR_NAME_CHARS = 'A-Za-z0-9_-';

const getFilePath = (fileName: string): string => {
  const relativePath = join(__dirname, '..', fileName);
  return resolve(relativePath);
};

const getImagesFromContent = (content: string): string[] => {
  const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;
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

const extractVariables = (filePath: string): string[] => {
  const content = removeAllCommentsFromContent(readFileSync(filePath, 'utf8'));
  const regex = new RegExp(`\\$[${VAR_NAME_CHARS}]+`, 'g');
  return content.match(regex) ?? [];
};

const findUniqueVariables = (variables: string[]): string[] => {
  const variableCounts = new Map<string, number>();
  variables.forEach((variable) => {
    variableCounts.set(variable, (variableCounts.get(variable) ?? 0) + 1);
  });
  return Array.from(variableCounts.entries())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-ignore
    .filter(([variable, count]) => count === 1)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-ignore
    .map(([variable, count]) => variable);
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

['generic', 'material', 'fluent'].forEach((themeName) => {
  test(`There are no unused variables in ${themeName} SCSS files`, () => {
    const baseScssFiles = getFilesFromDirectory(join('scss', 'widgets', 'base'), ['.scss'])
      .map((fileName) => resolve(fileName));

    const genericScssFiles = getFilesFromDirectory(join('scss', 'widgets', themeName), ['.scss'])
      .map((fileName) => resolve(fileName));

    const scssFiles = [...baseScssFiles, ...genericScssFiles];

    let variables: string[] = [];
    scssFiles.forEach((filePath) => {
      variables = variables.concat(extractVariables(getFilePath(filePath.substring(filePath.indexOf('/scss')))));
    });

    const uniqueVariables = findUniqueVariables(variables);

    const exclusions: { generic: string[]; material: string[]; fluent: string[] } = {
      generic: [],
      material: [],
      fluent: [],
    };

    expect(uniqueVariables).toEqual(exclusions[themeName]);
  });
});
