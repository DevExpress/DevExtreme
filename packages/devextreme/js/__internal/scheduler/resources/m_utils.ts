import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { wrapToArray } from '@js/core/utils/array';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import { isDefined } from '@js/core/utils/type';
import { current, isFluent } from '@js/ui/themes';
import { getGroupCount, hasResourceValue } from '@ts/scheduler/r1/utils/index';

export const getValueExpr = (resource) => resource.valueExpr || 'id';
export const getDisplayExpr = (resource) => resource.displayExpr || 'text';
export const getFieldExpr = (resource) => resource.fieldExpr || resource.field;

export const getWrappedDataSource = (dataSource) => {
  if (dataSource instanceof DataSource) {
    return dataSource;
  }

  const result = {
    // @ts-expect-error
    ...normalizeDataSourceOptions(dataSource),
    pageSize: 0,
  };

  if (!Array.isArray(dataSource)) {
    result.filter = dataSource.filter;
  }

  return new DataSource(result);
};

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

export const getPathToLeaf = (leafIndex, groups) => {
  const tree = createResourcesTree(groups);

  const findLeafByIndex = (data, index) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].leafIndex === index) {
        return data[i];
      }
      const leaf = findLeafByIndex(data[i].children, index);
      if (leaf) {
        return leaf;
      }
    }
  };

  const makeBranch = (leaf, result?) => {
    result = result || [];
    result.push(leaf.value);

    if (leaf.parent) {
      makeBranch(leaf.parent, result);
    }

    return result;
  };

  const leaf = findLeafByIndex(tree, leafIndex);

  return makeBranch(leaf).reverse();
};

// TODO rework
export const getCellGroups = (groupIndex, groups) => {
  const result: any = [];

  if (getGroupCount(groups)) {
    if (groupIndex < 0) {
      return;
    }

    const path = getPathToLeaf(groupIndex, groups);

    for (let i = 0; i < groups.length; i++) {
      result.push({
        name: groups[i].name,
        id: path[i],
      });
    }
  }

  return result;
};

export const getGroupsObjectFromGroupsArray = (groupsArray) => groupsArray.reduce((currentGroups, { name, id }) => ({
  ...currentGroups,
  [name]: id,
}), {});

export const getAllGroups = (groups) => {
  const groupCount = getGroupCount(groups);

  return [...new Array(groupCount)].map((_, groupIndex) => {
    const groupsArray = getCellGroups(
      groupIndex,
      groups,
    );

    return getGroupsObjectFromGroupsArray(groupsArray);
  });
};

export const getResourceByField = (fieldName, loadedResources) => {
  for (let i = 0; i < loadedResources.length; i++) {
    const resource = loadedResources[i];
    if (resource.name === fieldName) {
      return resource.data;
    }
  }

  return [];
};

export const createResourceEditorModel = (resources, loadedResources) => resources.map((resource) => {
  const dataField = getFieldExpr(resource);
  const dataSource = getResourceByField(dataField, loadedResources);

  return {
    editorOptions: {
      dataSource: dataSource.length ? dataSource : getWrappedDataSource(resource.dataSource),
      displayExpr: getDisplayExpr(resource),
      valueExpr: getValueExpr(resource),
      stylingMode: isFluent(current()) ? 'filled' : 'outlined',
    },
    dataField,
    editorType: resource.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
    label: { text: resource.label || dataField },
  };
});

export const isResourceMultiple = (resources, resourceField) => {
  const resource = resources.find((resource) => {
    const field = getFieldExpr(resource);
    return field === resourceField;
  });

  return !!resource?.allowMultiple;
};

export const filterResources = (resources, fields) => resources.filter((resource) => {
  const field = getFieldExpr(resource);
  return fields.indexOf(field) > -1;
});

export const getPaintedResources = (resources, groups) => {
  const newGroups = groups || [];

  const result = resources.find((resource) => resource.useColorAsDefault);
  if (result) {
    return result;
  }

  const newResources = newGroups.length
    ? filterResources(resources, newGroups)
    : resources;

  return newResources[newResources.length - 1];
};

export const getOrLoadResourceItem = (resources, resourceLoaderMap, field, value) => {
  // @ts-expect-error
  const result = new Deferred();

  resources
    .filter((resource) => getFieldExpr(resource) === field
      && isDefined(resource.dataSource))
    .forEach((resource) => {
      const wrappedDataSource: any = getWrappedDataSource(resource.dataSource);
      const valueExpr = getValueExpr(resource);

      if (!resourceLoaderMap.has(field)) {
        resourceLoaderMap.set(field, wrappedDataSource.load());
      }

      resourceLoaderMap.get(field)
        .done((data) => {
          const getter: any = compileGetter(valueExpr);
          const filteredData = data.filter(
            (resource) => equalByValue(getter(resource), value),
          );
          result.resolve(filteredData[0]);
        })
        .fail(() => {
          resourceLoaderMap.delete(field);
          result.reject();
        });
    });

  return result.promise();
};

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

export const createReducedResourcesTree = (loadedResources, getDataAccessors, appointments) => {
  const tree = createResourcesTree(loadedResources);
  return reduceResourcesTree(getDataAccessors, tree, appointments);
};

export const reduceResourcesTree = (getDataAccessors, tree, existingAppointments, _result?) => {
  _result = _result ? _result.children : [];

  tree.forEach((node, index) => {
    let ok = false;
    const resourceName = node.name;
    const resourceValue = node.value;
    const resourceTitle = node.title;
    const resourceData = node.data;
    const resourceGetter = getDataAccessors(resourceName, 'getter');

    existingAppointments.forEach((appointment) => {
      if (!ok) {
        const resourceFromAppointment = resourceGetter(appointment);

        if (Array.isArray(resourceFromAppointment)) {
          if (resourceFromAppointment.includes(resourceValue)) {
            _result.push({
              name: resourceName,
              value: resourceValue,
              title: resourceTitle,
              data: resourceData,
              children: [],
            });
            ok = true;
          }
        } else if (resourceFromAppointment === resourceValue) {
          _result.push({
            name: resourceName,
            value: resourceValue,
            title: resourceTitle,
            data: resourceData,
            children: [],
          });
          ok = true;
        }
      }
    });

    if (ok && node.children && node.children.length) {
      reduceResourcesTree(getDataAccessors, node.children, existingAppointments, _result[index]);
    }
  });

  return _result;
};

export const getResourcesDataByGroups = (loadedResources, resources, groups) => {
  if (!groups || !groups.length) {
    return loadedResources;
  }

  const fieldNames = {};
  const currentResourcesData: any = [];

  groups.forEach((group) => {
    each(group, (name, value) => { fieldNames[name] = value; });
  });

  const resourceData = loadedResources.filter(({ name }) => isDefined(fieldNames[name]));
  resourceData.forEach(
    (data) => currentResourcesData.push(extend({}, data)),
  );

  currentResourcesData.forEach((currentResource) => {
    const {
      items,
      data,
      name: resourceName,
    } = currentResource;

    const resource = filterResources(resources, [resourceName])[0] || {};
    const valueExpr = getValueExpr(resource);
    const filteredItems: any = [];
    const filteredData: any = [];

    groups
      .filter((group) => isDefined(group[resourceName]))
      .forEach((group) => {
        each(group, (name, value) => {
          if (!filteredItems.filter((item) => item.id === value && item[valueExpr] === name).length) {
            const currentItems = items.filter((item) => item.id === value);
            const currentData = data.filter((item) => item[valueExpr] === value);

            filteredItems.push(...currentItems);
            filteredData.push(...currentData);
          }
        });
      });

    currentResource.items = filteredItems;
    currentResource.data = filteredData;
  });

  return currentResourcesData;
};

export const setResourceToAppointment = (resources, dataAccessors, appointment, groups) => {
  const resourcesSetter = dataAccessors.setter;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in groups) {
    const resourceData = groups[name];
    const value = isResourceMultiple(resources, name) ? wrapToArray(resourceData) : resourceData;
    resourcesSetter[name](appointment, value);
  }
};

export const getResourceColor = (resources, resourceLoaderMap, field, value) => {
  // @ts-expect-error
  const result = new Deferred();

  const resource = filterResources(resources, [field])[0] || {};

  const colorExpr = resource.colorExpr || 'color';
  const colorGetter: any = compileGetter(colorExpr);

  getOrLoadResourceItem(resources, resourceLoaderMap, field, value)
    .done((resource) => result.resolve(colorGetter(resource)))
    .fail(() => result.reject());

  return result.promise();
};

export const getAppointmentColor = (resourceConfig, appointmentConfig) => {
  const {
    resources, dataAccessors, loadedResources, resourceLoaderMap,
  } = resourceConfig;
  const { groupIndex, groups, itemData } = appointmentConfig;

  const paintedResources = getPaintedResources(resources || [], groups);

  if (paintedResources) {
    const field = getFieldExpr(paintedResources);

    const cellGroups = getCellGroups(groupIndex, loadedResources);
    const resourcesDataAccessors = getDataAccessors(dataAccessors, field, 'getter');
    const resourceValues = wrapToArray(resourcesDataAccessors(itemData));

    let groupId = resourceValues[0];

    for (let i = 0; i < cellGroups.length; i++) {
      if (cellGroups[i].name === field) {
        groupId = cellGroups[i].id;
        break;
      }
    }

    return getResourceColor(resources, resourceLoaderMap, field, groupId);
  }

  // @ts-expect-error
  return new Deferred()
    .resolve()
    .promise();
};

export const createExpressions = (resources: any = []) => {
  const result = {
    getter: {},
    setter: {},
  };

  resources.forEach((resource) => {
    const field = getFieldExpr(resource);

    result.getter[field] = compileGetter(field);
    result.setter[field] = compileSetter(field);
  });

  return result;
};

const getTransformedResourceData = (resource, data) => {
  const valueGetter: any = compileGetter(getValueExpr(resource));
  const displayGetter: any = compileGetter(getDisplayExpr(resource));

  return data.map((item) => {
    const result: any = {
      id: valueGetter(item),
      text: displayGetter(item),
    };

    if (item.color) { // TODO for passed tests
      result.color = item.color;
    }

    return result;
  });
};

export const loadResources = (groups, resources, resourceLoaderMap) => {
  // @ts-expect-error
  const result = new Deferred();
  const deferreds: any = [];

  const newGroups = groups || [];
  const newResources = resources || [];

  let loadedResources: any = [];

  filterResources(newResources, newGroups)
    .forEach((resource) => {
      // @ts-expect-error
      const deferred = new Deferred();
      const name = getFieldExpr(resource);
      deferreds.push(deferred);

      const dataSourcePromise = getWrappedDataSource(resource.dataSource).load();
      resourceLoaderMap.set(name, dataSourcePromise);

      dataSourcePromise
        .done((data) => {
          const items = getTransformedResourceData(resource, data);

          deferred.resolve({ name, items, data });
        })
        .fail(() => deferred.reject());
    });

  if (!deferreds.length) {
    return result.resolve(loadedResources);
  }

  when.apply(null, deferreds).done((...resources) => {
    const hasEmpty = resources.some((r) => (r as any).items.length === 0);

    loadedResources = hasEmpty ? [] : resources;

    result.resolve(loadedResources);
  }).fail(() => result.reject());

  return result.promise();
};

export const getNormalizedResources = (rawAppointment, dataAccessors, resources) => {
  const result = {};

  each(dataAccessors.resources.getter, (fieldName) => {
    const value = dataAccessors.resources.getter[fieldName](rawAppointment);

    if (isDefined(value)) {
      const isMultiple = isResourceMultiple(resources, fieldName);
      const resourceValue = isMultiple
        ? wrapToArray(value)
        : value;
      result[fieldName] = resourceValue;
    }
  });

  return result;
};
