import {
  existsSync, readFileSync, writeFileSync, readdirSync, copyFileSync, mkdirSync, copySync,
} from 'fs-extra';
import { join, basename, extname } from 'path';
import { createHash } from 'crypto';
import { version as DX_Version } from 'devextreme/package.json';
import { Demo, Framework } from './types';

export const isSkipDemo = (demo: Demo) => {
  const { Widget } = demo;
  const isLocalization = Widget === 'Localization';

  return isLocalization;
};

const sourceDemosDir = join(__dirname, '..', '..', '..', 'JSDemos', 'Demos');
const destinationPublishDir = join(__dirname, '..', '..', '..', 'publish-demos');

export const getSourcePathByDemo = (demo: Demo, framework: string) => join(sourceDemosDir, demo.Widget, demo.Name, framework);
export const getDestinationPathByDemo = (demo: Demo, framework: string) => join(destinationPublishDir, 'Demos', demo.Widget, demo.Name, framework);

const getFileHash = (fileContent: string) => {
  const hash = createHash('shake256', { outputLength: 4 }).update(fileContent);
  const hashResult = hash.digest('hex');
  return hashResult;
};

const getTemplateContent = (framework: Framework) => {
  const templatePath = join(__dirname, '..', framework, 'template.html');
  if (!existsSync(templatePath)) {
    throw new Error(`Not found ${framework} template\n${templatePath}`);
  }

  const templateContent = readFileSync(templatePath, { encoding: 'utf-8' });
  return templateContent;
};

const getBundlePath = (demoPath: string, prefix: string, postfix: string) => readdirSync(demoPath)
  .find((item) => item.startsWith(prefix) && item.endsWith(postfix));

export const createDemoLayout = (demo: Demo, framework: Framework) => {
  const demoPath = getDestinationPathByDemo(demo, framework);
  const templateContent = getTemplateContent(framework);

  const metadataScripts = join(destinationPublishDir, 'scripts');
  const options = {
    demo_title: `${framework} ${demo.Widget} - ${demo.Title} - DevExtreme ${framework} Demo`,
    dx_version: DX_Version,
    js_bundle_path: getBundlePath(demoPath, 'bundle', '.js'),
    css_bundle_path: getBundlePath(demoPath, 'bundle', '.css'),
    init_theme: getBundlePath(metadataScripts, 'init-theme', '.js'),
  };

  let result = templateContent;
  Object.keys(options).forEach((key) => {
    result = result.replace(`{{${key}}}`, options[key]);
  });

  const demoHtmlPath = join(demoPath, 'index.html');
  writeFileSync(demoHtmlPath, result, { encoding: 'utf-8' });
};

const getFilesByPath = (sourcePath: string) => {
  const files = readdirSync(sourcePath);
  const filePaths = [];

  files.forEach((fileName) => {
    const filePath = join(sourcePath, fileName);
    filePaths.push(filePath);
  });

  return filePaths;
};

const getFileInfo = (filePath: string) => {
  const fileExt = extname(filePath);
  const fileName = basename(filePath, fileExt);

  return {
    ext: fileExt,
    name: fileName,
  };
};

const copyMetadataDir = (sourceDir: string, destinatonDir: string) => {
  const listFiles = getFilesByPath(sourceDir);

  mkdirSync(destinatonDir, { recursive: true });
  listFiles.forEach((sourceFilePath) => {
    const fileContent = readFileSync(sourceFilePath, 'utf-8');
    const hash = getFileHash(fileContent);
    const fileInfo = getFileInfo(sourceFilePath);

    const hashName = `${fileInfo.name}.${hash}${fileInfo.ext}`;
    const destinationFilePath = join(destinatonDir, hashName);

    console.log(`Copy metadata ${fileInfo.name}${fileInfo.ext}\n  ${sourceFilePath}\n  ${destinationFilePath}`);
    copyFileSync(sourceFilePath, destinationFilePath);
  });
};

export const copyMetadata = () => {
  const sourceScripts = join(__dirname, 'metadata', 'scripts');
  const destScripts = join(destinationPublishDir, 'scripts');
  copyMetadataDir(sourceScripts, destScripts);

  const nodeModulesPath = join(__dirname, '..', '..', '..', 'node_modules');

  const destinationCss = join(destinationPublishDir, 'css');

  const diagramCss = join(nodeModulesPath, 'devexpress-diagram', 'dist', 'dx-diagram.css');
  copySync(diagramCss, join(destinationCss, 'dx-diagram.css'));

  const ganttCss = join(nodeModulesPath, 'devexpress-gantt', 'dist', 'dx-gantt.css');
  copySync(ganttCss, join(destinationCss, 'dx-gantt.css'));

  const sourceData = join(sourceDemosDir, '..', 'data');
  const destinationData = join(destinationPublishDir, 'data');
  copySync(sourceData, destinationData);
};
