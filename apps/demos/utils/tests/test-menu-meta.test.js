const { readdirSync } = require('fs');
const { join } = require('path');

const rootDemosFolder = join(__dirname, '..', '..', 'Demos');
const meta = require('../../menuMeta.json');

const demos = [];
const folders = {};

readdirSync(rootDemosFolder, { withFileTypes: true }).forEach((widgetFolder) => {
  const widgetName = widgetFolder.name.toString();
  if (widgetFolder.isDirectory()) {
    folders[widgetName] = folders[widgetName] || {};
  }

  readdirSync(join(rootDemosFolder, widgetName), { withFileTypes: true }).forEach((demoFolder) => {
    const demoName = demoFolder.name.toString();
    if (demoFolder.isDirectory()) {
      folders[widgetName][demoName] = folders[widgetName][demoName] || true;
    }
  });
});

meta.forEach((section) => {
  section.Groups.forEach((group) => {
    if (group.Groups) {
      group.Groups.forEach((nestedGroup) => {
        nestedGroup.Demos.forEach((demo) => demos.push(demo));
      });
    }
    if (group.Demos) {
      group.Demos.forEach((demo) => demos.push(demo));
    }
  });
});

describe('All demos has corresponding folders', () => {
  demos.forEach((demo) => {
    test(`Demo: ${demo.Title} - ${demo.Widget}/${demo.Name}`, () => {
      expect(folders[demo.Widget][demo.Name]).toBe(true);
    });
  });
});

describe('All folders has corresponding demos', () => {
  Object.keys(folders).forEach((widgetFolder) => {
    Object.keys(folders[widgetFolder]).forEach((demoFolder) => {
      test(`Folder: ${widgetFolder}/${demoFolder} has demo`, () => {
        const demosWithFolder = demos
          .filter((d) => d.Widget === widgetFolder && d.Name === demoFolder);
        expect(demosWithFolder).toHaveLength(1);
      });
    });
  });
});
