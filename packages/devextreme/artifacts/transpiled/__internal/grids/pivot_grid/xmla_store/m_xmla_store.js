"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.XmlaStore = void 0;
var _class = _interopRequireDefault(require("../../../../core/class"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _string = require("../../../../core/utils/string");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _errors = require("../../../../data/errors");
var _language_codes = require("../../../../localization/language_codes");
var _m_widget_utils = _interopRequireWildcard(require("../m_widget_utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const window = (0, _window.getWindow)();
const XmlaStore = exports.XmlaStore = _class.default.inherit(function () {
  const discover = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>{2}</RequestType><Restrictions><RestrictionList><CATALOG_NAME>{0}</CATALOG_NAME><CUBE_NAME>{1}</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>{0}</Catalog>{3}</PropertyList></Properties></Discover></Body></Envelope>';
  const execute = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>{0}</Statement></Command><Properties><PropertyList><Catalog>{1}</Catalog><ShowHiddenCubes>True</ShowHiddenCubes><SspropInitAppName>Microsoft SQL Server Management Studio</SspropInitAppName><Timeout>3600</Timeout>{2}</PropertyList></Properties></Execute></Body></Envelope>';
  const mdx = 'SELECT {2} FROM {0} {1} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS';
  const mdxFilterSelect = '(SELECT {0} FROM {1})';
  const mdxSubset = 'Subset({0}, {1}, {2})';
  const mdxOrder = 'Order({0}, {1}, {2})';
  const mdxWith = '{0} {1} as {2}';
  const mdxSlice = 'WHERE ({0})';
  const mdxNonEmpty = 'NonEmpty({0}, {1})';
  const mdxAxis = '{0} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON {1}';
  const mdxCrossJoin = 'CrossJoin({0})';
  const mdxSet = '{{0}}';
  const MEASURE_DEMENSION_KEY = 'DX_MEASURES';
  const MD_DIMTYPE_MEASURE = '2';
  function execXMLA(requestOptions, data) {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const {
      beforeSend
    } = requestOptions;
    const ajaxSettings = {
      url: requestOptions.url,
      dataType: 'text',
      data,
      headers: {
        'Content-Type': 'text/xml'
      },
      xhrFields: {},
      method: 'POST'
    };
    if ((0, _type.isFunction)(beforeSend)) {
      beforeSend(ajaxSettings);
    }
    _m_widget_utils.default.sendRequest(ajaxSettings).fail(function () {
      deferred.reject(arguments);
    }).done(text => {
      const parser = new window.DOMParser();
      let xml;
      try {
        try {
          // For IE
          xml = parser.parseFromString(text, 'text/xml');
        } catch (e) {
          xml = undefined;
        }
        if (!xml || xml.getElementsByTagName('parsererror').length || xml.childNodes.length === 0) {
          throw new _errors.errors.Error('E4023', text);
        }
      } catch (e) {
        deferred.reject({
          statusText: e.message,
          stack: e.stack,
          responseText: text
        });
      }
      deferred.resolve(xml);
    });
    return deferred;
  }
  function getLocaleIdProperty() {
    const languageId = (0, _language_codes.getLanguageId)();
    if (languageId !== undefined) {
      return (0, _string.format)('<LocaleIdentifier>{0}</LocaleIdentifier>', languageId);
    }
    return '';
  }
  function mdxDescendants(level, levelMember, nextLevel) {
    const memberExpression = levelMember || level;
    return `Descendants({${memberExpression}}, ${nextLevel}, SELF_AND_BEFORE)`;
  }
  function getAllMember(dimension) {
    return `${dimension.hierarchyName || dimension.dataField}.[All]`;
  }
  function getAllMembers(field) {
    let result = `${field.dataField}.allMembers`;
    let {
      searchValue
    } = field;
    if (searchValue) {
      searchValue = searchValue.replace(/'/g, '\'\'');
      result = `Filter(${result}, instr(${field.dataField}.currentmember.member_caption,'${searchValue}') > 0)`;
    }
    return result;
  }
  function crossJoinElements(elements) {
    const elementsString = elements.join(',');
    return elements.length > 1 ? (0, _string.format)(mdxCrossJoin, elementsString) : elementsString;
  }
  function union(elements) {
    const elementsString = elements.join(',');
    return elements.length > 1 ? `Union(${elementsString})` : elementsString;
  }
  function generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take) {
    const crossJoinArgs = [];
    const dimensions = options[axisName];
    const fields = [];
    let arg;
    let prevDimension;
    let member;
    for (let i = expandIndex; i <= expandLevel; i += 1) {
      const field = dimensions[i];
      const {
        dataField
      } = field;
      const prevHierarchyName = dimensions[i - 1] && dimensions[i - 1].hierarchyName;
      const {
        hierarchyName
      } = field;
      const isLastDimensionInGroup = !hierarchyName || !dimensions[i + 1] || dimensions[i + 1].hierarchyName !== hierarchyName;
      const expandAllIndex = path.length + expandAllCount + expandIndex;
      arg = null;
      fields.push(field);
      if (i < path.length) {
        if (isLastDimensionInGroup) {
          arg = `(${dataField}.${preparePathValue(path[i], dataField)})`;
        }
      } else if (i <= expandAllIndex) {
        if (i === 0 && expandAllCount === 0) {
          const allMember = getAllMember(dimensions[expandIndex]);
          if (!hierarchyName) {
            arg = getAllMembers(dimensions[expandIndex]);
          } else {
            arg = `${allMember},${dimensions[expandIndex].dataField}`;
          }
        } else if (hierarchyName) {
          member = preparePathValue(slicePath[slicePath.length - 1]);
          if (isLastDimensionInGroup || i === expandAllIndex) {
            if (prevHierarchyName === hierarchyName) {
              if (slicePath.length) {
                prevDimension = dimensions[slicePath.length - 1];
              }
              if (!prevDimension || prevDimension.hierarchyName !== hierarchyName) {
                prevDimension = dimensions[i - 1];
                member = '';
              }
              arg = mdxDescendants(prevDimension.dataField, member, dataField);
            } else {
              arg = getAllMembers(field);
            }
          }
        } else {
          arg = getAllMembers(field);
        }
      } else {
        const isFirstDimensionInGroup = !hierarchyName || prevHierarchyName !== hierarchyName;
        if (isFirstDimensionInGroup) {
          arg = `(${getAllMember(field)})`;
        }
      }
      if (arg) {
        arg = (0, _string.format)(mdxSet, arg);
        if (take) {
          const sortBy = (field.hierarchyName || field.dataField) + (field.sortBy === 'displayText' ? '.MEMBER_CAPTION' : '.MEMBER_VALUE');
          arg = (0, _string.format)(mdxOrder, arg, sortBy, field.sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        crossJoinArgs.push(arg);
      }
    }
    return crossJoinElements(crossJoinArgs);
  }
  function fillCrossJoins(crossJoins, path, expandLevel, expandIndex, slicePath, options, axisName, cellsString, take, totalsOnly) {
    let expandAllCount = -1;
    const dimensions = options[axisName];
    let dimensionIndex;
    do {
      expandAllCount += 1;
      dimensionIndex = path.length + expandAllCount + expandIndex;
      let crossJoin = generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take);
      if (!take && !totalsOnly) {
        crossJoin = (0, _string.format)(mdxNonEmpty, crossJoin, cellsString);
      }
      crossJoins.push(crossJoin);
    } while (dimensions[dimensionIndex] && dimensions[dimensionIndex + 1] && dimensions[dimensionIndex].expanded);
  }
  function declare(expression, withArray, name, type) {
    name = name || `[DX_Set_${withArray.length}]`;
    type = type || 'set';
    withArray.push((0, _string.format)(mdxWith, type, name, expression));
    return name;
  }
  function generateAxisMdx(options, axisName, cells, withArray, parseOptions) {
    const dimensions = options[axisName];
    const crossJoins = [];
    let path = [];
    let expandedPaths = [];
    let expandIndex = 0;
    let expandLevel = 0;
    const result = [];
    const cellsString = (0, _string.format)(mdxSet, cells.join(','));
    if (dimensions && dimensions.length) {
      if (options.headerName === axisName) {
        path = options.path;
        expandIndex = path.length;
      } else if (options.headerName && options.oppositePath) {
        path = options.oppositePath;
        expandIndex = path.length;
      } else {
        expandedPaths = (axisName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || expandedPaths;
      }
      expandLevel = (0, _m_widget_utils.getExpandedLevel)(options, axisName);
      fillCrossJoins(crossJoins, [], expandLevel, expandIndex, path, options, axisName, cellsString, axisName === 'rows' ? options.rowTake : options.columnTake, options.totalsOnly);
      (0, _iterator.each)(expandedPaths, (_, expandedPath) => {
        fillCrossJoins(crossJoins, expandedPath, expandLevel, expandIndex, expandedPath, options, axisName, cellsString);
      });
      for (let i = expandLevel; i >= path.length; i -= 1) {
        if (dimensions[i].hierarchyName) {
          parseOptions.visibleLevels[dimensions[i].hierarchyName] = parseOptions.visibleLevels[dimensions[i].hierarchyName] || [];
          parseOptions.visibleLevels[dimensions[i].hierarchyName].push(dimensions[i].dataField);
        }
      }
    }
    if (crossJoins.length) {
      let expression = union(crossJoins);
      if (axisName === 'rows' && options.rowTake) {
        expression = (0, _string.format)(mdxSubset, expression, options.rowSkip > 0 ? options.rowSkip + 1 : 0, options.rowSkip > 0 ? options.rowTake : options.rowTake + 1);
      }
      if (axisName === 'columns' && options.columnTake) {
        expression = (0, _string.format)(mdxSubset, expression, options.columnSkip > 0 ? options.columnSkip + 1 : 0, options.columnSkip > 0 ? options.columnTake : options.columnTake + 1);
      }
      const axisSet = `[DX_${axisName}]`;
      result.push(declare(expression, withArray, axisSet));
      if (options.totalsOnly) {
        result.push(declare(`COUNT(${axisSet})`, withArray, `[DX_${axisName}_count]`, 'member'));
      }
    }
    if (axisName === 'columns' && cells.length && !options.skipValues) {
      result.push(cellsString);
    }
    return (0, _string.format)(mdxAxis, crossJoinElements(result), axisName);
  }
  function generateAxisFieldsFilter(fields) {
    const filterMembers = [];
    (0, _iterator.each)(fields, (_, field) => {
      const {
        dataField
      } = field;
      const filterExpression = [];
      const filterValues = field.filterValues || [];
      let filterStringExpression;
      if (field.hierarchyName && (0, _type.isNumeric)(field.groupIndex)) {
        return;
      }
      (0, _iterator.each)(filterValues, (_, filterValue) => {
        let filterMdx = `${dataField}.${preparePathValue(Array.isArray(filterValue) ? filterValue[filterValue.length - 1] : filterValue, dataField)}`;
        if (field.filterType === 'exclude') {
          filterExpression.push(`${filterMdx}.parent`);
          filterMdx = `Descendants(${filterMdx})`;
        }
        filterExpression.push(filterMdx);
      });
      if (filterValues.length) {
        filterStringExpression = (0, _string.format)(mdxSet, filterExpression.join(','));
        if (field.filterType === 'exclude') {
          filterStringExpression = `Except(${getAllMembers(field)},${filterStringExpression})`;
        }
        filterMembers.push(filterStringExpression);
      }
    });
    return filterMembers.length ? crossJoinElements(filterMembers) : '';
  }
  function generateFrom(columnsFilter, rowsFilter, filter, cubeName) {
    let from = `[${cubeName}]`;
    (0, _iterator.each)([columnsFilter, rowsFilter, filter], (_, filter) => {
      if (filter) {
        from = (0, _string.format)(mdxFilterSelect, `${filter}on 0`, from);
      }
    });
    return from;
  }
  function generateMdxCore(axisStrings, withArray, columns, rows, filters, slice, cubeName) {
    let options = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
    let mdxString = '';
    const withString = `${withArray.length ? `with ${withArray.join(' ')}` : ''} `;
    if (axisStrings.length) {
      let select;
      if (options.totalsOnly) {
        const countMembers = [];
        if (rows.length) {
          countMembers.push('[DX_rows_count]');
        }
        if (columns.length) {
          countMembers.push('[DX_columns_count]');
        }
        select = `{${countMembers.join(',')}} on columns`;
      } else {
        select = axisStrings.join(',');
      }
      mdxString = withString + (0, _string.format)(mdx, generateFrom(generateAxisFieldsFilter(columns), generateAxisFieldsFilter(rows), generateAxisFieldsFilter(filters || []), cubeName), slice.length ? (0, _string.format)(mdxSlice, slice.join(',')) : '', select);
    }
    return mdxString;
  }
  function prepareDataFields(withArray, valueFields) {
    return (0, _iterator.map)(valueFields, cell => {
      if ((0, _type.isString)(cell.expression)) {
        declare(cell.expression, withArray, cell.dataField, 'member');
      }
      return cell.dataField;
    });
  }
  function addSlices(slices, options, headerName, path) {
    (0, _iterator.each)(path, (index, value) => {
      const dimension = options[headerName][index];
      if (!dimension.hierarchyName || dimension.hierarchyName !== options[headerName][index + 1].hierarchyName) {
        slices.push(`${dimension.dataField}.${preparePathValue(value, dimension.dataField)}`);
      }
    });
  }
  function generateMDX(options, cubeName, parseOptions) {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values && options.values.length ? options.values : [{
      dataField: '[Measures]'
    }];
    const slice = [];
    const withArray = [];
    const axisStrings = [];
    const dataFields = prepareDataFields(withArray, values);
    parseOptions.measureCount = options.skipValues ? 1 : values.length;
    parseOptions.visibleLevels = {};
    if (options.headerName && options.path) {
      addSlices(slice, options, options.headerName, options.path);
    }
    if (options.headerName && options.oppositePath) {
      addSlices(slice, options, options.headerName === 'rows' ? 'columns' : 'rows', options.oppositePath);
    }
    if (columns.length || dataFields.length) {
      axisStrings.push(generateAxisMdx(options, 'columns', dataFields, withArray, parseOptions));
    }
    if (rows.length) {
      axisStrings.push(generateAxisMdx(options, 'rows', dataFields, withArray, parseOptions));
    }
    return generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName, options);
  }
  function createDrillDownAxisSlice(slice, fields, path) {
    (0, _iterator.each)(path, (index, value) => {
      const field = fields[index];
      if (field.hierarchyName && (fields[index + 1] || {}).hierarchyName === field.hierarchyName) {
        return;
      }
      slice.push(`${field.dataField}.${preparePathValue(value, field.dataField)}`);
    });
  }
  function generateDrillDownMDX(options, cubeName, params) {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values && options.values.length ? options.values : [{
      dataField: '[Measures]'
    }];
    const slice = [];
    const withArray = [];
    const axisStrings = [];
    const dataFields = prepareDataFields(withArray, values);
    const {
      maxRowCount
    } = params;
    const customColumns = params.customColumns || [];
    const customColumnsString = customColumns.length > 0 ? ` return ${customColumns.join(',')}` : '';
    createDrillDownAxisSlice(slice, columns, params.columnPath || []);
    createDrillDownAxisSlice(slice, rows, params.rowPath || []);
    if (columns.length || dataFields.length) {
      axisStrings.push([`${dataFields[params.dataIndex] || dataFields[0]} on 0`]);
    }
    const coreMDX = generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName);
    return coreMDX ? `drillthrough${maxRowCount > 0 ? ` maxrows ${maxRowCount}` : ''}${coreMDX}${customColumnsString}` : coreMDX;
  }
  function getNumber(str) {
    return parseInt(str, 10);
  }
  function parseValue(valueText) {
    // @ts-expect-error
    return (0, _type.isNumeric)(valueText) ? parseFloat(valueText) : valueText;
  }
  function getFirstChild(node, tagName) {
    return (node.getElementsByTagName(tagName) || [])[0];
  }
  function getFirstChildText(node, childTagName) {
    return getNodeText(getFirstChild(node, childTagName));
  }
  function parseAxes(xml, skipValues) {
    const axes = [];
    (0, _iterator.each)(xml.getElementsByTagName('Axis'), (_, axisElement) => {
      const name = axisElement.getAttribute('name');
      const axis = [];
      let index = 0;
      if (name.indexOf('Axis') === 0 && (0, _type.isNumeric)(getNumber(name.substr(4)))) {
        axes.push(axis);
        (0, _iterator.each)(axisElement.getElementsByTagName('Tuple'), (_, tupleElement) => {
          const tupleMembers = tupleElement.childNodes;
          let levelSum = 0;
          const members = [];
          let membersCount = skipValues ? tupleMembers.length : tupleMembers.length - 1;
          const isAxisWithMeasure = axes.length === 1;
          if (isAxisWithMeasure) {
            membersCount -= 1;
          }
          axis.push(members);
          for (let i = membersCount; i >= 0; i -= 1) {
            const tuple = tupleMembers[i];
            const level = getNumber(getFirstChildText(tuple, 'LNum'));
            members[i] = {
              caption: getFirstChildText(tuple, 'Caption'),
              value: parseValue(getFirstChildText(tuple, 'MEMBER_VALUE')),
              level,
              // eslint-disable-next-line no-plusplus
              index: index++,
              hasValue: !levelSum && (!!level || i === 0),
              name: getFirstChildText(tuple, 'UName'),
              hierarchyName: tupleMembers[i].getAttribute('Hierarchy'),
              parentName: getFirstChildText(tuple, 'PARENT_UNIQUE_NAME'),
              levelName: getFirstChildText(tuple, 'LName')
            };
            levelSum += level;
          }
        });
      }
    });
    while (axes.length < 2) {
      axes.push([[{
        level: 0
      }]]);
    }
    return axes;
  }
  function getNodeText(node) {
    return node && (node.textContent || node.text || node.innerHTML) || '';
  }
  function parseCells(xml, axes, measureCount) {
    const cells = [];
    let cell = [];
    let index = 0;
    const cellsOriginal = [];
    const cellElements = xml.getElementsByTagName('Cell');
    const errorDictionary = {};
    for (let i = 0; i < cellElements.length; i += 1) {
      const xmlCell = cellElements[i];
      const valueElement = xmlCell.getElementsByTagName('Value')[0];
      const errorElements = valueElement && valueElement.getElementsByTagName('Error') || [];
      const text = errorElements.length === 0 ? getNodeText(valueElement) : '#N/A';
      const value = parseFloat(text);
      const isNumeric = text - value + 1 > 0;
      const cellOrdinal = getNumber(xmlCell.getAttribute('CellOrdinal'));
      if (errorElements.length) {
        errorDictionary[getNodeText(errorElements[0].getElementsByTagName('ErrorCode')[0])] = getNodeText(errorElements[0].getElementsByTagName('Description')[0]);
      }
      cellsOriginal[cellOrdinal] = {
        value: isNumeric ? value : text || null
      };
    }
    (0, _iterator.each)(axes[1], () => {
      const row = [];
      cells.push(row);
      (0, _iterator.each)(axes[0], () => {
        const measureIndex = index % measureCount;
        if (measureIndex === 0) {
          cell = [];
          row.push(cell);
        }
        cell.push(cellsOriginal[index] ? cellsOriginal[index].value : null);
        index += 1;
      });
    });
    Object.keys(errorDictionary).forEach(key => {
      _errors.errors.log('W4002', errorDictionary[key]);
    });
    return cells;
  }
  function preparePathValue(pathValue, dataField) {
    if (pathValue) {
      pathValue = (0, _type.isString)(pathValue) && pathValue.includes('&') ? pathValue : `[${pathValue}]`;
      if (dataField && pathValue.indexOf(`${dataField}.`) === 0) {
        pathValue = pathValue.slice(dataField.length + 1, pathValue.length);
      }
    }
    return pathValue;
  }
  function getItem(hash, name, member, index) {
    let item = hash[name];
    if (!item) {
      item = {};
      hash[name] = item;
    }
    if (!(0, _type.isDefined)(item.value) && member) {
      item.text = member.caption;
      item.value = member.value;
      item.key = name || '';
      item.levelName = member.levelName;
      item.hierarchyName = member.hierarchyName;
      item.parentName = member.parentName;
      item.index = index;
      item.level = member.level;
    }
    return item;
  }
  function getVisibleChildren(item, visibleLevels) {
    const result = [];
    const children = item.children && (item.children.length ? item.children : Object.keys(item.children.grandTotalHash || {}).reduce((result, name) => result.concat(item.children.grandTotalHash[name].children), []));
    const firstChild = children && children[0];
    if (firstChild && (visibleLevels[firstChild.hierarchyName] && visibleLevels[firstChild.hierarchyName].includes(firstChild.levelName) || !visibleLevels[firstChild.hierarchyName] || firstChild.level === 0)) {
      const newChildren = children.filter(child => child.hierarchyName === firstChild.hierarchyName);
      newChildren.grandTotalHash = children.grandTotalHash;
      return newChildren;
    }
    if (firstChild) {
      for (let i = 0; i < children.length; i += 1) {
        if (children[i].hierarchyName === firstChild.hierarchyName) {
          result.push.apply(result, getVisibleChildren(children[i], visibleLevels));
        }
      }
    }
    return result;
  }
  function processMember(dataIndex, member, parentItem) {
    let children = parentItem.children = parentItem.children || [];
    const hash = children.hash = children.hash || {};
    const grandTotalHash = children.grandTotalHash = children.grandTotalHash || {};
    if (member.parentName) {
      parentItem = getItem(hash, member.parentName);
      children = parentItem.children = parentItem.children || [];
    }
    const currentItem = getItem(hash, member.name, member, dataIndex);
    if (member.hasValue && !currentItem.added) {
      currentItem.index = dataIndex;
      currentItem.added = true;
      children.push(currentItem);
    }
    if ((!parentItem.value || !parentItem.parentName) && member.parentName) {
      grandTotalHash[member.parentName] = parentItem;
    } else if (grandTotalHash[parentItem.name]) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete grandTotalHash[member.parentName];
    }
    return currentItem;
  }
  function getGrandTotalIndex(parentItem, visibleLevels) {
    let grandTotalIndex;
    if (parentItem.children.length === 1 && parentItem.children[0].parentName === '') {
      grandTotalIndex = parentItem.children[0].index;
      // TODO - refactoring
      const {
        grandTotalHash
      } = parentItem.children;
      parentItem.children = parentItem.children[0].children || [];
      parentItem.children.grandTotalHash = grandTotalHash;
      parentItem.children = getVisibleChildren(parentItem, visibleLevels);
    } else if (parentItem.children.length === 0) {
      grandTotalIndex = 0;
    }
    return grandTotalIndex;
  }
  function fillDataSourceAxes(dataSourceAxis, axisTuples, measureCount, visibleLevels) {
    const result = [];
    (0, _iterator.each)(axisTuples, (tupleIndex, members) => {
      let parentItem = {
        children: result
      };
      const dataIndex = (0, _type.isDefined)(measureCount) ? Math.floor(tupleIndex / measureCount) : tupleIndex;
      (0, _iterator.each)(members, (_, member) => {
        parentItem = processMember(dataIndex, member, parentItem);
      });
    });
    const parentItem = {
      children: result
    };
    parentItem.children = getVisibleChildren(parentItem, visibleLevels);
    const grandTotalIndex = getGrandTotalIndex(parentItem, visibleLevels);
    (0, _m_widget_utils.foreachTree)(parentItem.children, items => {
      const item = items[0];
      const children = getVisibleChildren(item, visibleLevels);
      if (children.length) {
        item.children = children;
      } else {
        delete item.children;
      }
      delete item.levelName;
      delete item.hierarchyName;
      delete item.added;
      delete item.parentName;
      delete item.level;
    }, true);
    (0, _iterator.each)(parentItem.children || [], (_, e) => {
      dataSourceAxis.push(e);
    });
    return grandTotalIndex;
  }
  function checkError(xml) {
    const faultElementNS = xml.getElementsByTagName('soap:Fault');
    const faultElement = xml.getElementsByTagName('Fault');
    const errorElement = (0, _renderer.default)([].slice.call(faultElement.length ? faultElement : faultElementNS)).find('Error');
    if (errorElement.length) {
      const description = errorElement.attr('Description');
      const error = new _errors.errors.Error('E4000', description);
      _errors.errors.log('E4000', description);
      return error;
    }
    return null;
  }
  function parseResult(xml, parseOptions) {
    const dataSource = {
      columns: [],
      rows: []
    };
    const {
      measureCount
    } = parseOptions;
    const axes = parseAxes(xml, parseOptions.skipValues);
    dataSource.grandTotalColumnIndex = fillDataSourceAxes(dataSource.columns, axes[0], measureCount, parseOptions.visibleLevels);
    dataSource.grandTotalRowIndex = fillDataSourceAxes(dataSource.rows, axes[1], undefined, parseOptions.visibleLevels);
    dataSource.values = parseCells(xml, axes, measureCount);
    return dataSource;
  }
  function parseDiscoverRowSet(xml, schema, dimensions, translatedDisplayFolders) {
    const result = [];
    const isMeasure = schema === 'MEASURE';
    const displayFolderField = isMeasure ? 'MEASUREGROUP_NAME' : `${schema}_DISPLAY_FOLDER`;
    (0, _iterator.each)(xml.getElementsByTagName('row'), (_, row) => {
      const hierarchyName = schema === 'LEVEL' ? getFirstChildText(row, 'HIERARCHY_UNIQUE_NAME') : undefined;
      const levelNumber = getFirstChildText(row, 'LEVEL_NUMBER');
      let displayFolder = getFirstChildText(row, displayFolderField);
      if (isMeasure) {
        displayFolder = translatedDisplayFolders[displayFolder] || displayFolder;
      }
      if ((levelNumber !== '0' || getFirstChildText(row, `${schema}_IS_VISIBLE`) !== 'true') && getFirstChildText(row, 'DIMENSION_TYPE') !== MD_DIMTYPE_MEASURE) {
        const dimension = isMeasure ? MEASURE_DEMENSION_KEY : getFirstChildText(row, 'DIMENSION_UNIQUE_NAME');
        const dataField = getFirstChildText(row, `${schema}_UNIQUE_NAME`);
        result.push({
          dimension: dimensions.names[dimension] || dimension,
          groupIndex: levelNumber ? getNumber(levelNumber) - 1 : undefined,
          dataField,
          caption: getFirstChildText(row, `${schema}_CAPTION`),
          hierarchyName,
          groupName: hierarchyName,
          displayFolder,
          isMeasure,
          isDefault: !!dimensions.defaultHierarchies[dataField]
        });
      }
    });
    return result;
  }
  function parseMeasureGroupDiscoverRowSet(xml) {
    const measureGroups = {};
    (0, _iterator.each)(xml.getElementsByTagName('row'), (_, row) => {
      measureGroups[getFirstChildText(row, 'MEASUREGROUP_NAME')] = getFirstChildText(row, 'MEASUREGROUP_CAPTION');
    });
    return measureGroups;
  }
  function parseDimensionsDiscoverRowSet(xml) {
    const result = {
      names: {},
      defaultHierarchies: {}
    };
    (0, _iterator.each)((0, _renderer.default)(xml).find('row'), function () {
      const $row = (0, _renderer.default)(this);
      const type = $row.children('DIMENSION_TYPE').text();
      const dimensionName = type === MD_DIMTYPE_MEASURE ? MEASURE_DEMENSION_KEY : $row.children('DIMENSION_UNIQUE_NAME').text();
      result.names[dimensionName] = $row.children('DIMENSION_CAPTION').text();
      result.defaultHierarchies[$row.children('DEFAULT_HIERARCHY').text()] = true;
    });
    return result;
  }
  function parseStringWithUnicodeSymbols(str) {
    str = str.replace(/_x(....)_/g, (_, group1) => String.fromCharCode(parseInt(group1, 16)));
    const stringArray = str.match(/\[.+?\]/gi);
    if (stringArray && stringArray.length) {
      str = stringArray[stringArray.length - 1];
    }
    return str.replace(/\[/gi, '').replace(/\]/gi, '').replace(/\$/gi, '').replace(/\./gi, ' ');
  }
  function parseDrillDownRowSet(xml) {
    const rows = xml.getElementsByTagName('row');
    const result = [];
    const columnNames = {};
    for (let i = 0; i < rows.length; i += 1) {
      const children = rows[i].childNodes;
      const item = {};
      for (let j = 0; j < children.length; j += 1) {
        const {
          tagName
        } = children[j];
        const name = columnNames[tagName] = columnNames[tagName] || parseStringWithUnicodeSymbols(tagName);
        item[name] = getNodeText(children[j]);
      }
      result.push(item);
    }
    return result;
  }
  function sendQuery(storeOptions, mdxString) {
    mdxString = (0, _renderer.default)('<div>').text(mdxString).html();
    return execXMLA(storeOptions, (0, _string.format)(execute, mdxString, storeOptions.catalog, getLocaleIdProperty()));
  }
  function processTotalCount(data, options, totalCountXml) {
    const axes = [];
    const columnOptions = options.columns || [];
    const rowOptions = options.rows || [];
    if (columnOptions.length) {
      axes.push({});
    }
    if (rowOptions.length) {
      axes.push({});
    }
    const cells = parseCells(totalCountXml, [[{}], [{}, {}]], 1);
    if (!columnOptions.length && rowOptions.length) {
      data.rowCount = Math.max(cells[0][0][0] - 1, 0);
    }
    if (!rowOptions.length && columnOptions.length) {
      data.columnCount = Math.max(cells[0][0][0] - 1, 0);
    }
    if (rowOptions.length && columnOptions.length) {
      data.rowCount = Math.max(cells[0][0][0] - 1, 0);
      data.columnCount = Math.max(cells[1][0][0] - 1, 0);
    }
    if (data.rowCount !== undefined && options.rowTake) {
      data.rows = [...Array(options.rowSkip)].concat(data.rows);
      data.rows.length = data.rowCount;
      for (let i = 0; i < data.rows.length; i += 1) {
        data.rows[i] = data.rows[i] || {};
      }
    }
    if (data.columnCount !== undefined && options.columnTake) {
      data.columns = [...Array(options.columnSkip)].concat(data.columns);
      data.columns.length = data.columnCount;
      for (let i = 0; i < data.columns.length; i += 1) {
        data.columns[i] = data.columns[i] || {};
      }
    }
  }
  return {
    ctor(options) {
      this._options = options;
    },
    getFields() {
      const options = this._options;
      const {
        catalog
      } = options;
      const {
        cube
      } = options;
      const localeIdProperty = getLocaleIdProperty();
      const dimensionsRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, 'MDSCHEMA_DIMENSIONS', localeIdProperty));
      const measuresRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, 'MDSCHEMA_MEASURES', localeIdProperty));
      const hierarchiesRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, 'MDSCHEMA_HIERARCHIES', localeIdProperty));
      const levelsRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, 'MDSCHEMA_LEVELS', localeIdProperty));
      // @ts-expect-error
      const result = new _deferred.Deferred();
      (0, _deferred.when)(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest).then((dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) => {
        execXMLA(options, (0, _string.format)(discover, catalog, cube, 'MDSCHEMA_MEASUREGROUPS', localeIdProperty)).done(measureGroupsResponse => {
          const dimensions = parseDimensionsDiscoverRowSet(dimensionsResponse);
          const hierarchies = parseDiscoverRowSet(hierarchiesResponse, 'HIERARCHY', dimensions);
          const levels = parseDiscoverRowSet(levelsResponse, 'LEVEL', dimensions);
          const measureGroups = parseMeasureGroupDiscoverRowSet(measureGroupsResponse);
          const fields = parseDiscoverRowSet(measuresResponse, 'MEASURE', dimensions, measureGroups).concat(hierarchies);
          const levelsByHierarchy = {};
          (0, _iterator.each)(levels, (_, level) => {
            levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName] || [];
            levelsByHierarchy[level.hierarchyName].push(level);
          });
          (0, _iterator.each)(hierarchies, (_, hierarchy) => {
            if (levelsByHierarchy[hierarchy.dataField] && levelsByHierarchy[hierarchy.dataField].length > 1) {
              hierarchy.groupName = hierarchy.hierarchyName = hierarchy.dataField;
              fields.push.apply(fields, levelsByHierarchy[hierarchy.hierarchyName]);
            }
          });
          result.resolve(fields);
        }).fail(result.reject);
      }).fail(result.reject);
      return result;
    },
    load(options) {
      // @ts-expect-error
      const result = new _deferred.Deferred();
      const storeOptions = this._options;
      const parseOptions = {
        skipValues: options.skipValues
      };
      const mdxString = generateMDX(options, storeOptions.cube, parseOptions);
      let rowCountMdx;
      if (options.rowSkip || options.rowTake || options.columnTake || options.columnSkip) {
        rowCountMdx = generateMDX((0, _extend.extend)({}, options, {
          totalsOnly: true,
          rowSkip: null,
          rowTake: null,
          columnSkip: null,
          columnTake: null
        }), storeOptions.cube, {});
      }
      const load = () => {
        if (mdxString) {
          (0, _deferred.when)(sendQuery(storeOptions, mdxString), rowCountMdx && sendQuery(storeOptions, rowCountMdx)).done((executeXml, rowCountXml) => {
            const error = checkError(executeXml) || rowCountXml && checkError(rowCountXml);
            if (!error) {
              const response = parseResult(executeXml, parseOptions);
              if (rowCountXml) {
                processTotalCount(response, options, rowCountXml);
              }
              result.resolve(response);
            } else {
              result.reject(error);
            }
          }).fail(result.reject);
        } else {
          result.resolve({
            columns: [],
            rows: [],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
          });
        }
      };
      if (options.delay) {
        setTimeout(load, options.delay);
      } else {
        load();
      }
      return result;
    },
    supportPaging() {
      return true;
    },
    getDrillDownItems(options, params) {
      // @ts-expect-error
      const result = new _deferred.Deferred();
      const storeOptions = this._options;
      const mdxString = generateDrillDownMDX(options, storeOptions.cube, params);
      if (mdxString) {
        (0, _deferred.when)(sendQuery(storeOptions, mdxString)).done(executeXml => {
          const error = checkError(executeXml);
          if (!error) {
            result.resolve(parseDrillDownRowSet(executeXml));
          } else {
            result.reject(error);
          }
        }).fail(result.reject);
      } else {
        result.resolve([]);
      }
      return result;
    },
    key: _common.noop,
    filter: _common.noop
  };
}()).include(_m_widget_utils.storeDrillDownMixin);
// NOTE: Exports default object for mocks in QUnit only.
var _default = exports.default = {
  XmlaStore
};