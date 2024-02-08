/* eslint-disable no-console */
const { join } = require('path');
const { writeFileSync, existsSync, readFileSync } = require('fs');

const configPath = join(__dirname, '..', '..', 'repository.config.json');

/* eslint-disable quote-props */
const config = {
  'devextreme': '',
  'devextreme-angular': '',
  'devextreme-react': '',
  'devextreme-vue': '',
  'devexpress-diagram': '',
  'devexpress-gantt': '',
  'devextreme-aspnet': '',
};
/* eslint-enable quote-props */

const updateConfig = (configObject) => {
  const configString = JSON.stringify(configObject, null, 2);
  console.log(`Updating ${configPath}. Config:\n${configString}`);
  writeFileSync(configPath, configString, 'utf8');
  console.log('File updated.');
};

const init = () => {
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }
  updateConfig(config);
  return config;
};

module.exports = {
  updateConfig,
  init,
};
