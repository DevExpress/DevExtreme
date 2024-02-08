/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const promptsQuestions = require('./prompts-questions');
const fileSystemUtils = require('../shared/fs-utils');
const menuMetaUtils = require('./menu-meta-utils');
const menuMetaData = require('../../JSDemos/menuMeta.json');

const existingApproaches = ['jQuery', 'AngularJS', 'Angular', 'React', 'Vue'];

// const descriptionFileName = 'description.md';

const menuMetaFilePath = './JSDemos/menuMeta.json';

const baseDemosDir = 'JSDemos/Demos';

const openDemoInEditor = (demoPath) => spawn('code', [demoPath], { shell: true });

const addDemo = async (category, group, meta) => {
  const demo = await promptsQuestions.askDemo(meta, category, group);
  let demoPath;
  let missingApproaches = [];

  if (demo.name === 'new') {
    const widget = await promptsQuestions.askWidget(baseDemosDir);
    if (widget.name === 'new') {
      const pathToNewWidget = path.join(baseDemosDir, widget.newName);
      if (!fs.existsSync(pathToNewWidget)) {
        fs.mkdirSync(pathToNewWidget, { recursive: true });
      }
      demoPath = path.join(pathToNewWidget, demo.newName.replace(/ /g, ''));
    } else {
      demoPath = path.join(baseDemosDir, widget.name, demo.newName.replace(/ /g, ''));
    }
    menuMetaUtils.addDemo(
      meta,
      category.name,
      group.name,
      demo.newName,
      widget.newName ? widget.newName : widget.name,
    );
    missingApproaches = existingApproaches;
  } else {
    demoPath = fileSystemUtils.getDemoPathByMeta(
      category.name,
      group.name,
      demo.name,
      baseDemosDir,
      meta,
    );
    missingApproaches = fileSystemUtils.getMissingApproaches(demoPath, existingApproaches);
  }
  if (missingApproaches.length === 0) {
    console.log('This demo has all approaches.');
    return;
  }
  const approaches = await promptsQuestions.askApproaches(missingApproaches);
  const newOrExisting = await promptsQuestions.askNewOrExisting(meta);
  if (newOrExisting.choice === 'existing') {
    menuMetaUtils.updateDemoProperties(
      meta,
      category.name,
      group.name,
      demo.newName,
      newOrExisting,
    );
  }
  fileSystemUtils.copyDemos(
    demoPath,
    approaches.selectedApproaches,
    newOrExisting,
    meta,
    baseDemosDir,
  );
  fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
  console.log(demoPath);
  openDemoInEditor(demoPath);
};

const mainRoutine = async (meta) => {
  const category = await promptsQuestions.askCategory(meta);
  if (category.name === 'new') {
    menuMetaUtils.addCategory(meta, category.newName);
    fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
    console.log('-> New category has been added.');
  } else {
    const group = await promptsQuestions.askGroup(meta, category);
    if (group.name === 'new') {
      menuMetaUtils.addGroup(meta, category.name, group.newName);
      fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
      console.log('-> New group has been added.');
    } else {
      await addDemo(category, group, meta);
    }
  }
};

// eslint-disable-next-line no-return-await
(async () => await mainRoutine(menuMetaData))();
