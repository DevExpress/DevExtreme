import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

const getFilePath = (fileName: string): string => {
  const relativePath = join(__dirname, '..', '..', fileName);
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

const getFilesFromDirectory = (directoryName: string): string[] => {
  const fullDirName = join(process.cwd(), directoryName);
  const result: string[] = [];

  const walkDirectory = (directory: string): void => {
    readdirSync(directory).forEach((file) => {
      const absolutePath = join(directory, file);
      if (statSync(absolutePath).isDirectory()) walkDirectory(absolutePath);
      else result.push(absolutePath);
    });
  };

  walkDirectory(fullDirName);
  return result;
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
