/* eslint-disable no-console */
const addCategory = (menuMetaData, categoryName) => {
  const categoryMeta = { Name: categoryName, Equivalents: '', Groups: [] };
  menuMetaData.push(categoryMeta);
};

const addGroup = (menuMetaData, categoryName, groupName) => {
  const groupMeta = { Name: groupName, Equivalents: '', Demos: [] };
  const categoryIndex = menuMetaData.findIndex((x) => x.Name === categoryName);
  menuMetaData[categoryIndex].Groups.push(groupMeta);
};

const addDemo = (menuMetaData, categoryName, groupName, demoName, widgetName) => {
  const demoMeta = {
    Title: demoName,
    Name: demoName.replace(/ /g, ''),
    DocUrl: '',
    Widget: widgetName,
    MvcDescription: '',
    NetCoreDescription: '',
    MvcAdditionalFiles: [],
    DemoType: 'Web',
    Badge: 'New',
  };
  const categoryIndex = menuMetaData.findIndex((x) => x.Name === categoryName);
  const groupIndex = menuMetaData[categoryIndex].Groups.findIndex((x) => x.Name === groupName);
  menuMetaData[categoryIndex].Groups[groupIndex].Demos.push(demoMeta);
};

const getDemoMeta = (menuMetaData, categoryName, groupName, demoName) => {
  const categoryIndex = menuMetaData.findIndex((x) => x.Name === categoryName);
  const groupIndex = menuMetaData[categoryIndex].Groups.findIndex((x) => x.Name === groupName);
  const demoIndex = menuMetaData[categoryIndex]
    .Groups[groupIndex]
    .Demos.findIndex((x) => x.Name === demoName);
  return menuMetaData[categoryIndex].Groups[groupIndex].Demos[demoIndex];
};

const updateDemoProperties = (
  menuMetaData,
  categoryName,
  groupName,
  demoNewName,
  newOrExisting,
) => {
  const demoMetaSource = getDemoMeta(
    menuMetaData,
    newOrExisting.category,
    newOrExisting.group,
    newOrExisting.demo,
  );
  const demoMetaDest = getDemoMeta(menuMetaData, categoryName, groupName, demoNewName);
  if (demoMetaSource.Modules) {
    demoMetaDest.Modules = demoMetaSource.Modules;
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

const getGroups = (menuMetaData, category, newGroup) => {
  console.log(category);
  const result = menuMetaData
    .find((x) => x.Name === category)
    .Groups.map((current) => ({ title: current.Name }));

  if (newGroup) {
    result.unshift({ title: newGroup, value: 'new' });
  }

  return result;
};

const getDemos = (menuMetaData, category, group, newDemo) => {
  const result = menuMetaData
    .find((x) => x.Name === category).Groups
    .find((x) => x.Name === group).Demos
    .map((current) => ({ title: current.Title, value: current.Name }));

  if (newDemo) {
    result.unshift({ title: newDemo, value: 'new' });
  }

  return result;
};

module.exports = {
  addCategory,
  addGroup,
  updateDemoProperties,
  addDemo,
  getCategories,
  getGroups,
  getDemos,
};
