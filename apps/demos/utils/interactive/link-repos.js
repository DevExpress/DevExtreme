/* eslint-disable no-console */
const path = require('path');
const promptsQuestions = require('./prompts-questions');
const repositoriesHelper = require('./repos-helper');

const nodeModulesDir = path.join(__dirname, '..', '..', 'node_modules');

const mainRoutine = async () => {
  const response = await promptsQuestions.askLinkRepositories();
  const repositories = [];
  await repositoriesHelper.processRepositoriesAsync(
    response.repositories,
    async (repositoryName) => {
      const repositoryPath = await repositoriesHelper.getRepositoryPath(repositoryName);
      repositories.push({ name: repositoryName, path: repositoryPath });
    },
  );
  repositories.forEach((repository) => {
    console.log(`Processing the \`${repository.name}\` repository...`);

    if (repository.name === 'devextreme' && response.build) {
      // eslint-disable-next-line no-param-reassign
      repository.path = path.join(repository.path, 'artifacts', 'npm', response.build);
    }

    repositoriesHelper.processRepository(
      response.command,
      repository.name,
      repository.path,
      nodeModulesDir,
    );
    console.log(`Processed: ${repository.path}`);
  });
  console.log(`Finished ${response.command}ing repositories...`);
};

// eslint-disable-next-line no-return-await
(async () => await mainRoutine())();
