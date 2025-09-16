const fs = require('fs');
const path = require('path');

const jobs = [
  { componentFolder: "accessibility/common", name: "accessibility (1/7)", indices: "1/7" },
  { componentFolder: "accessibility/common", name: "accessibility (2/7)", indices: "2/7" },
  { componentFolder: "accessibility/common", name: "accessibility (3/7)", indices: "3/7" },
  { componentFolder: "accessibility/common", name: "accessibility (4/7)", indices: "4/7" },
  { componentFolder: "accessibility/common", name: "accessibility (5/7)", indices: "5/7" },
  { componentFolder: "accessibility/common", name: "accessibility (6/7)", indices: "6/7" },
  { componentFolder: "accessibility/common", name: "accessibility (7/7)", indices: "7/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (1/7)", theme: "material.blue.light", indices: "1/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (2/7)", theme: "material.blue.light", indices: "2/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (3/7)", theme: "material.blue.light", indices: "3/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (4/7)", theme: "material.blue.light", indices: "4/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (5/7)", theme: "material.blue.light", indices: "5/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (6/7)", theme: "material.blue.light", indices: "6/7" },
  { componentFolder: "accessibility/common", name: "accessibility - material (7/7)", theme: "material.blue.light", indices: "7/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (1/7)", theme: "fluent.blue.light", indices: "1/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (2/7)", theme: "fluent.blue.light", indices: "2/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (3/7)", theme: "fluent.blue.light", indices: "3/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (4/7)", theme: "fluent.blue.light", indices: "4/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (5/7)", theme: "fluent.blue.light", indices: "5/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (6/7)", theme: "fluent.blue.light", indices: "6/7" },
  { componentFolder: "accessibility/common", name: "accessibility - fluent (7/7)", theme: "fluent.blue.light", indices: "7/7" },
  { componentFolder: "common", name: "common" },
  { componentFolder: "common", name: "common - material", theme: 'material.blue.light' },
  { componentFolder: "common", name: "common - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "chat", name: "chat" },
  { componentFolder: "chat", name: "chat - material", theme: 'material.blue.light' },
  { componentFolder: "chat", name: "chat - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "treeList", name: "treeList", concurrency: 1 },
  { componentFolder: "dataGrid/common", name: "dataGrid / common (1/5)", indices: "1/5" },
  { componentFolder: "dataGrid/common", name: "dataGrid / common (2/5)", indices: "2/5" },
  { componentFolder: "dataGrid/common", name: "dataGrid / common (3/5)", indices: "3/5" },
  { componentFolder: "dataGrid/common", name: "dataGrid / common (4/5)", indices: "4/5" },
  { componentFolder: "dataGrid/common", name: "dataGrid / common (5/5)", indices: "5/5" },
  { componentFolder: "dataGrid/sticky/common", name: "dataGrid / sticky common" },
  { componentFolder: "dataGrid/sticky/fixed", name: "dataGrid / sticky (1/3)", indices: "1/3" },
  { componentFolder: "dataGrid/sticky/fixed", name: "dataGrid / sticky (2/3)", indices: "2/3" },
  { componentFolder: "dataGrid/sticky/fixed", name: "dataGrid / sticky (3/3)", indices: "3/3" },
  { componentFolder: "cardView", name: "cardView" },
  { componentFolder: "cardView", name: "cardView - material", theme: 'material.blue.light' },
  { componentFolder: "cardView", name: "cardView - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "pivotGrid", name: "pivotGrid", concurrency: 1 },
  { componentFolder: "pivotGrid", name: "pivotGrid - material", theme: 'material.blue.light', concurrency: 1 },
  { componentFolder: "pivotGrid", name: "pivotGrid - fluent", theme: 'fluent.blue.light', concurrency: 1 },
  { componentFolder: "scheduler/common", name: "scheduler / common (1/6)", indices: "1/6" },
  { componentFolder: "scheduler/common", name: "scheduler / common (2/6)", indices: "2/6" },
  { componentFolder: "scheduler/common", name: "scheduler / common (3/6)", indices: "3/6" },
  { componentFolder: "scheduler/common", name: "scheduler / common (4/6)", indices: "4/6" },
  { componentFolder: "scheduler/common", name: "scheduler / common (5/6)", indices: "5/6" },
  { componentFolder: "scheduler/common", name: "scheduler / common (6/6)", indices: "6/6" },
  { componentFolder: "scheduler/viewOffset/common", name: "scheduler / offset" },
  { componentFolder: "scheduler/viewOffset/markup", name: "scheduler / offset markups" },
  // { componentFolder: "scheduler/timezones", name: "scheduler / timezones (Europe/Berlin)", timezone: "Europe/Berlin" },
  // { componentFolder: "scheduler/timezones", name: "scheduler / timezones (America/Los_Angeles)", timezone: "America/Los_Angeles" },
  { componentFolder: "form", name: "form (1/2)", indices: "1/2" },
  { componentFolder: "form", name: "form (2/2)", indices: "2/2" },
  { componentFolder: "form", name: "form - material (1/2)", theme: 'material.blue.light', indices: "1/2" },
  { componentFolder: "form", name: "form - material (2/2)", theme: 'material.blue.light', indices: "2/2" },
  { componentFolder: "form", name: "form - fluent (1/2)", theme: 'fluent.blue.light', indices: "1/2" },
  { componentFolder: "form", name: "form - fluent (2/2)", theme: 'fluent.blue.light', indices: "2/2" },
  { componentFolder: "editors", name: "editors (1/3)", indices: "1/3" },
  { componentFolder: "editors", name: "editors (2/3)", indices: "2/3" },
  { componentFolder: "editors", name: "editors (3/3)", indices: "3/3" },
  { componentFolder: "editors", name: "editors - material (1/3)", indices: "1/3", theme: 'material.blue.light' },
  { componentFolder: "editors", name: "editors - material (2/3)", indices: "2/3", theme: 'material.blue.light' },
  { componentFolder: "editors", name: "editors - material (3/3)", indices: "3/3", theme: 'material.blue.light' },
  { componentFolder: "editors", name: "editors - fluent (1/3)", indices: "1/3", theme: 'fluent.blue.light' },
  { componentFolder: "editors", name: "editors - fluent (2/3)", indices: "2/3", theme: 'fluent.blue.light' },
  { componentFolder: "editors", name: "editors - fluent (3/3)", indices: "3/3", theme: 'fluent.blue.light' },
  { componentFolder: "htmlEditor", name: "htmlEditor", concurrency: 1 },
  { componentFolder: "htmlEditor", name: "htmlEditor - material", theme: 'material.blue.light', concurrency: 1 },
  { componentFolder: "htmlEditor", name: "htmlEditor - fluent", theme: 'fluent.blue.light', concurrency: 1 },
  { componentFolder: "navigation", name: "navigation" },
  { componentFolder: "navigation", name: "navigation - material", theme: 'material.blue.light' },
  { componentFolder: "navigation", name: "navigation - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "fileManager", name: "fileManager" },
  { componentFolder: "fileManager", name: "fileManager - material", theme: 'material.blue.light' },
  { componentFolder: "fileManager", name: "fileManager - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "filterBuilder", name: "filterBuilder" },
  { componentFolder: "filterBuilder", name: "filterBuilder - material", theme: 'material.blue.light' },
  { componentFolder: "filterBuilder", name: "filterBuilder - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "pagination", name: "pagination" },
  { componentFolder: "pagination", name: "pagination - fluent", theme: 'fluent.blue.light' },
  { componentFolder: "gantt", name: "gantt" },
  { componentFolder: "fileUploader", name: "fileUploader" },
  { componentFolder: "fileUploader", name: "fileUploader - material", theme: 'material.blue.light' },
  { componentFolder: "fileUploader", name: "fileUploader - fluent", theme: 'fluent.blue.light' },
];

const testTargets = Object.fromEntries(
  jobs.map((job) => {
    const testName = job.name.replace(/ /g, '').replace(/[-\/()]/g, '-').replace(/-$/, '');
    const name = `test--${testName}`;

    let args = `--browsers=chrome:devextreme-shr2 --componentFolder ${job.componentFolder}`;
    

    if (job.theme)
      args += ` --theme ${ job.theme }`
    if (job.indices)
      args += ` --indices ${ job.indices }`
    if (job.concurrency)
      args += ` --concurrency ${ job.concurrency }`
    if (job.platform)
      args += ` --platform ${ job.platform }`

    const settins = {
      "dependsOn": [
        "^build"
      ],
      "executor": "nx:run-commands",
      "cache": true,
      "outputs": [
        "{projectRoot}/artifacts/compared-screenshots/**/*"
      ],
      "options": {
        "cwd": "{projectRoot}",
        "command": "pnpm run test",
        args
      }
    };

    return [name, settins];
  })
);

const project = {
  name: "devextreme-testcafe-tests",
  projectType: "application",
  targets: {
    lint: {
      "executor": "nx:run-script",
      "options": {
        "script": "lint"
      },
      "cache": true
    },
    test: {
      "executor": "nx:noop",
      dependsOn: Object.keys(testTargets),
    },
    ...testTargets,
  },
  tags: [],
}

fs.writeFileSync(path.join(__dirname, './project.json'), JSON.stringify(project, null, 2));
