import { IConfigNode, ITemplate } from './config-node';
import { buildNode, buildTemplates } from './tree';
import { buildFullName, mergeNameParts } from './utils';

interface IConfigChanges {
  options: Record<string, any>;
  removedOptions: string[];
  templates: Record<string, ITemplate>;
  addRemovedValues: (
    currentOptions: Record<string, any>, prevOptions: Record<string, any>, path: string) => void;
}

function compareTemplates(
  current: IConfigNode,
  currentFullName: string,
  prev: IConfigNode,
  changesAccum: IConfigChanges
) {
  const currentTemplatesOptions: Record<string, any> = {};
  const currentTemplates: Record<string, ITemplate> = {};
  const prevTemplatesOptions: Record<string, any> = {};
  const prevTemplates: Record<string, ITemplate> = {};

  buildTemplates(current, currentTemplatesOptions, currentTemplates);
  buildTemplates(prev, prevTemplatesOptions, prevTemplates);

  changesAccum.addRemovedValues(currentTemplatesOptions, prevTemplatesOptions, currentFullName);
  // TODO: support switching to default templates
  // appendRemovedValues(currentTemplates, prevTemplates, "", changesAccum.templates);

  Object.keys(currentTemplatesOptions).forEach((key) => {
    if (currentTemplatesOptions[key] === prevTemplatesOptions[key]) {
      return;
    }

    changesAccum.options[mergeNameParts(currentFullName, key)] = currentTemplatesOptions[key];
  });

  Object.keys(currentTemplates).forEach((key) => {
    const currentTemplate = currentTemplates[key];
    const prevTemplate = prevTemplates[key];
    if (prevTemplate && currentTemplate.content === prevTemplate.content) {
      return;
    }

    changesAccum.templates[key] = currentTemplate;
  });
}


function compare(current: IConfigNode, prev: IConfigNode, changesAccum: IConfigChanges) {
  const fullName = buildFullName(current);

  if (!prev) {
    changesAccum.options[fullName] = buildNode(
      current,
      changesAccum.templates,
      true,
    );
    return;
  }

  changesAccum.addRemovedValues(current.options, prev.options, fullName);
  changesAccum.addRemovedValues(
    current.configCollections,
    prev.configCollections,
    fullName,
  );
  changesAccum.addRemovedValues(current.configs, prev.configs, fullName);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  compareCollections(current, fullName, prev, changesAccum);

  Object.keys(current.configs).forEach((key) => {
    compare(current.configs[key], prev.configs[key], changesAccum);
  });

  Object.keys(current.options).forEach((key) => {
    if (current.options[key] === prev.options[key]) {
      return;
    }

    changesAccum.options[mergeNameParts(fullName, key)] = current.options[key];
  });

  compareTemplates(current, fullName, prev, changesAccum);
}

function appendRemovedValues(
  current: Record<string, any>,
  prev: Record<string, any>,
  path: string,
  changesAccum: string[],
) {
  const removedKeys = Object.keys(prev).filter((key) => !Object.keys(current).includes(key));

  removedKeys.forEach((key) => {
    changesAccum.push(mergeNameParts(path, key));
  });
}

function getChanges(current: IConfigNode, prev: IConfigNode): IConfigChanges {
  const changesAccum: IConfigChanges = {
    options: {},
    removedOptions: [],
    templates: {},
    addRemovedValues(currentOptions, prevOptions, path) {
      appendRemovedValues(currentOptions, prevOptions, path, this.removedOptions);
    },
  };

  compare(current, prev, changesAccum);

  return changesAccum;
}

function compareCollections(
  current: IConfigNode,
  currentFullName: string,
  prev: IConfigNode,
  changesAccum: IConfigChanges,
) {
  Object.keys(current.configCollections).forEach((key) => {
    const currentCollection = current.configCollections[key];
    const prevCollection = prev.configCollections[key] || [];
    if (!currentCollection || currentCollection.length !== prevCollection.length) {
      const updatedCollection: Record<string, any>[] = [];
      currentCollection.forEach(
        (item) => {
          const config = buildNode(item, changesAccum.templates, true);
          updatedCollection.push(config);
        },
      );
      changesAccum.options[mergeNameParts(currentFullName, key)] = updatedCollection;
      return;
    }

    for (let i = 0; i < currentCollection.length; i += 1) {
      compare(currentCollection[i], prevCollection[i], changesAccum);
    }
  });
}

export {
  getChanges,
};
