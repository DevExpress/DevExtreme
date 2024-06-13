import { writeFileSync, existsSync } from 'fs-extra';
import { relative, join } from 'path';
import { Demo, Item } from '../helper/types';
import { getSourcePathByDemoRelative,getSourcePathByDemo, getDestinationPathByDemoRelative, isSkipDemo } from '../helper';
import * as menuMeta from '../../../menuMeta.json';
import { getProjectNameByDemo, getIndexHtmlPath } from './helper';

// use this script either from npm, or from devextreme-demos root folder
const rootFolder = process.cwd();

const createConfigForDemo = (Demo: Demo) => {
  const demoSourcePath = getSourcePathByDemo(Demo, 'Angular').split('\\').join('/');
  const demoSourcePathRelative = getSourcePathByDemoRelative(Demo, 'Angular').split('\\').join('/');
  const demoDestinationPathRelative = getDestinationPathByDemoRelative(Demo, 'Angular').split('\\').join('/');
  const indexPath = relative(
    rootFolder,
    join(getIndexHtmlPath(Demo), 'index.html'),
  ).split('\\').join('/');
  return {
    projectType: 'application',
    schematics: {
      '@schematics/angular:application': {
        strict: false,
      },
    },
    root: demoSourcePathRelative,
    sourceRoot: demoSourcePathRelative,

    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: demoDestinationPathRelative,
          index: `${indexPath}`,
          main: `${demoSourcePathRelative}/app/app.component.ts`,
          polyfills: join(__dirname, 'polyfill.ts').split('\\').join('/'),
          tsConfig: `${demoSourcePathRelative}/tsconfig.json`,
          scripts: [],
          allowedCommonJsDependencies: [
            "jszip",
            
          ]
        },
        configurations: {
          production: {
            budgets: [
              {
                type: 'initial',
                maximumWarning: '1mb',
                maximumError: '4mb',
              },
              {
                type: 'anyComponentStyle',
                maximumWarning: '2kb',
                maximumError: '4kb',
              },
            ],
            outputHashing: 'all',
          },
        },
        defaultConfiguration: 'production',
      },
    },
  };
};

const createAngularJson = () => {
  const angularJsonObject = {
    version: 1,
    newProjectRoot: 'projects',
    projects: {},
  };
  const menu: Item[] = (menuMeta as any).default;

  for (const meta of menu) {
    for (const group of meta.Groups) {
      const demos = group.Demos || [];
      for (const demo of demos) {
        if (isSkipDemo(demo)) {
          break;
        }

        if (existsSync(getSourcePathByDemo(demo, 'Angular'))) {
          console.log(`Angular Config created: ${demo.Widget} - ${demo.Name}`);

          angularJsonObject.projects[getProjectNameByDemo(demo)] = createConfigForDemo(demo);
        } else {
          console.log(`No angular project for: ${demo.Widget} - ${demo.Name}`);
        }
      }
    }
  }

  const jsonString = JSON.stringify(angularJsonObject);
  const filePath = 'angular.json';
  writeFileSync(filePath, jsonString);
};

createAngularJson();
