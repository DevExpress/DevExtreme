import { writeFileSync, existsSync } from 'fs-extra';
import { relative, join } from 'path';
import { Demo, Item } from '../helper/types';
import { getSourcePathByDemo, getDestinationPathByDemo, isSkipDemo } from '../helper';
import * as menuMeta from '../../../menuMeta.json';
import { getProjectNameByDemo, getIndexHtmlPath } from './utils';

// use this script either from npm, or from devextreme-demos root folder
const rootFolder = process.cwd();

const createConfigForDemo = (Demo: Demo) => {
  const demoSourcePath = getSourcePathByDemo(Demo, 'Angular').split('\\').join('/');
  const demoSourcePathRelative = getSourcePathByDemo(Demo, 'Angular', true).split('\\').join('/');
  const demoDestinationPathRelative = getDestinationPathByDemo(Demo, 'Angular', true).split('\\').join('/');
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
        builder: '@angular-devkit/build-angular:browser-esbuild',
        options: {
          outputPath: demoDestinationPathRelative,
          index: `${indexPath}`,
          main: `${demoSourcePathRelative}/app/app.component.ts`,
          polyfills: join(__dirname, 'polyfill.ts').split('\\').join('/'),
          tsConfig: `${demoSourcePathRelative}/tsconfig.json`,
          scripts: [],
          allowedCommonJsDependencies: [
            'jszip',
            'devexpress-diagram',
            'devexpress-gantt',
            'devextreme-quill',
            'devextreme-aspnet-data-nojquery'
          ]
        },
        configurations: {
          production: {
            budgets: [
              {
                type: 'initial',
                maximumWarning: '2mb',
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
        if (!isSkipDemo(demo)) {
          if (existsSync(getSourcePathByDemo(demo, 'Angular'))) {
            console.log(`Angular Config created: ${demo.Widget} - ${demo.Name}`);
  
            angularJsonObject.projects[getProjectNameByDemo(demo)] = createConfigForDemo(demo);
          } else {
            console.log(`No angular project for: ${demo.Widget} - ${demo.Name}`);
          }
        }
      }
    }
  }

  const jsonString = JSON.stringify(angularJsonObject);
  const filePath = 'angular.json';
  writeFileSync(filePath, jsonString);
};

createAngularJson();
