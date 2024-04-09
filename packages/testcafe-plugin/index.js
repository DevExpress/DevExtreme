const { dirname, join } = require("path");
const {readJsonFile } = require('@nx/devkit');
const glob = require('glob');

/**
 * @type {import('@nx/devkit').CreateNodes}
 */
module.exports.createNodes = [
  'e2e/testcafe-devextreme/package.json',
  (projectConfigurationFile, opts, context) => {
    const path = join(context.workspaceRoot, 'e2e/testcafe-devextreme/tests/')
    const tests = glob.sync(path + 'treeList/**/*.ts').map((test) => test.slice(path.length, -3));

    const testFileTargets = Object.fromEntries(tests.map((test) => [
      'test--' + test,
      {
        executor: 'nx:run-commands',
        options: {
          cwd: 'e2e/testcafe-devextreme',
          command: `node runner.js --componentFolder '' --file ${test} --concurrency 1`,
        }
      }
    ]));

    /**
     * @type {import('@nx/devkit').ProjectConfiguration}
     */
    const projectConfiguration = {
      targets: {
        e2e: {
          executor: 'nx:noop',
          dependsOn: Object.keys(testFileTargets).map((target) => ({
            target,
            project: 'self',
            params: 'forward'
          }))
        },
        ...testFileTargets
      }
    };



    return {
      projects: {
        "e2e/testcafe-devextreme": projectConfiguration,
      },
    };
  },
];

