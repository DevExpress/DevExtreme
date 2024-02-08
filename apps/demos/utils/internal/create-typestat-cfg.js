// npm run create-typestat-cfg Navigation
const fs = require('fs');
const path = require('path');

const demosMetaPath = path.join('..', '..', 'menuMeta.json');
const demosMeta = JSON.parse(fs.readFileSync(demosMetaPath));
const relativeRootDemosPath = 'Demos';
const pathToOutput = path.join('..', '..');

function findFolderPaths(meta, folderName) {
  const folderMeta = meta.find((metaElement) => metaElement.Name === folderName);
  const reactFoldersByFolderName = [];
  findAllPathForGroup(folderMeta, reactFoldersByFolderName);
  return reactFoldersByFolderName;
}

function findAllPathForGroup(group, reactFoldersByFolderName) {
  if (group.Groups) {
    group.Groups.forEach((subGroup) => {
      if (subGroup.Groups) {
        subGroup.Groups.forEach((subSubGroup) => {
          findAllPathForGroup(subSubGroup, reactFoldersByFolderName);
        });
      } else {
        findAllDemosByGroup(subGroup, reactFoldersByFolderName);
      }
    });
  } else {
    findAllDemosByGroup(group, reactFoldersByFolderName);
  }
}

function findAllDemosByGroup(group, reactFoldersByFolderName) {
  group.Demos.forEach((demo) => {
    const { Widget, Name } = demo;
    const demoPath = path.join(relativeRootDemosPath, Widget, Name, 'React');
    reactFoldersByFolderName.push(demoPath);
  });
}

function findJSXForRename(reactFolders) {
  const reactJsxPaths = [];
  reactFolders.forEach((folder) => {
    const reactFolder = path.join(pathToOutput, folder);
    const reactFolderExists = fs.existsSync(reactFolder);
    if (reactFolderExists) {
      const files = fs.readdirSync(reactFolder);
      files.forEach((file) => {
        if (!file.includes('config.') && (file.endsWith('.js') || file.endsWith('.jsx'))) {
          reactJsxPaths.push(path.join(folder, file));
        }
      });
    }
  });
  return reactJsxPaths;
}

function findTSXInferTypes(reactJsxPaths) {
  return reactJsxPaths.map((reactPath) => {
    if (reactPath.endsWith('.js')) {
      return [reactPath.replace('.js', '.ts'), reactPath.replace('.js', '.tsx')];
    }
    if (reactPath.endsWith('.jsx')) {
      return [reactPath.replace('.jsx', '.tsx'), reactPath.replace('.jsx', '.ts')];
    }
    return reactPath;
  }).flat();
}

const metaFolder = process.argv[2];
const reactFilePaths = findFolderPaths(demosMeta, metaFolder);

const JSXForRename = findJSXForRename(reactFilePaths);
const TSXInferTypes = findTSXInferTypes(JSXForRename);
const result = `[
    {
        "files": {
            "renameExtensions": true
        },
        "fixes": {
            "importExtensions": true
        },
        "include": [
            ${JSXForRename.map((filePath) => `"${filePath}"`).join(',\n')}
        ],
        "project": "${path.join('JSDemos', 'tsconfig.json')}"
    },
    {
        "fixes": {
            "incompleteTypes": true,
            "missingProperties": true,
            "noImplicitAny": true
        },
        "include": [
            ${TSXInferTypes.map((filePath) => `"${filePath}"`).join(',\n')}
        ],
        "project": "${path.join('JSDemos', 'tsconfig.json')}"
    }
]`;
const resultWithDoubleBackslash = result.replaceAll('\\', '\\\\');
fs.writeFileSync(path.join(pathToOutput, 'typestat.json'), resultWithDoubleBackslash);
