const path = require('path');
const fs = require('fs');
const meta = require('../../menuMeta.json');

class CreateConfig {
  constructor() {
    this.configDir = path.join(__dirname, '..', '..', 'configs');

    this.approaches = ['Angular', 'React', 'ReactJs', 'Vue'];

    this.meta = meta;

    this.useBundles = false;
  }

  getKey(widget, name) {
    return `${widget}--${name}`.toLowerCase();
  }

  unique(array) {
    return array.filter((value, index, that) => that.indexOf(value) === index);
  }

  getDemoKey(approach, modulesList) {
    return approach + modulesList.replace(/[\W]/g, '');
  }

  removeEmptyLines(content) {
    return content.replace(/(^\s*[\r\n])/gm, '');
  }

  removeModules(content, exceptions) {
    const moduleRegex = /\/\*\*\s*(.*?)\s*\*\/([\w\W]*?)\/\*\*\//g;
    const handler = (_, moduleName, moduleContent) => (exceptions.indexOf(moduleName) >= 0 ? moduleContent : '');
    return content.replace(moduleRegex, handler);
  }

  getConfigContent(approach, modulesString) {
    const modules = modulesString.replace(/\s/g, '').split(',');
    let baseContent = '';

    baseContent += fs.readFileSync(path.join(this.configDir, approach, 'config.js'), 'utf8');
    if (this.useBundles) {
      baseContent = baseContent.replace('System.config(window.config);', '');
      baseContent = baseContent.replace('System.import(\'@angular/compiler\').catch(console.error.bind(console));', '');
      baseContent += fs.readFileSync(path.join(this.configDir, approach, 'config.bundle.js'), 'utf8');
    }

    return this.removeEmptyLines(this.removeModules(baseContent, modules));
  }

  getDemosWithExtraModules() {
    const result = {};

    const handleGroup = (group) => group.Demos && group.Demos.forEach((demo) => {
      if (demo.Modules) result[this.getKey(demo.Widget, demo.Name)] = demo.Modules;
    });

    this.meta.forEach((section) => {
      if (section.Groups) {
        section.Groups.forEach((group) => {
          if (group.Groups) {
            group.Groups.forEach(handleGroup);
          }
          handleGroup(group);
        });
      }
    });
    return result;
  }

  createConfigFilesContent(demos) {
    const result = {};
    const uniqueConfigurations = this.unique(Object.values(demos));
    uniqueConfigurations.push(''); // default config has no modules

    uniqueConfigurations.forEach((modulesList) => {
      this.approaches.forEach((approach) => {
        result[this.getDemoKey(approach, modulesList)] = this.getConfigContent(
          approach,
          modulesList,
        );
      });
    });

    return result;
  }

  createConfigForApproaches(
    fullDemoName,
    widgetName,
    demoName,
    extraModulesDemos,
    approachesConfigContent,
  ) {
    this.approaches.forEach((approach) => {
      const demoApproachName = path.join(fullDemoName, approach);
      if (!fs.existsSync(demoApproachName)) return;

      const demoConfigName = path.join(demoApproachName, 'config.js');
      if (fs.existsSync(demoConfigName)) {
        fs.unlinkSync(demoConfigName);
      }

      const demoModulesList = extraModulesDemos[this.getKey(widgetName, demoName)] || '';
      fs.writeFileSync(demoConfigName, approachesConfigContent[this.getDemoKey(approach, demoModulesList)], 'utf8');
    });
  }

  copyTsConfigForApproaches(fullDemoName) {
    this.approaches.forEach((approach) => {
      if (approach === 'ReactJs' || !fs.existsSync(path.join(fullDemoName, approach))) return;
      const approachConfigPath = path.join(this.configDir, approach, 'tsconfig.json');
      const demoConfigPath = path.join(fullDemoName, approach, 'tsconfig.json');
      fs.copyFileSync(approachConfigPath, demoConfigPath);
    });
  }

  run(demosDir) {
    const demosWithExtraModules = this.getDemosWithExtraModules();
    const configContent = this.createConfigFilesContent(demosWithExtraModules);
    const widgetNames = fs.readdirSync(demosDir);

    widgetNames.forEach((widgetName) => {
      const fullWidgetName = path.join(demosDir, widgetName);
      if (!fs.statSync(fullWidgetName).isDirectory()) return;

      const demoNames = fs.readdirSync(fullWidgetName);

      demoNames.forEach((demoName) => {
        const fullDemoName = path.join(fullWidgetName, demoName);
        if (!fs.statSync(fullDemoName).isDirectory()) return;

        this.createConfigForApproaches(
          fullDemoName,
          widgetName,
          demoName,
          demosWithExtraModules,
          configContent,
        );

        this.copyTsConfigForApproaches(fullDemoName);
      });
    });
  }
}

module.exports = new CreateConfig();
