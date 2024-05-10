import path from 'path';
import fs from 'fs';

function findAllMDFiles(directory) {
  const MDFilesPaths = [];
  const filesAndFolders = fs.readdirSync(directory);

  for (const item of filesAndFolders) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const subfolderContainsMDFiles = findAllMDFiles(itemPath);

      if (subfolderContainsMDFiles.length > 0) {
        MDFilesPaths.push(...subfolderContainsMDFiles);
      }
    } else if (stats.isFile() && itemPath.endsWith('.md')) {
      MDFilesPaths.push(itemPath);
      break;
    }
  }

  return MDFilesPaths;
}

const directory = 'Demos';
const MDFilesList = findAllMDFiles(directory);
MDFilesList.forEach((file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const paragraphs = data.split('\n');
    let firstTextParagraphIndex = paragraphs.findIndex((para) => para.trim() !== '');

    if (firstTextParagraphIndex === -1) {
      console.error('No text paragraph found in the file.');
      return;
    }
    paragraphs.splice(firstTextParagraphIndex + 1, 0, '// _split_');

    const modifiedContent = paragraphs.join('\n');

    fs.writeFile(file, modifiedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Comment added after the first text paragraph.');
    });
  });
});
