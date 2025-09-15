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

const menuMetaFilePath = './menuMeta.json';

const baseDemosDir = 'Demos';

const openDemoInEditor = (demoPath) => spawn('code', [demoPath], { shell: true });

const addDemo = async (meta, pathParts) => {
  const demo = await promptsQuestions.askDemo(meta, pathParts);
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
      pathParts,
      demo.newName,
      widget.newName ? widget.newName : widget.name,
      equivalents.value,
    );
    pathParts.push(demo.newName.replace(/ /g, ''));
    missingApproaches = existingApproaches;
  } else {
    pathParts.push(demo.name);
    demoPath = fileSystemUtils.getDemoPathByMeta(
      pathParts,
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
      pathParts,
      newOrExisting,
    );
  }
  if (newOrExisting.choice === 'new') {
    const extraModulesAnswer = await promptsQuestions.askForExtraModules(extraModules);
    menuMetaUtils.addDemoModules(
      meta,
      pathParts,
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
    const pathParts = [category.name];
    let shouldAskForGroup = true;
    let group;
    while (shouldAskForGroup) {
      group = await promptsQuestions.askGroup(meta, pathParts);
      if (group.name === 'new') {
        menuMetaUtils.addGroup(meta, pathParts, group.newName);
        fileSystemUtils.saveMetaDataFile(menuMetaFilePath, meta);
        console.log('-> New group has been added.');
        shouldAskForGroup = false;
      } else {
        pathParts.push(group.name);
        if (menuMetaUtils.hasDemos(meta, pathParts)) {
          shouldAskForGroup = false;
          await addDemo(meta, pathParts);
        }
      }
    }
  }
};

// eslint-disable-next-line no-return-await
(async () => await mainRoutine(menuMetaData))();
