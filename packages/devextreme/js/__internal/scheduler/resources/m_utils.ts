import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { wrapToArray } from '@js/core/utils/array';
import { deepExtendArraySafe } from '@js/core/utils/object';
import { isDefined } from '@js/core/utils/type';
import { hasResourceValue } from '@ts/scheduler/r1/utils/index';

export const getIdExpr = (resource) => resource.valueExpr || 'id';
export const getTextExpr = (resource) => resource.displayExpr || 'text';
export const getFieldExpr = (resource) => resource.fieldExpr || resource.field;

export const createResourcesTree = (groups) => {
  let leafIndex = 0;

  const make = (group, groupIndex, result?, parent?) => {
    result = result || [];

    for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
      const currentGroupItem = group.items[itemIndex];
      const resultItem: any = {
        name: group.name,
        value: currentGroupItem.id,
        title: currentGroupItem.text,
        data: group.data?.[itemIndex],
        children: [],
        parent: parent || null,
      };

      const nextGroupIndex = groupIndex + 1;

      if (groups[nextGroupIndex]) {
        make(groups[nextGroupIndex], nextGroupIndex, resultItem.children, resultItem);
      }

      if (!resultItem.children.length) {
        resultItem.leafIndex = leafIndex;
        leafIndex++;
      }

      result.push(resultItem);
    }

    return result;
  };

  return make(groups[0], 0);
};

export const filterResources = (resources, fields) => resources.filter((resource) => {
  const field = getFieldExpr(resource);
  return fields.indexOf(field) > -1;
});

export const getDataAccessors = (dataAccessors, fieldName, type) => {
  const actions = dataAccessors[type];
  return actions[fieldName];
};

export const groupAppointmentsByResources = (config, appointments, groups = []) => {
  let result: any = { 0: appointments };

  if (groups.length && config.loadedResources.length) {
    result = groupAppointmentsByResourcesCore(config, appointments, config.loadedResources);
  }

  let totalResourceCount = 0;

  config.loadedResources.forEach((resource, index) => {
    if (!index) {
      totalResourceCount = resource.items.length;
    } else {
      totalResourceCount *= resource.items.length;
    }
  });

  for (let index = 0; index < totalResourceCount; index++) {
    const key = index.toString();

    if (result[key]) {
      continue;
    }

    result[key] = [];
  }

  return result;
};

export const groupAppointmentsByResourcesCore = (config, appointments, resources) => {
  const tree = createResourcesTree(resources);
  const result = {};

  appointments.forEach((appointment) => {
    const treeLeaves = getResourceTreeLeaves((field, action) => getDataAccessors(config.dataAccessors, field, action), tree, appointment);

    for (let i = 0; i < treeLeaves.length; i++) {
      if (!result[treeLeaves[i]]) {
        result[treeLeaves[i]] = [];
      }

      // NOTE: check appointment before pushing
      result[treeLeaves[i]].push(deepExtendArraySafe({}, appointment, true));
    }
  });

  return result;
};

export const getResourceTreeLeaves = (getDataAccessors, tree, rawAppointment, result?) => {
  result = result || [];

  for (let i = 0; i < tree.length; i++) {
    if (!hasGroupItem(getDataAccessors, rawAppointment, tree[i].name, tree[i].value)) {
      continue;
    }

    if (isDefined(tree[i].leafIndex)) {
      result.push(tree[i].leafIndex);
    }

    if (tree[i].children) {
      getResourceTreeLeaves(getDataAccessors, tree[i].children, rawAppointment, result);
    }
  }

  return result;
};

const hasGroupItem = (getDataAccessors, rawAppointment, groupName, itemValue) => {
  const resourceValue = getDataAccessors(groupName, 'getter')(rawAppointment);

  return hasResourceValue(wrapToArray(resourceValue), itemValue);
};
