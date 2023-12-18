/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/testAccessibility';

const fs = require('fs');
const path = require('path');

const importConfigurations = (directory: string) => {
  const configFiles = fs
    .readdirSync(directory)
    .filter((file) => file === 'accessibility.ts');

  const configurations: Configuration[] = [];

  configFiles.forEach((file) => {
    const configPath = path.join(directory, file);
    const configModule = require(configPath);

    if (configModule.configuration) {
      configurations.push(configModule.configuration);
    }
  });

  const subdirectories = fs
    .readdirSync(directory)
    .filter((subdirectory) => fs.statSync(path.join(directory, subdirectory)).isDirectory());

  subdirectories.forEach((subdirectory) => {
    const subdirectoryPath = path.join(directory, subdirectory);
    const subConfigurations = importConfigurations(subdirectoryPath);

    configurations.push(...subConfigurations);
  });

  return configurations;
};

const rootPath = path.join(__dirname, '..');
const configurations: Configuration[] = importConfigurations(rootPath);

fixture`Accessibility`
  .page(url(__dirname, '../container.html'));

configurations.forEach((configuration) => testAccessibility(configuration));
