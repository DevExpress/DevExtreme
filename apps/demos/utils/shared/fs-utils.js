/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');
const { copySync } = require('fs-extra');
const path = require('path');

const demosPathPrefix = path.join('utils', 'templates');
const descriptionFileName = 'description.md';

class FileSystemUtils {
  copyDemos(demoPath, approaches, newOrExisting, menuMetaData, baseDemosDir) {
    if (newOrExisting.choice === 'new') {
      this.copyFilesFromBlankDemos(approaches, demoPath);
    } else {
      this.copyFilesFromExistingDemos(
        approaches,
        demoPath,
        newOrExisting,
        menuMetaData,
        baseDemosDir,
      );
    }
    console.log('files for selected approaches were copied');
  }

  copyFilesFromExistingDemos(approaches, demoPath, newOrExisting, menuMetaData, baseDemosDir) {
    approaches.forEach((approach) => {
      const demoPathByMeta = this.getDemoPathByMeta(
        newOrExisting.category,
        newOrExisting.group,
        newOrExisting.demo,
        baseDemosDir,
        menuMetaData,
      );
      const fromPath = path.join(demoPathByMeta, approach);
      const toPath = path.join(demoPath, approach);

      if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath, { recursive: true });
      }
      copySync(fromPath, toPath);
    });
  }

  copyFilesFromBlankDemos(approaches, demoPath) {
    approaches.forEach((approach) => {
      const fromPath = path.join(demosPathPrefix, approach);
      const toPath = path.join(demoPath, approach);
      copySync(fromPath, toPath);
    });

    fs.writeFileSync(path.join(demoPath, descriptionFileName), '', (err) => {
      if (err) throw err;
      console.log('description.md copied');
    });
  }

  getDemoPathByMeta(categoryName, groupName, demoName, baseDemosDir, menuMetaData) {
    const categoryIndex = menuMetaData.findIndex((x) => x.Name === categoryName);
    const groupIndex = menuMetaData[categoryIndex].Groups.findIndex((x) => x.Name === groupName);
    const demo = menuMetaData[categoryIndex]
      .Groups[groupIndex]
      .Demos.find((x) => x.Name === demoName);
    const result = path.join(baseDemosDir, demo.Widget, demo.Name);
    return result;
  }

  getMissingApproaches(demoPath, approachesList) {
    const currentDemos = this.getApproachesList(demoPath);
    const missingApproaches = approachesList.filter((approach) => !currentDemos.includes(approach));
    return missingApproaches;
  }

  saveMetaDataFile(menuMetaDataFilePath, metaData) {
    console.log('Saving: menuMeta.json');
    fs.writeFileSync(menuMetaDataFilePath, JSON.stringify(metaData, null, 2));
    console.log('Saved: menuMeta.json');
  }

  getApproachesList(demoPath) {
    if (!fs.existsSync(demoPath)) {
      throw new Error(`Directory does not exist: ${demoPath}`);
    }

    const demosList = fs.readdirSync(demoPath, { withFileTypes: true })
      .filter((dirEntity) => dirEntity.isDirectory())
      .map((dirEntity) => dirEntity.name);
    return demosList;
  }

  isValidDirectory(directoryPath) {
    return fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory();
  }

  getWidgets(widgetsPath, newWidget) {
    const result = fs.readdirSync(widgetsPath, { withFileTypes: true })
      .filter((dirEntity) => dirEntity.isDirectory())
      .map((dirEntity) => ({ title: dirEntity.name }));

    if (newWidget) {
      result.unshift({ title: newWidget, value: 'new' });
    }
    return result;
  }
}

module.exports = new FileSystemUtils();
