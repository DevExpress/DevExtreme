import { getLanguageId } from '@js/common/core/localization/language_codes';
import { errors } from '@js/common/data/errors';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { format as stringFormat } from '@js/core/utils/string';
import {
  isDefined, isFunction, isNumeric, isString,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

import pivotGridUtils, {
  foreachTree,
  getExpandedLevel,
  storeDrillDownMixin,
} from '../m_widget_utils';

// Utility functions
function union(elements: any[]): string {
  const elementsString = elements.join(',');
  return elements.length > 1 ? `Union(${elementsString})` : elementsString;
}

function crossJoinElements(elements: any[]): string {
  const elementsString = elements.join(',');
  return elements.length > 1 ? stringFormat(MDX_CROSS_JOIN_TEMPLATE, elementsString) : elementsString;
}

function mdxDescendants(level: string, levelMember: string, nextLevel: string): string {
  const memberExpression = levelMember || level;
  return `Descendants({${memberExpression}}, ${nextLevel}, SELF_AND_BEFORE)`;
}

function getAllMember(dimension: any): string {
  return `${dimension.hierarchyName || dimension.dataField}.[All]`;
}

function getAllMembers(field: any): string {
  let result = `${field.dataField}.allMembers`;
  let { searchValue } = field;

  if (searchValue) {
    searchValue = searchValue.replace(/'/g, '\'\'');
    result = `Filter(${result}, instr(${field.dataField}.currentmember.member_caption,'${searchValue}') > 0)`;
  }

  return result;
}

function preparePathValue(pathValue: any, dataField?: string): any {
  if (pathValue) {
    const shouldSkipWrappingPathValue = isString(pathValue) && (
      pathValue.includes('&') || pathValue.startsWith(`${dataField}.`)
    );
    pathValue = shouldSkipWrappingPathValue ? pathValue : `[${pathValue}]`;

    if (dataField && pathValue.indexOf(`${dataField}.`) === 0) {
      pathValue = pathValue.slice(dataField.length + 1, pathValue.length);
    }
  }
  return pathValue;
}

function getNumber(str: string): number {
  return parseInt(str, 10);
}

function parseValue(valueText: string): any {
  return isNumeric(valueText) ? parseFloat(valueText) : valueText;
}

function getFirstChild(node: any, tagName: string): any {
  return (node.getElementsByTagName(tagName) || [])[0];
}

function getFirstChildText(node: any, childTagName: string): string {
  return getNodeText(getFirstChild(node, childTagName));
}

function getNodeText(node: any): string {
  return node && (node.textContent || node.text || node.innerHTML) || '';
}

function parseStringWithUnicodeSymbols(str: string): string {
  str = str.replace(/_x(....)_/g, (_, group1) => String.fromCharCode(parseInt(group1, 16)));

  const stringArray = str.match(/\[.+?\]/gi);
  if (stringArray && stringArray.length) {
    str = stringArray[stringArray.length - 1];
  }

  return str
    .replace(/\[/gi, '')
    .replace(/\]/gi, '')
    .replace(/\$/gi, '')
    .replace(/\./gi, ' ');
}

function getLocaleIdProperty(): string {
  const languageId = getLanguageId();

  if (languageId !== undefined) {
    return stringFormat('<LocaleIdentifier>{0}</LocaleIdentifier>', languageId);
  }
  return '';
}

// Constants
const window = getWindow();

const XMLA_DISCOVER_TEMPLATE = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>{2}</RequestType><Restrictions><RestrictionList><CATALOG_NAME>{0}</CATALOG_NAME><CUBE_NAME>{1}</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>{0}</Catalog>{3}</PropertyList></Properties></Discover></Body></Envelope>';

const XMLA_EXECUTE_TEMPLATE = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>{0}</Statement></Command><Properties><PropertyList><Catalog>{1}</Catalog><ShowHiddenCubes>True</ShowHiddenCubes><SspropInitAppName>Microsoft SQL Server Management Studio</SspropInitAppName><Timeout>3600</Timeout>{2}</PropertyList></Properties></Execute></Body></Envelope>';

const MDX_SELECT_TEMPLATE = 'SELECT {2} FROM {0} {1} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS';

const MDX_FILTER_SELECT_TEMPLATE = '(SELECT {0} FROM {1})';

const MDX_SUBSET_TEMPLATE = 'Subset({0}, {1}, {2})';

const MDX_ORDER_TEMPLATE = 'Order({0}, {1}, {2})';

const MDX_WITH_TEMPLATE = '{0} {1} as {2}';

const MDX_SLICE_TEMPLATE = 'WHERE ({0})';

const MDX_NON_EMPTY_TEMPLATE = 'NonEmpty({0}, {1})';

const MDX_AXIS_TEMPLATE = '{0} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON {1}';

const MDX_CROSS_JOIN_TEMPLATE = 'CrossJoin({0})';

const MDX_SET_TEMPLATE = '{{0}}';

const MEASURE_DIMENSION_KEY = 'DX_MEASURES';

const MD_DIMTYPE_MEASURE = '2';

class XmlaStore {
  _options: any;

  constructor(options: any) {
    this._options = options;
  }

  key() {
    noop();
  }

  filter() {
    noop();
  }

  execXMLA(requestOptions, data) {
    // @ts-expect-error
    const deferred = new Deferred();
    const { beforeSend } = requestOptions;
    const ajaxSettings = {
      url: requestOptions.url,
      dataType: 'text',
      data,
      headers: {
        'Content-Type': 'text/xml',
      },
      xhrFields: {
      },
      method: 'POST',
    };

    if (isFunction(beforeSend)) {
      beforeSend(ajaxSettings);
    }

    pivotGridUtils.sendRequest(ajaxSettings).fail(function () {
      deferred.reject(arguments);
    }).done((text) => {
      const parser = new (window as any).DOMParser();
      let xml;

      try {
        try { // For IE
          xml = parser.parseFromString(text, 'text/xml');
        } catch (e) {
          xml = undefined;
        }
        if (!xml || xml.getElementsByTagName('parsererror').length || xml.childNodes.length === 0) {
          throw errors.Error('E4023', text);
        }
      } catch (e: any) {
        deferred.reject({
          statusText: e.message,
          stack: e.stack,
          responseText: text,
        });
      }

      deferred.resolve(xml);
    });
    return deferred;
  }

  generateCrossJoin(
    path,
    expandLevel,
    expandAllCount,
    expandIndex,
    slicePath,
    options,
    axisName,
    take,
  ) {
    const crossJoinArgs: any = [];
    const dimensions = options[axisName];
    const fields: any = [];
    let arg;
    let prevDimension;
    let member;

    for (let i = expandIndex; i <= expandLevel; i += 1) {
      const field = dimensions[i];
      const { dataField } = field;
      const prevHierarchyName = dimensions[i - 1] && dimensions[i - 1].hierarchyName;
      const { hierarchyName } = field;
      const isLastDimensionInGroup = !hierarchyName
        || !dimensions[i + 1]
        || dimensions[i + 1].hierarchyName !== hierarchyName;
      const expandAllIndex = path.length + expandAllCount + expandIndex;
      arg = null;

      fields.push(field);

      if (i < path.length) {
        if (isLastDimensionInGroup) {
          const pathValue = path[i];
          if (hierarchyName && isString(pathValue) && pathValue.startsWith(`${hierarchyName}.`)) {
            arg = `(${pathValue})`;
          } else {
            arg = `(${dataField}.${preparePathValue(pathValue, dataField)})`;
          }
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
        arg = stringFormat(MDX_SET_TEMPLATE, arg);
        if (take) {
          const sortBy = (field.hierarchyName || field.dataField) + (field.sortBy === 'displayText' ? '.MEMBER_CAPTION' : '.MEMBER_VALUE');
          arg = stringFormat(MDX_ORDER_TEMPLATE, arg, sortBy, field.sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        crossJoinArgs.push(arg);
      }
    }

    return crossJoinElements(crossJoinArgs);
  }

  fillCrossJoins(
    crossJoins,
    path,
    expandLevel,
    expandIndex,
    slicePath,
    options,
    axisName,
    cellsString,
    take?,
    totalsOnly?,
  ) {
    let expandAllCount = -1;
    const dimensions = options[axisName];
    let dimensionIndex;

    do {
      expandAllCount += 1;
      dimensionIndex = path.length + expandAllCount + expandIndex;
      let crossJoin = this.generateCrossJoin(
        path,
        expandLevel,
        expandAllCount,
        expandIndex,
        slicePath,
        options,
        axisName,
        take,
      );
      if (!take && !totalsOnly) {
        crossJoin = stringFormat(MDX_NON_EMPTY_TEMPLATE, crossJoin, cellsString);
      }
      crossJoins.push(crossJoin);
    } while (
      dimensions[dimensionIndex]
      && dimensions[dimensionIndex + 1]
      && dimensions[dimensionIndex].expanded
    );
  }

  declare(expression, withArray, name?, type?) {
    name = name || `[DX_Set_${withArray.length}]`;
    type = type || 'set';

    withArray.push(stringFormat(MDX_WITH_TEMPLATE, type, name, expression));
    return name;
  }

  generateAxisMdx(options, axisName, cells, withArray, parseOptions) {
    const dimensions = options[axisName];
    const crossJoins = [];
    let path = [];
    let expandedPaths = [];
    let expandIndex = 0;
    let expandLevel = 0;
    const result: any = [];
    const cellsString = stringFormat(MDX_SET_TEMPLATE, cells.join(','));

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
      expandLevel = getExpandedLevel(options, axisName);

      this.fillCrossJoins(crossJoins, [], expandLevel, expandIndex, path, options, axisName, cellsString, axisName === 'rows' ? options.rowTake : options.columnTake, options.totalsOnly);
      each(expandedPaths, (_, expandedPath) => {
        this.fillCrossJoins(
          crossJoins,
          expandedPath,
          expandLevel,
          expandIndex,
          expandedPath,
          options,
          axisName,
          cellsString,
        );
      });

      for (let i = expandLevel; i >= path.length; i -= 1) {
        if (dimensions[i].hierarchyName) {
          parseOptions.visibleLevels[
            dimensions[i].hierarchyName
          ] = parseOptions.visibleLevels[dimensions[i].hierarchyName] || [];
          parseOptions.visibleLevels[dimensions[i].hierarchyName]
            .push(dimensions[i].dataField);
        }
      }
    }

    if (crossJoins.length) {
      let expression = union(crossJoins);
      if (axisName === 'rows' && options.rowTake) {
        expression = stringFormat(
          MDX_SUBSET_TEMPLATE,
          expression,
          options.rowSkip > 0
            ? options.rowSkip + 1
            : 0,
          options.rowSkip > 0
            ? options.rowTake
            : options.rowTake + 1,
        );
      }
      if (axisName === 'columns' && options.columnTake) {
        expression = stringFormat(
          MDX_SUBSET_TEMPLATE,
          expression,
          options.columnSkip > 0
            ? options.columnSkip + 1
            : 0,
          options.columnSkip > 0
            ? options.columnTake
            : options.columnTake + 1,
        );
      }

      const axisSet = `[DX_${axisName}]`;
      result.push(this.declare(expression, withArray, axisSet));

      if (options.totalsOnly) {
        result.push(this.declare(`COUNT(${axisSet})`, withArray, `[DX_${axisName}_count]`, 'member'));
      }
    }

    if (axisName === 'columns' && cells.length && !options.skipValues) {
      result.push(cellsString);
    }

    return stringFormat(MDX_AXIS_TEMPLATE, crossJoinElements(result), axisName);
  }

  generateAxisFieldsFilter(fields) {
    const filterMembers: any = [];

    each(fields, (_, field) => {
      const { dataField } = field;
      const filterExpression: any = [];
      const filterValues = field.filterValues || [];
      let filterStringExpression;

      if (field.hierarchyName && isNumeric(field.groupIndex)) {
        return;
      }

      each(filterValues, (_, filterValue) => {
        let filterMdx = `${dataField}.${preparePathValue(Array.isArray(filterValue) ? filterValue[filterValue.length - 1] : filterValue, dataField)}`;
        if (field.filterType === 'exclude') {
          filterExpression.push(`${filterMdx}.parent`);
          filterMdx = `Descendants(${filterMdx})`;
        }

        filterExpression.push(filterMdx);
      });

      if (filterValues.length) {
        filterStringExpression = stringFormat(MDX_SET_TEMPLATE, filterExpression.join(','));

        if (field.filterType === 'exclude') {
          filterStringExpression = `Except(${getAllMembers(field)},${filterStringExpression})`;
        }

        filterMembers.push(filterStringExpression);
      }
    });

    return filterMembers.length ? crossJoinElements(filterMembers) : '';
  }

  generateFrom(columnsFilter, rowsFilter, filter, cubeName) {
    let from = `[${cubeName}]`;

    each([columnsFilter, rowsFilter, filter], (_, filter) => {
      if (filter) {
        from = stringFormat(MDX_FILTER_SELECT_TEMPLATE, `${filter}on 0`, from);
      }
    });

    return from;
  }

  generateMdxCore(
    axisStrings,
    withArray,
    columns,
    rows,
    filters,
    slice,
    cubeName,
    options: any = {},
  ) {
    let mdxString = '';
    const withString = `${withArray.length ? `with ${withArray.join(' ')}` : ''} `;

    if (axisStrings.length) {
      let select;
      if (options.totalsOnly) {
        const countMembers: any = [];
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
      mdxString = withString + stringFormat(
        MDX_SELECT_TEMPLATE,
        this.generateFrom(
          this.generateAxisFieldsFilter(columns),
          this.generateAxisFieldsFilter(rows),
          this.generateAxisFieldsFilter(filters || []),
          cubeName,
        ),
        slice.length ? stringFormat(MDX_SLICE_TEMPLATE, slice.join(',')) : '',
        select,
      );
    }

    return mdxString;
  }

  prepareDataFields(withArray, valueFields) {
    return map(valueFields, (cell) => {
      if (isString(cell.expression)) {
        this.declare(cell.expression, withArray, cell.dataField, 'member');
      }
      return cell.dataField;
    });
  }

  addSlices(slices, options, headerName, path) {
    each(path, (index: number, value) => {
      const dimension = options[headerName][index];
      if (
        !dimension.hierarchyName
        || dimension.hierarchyName !== options[headerName][index + 1]
          .hierarchyName
      ) {
        const { hierarchyName } = dimension;
        if (hierarchyName && isString(value) && value.startsWith(`${hierarchyName}.`)) {
          slices.push(value);
        } else {
          slices.push(`${dimension.dataField}.${this.preparePathValue(value, dimension.dataField)}`);
        }
      }
    });
  }

  generateMDX(options, cubeName, parseOptions) {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values && options.values.length ? options.values : [{ dataField: '[Measures]' }];
    const slice = [];
    const withArray = [];
    const axisStrings: any = [];
    const dataFields = this.prepareDataFields(withArray, values);

    parseOptions.measureCount = options.skipValues ? 1 : values.length;
    parseOptions.visibleLevels = {};

    if (options.headerName && options.path) {
      this.addSlices(slice, options, options.headerName, options.path);
    }

    if (options.headerName && options.oppositePath) {
      this.addSlices(slice, options, options.headerName === 'rows' ? 'columns' : 'rows', options.oppositePath);
    }

    if (columns.length || dataFields.length) {
      axisStrings.push(this.generateAxisMdx(options, 'columns', dataFields, withArray, parseOptions));
    }

    if (rows.length) {
      axisStrings.push(this.generateAxisMdx(options, 'rows', dataFields, withArray, parseOptions));
    }

    return this.generateMdxCore(
      axisStrings,
      withArray,
      columns,
      rows,
      options.filters,
      slice,
      cubeName,
      options,
    );
  }

  createDrillDownAxisSlice(slice, fields, path) {
    each(path, (index: number, value) => {
      const field = fields[index];
      if (field.hierarchyName && (fields[index + 1] || {}).hierarchyName === field.hierarchyName) {
        return;
      }
      const { hierarchyName } = field;
      if (hierarchyName && isString(value) && value.startsWith(`${hierarchyName}.`)) {
        slice.push(value);
      } else {
        slice.push(`${field.dataField}.${this.preparePathValue(value, field.dataField)}`);
      }
    });
  }

  generateDrillDownMDX(options, cubeName, params) {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values && options.values.length ? options.values : [{ dataField: '[Measures]' }];
    const slice: any = [];
    const withArray: any = [];
    const axisStrings: any = [];
    const dataFields = this.prepareDataFields(withArray, values);
    const { maxRowCount } = params;
    const customColumns = params.customColumns || [];
    const customColumnsString = customColumns.length > 0 ? ` return ${customColumns.join(',')}` : '';

    this.createDrillDownAxisSlice(slice, columns, params.columnPath || []);

    this.createDrillDownAxisSlice(slice, rows, params.rowPath || []);

    if (columns.length || dataFields.length) {
      axisStrings.push([`${dataFields[params.dataIndex] || dataFields[0]} on 0`]);
    }

    const coreMDX = this.generateMdxCore(
      axisStrings,
      withArray,
      columns,
      rows,
      options.filters,
      slice,
      cubeName,
    );

    return coreMDX ? `drillthrough${maxRowCount > 0 ? ` maxrows ${maxRowCount}` : ''}${coreMDX}${customColumnsString}` : coreMDX;
  }

  parseAxes(xml, skipValues) {
    const axes: any = [];

    each(xml.getElementsByTagName('Axis'), (_, axisElement) => {
      const name = axisElement.getAttribute('name');
      const axis: any = [];
      let index = 0;

      if (name.indexOf('Axis') === 0 && isNumeric(getNumber(name.substr(4)))) {
        axes.push(axis);

        each(axisElement.getElementsByTagName('Tuple'), (_, tupleElement) => {
          const tupleMembers = tupleElement.childNodes;
          let levelSum = 0;
          const members: any = [];
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
              levelName: getFirstChildText(tuple, 'LName'),
            };

            levelSum += level;
          }
        });
      }
    });

    while (axes.length < 2) {
      axes.push([[{
        level: 0,
      }]]);
    }

    return axes;
  }

  getNodeText(node) {
    return getNodeText(node);
  }

  parseCells(xml, axes, measureCount) {
    const cells: any = [];
    let cell: any = [];
    let index = 0;
    const cellsOriginal: any = [];
    const cellElements = xml.getElementsByTagName('Cell');
    const errorDictionary = {};

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < cellElements.length; i += 1) {
      const xmlCell = cellElements[i];
      const valueElement = xmlCell.getElementsByTagName('Value')[0];
      const errorElements = valueElement && valueElement.getElementsByTagName('Error') || [];
      const text = errorElements.length === 0 ? this.getNodeText(valueElement) : '#N/A';
      const value = parseFloat(text);
      const cellOrdinal = getNumber(xmlCell.getAttribute('CellOrdinal'));

      if (errorElements.length) {
        errorDictionary[this.getNodeText(errorElements[0].getElementsByTagName('ErrorCode')[0])] = this.getNodeText(errorElements[0].getElementsByTagName('Description')[0]);
      }

      cellsOriginal[cellOrdinal] = {
        value: isNumeric(text) ? value : text || null,
      };
    }

    each(axes[1], () => {
      const row: any = [];
      cells.push(row);
      each(axes[0], () => {
        const measureIndex = index % measureCount;

        if (measureIndex === 0) {
          cell = [];
          row.push(cell);
        }

        cell.push(cellsOriginal[index] ? cellsOriginal[index].value : null);
        index += 1;
      });
    });

    Object.keys(errorDictionary).forEach((key) => {
      errors.log('W4002', errorDictionary[key]);
    });

    return cells;
  }

  preparePathValue(pathValue, dataField?) {
    return preparePathValue(pathValue, dataField);
  }

  getItem(hash, name, member?, index?) {
    let item = hash[name];

    if (!item) {
      item = {};
      hash[name] = item;
    }

    if (!isDefined(item.value) && member) {
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

  getVisibleChildren(item, visibleLevels) {
    const result = [];
    const children = item.children
      && (item.children.length
        ? item.children
        : Object.keys(item.children.grandTotalHash || {})
          .reduce((result, name) => result
            .concat(item.children.grandTotalHash[name].children), [])
      );
    const firstChild = children && children[0];

    if (firstChild && (visibleLevels[firstChild.hierarchyName]
      && visibleLevels[firstChild.hierarchyName]
        .includes(firstChild.levelName)
      || !visibleLevels[firstChild.hierarchyName]
      || firstChild.level === 0)) {
      const newChildren = children
        .filter((child) => child.hierarchyName === firstChild.hierarchyName);
      newChildren.grandTotalHash = children.grandTotalHash;
      return newChildren;
    } if (firstChild) {
      for (let i = 0; i < children.length; i += 1) {
        if (children[i].hierarchyName === firstChild.hierarchyName) {
          result.push.apply(result, this.getVisibleChildren(children[i], visibleLevels));
        }
      }
    }
    return result;
  }

  processMember(dataIndex, member, parentItem) {
    let children = parentItem.children = parentItem.children || [];
    const hash = children.hash = children.hash || {};
    const grandTotalHash = children.grandTotalHash = children.grandTotalHash || {};

    if (member.parentName) {
      parentItem = this.getItem(hash, member.parentName);
      children = parentItem.children = parentItem.children || [];
    }

    const currentItem = this.getItem(hash, member.name, member, dataIndex);

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

  getGrandTotalIndex(parentItem, visibleLevels) {
    let grandTotalIndex;
    if (parentItem.children.length === 1 && parentItem.children[0].parentName === '') {
      grandTotalIndex = parentItem.children[0].index;
      // TODO - refactoring
      const { grandTotalHash } = parentItem.children;
      parentItem.children = parentItem.children[0].children || [];

      parentItem.children.grandTotalHash = grandTotalHash;

      parentItem.children = this.getVisibleChildren(parentItem, visibleLevels);
    } else if (parentItem.children.length === 0) {
      grandTotalIndex = 0;
    }

    return grandTotalIndex;
  }

  fillDataSourceAxes(dataSourceAxis, axisTuples, measureCount, visibleLevels) {
    const result = [];

    each(axisTuples, (tupleIndex, members) => {
      let parentItem = {
        children: result,
      };
      const dataIndex = isDefined(measureCount)
        ? Math.floor(tupleIndex as number / measureCount)
        : tupleIndex;

      each(members, (_, member) => {
        parentItem = this.processMember(dataIndex, member, parentItem);
      });
    });

    const parentItem = {
      children: result,
    };

    parentItem.children = this.getVisibleChildren(parentItem, visibleLevels);

    const grandTotalIndex = this.getGrandTotalIndex(parentItem, visibleLevels);

    foreachTree(parentItem.children, (items) => {
      const item = items[0];
      const children = this.getVisibleChildren(item, visibleLevels);

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

    each(parentItem.children || [], (_, e) => {
      dataSourceAxis.push(e);
    });

    return grandTotalIndex;
  }

  checkError(xml) {
    const faultElementNS = xml.getElementsByTagName('soap:Fault');
    const faultElement = xml.getElementsByTagName('Fault');
    const errorElement = $(([] as any).slice.call(faultElement.length ? faultElement : faultElementNS)).find('Error');

    if (errorElement.length) {
      const description = errorElement.attr('Description');
      const error = errors.Error('E4000', description);
      errors.log('E4000', description);
      return error;
    }
    return null;
  }

  parseResult(xml, parseOptions) {
    const dataSource: any = {
      columns: [],
      rows: [],
    };

    const { measureCount } = parseOptions;

    const axes = this.parseAxes(xml, parseOptions.skipValues);

    dataSource.grandTotalColumnIndex = this.fillDataSourceAxes(
      dataSource.columns,
      axes[0],
      measureCount,
      parseOptions.visibleLevels,
    );

    dataSource.grandTotalRowIndex = this.fillDataSourceAxes(
      dataSource.rows,
      axes[1],
      undefined,
      parseOptions.visibleLevels,
    );

    dataSource.values = this.parseCells(xml, axes, measureCount);

    return dataSource;
  }

  parseDiscoverRowSet(xml, schema, dimensions, translatedDisplayFolders?) {
    const result: any = [];
    const isMeasure = schema === 'MEASURE';
    const displayFolderField = isMeasure ? 'MEASUREGROUP_NAME' : `${schema}_DISPLAY_FOLDER`;

    each(xml.getElementsByTagName('row'), (_, row) => {
      const hierarchyName = schema === 'LEVEL' ? getFirstChildText(row, 'HIERARCHY_UNIQUE_NAME') : undefined;
      const levelNumber = getFirstChildText(row, 'LEVEL_NUMBER');
      let displayFolder = getFirstChildText(row, displayFolderField);

      if (isMeasure) {
        displayFolder = translatedDisplayFolders[displayFolder] || displayFolder;
      }

      if ((levelNumber !== '0' || getFirstChildText(row, `${schema}_IS_VISIBLE`) !== 'true') && (getFirstChildText(row, 'DIMENSION_TYPE') !== MD_DIMTYPE_MEASURE)) {
        const dimension = isMeasure ? MEASURE_DIMENSION_KEY : getFirstChildText(row, 'DIMENSION_UNIQUE_NAME');
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
          isDefault: !!dimensions.defaultHierarchies[dataField],
        });
      }
    });

    return result;
  }

  parseMeasureGroupDiscoverRowSet(xml) {
    const measureGroups = {};
    each(xml.getElementsByTagName('row'), (_, row) => {
      measureGroups[getFirstChildText(row, 'MEASUREGROUP_NAME')] = getFirstChildText(row, 'MEASUREGROUP_CAPTION');
    });
    return measureGroups;
  }

  parseDimensionsDiscoverRowSet(xml) {
    const result = {
      names: {},
      defaultHierarchies: {},
    };

    each($(xml).find('row'), function () {
      const $row = $(this);
      const type = $row.children('DIMENSION_TYPE').text();
      const dimensionName = type === MD_DIMTYPE_MEASURE ? MEASURE_DIMENSION_KEY : $row.children('DIMENSION_UNIQUE_NAME').text();

      result.names[dimensionName] = $row.children('DIMENSION_CAPTION').text();
      result.defaultHierarchies[$row.children('DEFAULT_HIERARCHY').text()] = true;
    });
    return result;
  }

  parseStringWithUnicodeSymbols(str) {
    return parseStringWithUnicodeSymbols(str);
  }

  parseDrillDownRowSet(xml) {
    const rows = xml.getElementsByTagName('row');
    const result: any = [];
    const columnNames: any = {};

    for (let i = 0; i < rows.length; i += 1) {
      const children = rows[i].childNodes;
      const item = {};

      for (let j = 0; j < children.length; j += 1) {
        const { tagName } = children[j];
        const name = columnNames[tagName] = columnNames[tagName]
          || this.parseStringWithUnicodeSymbols(tagName);
        item[name] = this.getNodeText(children[j]);
      }
      result.push(item);
    }

    return result;
  }

  sendQuery(storeOptions, mdxString) {
    mdxString = ($('<div>') as any).text(mdxString).html();
    return this.execXMLA(
      storeOptions,
      stringFormat(XMLA_EXECUTE_TEMPLATE, mdxString, storeOptions.catalog, getLocaleIdProperty()),
    );
  }

  processTotalCount(data, options, totalCountXml) {
    const axes: any = [];
    const columnOptions = options.columns || [];
    const rowOptions = options.rows || [];

    if (columnOptions.length) {
      axes.push({});
    }
    if (rowOptions.length) {
      axes.push({});
    }
    const cells = this.parseCells(totalCountXml, [[{}], [{}, {}]], 1);
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

  getFields() {
    const options = this._options;
    const { catalog } = options;
    const { cube } = options;
    const localeIdProperty = getLocaleIdProperty();
    const dimensionsRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_DIMENSIONS', localeIdProperty));
    const measuresRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_MEASURES', localeIdProperty));
    const hierarchiesRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_HIERARCHIES', localeIdProperty));
    const levelsRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_LEVELS', localeIdProperty));
    // @ts-expect-error
    const result = new Deferred();

    when(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest)
      .then((dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) => {
        this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_MEASUREGROUPS', localeIdProperty))
          .done((measureGroupsResponse) => {
            const dimensions = this.parseDimensionsDiscoverRowSet(dimensionsResponse);
            const hierarchies = this.parseDiscoverRowSet(hierarchiesResponse, 'HIERARCHY', dimensions);
            const levels = this.parseDiscoverRowSet(levelsResponse, 'LEVEL', dimensions);
            const measureGroups = this.parseMeasureGroupDiscoverRowSet(measureGroupsResponse);
            const fields = this.parseDiscoverRowSet(measuresResponse, 'MEASURE', dimensions, measureGroups)
              .concat(hierarchies);
            const levelsByHierarchy = {};

            each(levels, (_, level) => {
              levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName]
                || [];
              levelsByHierarchy[level.hierarchyName].push(level);
            });

            each(hierarchies, (_, hierarchy) => {
              if (levelsByHierarchy[hierarchy.dataField]
                && levelsByHierarchy[hierarchy.dataField].length > 1) {
                hierarchy.groupName = hierarchy.hierarchyName = hierarchy.dataField;

                fields.push.apply(fields, levelsByHierarchy[hierarchy.hierarchyName]);
              }
            });
            result.resolve(fields);
          }).fail(result.reject);
      }).fail(result.reject);

    return result;
  }

  load(options) {
    // @ts-expect-error
    const result = new Deferred();
    const storeOptions = this._options;
    const parseOptions = {
      skipValues: options.skipValues,
    };
    const mdxString = this.generateMDX(options, storeOptions.cube, parseOptions);

    let rowCountMdx;
    if (options.rowSkip || options.rowTake || options.columnTake || options.columnSkip) {
      rowCountMdx = this.generateMDX(extend({}, options, {
        totalsOnly: true,
        rowSkip: null,
        rowTake: null,
        columnSkip: null,
        columnTake: null,
      }), storeOptions.cube, {});
    }

    const load = () => {
      if (mdxString) {
        when(
          this.sendQuery(storeOptions, mdxString),
          rowCountMdx && this.sendQuery(storeOptions, rowCountMdx),
        )
          .done((executeXml, rowCountXml) => {
            const error = this.checkError(executeXml) || rowCountXml && this.checkError(rowCountXml);
            if (!error) {
              const response = this.parseResult(executeXml, parseOptions);
              if (rowCountXml) {
                this.processTotalCount(response, options, rowCountXml);
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
          grandTotalRowIndex: 0,
        });
      }
    };

    if (options.delay) {
      setTimeout(load, options.delay);
    } else {
      load();
    }

    return result;
  }

  supportPaging() {
    return true;
  }

  getDrillDownItems(options, params) {
    // @ts-expect-error
    const result = new Deferred();
    const storeOptions = this._options;
    const mdxString = this.generateDrillDownMDX(options, storeOptions.cube, params);

    if (mdxString) {
      when(this.sendQuery(storeOptions, mdxString)).done((executeXml) => {
        const error = this.checkError(executeXml);

        if (!error) {
          result.resolve(this.parseDrillDownRowSet(executeXml));
        } else {
          result.reject(error);
        }
      }).fail(result.reject);
    } else {
      result.resolve([]);
    }
    return result;
  }
}

// Apply storeDrillDownMixin methods to XmlaStore prototype
Object.assign(XmlaStore.prototype, storeDrillDownMixin);

// NOTE: Exports default object for mocks in QUnit only.
export default { XmlaStore };
export { XmlaStore };
