const fs = require('fs');
const path = require('path');
const jsonJs = require('./files-js.json');
const jsonMvc = require('./files-mvc.json');

function copyJsSharedResources(callback) {
  copySharedResources(callback, jsonJs);
}

function copyMvcSharedResources(callback) {
  copySharedResources(callback, jsonMvc);
}

function copySharedResources(callback, json) {
  for (let i = 0; i < json.files.length; i += 1) {
    const fileInfo = json.files[i];
    const fileName = path.basename(fileInfo.filePath);

    for (let j = 0; j < fileInfo.paths.length; j += 1) {
      const copyPath = fileInfo.paths[j];
      const isFile = !!path.extname(copyPath);
      const filePathTo = isFile ? copyPath : path.join(copyPath, fileName);

      if (!isFile && !fs.existsSync(copyPath)) {
        fs.mkdirSync(copyPath);
      }

      fs.copyFileSync(fileInfo.filePath, filePathTo);

      if (fileInfo.removeExport) {
        const fileContent = fs.readFileSync(filePathTo, 'utf-8');
        fs.writeFileSync(filePathTo, fileContent.replace(/export\s/g, ''));
      }
    }
  }

  callback();
}

module.exports = {
  copyJsSharedResources,
  copyMvcSharedResources,
};
