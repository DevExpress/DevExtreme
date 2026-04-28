const { readdirSync } = require('fs');
const { join } = require('path');

const rootDemosFolder = join(__dirname, '..', '..', 'Demos');
const meta = require('../../menuMeta.json');

const demos = [];
const folders = {};

readdirSync(rootDemosFolder, { withFileTypes: true }).forEach((widgetFolder) => {
  if (!widgetFolder.isDirectory()) { return; }
  const widgetName = widgetFolder.name.toString();
  folders[widgetName] = folders[widgetName] || {};

  readdirSync(join(rootDemosFolder, widgetName), { withFileTypes: true }).forEach((demoFolder) => {
    const demoName = demoFolder.name.toString();
    if (demoFolder.isDirectory()) {
      folders[widgetName][demoName] = folders[widgetName][demoName] || true;
    }
  });
});

const collectDemos = (group) => {
  if (group.Demos) {
    group.Demos.forEach((demo) => demos.push(demo));
  } else if (group.Groups) {
    group.Groups.forEach(collectDemos);
  }
};

meta.forEach((section) => {
  section.Groups.forEach(collectDemos);
});

const primaryDemos = demos.filter((d) => !d.IsDuplicate);
const duplicateDemos = demos.filter((d) => d.IsDuplicate);

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
        const demosWithFolder = primaryDemos
          .filter((d) => d.Widget === widgetFolder && d.Name === demoFolder);
        expect(demosWithFolder).toHaveLength(1);
      });
    });
  });
});

describe('Each duplicate demo has exactly one primary entry', () => {
  duplicateDemos.forEach((demo) => {
    test(`Duplicate: ${demo.Title} - ${demo.Widget}/${demo.Name}`, () => {
      const primaryMatches = primaryDemos
        .filter((d) => d.Widget === demo.Widget && d.Name === demo.Name);
      expect(primaryMatches).toHaveLength(1);
    });
  });
});
