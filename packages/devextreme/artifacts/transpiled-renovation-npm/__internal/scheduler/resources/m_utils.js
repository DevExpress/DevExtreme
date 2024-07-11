"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setResourceToAppointment = exports.reduceResourcesTree = exports.loadResources = exports.isResourceMultiple = exports.groupAppointmentsByResourcesCore = exports.groupAppointmentsByResources = exports.getWrappedDataSource = exports.getValueExpr = exports.getResourcesDataByGroups = exports.getResourceTreeLeaves = exports.getResourceColor = exports.getResourceByField = exports.getPathToLeaf = exports.getPaintedResources = exports.getOrLoadResourceItem = exports.getNormalizedResources = exports.getGroupsObjectFromGroupsArray = exports.getFieldExpr = exports.getDisplayExpr = exports.getDataAccessors = exports.getCellGroups = exports.getAppointmentColor = exports.getAllGroups = exports.filterResources = exports.createResourcesTree = exports.createResourceEditorModel = exports.createReducedResourcesTree = exports.createExpressions = void 0;
var _array = require("../../../core/utils/array");
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _object = require("../../../core/utils/object");
var _type = require("../../../core/utils/type");
var _data_source = require("../../../data/data_source/data_source");
var _utils = require("../../../data/data_source/utils");
var _themes = require("../../../ui/themes");
var _index = require("../../scheduler/r1/utils/index");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const getValueExpr = resource => resource.valueExpr || 'id';
exports.getValueExpr = getValueExpr;
const getDisplayExpr = resource => resource.displayExpr || 'text';
exports.getDisplayExpr = getDisplayExpr;
const getFieldExpr = resource => resource.fieldExpr || resource.field;
exports.getFieldExpr = getFieldExpr;
const getWrappedDataSource = dataSource => {
  if (dataSource instanceof _data_source.DataSource) {
    return dataSource;
  }
  const result = _extends({}, (0, _utils.normalizeDataSourceOptions)(dataSource), {
    pageSize: 0
  });
  if (!Array.isArray(dataSource)) {
    result.filter = dataSource.filter;
  }
  return new _data_source.DataSource(result);
};
exports.getWrappedDataSource = getWrappedDataSource;
const createResourcesTree = groups => {
  let leafIndex = 0;
  const make = (group, groupIndex, result, parent) => {
    result = result || [];
    for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
      var _group$data;
      const currentGroupItem = group.items[itemIndex];
      const resultItem = {
        name: group.name,
        value: currentGroupItem.id,
        title: currentGroupItem.text,
        data: (_group$data = group.data) === null || _group$data === void 0 ? void 0 : _group$data[itemIndex],
        children: [],
        parent: parent || null
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
exports.createResourcesTree = createResourcesTree;
const getPathToLeaf = (leafIndex, groups) => {
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
  const makeBranch = (leaf, result) => {
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
exports.getPathToLeaf = getPathToLeaf;
const getCellGroups = (groupIndex, groups) => {
  const result = [];
  if ((0, _index.getGroupCount)(groups)) {
    if (groupIndex < 0) {
      return;
    }
    const path = getPathToLeaf(groupIndex, groups);
    for (let i = 0; i < groups.length; i++) {
      result.push({
        name: groups[i].name,
        id: path[i]
      });
    }
  }
  return result;
};
exports.getCellGroups = getCellGroups;
const getGroupsObjectFromGroupsArray = groupsArray => groupsArray.reduce((currentGroups, _ref) => {
  let {
    name,
    id
  } = _ref;
  return _extends({}, currentGroups, {
    [name]: id
  });
}, {});
exports.getGroupsObjectFromGroupsArray = getGroupsObjectFromGroupsArray;
const getAllGroups = groups => {
  const groupCount = (0, _index.getGroupCount)(groups);
  return [...new Array(groupCount)].map((_, groupIndex) => {
    const groupsArray = getCellGroups(groupIndex, groups);
    return getGroupsObjectFromGroupsArray(groupsArray);
  });
};
exports.getAllGroups = getAllGroups;
const getResourceByField = (fieldName, loadedResources) => {
  for (let i = 0; i < loadedResources.length; i++) {
    const resource = loadedResources[i];
    if (resource.name === fieldName) {
      return resource.data;
    }
  }
  return [];
};
exports.getResourceByField = getResourceByField;
const createResourceEditorModel = (resources, loadedResources) => resources.map(resource => {
  const dataField = getFieldExpr(resource);
  const dataSource = getResourceByField(dataField, loadedResources);
  return {
    editorOptions: {
      dataSource: dataSource.length ? dataSource : getWrappedDataSource(resource.dataSource),
      displayExpr: getDisplayExpr(resource),
      valueExpr: getValueExpr(resource),
      stylingMode: (0, _themes.isFluent)((0, _themes.current)()) ? 'filled' : 'outlined'
    },
    dataField,
    editorType: resource.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
    label: {
      text: resource.label || dataField
    }
  };
});
exports.createResourceEditorModel = createResourceEditorModel;
const isResourceMultiple = (resources, resourceField) => {
  const resource = resources.find(resource => {
    const field = getFieldExpr(resource);
    return field === resourceField;
  });
  return !!(resource !== null && resource !== void 0 && resource.allowMultiple);
};
exports.isResourceMultiple = isResourceMultiple;
const filterResources = (resources, fields) => resources.filter(resource => {
  const field = getFieldExpr(resource);
  return fields.indexOf(field) > -1;
});
exports.filterResources = filterResources;
const getPaintedResources = (resources, groups) => {
  const newGroups = groups || [];
  const result = resources.find(resource => resource.useColorAsDefault);
  if (result) {
    return result;
  }
  const newResources = newGroups.length ? filterResources(resources, newGroups) : resources;
  return newResources[newResources.length - 1];
};
exports.getPaintedResources = getPaintedResources;
const getOrLoadResourceItem = (resources, resourceLoaderMap, field, value) => {
  // @ts-expect-error
  const result = new _deferred.Deferred();
  resources.filter(resource => getFieldExpr(resource) === field && (0, _type.isDefined)(resource.dataSource)).forEach(resource => {
    const wrappedDataSource = getWrappedDataSource(resource.dataSource);
    const valueExpr = getValueExpr(resource);
    if (!resourceLoaderMap.has(field)) {
      resourceLoaderMap.set(field, wrappedDataSource.load());
    }
    resourceLoaderMap.get(field).done(data => {
      const getter = (0, _data.compileGetter)(valueExpr);
      const filteredData = data.filter(resource => (0, _common.equalByValue)(getter(resource), value));
      result.resolve(filteredData[0]);
    }).fail(() => {
      resourceLoaderMap.delete(field);
      result.reject();
    });
  });
  return result.promise();
};
exports.getOrLoadResourceItem = getOrLoadResourceItem;
const getDataAccessors = (dataAccessors, fieldName, type) => {
  const actions = dataAccessors[type];
  return actions[fieldName];
};
exports.getDataAccessors = getDataAccessors;
const groupAppointmentsByResources = function (config, appointments) {
  let groups = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let result = {
    0: appointments
  };
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
exports.groupAppointmentsByResources = groupAppointmentsByResources;
const groupAppointmentsByResourcesCore = (config, appointments, resources) => {
  const tree = createResourcesTree(resources);
  const result = {};
  appointments.forEach(appointment => {
    const treeLeaves = getResourceTreeLeaves((field, action) => getDataAccessors(config.dataAccessors, field, action), tree, appointment);
    for (let i = 0; i < treeLeaves.length; i++) {
      if (!result[treeLeaves[i]]) {
        result[treeLeaves[i]] = [];
      }
      // NOTE: check appointment before pushing
      result[treeLeaves[i]].push((0, _object.deepExtendArraySafe)({}, appointment, true));
    }
  });
  return result;
};
exports.groupAppointmentsByResourcesCore = groupAppointmentsByResourcesCore;
const getResourceTreeLeaves = (getDataAccessors, tree, rawAppointment, result) => {
  result = result || [];
  for (let i = 0; i < tree.length; i++) {
    if (!hasGroupItem(getDataAccessors, rawAppointment, tree[i].name, tree[i].value)) {
      continue;
    }
    if ((0, _type.isDefined)(tree[i].leafIndex)) {
      result.push(tree[i].leafIndex);
    }
    if (tree[i].children) {
      getResourceTreeLeaves(getDataAccessors, tree[i].children, rawAppointment, result);
    }
  }
  return result;
};
exports.getResourceTreeLeaves = getResourceTreeLeaves;
const hasGroupItem = (getDataAccessors, rawAppointment, groupName, itemValue) => {
  const resourceValue = getDataAccessors(groupName, 'getter')(rawAppointment);
  return (0, _index.hasResourceValue)((0, _array.wrapToArray)(resourceValue), itemValue);
};
const createReducedResourcesTree = (loadedResources, getDataAccessors, appointments) => {
  const tree = createResourcesTree(loadedResources);
  return reduceResourcesTree(getDataAccessors, tree, appointments);
};
exports.createReducedResourcesTree = createReducedResourcesTree;
const reduceResourcesTree = (getDataAccessors, tree, existingAppointments, _result) => {
  _result = _result ? _result.children : [];
  tree.forEach((node, index) => {
    let ok = false;
    const resourceName = node.name;
    const resourceValue = node.value;
    const resourceTitle = node.title;
    const resourceData = node.data;
    const resourceGetter = getDataAccessors(resourceName, 'getter');
    existingAppointments.forEach(appointment => {
      if (!ok) {
        const resourceFromAppointment = resourceGetter(appointment);
        if (Array.isArray(resourceFromAppointment)) {
          if (resourceFromAppointment.includes(resourceValue)) {
            _result.push({
              name: resourceName,
              value: resourceValue,
              title: resourceTitle,
              data: resourceData,
              children: []
            });
            ok = true;
          }
        } else if (resourceFromAppointment === resourceValue) {
          _result.push({
            name: resourceName,
            value: resourceValue,
            title: resourceTitle,
            data: resourceData,
            children: []
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
exports.reduceResourcesTree = reduceResourcesTree;
const getResourcesDataByGroups = (loadedResources, resources, groups) => {
  if (!groups || !groups.length) {
    return loadedResources;
  }
  const fieldNames = {};
  const currentResourcesData = [];
  groups.forEach(group => {
    (0, _iterator.each)(group, (name, value) => {
      fieldNames[name] = value;
    });
  });
  const resourceData = loadedResources.filter(_ref2 => {
    let {
      name
    } = _ref2;
    return (0, _type.isDefined)(fieldNames[name]);
  });
  resourceData.forEach(data => currentResourcesData.push((0, _extend.extend)({}, data)));
  currentResourcesData.forEach(currentResource => {
    const {
      items,
      data,
      name: resourceName
    } = currentResource;
    const resource = filterResources(resources, [resourceName])[0] || {};
    const valueExpr = getValueExpr(resource);
    const filteredItems = [];
    const filteredData = [];
    groups.filter(group => (0, _type.isDefined)(group[resourceName])).forEach(group => {
      (0, _iterator.each)(group, (name, value) => {
        if (!filteredItems.filter(item => item.id === value && item[valueExpr] === name).length) {
          const currentItems = items.filter(item => item.id === value);
          const currentData = data.filter(item => item[valueExpr] === value);
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
exports.getResourcesDataByGroups = getResourcesDataByGroups;
const setResourceToAppointment = (resources, dataAccessors, appointment, groups) => {
  const resourcesSetter = dataAccessors.setter;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in groups) {
    const resourceData = groups[name];
    const value = isResourceMultiple(resources, name) ? (0, _array.wrapToArray)(resourceData) : resourceData;
    resourcesSetter[name](appointment, value);
  }
};
exports.setResourceToAppointment = setResourceToAppointment;
const getResourceColor = (resources, resourceLoaderMap, field, value) => {
  // @ts-expect-error
  const result = new _deferred.Deferred();
  const resource = filterResources(resources, [field])[0] || {};
  const colorExpr = resource.colorExpr || 'color';
  const colorGetter = (0, _data.compileGetter)(colorExpr);
  getOrLoadResourceItem(resources, resourceLoaderMap, field, value).done(resource => result.resolve(colorGetter(resource))).fail(() => result.reject());
  return result.promise();
};
exports.getResourceColor = getResourceColor;
const getAppointmentColor = (resourceConfig, appointmentConfig) => {
  const {
    resources,
    dataAccessors,
    loadedResources,
    resourceLoaderMap
  } = resourceConfig;
  const {
    groupIndex,
    groups,
    itemData
  } = appointmentConfig;
  const paintedResources = getPaintedResources(resources || [], groups);
  if (paintedResources) {
    const field = getFieldExpr(paintedResources);
    const cellGroups = getCellGroups(groupIndex, loadedResources);
    const resourcesDataAccessors = getDataAccessors(dataAccessors, field, 'getter');
    const resourceValues = (0, _array.wrapToArray)(resourcesDataAccessors(itemData));
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
  return new _deferred.Deferred().resolve().promise();
};
exports.getAppointmentColor = getAppointmentColor;
const createExpressions = function () {
  let resources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const result = {
    getter: {},
    setter: {}
  };
  resources.forEach(resource => {
    const field = getFieldExpr(resource);
    result.getter[field] = (0, _data.compileGetter)(field);
    result.setter[field] = (0, _data.compileSetter)(field);
  });
  return result;
};
exports.createExpressions = createExpressions;
const getTransformedResourceData = (resource, data) => {
  const valueGetter = (0, _data.compileGetter)(getValueExpr(resource));
  const displayGetter = (0, _data.compileGetter)(getDisplayExpr(resource));
  return data.map(item => {
    const result = {
      id: valueGetter(item),
      text: displayGetter(item)
    };
    if (item.color) {
      // TODO for passed tests
      result.color = item.color;
    }
    return result;
  });
};
const loadResources = (groups, resources, resourceLoaderMap) => {
  // @ts-expect-error
  const result = new _deferred.Deferred();
  const deferreds = [];
  const newGroups = groups || [];
  const newResources = resources || [];
  let loadedResources = [];
  filterResources(newResources, newGroups).forEach(resource => {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const name = getFieldExpr(resource);
    deferreds.push(deferred);
    const dataSourcePromise = getWrappedDataSource(resource.dataSource).load();
    resourceLoaderMap.set(name, dataSourcePromise);
    dataSourcePromise.done(data => {
      const items = getTransformedResourceData(resource, data);
      deferred.resolve({
        name,
        items,
        data
      });
    }).fail(() => deferred.reject());
  });
  if (!deferreds.length) {
    return result.resolve(loadedResources);
  }
  _deferred.when.apply(null, deferreds).done(function () {
    for (var _len = arguments.length, resources = new Array(_len), _key = 0; _key < _len; _key++) {
      resources[_key] = arguments[_key];
    }
    const hasEmpty = resources.some(r => r.items.length === 0);
    loadedResources = hasEmpty ? [] : resources;
    result.resolve(loadedResources);
  }).fail(() => result.reject());
  return result.promise();
};
exports.loadResources = loadResources;
const getNormalizedResources = (rawAppointment, dataAccessors, resources) => {
  const result = {};
  (0, _iterator.each)(dataAccessors.resources.getter, fieldName => {
    const value = dataAccessors.resources.getter[fieldName](rawAppointment);
    if ((0, _type.isDefined)(value)) {
      const isMultiple = isResourceMultiple(resources, fieldName);
      const resourceValue = isMultiple ? (0, _array.wrapToArray)(value) : value;
      result[fieldName] = resourceValue;
    }
  });
  return result;
};
exports.getNormalizedResources = getNormalizedResources;