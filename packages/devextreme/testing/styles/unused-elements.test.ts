import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';

const VAR_NAME_CHARS = 'A-Za-z0-9_-';

const getFilePath = (fileName: string): string => {
  const relativePath = join(__dirname, '..', '..', fileName);
  return resolve(relativePath);
};

const getImagesFromContent = (content: string): string[] => {
  const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;
  const result: string[] = [];
  let match = dataUriRegex.exec(content);

  while (match !== null) {
    const imagePath = getFilePath(match[2]);
    result.push(imagePath);
    match = dataUriRegex.exec(content);
  }

  return result;
};

const getFilesFromDirectory = (directoryName: string, extensions: string[] = []): string[] => {
  const fullDirName = join(process.cwd(), directoryName);
  const result: string[] = [];

  const walkDirectory = (directory: string): void => {
    readdirSync(directory).forEach((file) => {
      const absolutePath = join(directory, file);
      if (statSync(absolutePath).isDirectory()) {
        walkDirectory(absolutePath);
      } else if (extensions.length === 0 || extensions.includes(extname(file))) {
        result.push(absolutePath);
      }
    });
  };

  walkDirectory(fullDirName);
  return result;
};

const extractVariables = (filePath: string): string[] => {
  const content = readFileSync(filePath, 'utf8');
  const regex = new RegExp(`\\$[${VAR_NAME_CHARS}]+`, 'g');
  return content.match(regex) ?? [];
};

const findUniqueVariables = (variables: string[]): string[] => {
  const variableCounts = new Map<string, number>();
  variables.forEach((variable) => {
    variableCounts.set(variable, (variableCounts.get(variable) ?? 0) + 1);
  });
  return Array.from(variableCounts.entries())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([variable, count]) => count === 1)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([variable, count]) => variable);
};

test('There are no unused images in repository', () => {
  const fullImagesFileList = getFilesFromDirectory(join('images', 'widgets'))
    .map((fileName) => resolve(fileName).toLowerCase())
    .sort();

  const usedImagesFileList = getFilesFromDirectory('scss')
    .map((fileName) => {
      const fileContent = readFileSync(resolve(fileName)).toString();
      const imageNames = getImagesFromContent(fileContent);
      return imageNames.map((imageName) => resolve(imageName).toLowerCase());
    })
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  expect(fullImagesFileList).toEqual(usedImagesFileList);
});

test('There are no unused variables in SCSS files', () => {
  const scssFiles = getFilesFromDirectory(join('scss', 'widgets'), ['.scss'])
    .map((fileName) => resolve(fileName));

  let variables: string[] = [];
  scssFiles.forEach((filePath) => {
    variables = variables.concat(extractVariables(getFilePath(filePath.substring(filePath.indexOf('/scss')))));
  });

  const uniqueVariables = findUniqueVariables(variables);

  const exclusions: string[] = [
    '$validation-message-padding',
    '$cell-other-color',
    '$scheduler-default-header-height',
    '$scheduler-vertical-group-header-content-top-offset',
    '$tree-view-icon-size',
    '$fluent-accordion-shadow',
    '$fluent-button-padding',
    '$fluent-grid-base-footer-font-size',
    '$lookup-popover-arrow-border-color',
    '$lookup-popover-arrow-bg',
    '$fluent-pager-pagesize-padding-top',
    '$fluent-pager-pagesize-padding-bottom',
    '$fluent-pager-pagesize-padding-left',
    '$fluent-pager-pagesize-padding-right',
    '$progressbar-status-margin',
    '$radiobutton-invalid-color-active',
    '$fluent-scheduler-toolbar-color',
    '$fluent-scheduler-toolbar-active-color',
    '$fluent-scheduler-navigator-border-radius',
    '$fluent-scheduler-navigation-buttons-padding',
    '$fluent-scheduler-header-panel-week-font-size',
    '$fluent-scheduler-appointment-tooltip-width',
    '$fluent-slider-tooltip-width-without-paddings',
    '$fluent-slider-disabled-tooltip-top-margin',
    '$fluent-slider-handle-active-border-width',
    '$fluent-slider-handle-inner-border-width',
    '$fluent-slider-handle-inner-disabled-size',
    '$fluent-switch-handle-shadow',
    '$fluent-tagbox-outlined-with-label-top-padding',
    '$fluent-texteditor-clear-icon-size',
    '$fluent-texteditor-label-outside-font-size',
    '$fluent-standard-texteditor-input-padding',
    '$generic-button-text-transform',
    '$generic-button-text-font-weight',
    '$generic-button-text-letter-spacing',
    '$generic-html-editor-horizontal-padding',
    '$generic-scheduler-focused-tab-border',
    '$generic-scheduler-view-switcher-font-size',
    '$generic-scheduler-navigator-border-radius',
    '$generic-fa-button-label-shadow',
    '$tabs-tab-hover-border-color',
    '$generic-timeview-clock-additional-size',
    '$generic-treevieew-item-padding',
    '$material-accordion-shadow',
    '$button-inverted-icon-color',
    '$material-button-padding',
    '$material-normal-button-shadow',
    '$material-normal-button-active-state-shadow',
    '$material-normal-button-hovered-state-shadow',
    '$material-normal-button-focused-state-shadow',
    '$material-grid-base-footer-font-size',
    '$material-html-editor-horizontal-padding',
    '$material-pager-pagesize-padding-top',
    '$material-pager-pagesize-padding-bottom',
    '$material-pager-pagesize-padding-left',
    '$material-pager-pagesize-padding-right',
    '$material-scheduler-navigator-border-radius',
    '$material-scheduler-navigation-buttons-padding',
    '$material-scheduler-appointment-tooltip-width',
    '$material-slider-tooltip-width-without-paddings',
    '$material-tagbox-remove-button-right',
    '$material-tagbox-outlined-with-label-top-padding',
  ];

  expect(uniqueVariables).toEqual(exclusions);
});
