import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import { sync } from 'glob';

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

test('There are no unused images in repository', () => {
  const fullImagesFileList = sync('images/widgets/**/*.*')
    .map((fileName) => resolve(fileName).toLowerCase())
    .sort();

  const usedImagesFileList = sync('scss/**/*.*')
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
