/* eslint-disable no-console */
const path = require('path');
const prompts = require('prompts');

const menuMetaUtils = require('./menu-meta-utils');
const fileSystemUtils = require('../shared/fs-utils');

const setTextIfPrevIsNull = (prev) => (prev === 'new' ? 'text' : null);

const getPromptForCategories = (menuMetaData, message, newCategoryText) => ({
  type: 'autocomplete',
  name: 'name',
  message,
  choices: menuMetaUtils.getCategories(menuMetaData, newCategoryText),
});

const getCategoryQuestions = (menuMetaData) => [
  getPromptForCategories(
    menuMetaData,
    'Select a category for the new demo or `New category` to create a new category.',
    '[New category]',
  ),
  {
    type: setTextIfPrevIsNull,
    name: 'newName',
    message: 'Enter the name of a new category:',
  }];

const getGroupQuestions = (menuMetaData, category) => [{
  type: 'autocomplete',
  name: 'name',
  message: 'Select a group for the new demo or `New group` to create a new group.',
  choices: menuMetaUtils.getGroups(menuMetaData, category.name, '[New group]'),
}, {
  type: setTextIfPrevIsNull,
  name: 'newName',
  message: 'Enter the name of a new group:',
}];

const getDemoQuestions = (menuMetaData, category, group) => [{
  type: 'autocomplete',
  name: 'name',
  message: 'Select a demo to which you want to add missing approaches or `[New demo]` to create a new demo in this group.',
  choices: menuMetaUtils.getDemos(menuMetaData, category.name, group.name, '[New demo]'),
}, {
  type: setTextIfPrevIsNull,
  name: 'newName',
  message: 'Enter the name of a new demo:',
}];

const onCancel = () => {
  console.log('Operation is canceled.');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
};

const getWidgetQuestions = (baseDemosDir) => [{
  type: 'autocomplete',
  name: 'name',
  message: 'Select a directory for the demo or `[New directory]` to create a new directory',
  choices: fileSystemUtils.getWidgets(path.join(baseDemosDir), '[New directory]'),
}, {
  type: (prev, answers) => (answers.name === 'new' ? 'text' : null),
  name: 'newName',
  format: (val) => val.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(/ /g, ''),
  message: 'Enter the name of a new directory:',
}];

const getApproachesQuestions = (approaches) => ({
  type: 'multiselect',
  name: 'selectedApproaches',
  message: 'Select approaches:',
  min: 1,
  choices: () => approaches.map((item) => ({ title: item, value: item })),
});

const getNewOrExistingQuestions = (menuMetaData) => [{
  type: 'autocomplete',
  name: 'choice',
  message: 'Would you like to create a blank demo or copy files from existing demo?',
  choices: [{ title: 'Create a new demo', value: 'new' }, { title: 'Copy files from existing demo', value: 'existing' }],
}, {
  type: (prev, answers) => (answers.choice === 'existing' ? 'autocomplete' : null),
  name: 'category',
  message: '[Copy from existing demo]: Select a category:',
  choices: menuMetaUtils.getCategories(menuMetaData),
}, {
  type: (prev, answers) => (answers.choice === 'existing' ? 'autocomplete' : null),
  name: 'group',
  message: '[Copy from existing demo]: Select a group',
  choices: (prev, answers) => menuMetaUtils.getGroups(menuMetaData, answers.category),
}, {
  type: (prev, answers) => (answers.choice === 'existing' ? 'autocomplete' : null),
  name: 'demo',
  message: '[Copy from existing demo]: Select a demo',
  choices: (prev, answers) => menuMetaUtils.getDemos(menuMetaData, answers.category, answers.group),
}];

const getApproachesFoldersQuestions = (approaches) => {
  const result = approaches.map((approach) => ({ title: approach }));
  return {
    type: 'autocomplete',
    name: 'approach',
    message: 'Select an approach:',
    choices: result,
  };
};

const getDemoToUpdateQuestions = (menuMetaData) => [{
  type: 'autocomplete',
  name: 'category',
  message: 'Select a category:',
  choices: menuMetaUtils.getCategories(menuMetaData),
}, {
  type: 'autocomplete',
  name: 'group',
  message: 'Select a group:',
  choices: (prev, answers) => menuMetaUtils.getGroups(menuMetaData, answers.category),
}, {
  type: 'autocomplete',
  name: 'demo',
  message: 'Select a demo:',
  choices: (prev, answers) => menuMetaUtils.getDemos(menuMetaData, answers.category, answers.group),
}];

const getLinkRepositoriesQuestions = () => [
  {
    type: 'select',
    name: 'command',
    message: 'Do you want to link or unlink repositories?',
    choices: [
      { title: 'Link repositories', value: 'link' },
      { title: 'Unlink repositories', value: 'unlink' },
    ],
  },
  {
    type: 'multiselect',
    name: 'repositories',
    min: 1,
    instructions: '\nSpace - select a repository\nUp/Down - Highlight next/previous repository\nEnter - finish selection\n',
    message: (prev, answers) => `Select repositories that you want to ${answers.command} and press Enter...`,
    choices: [
      { title: 'DevExtreme', value: 'devextreme' },
      { title: 'DevExtreme Angular', value: 'devextreme-angular' },
      { title: 'DevExtreme React', value: 'devextreme-react' },
      { title: 'DevExtreme Vue', value: 'devextreme-vue' },
      { title: 'DevExpress Gantt', value: 'devexpress-gantt' },
      { title: 'DevExpress Diagram', value: 'devexpress-diagram' },
    ],
  },
  {
    type: (prev, answers) => (answers.repositories.includes('devextreme') ? 'select' : null),
    name: 'build',
    initial: 0,
    message: 'Select DevExtreme build you want to process.',
    choices: [
      { title: 'Current `devextreme/artifacts/npm/devextreme`', value: 'devextreme' },
      { title: 'Renovation `devextreme/artifacts/npm/devextreme-renovation`', value: 'devextreme-renovation' },
    ],
  },
];

const askCategory = async (menuMetaData) => prompts(
  getCategoryQuestions(menuMetaData), { onCancel },
);

const askGroup = async (menuMetaData, category) => prompts(
  getGroupQuestions(menuMetaData, category), { onCancel },
);

const askDemo = async (menuMetaData, category, group) => prompts(
  getDemoQuestions(menuMetaData, category, group), { onCancel },
);

const askWidget = async (baseDemosDir) => prompts(
  getWidgetQuestions(baseDemosDir), { onCancel },
);

const askApproaches = async (missingApproaches) => prompts(
  getApproachesQuestions(missingApproaches), { onCancel },
);

const askNewOrExisting = async (menuMetaData) => prompts(
  getNewOrExistingQuestions(menuMetaData), { onCancel },
);

const askDemoToUpdate = async (menuMetaData) => prompts(
  getDemoToUpdateQuestions(menuMetaData), { onCancel },
);

const askLinkRepositories = async () => prompts(getLinkRepositoriesQuestions(), { onCancel });

const askRepositoryPath = async (repositoryName) => prompts({
  type: 'text',
  name: 'path',
  validate: (value) => (fileSystemUtils.isValidDirectory(value) ? true : 'Invalid path.'),
  message: `Specify the location of the \`${repositoryName}\` repository:`,
}, { onCancel });

module.exports = {
  getCategoryQuestions,
  getGroupQuestions,
  askGroup,
  askNewOrExisting,
  askCategory,
  askDemo,
  askDemoToUpdate,
  askApproaches,
  askWidget,
  askRepositoryPath,
  getDemoQuestions,
  getApproachesQuestions,
  getWidgetQuestions,
  getApproachesFoldersQuestions,
  getDemoToUpdateQuestions,
  getNewOrExistingQuestions,
  askLinkRepositories,
};
