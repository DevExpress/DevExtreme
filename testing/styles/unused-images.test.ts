// import { readFileSync } from 'fs';
// import { resolve } from 'path';
// import { sync } from 'glob';
// import { getImagesFromContent } from '../../build/gulp/gulp-data-uri';

// test('There are no unused images in repository', () => {
//   const fullImagesFileList = sync('images/widgets/**/*.*')
//     .map((fileName) => resolve(fileName).toLowerCase())
//     .sort();

//   const usedImagesFileList = sync('scss/**/*.*')
//     .map((fileName) => {
//       const fileContent = readFileSync(resolve(fileName));
//       const imageNames = getImagesFromContent(fileContent);
//       return imageNames.map((imageName) => resolve(imageName).toLowerCase());
//     })
//     .flat()
//     .filter((value, index, self) => self.indexOf(value) === index)
//     .sort();

//   expect(fullImagesFileList).toEqual(usedImagesFileList);
// });
