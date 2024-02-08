/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const promptsQuestions = require('./prompts-questions');

const menuMetaFileName = 'menuMeta.json';
const menuMetaFilePath = path.join('.', menuMetaFileName);

const mainRoutine = async (menuMetaData) => {
  const demo = await promptsQuestions.askDemoToUpdate(menuMetaData);
  console.log('Not implemented', demo);
};

fs.readFile(menuMetaFilePath, (err, data) => {
  if (err) {
    console.error('Error reading menuMeta.json file.');
    throw err;
  }

  const menuMetaData = JSON.parse(data);
  // eslint-disable-next-line no-return-await
  (async () => await mainRoutine(menuMetaData))();
});
