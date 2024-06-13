const testFolder = '../../Demos';
import * as fs from 'fs';


fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});