/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const promptsQuestions = require('./prompts-questions');
const fileSystemUtils = require('../shared/fs-utils');
const menuMetaUtils = require('../shared/menu-meta-utils');
const menuMetaData = require('../../menuMeta.json');

const existingApproaches = ['jQuery', 'Angular', 'React', 'Vue'];
const extraModules = [
  'signalr',
  'devextreme-aspnet-data-nojquery',
  'globalize',
  'devextreme-exceljs-fork&file-saver',
  'jspdf',
  'jspdf&jspdf-autotable',
  'devextreme-intl',
  'canvg',
  'whatwg-fetch',
  'vectormap',
  'unified',
  'openai',
  'html-react-parser',
  'vuex',
];

// const descriptionFileName = 'description.md';

const menuMetaFilePath = './menuMeta.json';

const baseDemosDir = 'Demos';

const openDemoInEditor = (demoPath) => spawn('code', [demoPath], { shell: true });

const addDemo = async (metaPath, meta) => {
  const demo = await promptsQuestions.askDemo(meta, metaPath);
  let demoPath;
  let missingApproaches = [];

  if (demo.name === 'new') {
    const equivalents = await promptsQuestions.askEquivalents();
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
      metaPath,
      demo.newName,
      widget.newName ? widget.newName : widget.name,
      equivalents.value,
    );
    metaPath.push(demo.newName.replace(/ /g, ''));
    missingApproaches = existingApproaches;
  } else {
    metaPath.push(demo.name);
    demoPath = fileSystemUtils.getDemoPathByMeta(
      metaPath,
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
      metaPath,
      newOrExisting,
    );
  }
  if (newOrExisting.choice === 'new') {
    const extraModulesAnswer = await promptsQuestions.askForExtraModules(extraModules);
    menuMetaUtils.addDemoModules(
      meta,
      metaPath,
      extraModulesAnswer.modules,
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
  openDemoInEditor(demoPath);
};

const mainRoutine = async (meta) => {
  const category = await promptsQuestions.askCategory(meta);
  if (category.name === 'new') {
    menuMetaUtils.addCategory(meta, category.newName);
    fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
    console.log('-> New category has been added.');
  } else {
    const path = [category.name];
    let shouldCountinue = true;
    let group;
    while (shouldCountinue) {
      group = await promptsQuestions.askGroup(meta, path);
      // console.log('group', group.name);
      if (group.name === 'new') {
        menuMetaUtils.addGroup(meta, path, group.newName);
        fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
        console.log('-> New group has been added.');
        shouldCountinue = false;
      } else {
        path.push(group.name);
        // console.log('isGroup', path, menuMetaUtils.isGroup(meta, path));
        if (menuMetaUtils.isGroup(meta, path)) {
          shouldCountinue = false;
          await addDemo(path, meta);
        }
      }
    }
  }
};

// eslint-disable-next-line no-return-await
(async () => await mainRoutine(menuMetaData))();
