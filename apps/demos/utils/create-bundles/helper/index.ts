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

const demosRootDir = join(__dirname, '..', '..', '..');
const destinationPublishDir = join(demosRootDir, 'publish-demos');

export const getDemoPath = (path: string = '', demo: Demo, framework: string) => {
  return join(path, 'Demos', demo.Widget, demo.Name, framework);
}

export const getSourcePathByDemo = (demo: Demo, framework: string, relative = false) => {
  if (relative) {
    return getDemoPath('', demo, framework);
  }
  return getDemoPath(demosRootDir, demo, framework);
}

export const getDestinationPathByDemo = (demo: Demo, framework: string, relative = false) => {
  if (relative) {
    return getDemoPath('publish-demos', demo, framework);
  }
  return getDemoPath(destinationPublishDir, demo, framework);
}

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

const widgetsWithSpecificCss = ['Gantt', 'Diagram'];

const getSpecificCssPath = (WidgetName: string, demoPath: string) => {
  if (!widgetsWithSpecificCss.includes(WidgetName)) {
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

const addExternalResources = (demo: Demo, framework: Framework, cssLinks: string) => {
  let newCssLinks = cssLinks;
  const externalResources = resourceLinks[demo.Widget]?.[demo.Name];
  externalResources?.resources?.forEach(resource => {
    if (resource.frameworks.includes(framework)){
      newCssLinks = newCssLinks.concat('\n', resource.link)
    }
  });
  return newCssLinks;
}

export const createDemoLayout = (demo: Demo, framework: Framework) => {
  const demoPath = getDestinationPathByDemo(demo, framework);
  const demoHtmlPath = framework !== 'Angular'
    ? join(demoPath, 'index.html')
    : join(demoPath, '..', 'AngularTemplates', 'index.html');
  const templateContent = getTemplateContent(framework);

  const metadataScripts = join(destinationPublishDir, 'scripts');
  let cssLinks = `<link href="${getSpecificCssPath(demo.Widget, demoPath)}" rel="stylesheet" />`;

  cssLinks = addExternalResources(demo, framework, cssLinks);

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
    additional_css: cssLinks,
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

  const nodeModulesPath = join(__dirname, '..', '..', '..', 'node_modules');

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

  const sourceData = join(demosRootDir, 'data');
  const destinationData = join(destinationPublishDir, 'data');
  copySync(sourceData, destinationData);
};
