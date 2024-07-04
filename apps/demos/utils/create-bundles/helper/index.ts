import {
  existsSync, readFileSync, writeFileSync, readdirSync, copyFileSync, mkdirSync, copySync,
  removeSync, cpSync,
} from 'fs-extra';
import {
  join, basename, extname, relative,
} from 'path';
import { createHash } from 'crypto';
import { version as DX_Version } from 'devextreme/package.json';
import { Demo, Framework } from './types';
import { resourceLinks } from './external-resource-metadata';

export const isSkipDemo = (demo: Demo) => {
  const { Widget, Name } = demo;
  const excluded = ['Localization', 'RowTemplate', 'CellCustomization', 'TimeZonesSupport', 'ExportToPDF'];
  const shouldSkip = excluded.includes(Widget) || excluded.includes(Name);

  return shouldSkip;
};

const sourceDemosDir = join(__dirname, '..', '..', '..', 'Demos');
const destinationPublishDir = join(__dirname, '..', '..', '..', 'publish-demos');

export const getSourcePathByDemo = (demo: Demo, framework: string) => join(sourceDemosDir, demo.Widget, demo.Name, framework);
export const getSourcePathByDemoRelative = (demo: Demo, framework: string) => join('Demos', demo.Widget, demo.Name, framework);
export const getDestinationPathByDemo = (demo: Demo, framework: string) => join(destinationPublishDir, 'Demos', demo.Widget, demo.Name, framework);
export const getDestinationPathByDemoRelative = (demo: Demo, framework: string) => join('publish-demos', 'Demos', demo.Widget, demo.Name, framework);


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


const getSpecificCssPath = (WidgetName: string, demoPath: string) => {
  if (WidgetName !== 'Gantt' && WidgetName !== 'Diagram') {
    return '';
  }
  return relative(
    demoPath,
    join(
      destinationPublishDir,
      'css',
      `dx-${WidgetName.toLowerCase()}.css`,
    ),
  ).split('\\').join('/');
};

export const copyVueCustomCss = (demo: Demo): boolean => {
  const customCssPath = join(getSourcePathByDemo(demo, 'Vue'), 'styles.css');
  const destinationDir = join(getDestinationPathByDemo(demo, 'Vue'), 'styles.css');

  if (existsSync(customCssPath)) {
      copyFileSync(customCssPath, destinationDir);
      return true;
  }
  return false;
};

export const createDemoLayout = (demo: Demo, framework: Framework) => {
  const demoPath = getDestinationPathByDemo(demo, framework);
  const demoHtmlPath = framework !== 'Angular'
    ? join(demoPath, 'index.html')
    : join(demoPath, '..', 'AngularTemplates', 'index.html');
  const templateContent = getTemplateContent(framework);

  const metadataScripts = join(destinationPublishDir, 'scripts');
  let specific_css = `<link href="${getSpecificCssPath(demo.Widget, demoPath)}" rel="stylesheet" />`;

  const externalResources = resourceLinks[demo.Widget]?.[demo.Name];
  externalResources?.resources?.forEach(resource => {
    if (resource.frameworks.includes(framework)){
      specific_css = specific_css.concat('\n', resource.link)
    }
  });

  let hasCustomCss = false;

  if (framework === 'Vue') {
    hasCustomCss = copyVueCustomCss(demo);
  }
  
  const options = {
    css_bundle_path: getBundlePath(demoPath, 'bundle', '.css'),
    demo_title: `${framework} ${demo.Widget} - ${demo.Title} - DevExtreme ${framework} Demo`,
    dx_version: DX_Version,
    js_bundle_path: getBundlePath(demoPath, 'bundle', '.js'),
    init_theme: getBundlePath(metadataScripts, 'init-theme', '.js'),
    specific_css,
    custom_css: hasCustomCss ? '<link rel="stylesheet" type="text/css" href="styles.css" />' : '',
  };

  let result = templateContent;
  Object.keys(options).forEach((key) => {
    result = result.replace(`{{${key}}}`, options[key]);
  });

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
  if (existsSync(destinatonDir)) {
    removeSync(destinatonDir);
  }
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

  const nodeModulesPath = join(__dirname, '..', '..', '..', '..', '..', 'node_modules');

  const imagesPath = join(__dirname, '..', '..', '..', 'images');
  const imagesDest = join(destinationPublishDir, 'images');
  cpSync(imagesPath, imagesDest, {recursive: true});

  const destinationCss = join(destinationPublishDir, 'css');

  const themesPath = join(nodeModulesPath, 'devextreme', 'dist', 'css');
  cpSync(themesPath, destinationCss, {recursive: true});

  const diagramCssPath = join(nodeModulesPath, 'devexpress-diagram', 'dist', 'dx-diagram.css');
  copySync(diagramCssPath, join(destinationCss, 'dx-diagram.css'));

  const ganttCssPath = join(nodeModulesPath, 'devexpress-gantt', 'dist', 'dx-gantt.css');
  copySync(ganttCssPath, join(destinationCss, 'dx-gantt.css'));

  const sourceData = join(sourceDemosDir, '..', 'data');
  const destinationData = join(destinationPublishDir, 'data');
  copySync(sourceData, destinationData);
};
