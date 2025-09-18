/* eslint-disable no-console */
const addCategory = (menuMetaData, categoryName) => {
  const categoryMeta = { Name: categoryName, Equivalents: '', Groups: [] };
  menuMetaData.push(categoryMeta);
};

const addGroup = (menuMetaData, pathParts, groupName) => {
  const groupMeta = { Name: groupName, Equivalents: '', Demos: [] };
  const groupParent = getByPath(menuMetaData, pathParts);
  groupParent.push(groupMeta);
};

const addDemo = (menuMetaData, pathParts, demoName, widgetName, equivalents) => {
  const demoMeta = {
    Title: demoName,
    Name: demoName.replace(/ /g, ''),
    Equivalents: equivalents,
    DocUrl: '',
    Widget: widgetName,
    MvcDescription: '',
    NetCoreDescription: '',
    MvcAdditionalFiles: [],
    DemoType: 'Web',
    Badge: 'New',
  };
  const demoParent = getByPath(menuMetaData, pathParts);
  demoParent.push(demoMeta);
};

const updateDemoProperties = (
  menuMetaData,
  pathParts,
  newOrExisting,
) => {
  const demoMetaSource = getByPath(
    menuMetaData,
    newOrExisting.path
  );
  const demoMetaDest = getByPath(menuMetaData, pathParts);
  if (demoMetaSource.Modules) {
    demoMetaDest.Modules = demoMetaSource.Modules;
  }
};

const addDemoModules = (
  menuMetaData,
  pathParts,
  modules,
) => {
  if (modules && modules.length) {
    const demoMetaDest = getByPath(menuMetaData, pathParts);
    demoMetaDest.Modules = modules.join(',');
  }
};

const getCategories = (menuMetaData, newCategory) => {
  const result = menuMetaData.map((current) => ({
    title: current.Name.toUpperCase(),
    value: current.Name,
  }));

  if (newCategory) {
    result.unshift({ title: newCategory, value: 'new' });
  }

  return result;
};

const getGroups = (menuMetaData, pathParts, newGroup) => {
  const result = getByPath(menuMetaData, pathParts)
    .map((current) => ({ title: current.Name }));

  if (newGroup) {
    result.unshift({ title: newGroup, value: 'new' });
  }

  return result;
};

const getDemos = (menuMetaData, pathParts, newDemo) => {
  const result = getByPath(menuMetaData, pathParts)
    .map((current) => ({ title: current.Title, value: current.Name }));

  if (newDemo) {
    result.unshift({ title: newDemo, value: 'new' });
  }

  return result;
};

const getItemByPath = (menuMetaData, pathParts) => {
  return pathParts
    .reduce((result, name, i) => {
      const current = result?.find((x) => x.Name === name);

      if (!current) {
        throw new Error(`incorrect path for menuMetaData: ${JSON.stringify(pathParts)}`);
      }

      if (i === pathParts.length - 1) {
        return current;
      }
      if (current.Groups) {
        return current.Groups;
      }
      if (current.Demos) {
        return current.Demos;
      }

      throw new Error(`incorrect path for menuMetaData: ${JSON.stringify(pathParts)}`);
    }, menuMetaData);
}

const hasGroups = (menuMetaData, pathParts) => {
  const item = getItemByPath(menuMetaData, pathParts);
  return !!item.Groups;
}

const hasDemos = (menuMetaData, pathParts) => {
  const item = getItemByPath(menuMetaData, pathParts);
  return !!item.Demos;
}

const isDemo = (menuMetaData, pathParts) => {
  const item = getItemByPath(menuMetaData, pathParts);
  return !item.Groups && !item.Demos;
}

const getByPath = (menuMetaData, pathParts) => {
  let result = getItemByPath(menuMetaData, pathParts);
  if (!Array.isArray(result)) {
    if (result.Groups) {
      result = result.Groups;
    } else if (result.Demos) {
      result = result.Demos;
    }
  }

  return result;
}

const prepareModules = (modules) => {
  const complexSet = new Set(modules);
  const simplifiedSet = new Set(modules.map(module => module.split('&')).flat());

  const combinedModules = complexSet.difference(simplifiedSet);
  const simplifiedCombinedModulesSet = new Set(Array.from(combinedModules).map(module => module.split('&')).flat())
  return Array.from(complexSet.difference(simplifiedCombinedModulesSet));
}

module.exports = {
  addCategory,
  addGroup,
  addDemo,
  addDemoModules,
  updateDemoProperties,
  getCategories,
  getGroups,
  getDemos,
  getByPath,
  hasGroups,
  hasDemos,
  isDemo,
  prepareModules,
};
