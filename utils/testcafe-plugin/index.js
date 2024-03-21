const { dirname } = require("path");
const {readJsonFile } = require('@nx/devkit');
const glob = require('glob');

module.exports.createNodes = [
  'e2e/qunit/package.json',
  (projectConfigurationFile, opts, context) => {
    const tests = glob.sync('e2e/qunit/tests/**/*.tests.js');

    /**
     * @type {import('@nx/devkit').ProjectConfiguration}
     */
    const projectConfiguration = {
      targets: Object.fromEntries(tests.map((test) => [
        'test--' + test,
        {
          executor: 'nx:run-command',
          options: {
            cwd: 'e2e/qunit',
            command: 'echo hello',
          }
        }
      ]))
    };

    return {
      projects: {
        "e2e/qunit": projectConfiguration,
      },
    };
  },
];

