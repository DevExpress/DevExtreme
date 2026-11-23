import { getLanguageId } from '@js/common/core/localization/language_codes';
import { errors } from '@js/common/data/errors';
import type { ScalarFilterValue } from '@js/common/grids';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { format as stringFormat } from '@js/core/utils/string';
import {
  isDefined, isFunction, isNumeric, isString,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { XmlaStoreOptions } from '@js/ui/pivot_grid/xmla_store';
import type { DxError } from '@ts/core/utils/error';
import type {
  DrillDownParams,
  PivotGridAxis,
  PivotGridFilterValue,
} from '@ts/grids/pivot_grid/types';

import pivotGridUtils, {
  foreachTree,
  getExpandedLevel,
  storeDrillDownMixin,
} from '../widget_utils';
import type {
  XmlaAxisMember,
  XmlaCellValue,
  XmlaDimensions,
  XmlaDiscoveredField,
  XmlaField,
  XmlaHeaderItem,
  XmlaHeaderItems,
  XmlaLoadOptions,
  XmlaLoadResult,
  XmlaMdxOptions,
  XmlaNode,
  XmlaParseOptions,
  XmlaVisibleLevels,
} from './types';

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

// Utility functions
function union(elements: string[]): string {
  const elementsString = elements.join(',');
  return elements.length > 1 ? `Union(${elementsString})` : elementsString;
}

function crossJoinElements(elements: string[]): string {
  const elementsString = elements.join(',');
  return elements.length > 1
    ? stringFormat(MDX_CROSS_JOIN_TEMPLATE, elementsString)
    : elementsString;
}

function mdxDescendants(
  level: string | undefined,
  levelMember: ScalarFilterValue | undefined,
  nextLevel: string | undefined,
): string {
  const memberExpression = levelMember || level;
  return `Descendants({${memberExpression}}, ${nextLevel}, SELF_AND_BEFORE)`;
}

function getAllMember(dimension: XmlaField): string {
  return `${dimension.hierarchyName || dimension.dataField}.[All]`;
}

function getAllMembers(field: XmlaField): string {
  let result = `${field.dataField}.allMembers`;
  let { searchValue } = field;

  if (searchValue) {
    searchValue = searchValue.replace(/'/g, '\'\'');
    result = `Filter(${result}, instr(${field.dataField}.currentmember.member_caption,'${searchValue}') > 0)`;
  }

  return result;
}

function preparePathValue(
  pathValue: ScalarFilterValue | undefined,
  dataField?: string,
): ScalarFilterValue | undefined {
  if (!pathValue) {
    return pathValue;
  }

  const shouldSkipWrappingPathValue = isString(pathValue) && (
    pathValue.includes('&') || pathValue.startsWith(`${dataField}.`)
  );
  const wrappedPathValue = shouldSkipWrappingPathValue ? pathValue : `[${pathValue}]`;

  if (dataField && wrappedPathValue.startsWith(`${dataField}.`)) {
    return wrappedPathValue.slice(dataField.length + 1, wrappedPathValue.length);
  }
  return wrappedPathValue;
}

function getNumber(str: string): number {
  return parseInt(str, 10);
}

function parseValue(valueText: string): number | string {
  return isNumeric(valueText) ? parseFloat(valueText) : valueText;
}

function getFirstChild(node: Element, tagName: string): Element | undefined {
  return (node.getElementsByTagName(tagName) || [])[0];
}

function getNodeText(node: XmlaNode | undefined): string {
  return (node && (node.textContent || node.text || node.innerHTML)) || '';
}

function getFirstChildText(node: Element, childTagName: string): string {
  return getNodeText(getFirstChild(node, childTagName));
}

function parseStringWithUnicodeSymbols(str: string): string {
  let parsedString = str.replace(
    /_x(....)_/g,
    (_, group1: string) => String.fromCharCode(parseInt(group1, 16)),
  );

  const stringArray = parsedString.match(/\[.+?\]/gi);
  if (stringArray?.length) {
    parsedString = stringArray[stringArray.length - 1];
  }

  return parsedString
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

class XmlaStore {
  public _options: XmlaStoreOptions;

  constructor(options: XmlaStoreOptions) {
    this._options = options;
  }

  public key(): void {
    noop();
  }

  public filter(): void {
    noop();
  }

  public execXMLA(requestOptions: XmlaStoreOptions, data: string): DeferredObj<Document> {
    const deferred = Deferred<Document>();
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

    pivotGridUtils.sendRequest(ajaxSettings).fail(function rejectWithArguments() {
      // @ts-expect-error reject() gets the error, but is typed with the resolve value
      // eslint-disable-next-line prefer-rest-params -- rejects with the arguments object itself
      deferred.reject(arguments);
    // @ts-expect-error sendRequest() resolves with unknown, and dataType 'text' gives a string
    }).done((text: string) => {
      // @ts-expect-error getWindow() returns Window, which doesn't declare DOMParser
      const parser: DOMParser = new window.DOMParser();
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the try/catch
      let xml: Document | undefined;

      try {
        try { // For IE
          xml = parser.parseFromString(text, 'text/xml');
        } catch (e) {
          xml = undefined;
        }
        if (!xml || xml.getElementsByTagName('parsererror').length || xml.childNodes.length === 0) {
          throw errors.Error('E4023', text);
        }
      } catch (e: unknown) {
        deferred.reject({
          // @ts-expect-error reject() gets the error, but is typed with the resolve value
          statusText: (e as Error).message,
          stack: (e as Error).stack,
          responseText: text,
        });
      }

      if (xml) {
        deferred.resolve(xml);
      }
    });
    return deferred;
  }

  public generateCrossJoin(
    path: ScalarFilterValue[],
    expandLevel: number,
    expandAllCount: number,
    expandIndex: number,
    slicePath: ScalarFilterValue[],
    options: XmlaMdxOptions,
    axisName: PivotGridAxis,
    take: number | null | undefined,
  ): string {
    const crossJoinArgs: string[] = [];
    const dimensions = options[axisName];
    const fields: XmlaField[] = [];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- kept between the iterations
    let prevDimension: XmlaField | undefined;

    for (let i = expandIndex; i <= expandLevel; i += 1) {
      const field = dimensions[i];
      const { dataField } = field;
      const prevHierarchyName = dimensions[i - 1]?.hierarchyName;
      const { hierarchyName } = field;
      const isLastDimensionInGroup = !hierarchyName
        || dimensions[i + 1]?.hierarchyName !== hierarchyName;
      const expandAllIndex = path.length + expandAllCount + expandIndex;
      let arg: string | null = null;

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
          let member = preparePathValue(slicePath[slicePath.length - 1]);
          if (isLastDimensionInGroup || i === expandAllIndex) {
            if (prevHierarchyName === hierarchyName) {
              if (slicePath.length) {
                prevDimension = dimensions[slicePath.length - 1];
              }
              if (prevDimension?.hierarchyName !== hierarchyName) {
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
          const sortBy = (field.hierarchyName || field.dataField)
            + (field.sortBy === 'displayText' ? '.MEMBER_CAPTION' : '.MEMBER_VALUE');
          arg = stringFormat(MDX_ORDER_TEMPLATE, arg, sortBy, field.sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        crossJoinArgs.push(arg);
      }
    }

    return crossJoinElements(crossJoinArgs);
  }

  public fillCrossJoins(
    crossJoins: string[],
    path: ScalarFilterValue[],
    expandLevel: number,
    expandIndex: number,
    slicePath: ScalarFilterValue[],
    options: XmlaMdxOptions,
    axisName: PivotGridAxis,
    cellsString: string,
    take?: number | null,
    totalsOnly?: boolean,
  ): void {
    let expandAllCount = -1;
    const dimensions = options[axisName];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the do…while
    let dimensionIndex: number;

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

  public declare(expression: string, withArray: string[], name?: string, type?: string): string {
    const setName = name || `[DX_Set_${withArray.length}]`;
    const setType = type || 'set';

    withArray.push(stringFormat(MDX_WITH_TEMPLATE, setType, setName, expression));
    return setName;
  }

  public generateAxisMdx(
    options: XmlaMdxOptions,
    axisName: PivotGridAxis,
    cells: (string | undefined)[],
    withArray: string[],
    parseOptions: XmlaParseOptions,
  ): string {
    const dimensions = options[axisName];
    const crossJoins: string[] = [];
    let path: ScalarFilterValue[] = [];
    let expandedPaths: ScalarFilterValue[][] = [];
    let expandIndex = 0;
    let expandLevel = 0;
    const result: string[] = [];
    const cellsString = stringFormat(MDX_SET_TEMPLATE, cells.join(','));

    if (dimensions?.length) {
      if (options.headerName === axisName) {
        // @ts-expect-error the data source sets path together with headerName
        path = options.path;
        expandIndex = path.length;
      } else if (options.headerName && options.oppositePath) {
        path = options.oppositePath;
        expandIndex = path.length;
      } else {
        expandedPaths = (axisName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) ?? expandedPaths;
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
        const dimension = dimensions[i];
        if (dimension.hierarchyName && parseOptions.visibleLevels) {
          parseOptions.visibleLevels[
            dimension.hierarchyName
          ] = parseOptions.visibleLevels[dimension.hierarchyName] || [];
          parseOptions.visibleLevels[dimension.hierarchyName]
            .push(dimension.dataField);
        }
      }
    }

    if (crossJoins.length) {
      let expression = union(crossJoins);
      if (axisName === 'rows' && options.rowTake) {
        const rowSkip = options.rowSkip ?? 0;
        expression = stringFormat(
          MDX_SUBSET_TEMPLATE,
          expression,
          rowSkip > 0
            ? rowSkip + 1
            : 0,
          rowSkip > 0
            ? options.rowTake
            : options.rowTake + 1,
        );
      }
      if (axisName === 'columns' && options.columnTake) {
        const columnSkip = options.columnSkip ?? 0;
        expression = stringFormat(
          MDX_SUBSET_TEMPLATE,
          expression,
          columnSkip > 0
            ? columnSkip + 1
            : 0,
          columnSkip > 0
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

  public generateAxisFieldsFilter(fields: XmlaField[]): string {
    const filterMembers: string[] = [];

    each(fields, (_, field) => {
      const { dataField } = field;
      const filterExpression: string[] = [];
      const filterValues: PivotGridFilterValue[] = field.filterValues ?? [];

      if (field.hierarchyName && isNumeric(field.groupIndex)) {
        return;
      }

      each(filterValues, (valueIndex, filterValue) => {
        let filterMdx = `${dataField}.${preparePathValue(Array.isArray(filterValue) ? filterValue[filterValue.length - 1] : filterValue, dataField)}`;
        if (field.filterType === 'exclude') {
          filterExpression.push(`${filterMdx}.parent`);
          filterMdx = `Descendants(${filterMdx})`;
        }

        filterExpression.push(filterMdx);
      });

      if (filterValues.length) {
        let filterStringExpression = stringFormat(MDX_SET_TEMPLATE, filterExpression.join(','));

        if (field.filterType === 'exclude') {
          filterStringExpression = `Except(${getAllMembers(field)},${filterStringExpression})`;
        }

        filterMembers.push(filterStringExpression);
      }
    });

    return filterMembers.length ? crossJoinElements(filterMembers) : '';
  }

  public generateFrom(
    columnsFilter: string,
    rowsFilter: string,
    filter: string,
    cubeName: string | undefined,
  ): string {
    let from = `[${cubeName}]`;

    each([columnsFilter, rowsFilter, filter], (_, filterString) => {
      if (filterString) {
        from = stringFormat(MDX_FILTER_SELECT_TEMPLATE, `${filterString}on 0`, from);
      }
    });

    return from;
  }

  public generateMdxCore(
    axisStrings: (string | string[])[],
    withArray: string[],
    columns: XmlaField[],
    rows: XmlaField[],
    filters: XmlaField[] | undefined,
    slice: string[],
    cubeName: string | undefined,
    options: Pick<XmlaMdxOptions, 'totalsOnly'> = {},
  ): string {
    let mdxString = '';
    const withString = `${withArray.length ? `with ${withArray.join(' ')}` : ''} `;

    if (axisStrings.length) {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
      let select: string;
      if (options.totalsOnly) {
        const countMembers: string[] = [];
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
          this.generateAxisFieldsFilter(filters ?? []),
          cubeName,
        ),
        slice.length ? stringFormat(MDX_SLICE_TEMPLATE, slice.join(',')) : '',
        select,
      );
    }

    return mdxString;
  }

  public prepareDataFields(withArray: string[], valueFields: XmlaField[]): (string | undefined)[] {
    return map(valueFields, (cell) => {
      if (isString(cell.expression)) {
        this.declare(cell.expression, withArray, cell.dataField, 'member');
      }
      return cell.dataField;
    });
  }

  public addSlices(
    slices: string[],
    options: XmlaMdxOptions,
    headerName: PivotGridAxis,
    path: ScalarFilterValue[],
  ): void {
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

  public generateMDX(
    options: XmlaMdxOptions,
    cubeName: string | undefined,
    parseOptions: XmlaParseOptions,
  ): string {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values?.length ? options.values : [{ dataField: '[Measures]' }];
    const slice: string[] = [];
    const withArray: string[] = [];
    const axisStrings: string[] = [];
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

  public createDrillDownAxisSlice(
    slice: string[],
    fields: XmlaField[],
    path: ScalarFilterValue[],
  ): void {
    each(path, (index: number, value) => {
      const field = fields[index];
      if (field.hierarchyName && fields[index + 1]?.hierarchyName === field.hierarchyName) {
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

  public generateDrillDownMDX(
    options: XmlaLoadOptions,
    cubeName: string | undefined,
    params: DrillDownParams,
  ): string {
    const columns = options.columns || [];
    const rows = options.rows || [];
    const values = options.values?.length ? options.values : [{ dataField: '[Measures]' }];
    const slice: string[] = [];
    const withArray: string[] = [];
    const axisStrings: string[][] = [];
    const dataFields = this.prepareDataFields(withArray, values);
    const { maxRowCount } = params;
    const customColumns = params.customColumns ?? [];
    const customColumnsString = customColumns.length > 0 ? ` return ${customColumns.join(',')}` : '';

    this.createDrillDownAxisSlice(slice, columns, params.columnPath ?? []);

    this.createDrillDownAxisSlice(slice, rows, params.rowPath ?? []);

    if (columns.length || dataFields.length) {
      axisStrings.push([`${(isDefined(params.dataIndex) && dataFields[params.dataIndex]) || dataFields[0]} on 0`]);
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

    return coreMDX ? `drillthrough${(maxRowCount ?? 0) > 0 ? ` maxrows ${maxRowCount}` : ''}${coreMDX}${customColumnsString}` : coreMDX;
  }

  public parseAxes(xml: Document, skipValues: boolean | undefined): XmlaAxisMember[][][] {
    const axes: XmlaAxisMember[][][] = [];

    each(xml.getElementsByTagName('Axis'), (_, axisElement) => {
      const name = axisElement.getAttribute('name');
      const axis: XmlaAxisMember[][] = [];
      let index = 0;

      if (name?.indexOf('Axis') === 0 && isNumeric(getNumber(name.substr(4)))) {
        axes.push(axis);

        each(axisElement.getElementsByTagName('Tuple'), (tupleIndex, tupleElement) => {
          // @ts-expect-error the members of a tuple are elements
          const tupleMembers: NodeListOf<Element> = tupleElement.childNodes;
          let levelSum = 0;
          const members: XmlaAxisMember[] = [];
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

  public getNodeText(node: XmlaNode | undefined): string {
    return getNodeText(node);
  }

  public parseCells(xml: Document, axes: unknown[][], measureCount: number): XmlaCellValue[][][] {
    const cells: XmlaCellValue[][][] = [];
    let cell: XmlaCellValue[] = [];
    let index = 0;
    const cellsOriginal: { value: XmlaCellValue }[] = [];
    const cellElements = xml.getElementsByTagName('Cell');
    const errorDictionary: Record<string, string> = {};

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < cellElements.length; i += 1) {
      const xmlCell = cellElements[i];
      const valueElement = xmlCell.getElementsByTagName('Value')[0];
      const errorElements = valueElement?.getElementsByTagName('Error') ?? [];
      const text = errorElements.length === 0 ? this.getNodeText(valueElement) : '#N/A';
      const value = parseFloat(text);
      const cellOrdinal = getNumber(xmlCell.getAttribute('CellOrdinal') ?? '');

      if (errorElements.length) {
        errorDictionary[this.getNodeText(errorElements[0].getElementsByTagName('ErrorCode')[0])] = this.getNodeText(errorElements[0].getElementsByTagName('Description')[0]);
      }

      cellsOriginal[cellOrdinal] = {
        value: isNumeric(text) ? value : text || null,
      };
    }

    each(axes[1], () => {
      const row: XmlaCellValue[][] = [];
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

  public preparePathValue(
    pathValue: ScalarFilterValue | undefined,
    dataField?: string,
  ): ScalarFilterValue | undefined {
    return preparePathValue(pathValue, dataField);
  }

  public getItem(
    hash: Record<string, XmlaHeaderItem>,
    name: string,
    member?: XmlaAxisMember,
    index?: number,
  ): XmlaHeaderItem {
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

  public getVisibleChildren(
    item: XmlaHeaderItem,
    visibleLevels: XmlaVisibleLevels,
  ): XmlaHeaderItems {
    const result: XmlaHeaderItem[] = [];
    const children: XmlaHeaderItems | undefined = item.children
      && (item.children.length
        ? item.children
        : Object.keys(item.children.grandTotalHash ?? {})
          .reduce<XmlaHeaderItem[]>((childItems, name) => childItems
            // @ts-expect-error the keys come from grandTotalHash, whose items have children
            .concat(item.children.grandTotalHash[name].children), [])
      );
    const firstChild = children?.[0];
    const firstChildLevels: XmlaVisibleLevels[string] | undefined = firstChild
      // @ts-expect-error an item without a hierarchy reads the levels of 'null' or 'undefined'
      && visibleLevels[firstChild.hierarchyName];

    if (children && firstChild && (firstChildLevels
      ?.includes(firstChild.levelName)
      || !firstChildLevels
      || firstChild.level === 0)) {
      const newChildren: XmlaHeaderItems = children
        .filter((child) => child.hierarchyName === firstChild.hierarchyName);
      newChildren.grandTotalHash = children.grandTotalHash;
      return newChildren;
    } if (children && firstChild) {
      for (const child of children) {
        if (child.hierarchyName === firstChild.hierarchyName) {
          result.push(...this.getVisibleChildren(child, visibleLevels));
        }
      }
    }
    return result;
  }

  public processMember(
    dataIndex: number,
    member: XmlaAxisMember,
    parentItem: XmlaHeaderItem,
  ): XmlaHeaderItem {
    let currentParentItem = parentItem;
    let children = currentParentItem.children ?? [];
    currentParentItem.children = children;
    const hash = children.hash ?? {};
    children.hash = hash;
    const grandTotalHash = children.grandTotalHash ?? {};
    children.grandTotalHash = grandTotalHash;

    if (member.parentName) {
      currentParentItem = this.getItem(hash, member.parentName);
      children = currentParentItem.children ?? [];
      currentParentItem.children = children;
    }

    // @ts-expect-error the placeholder member of a missing axis has no name
    const currentItem = this.getItem(hash, member.name, member, dataIndex);

    if (member.hasValue && !currentItem.added) {
      currentItem.index = dataIndex;
      currentItem.added = true;
      children.push(currentItem);
    }

    if ((!currentParentItem.value || !currentParentItem.parentName) && member.parentName) {
      grandTotalHash[member.parentName] = currentParentItem;
    // @ts-expect-error header items have no name field
    } else if (grandTotalHash[currentParentItem.name]) {
      // @ts-expect-error the member may have no parentName here
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete grandTotalHash[member.parentName];
    }
    return currentItem;
  }

  public getGrandTotalIndex(
    parentItem: { children: XmlaHeaderItems },
    visibleLevels: XmlaVisibleLevels,
  ): number | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let grandTotalIndex: number | undefined;
    if (parentItem.children.length === 1 && parentItem.children[0].parentName === '') {
      grandTotalIndex = parentItem.children[0].index;
      // TODO - refactoring
      const { grandTotalHash } = parentItem.children;
      parentItem.children = parentItem.children[0].children ?? [];

      parentItem.children.grandTotalHash = grandTotalHash;

      parentItem.children = this.getVisibleChildren(parentItem, visibleLevels);
    } else if (parentItem.children.length === 0) {
      grandTotalIndex = 0;
    }

    return grandTotalIndex;
  }

  public fillDataSourceAxes(
    dataSourceAxis: XmlaHeaderItem[],
    axisTuples: XmlaAxisMember[][],
    measureCount: number | undefined,
    visibleLevels: XmlaVisibleLevels,
  ): number | undefined {
    const result: XmlaHeaderItems = [];

    each(axisTuples, (tupleIndex, members) => {
      let parentItem: XmlaHeaderItem = {
        children: result,
      };
      const dataIndex = isDefined(measureCount)
        ? Math.floor(tupleIndex / measureCount)
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

    foreachTree(parentItem.children, (items: XmlaHeaderItem[]) => {
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

  public checkError(xml: Document): DxError | null {
    const faultElementNS = xml.getElementsByTagName('soap:Fault');
    const faultElement = xml.getElementsByTagName('Fault');
    const errorElement = $(Array.prototype.slice.call(faultElement.length ? faultElement : faultElementNS)).find('Error');

    if (errorElement.length) {
      const description = errorElement.attr('Description');
      const error = errors.Error('E4000', description);
      errors.log('E4000', description);
      return error;
    }
    return null;
  }

  public parseResult(xml: Document, parseOptions: XmlaParseOptions): XmlaLoadResult {
    const dataSource: XmlaLoadResult = {
      columns: [],
      rows: [],
    };

    // @ts-expect-error generateMDX() sets measureCount and visibleLevels
    const { measureCount, visibleLevels }: Required<XmlaParseOptions> = parseOptions;

    const axes = this.parseAxes(xml, parseOptions.skipValues);

    dataSource.grandTotalColumnIndex = this.fillDataSourceAxes(
      dataSource.columns,
      axes[0],
      measureCount,
      visibleLevels,
    );

    dataSource.grandTotalRowIndex = this.fillDataSourceAxes(
      dataSource.rows,
      axes[1],
      undefined,
      visibleLevels,
    );

    dataSource.values = this.parseCells(xml, axes, measureCount);

    return dataSource;
  }

  public parseDiscoverRowSet(
    xml: Document,
    schema: string,
    dimensions: XmlaDimensions,
    translatedDisplayFolders?: Record<string, string>,
  ): XmlaDiscoveredField[] {
    const result: XmlaDiscoveredField[] = [];
    const isMeasure = schema === 'MEASURE';
    const displayFolderField = isMeasure ? 'MEASUREGROUP_NAME' : `${schema}_DISPLAY_FOLDER`;

    each(xml.getElementsByTagName('row'), (_, row) => {
      const hierarchyName = schema === 'LEVEL' ? getFirstChildText(row, 'HIERARCHY_UNIQUE_NAME') : undefined;
      const levelNumber = getFirstChildText(row, 'LEVEL_NUMBER');
      let displayFolder = getFirstChildText(row, displayFolderField);

      if (isMeasure) {
        displayFolder = translatedDisplayFolders?.[displayFolder] || displayFolder;
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

  public parseMeasureGroupDiscoverRowSet(xml: Document): Record<string, string> {
    const measureGroups: Record<string, string> = {};
    each(xml.getElementsByTagName('row'), (_, row) => {
      measureGroups[getFirstChildText(row, 'MEASUREGROUP_NAME')] = getFirstChildText(row, 'MEASUREGROUP_CAPTION');
    });
    return measureGroups;
  }

  public parseDimensionsDiscoverRowSet(xml: Document): XmlaDimensions {
    const result: XmlaDimensions = {
      names: {},
      defaultHierarchies: {},
    };

    each($(xml).find('row'), function parseDimensionRow(this: Element) {
      const $row = $(this);
      const type = $row.children('DIMENSION_TYPE').text();
      const dimensionName = type === MD_DIMTYPE_MEASURE ? MEASURE_DIMENSION_KEY : $row.children('DIMENSION_UNIQUE_NAME').text();

      result.names[dimensionName] = $row.children('DIMENSION_CAPTION').text();
      result.defaultHierarchies[$row.children('DEFAULT_HIERARCHY').text()] = true;
    });
    return result;
  }

  public parseStringWithUnicodeSymbols(str: string): string {
    return parseStringWithUnicodeSymbols(str);
  }

  public parseDrillDownRowSet(xml: Document): Record<string, string>[] {
    const rows = xml.getElementsByTagName('row');
    const result: Record<string, string>[] = [];
    const columnNames: Record<string, string> = {};

    for (const row of rows) {
      // @ts-expect-error the columns of a row are elements
      const children: NodeListOf<Element> = row.childNodes;
      const item: Record<string, string> = {};

      for (const child of children) {
        const { tagName } = child;
        columnNames[tagName] ??= this.parseStringWithUnicodeSymbols(tagName);
        const name = columnNames[tagName];
        item[name] = this.getNodeText(child);
      }
      result.push(item);
    }

    return result;
  }

  public sendQuery(storeOptions: XmlaStoreOptions, mdxString: string): DeferredObj<Document> {
    const encodedMdxString: string = $('<div>').text(mdxString).html();
    return this.execXMLA(
      storeOptions,
      stringFormat(
        XMLA_EXECUTE_TEMPLATE,
        encodedMdxString,
        storeOptions.catalog,
        getLocaleIdProperty(),
      ),
    );
  }

  public processTotalCount(
    data: XmlaLoadResult,
    options: XmlaLoadOptions,
    totalCountXml: Document,
  ): void {
    const axes: object[] = [];
    const columnOptions = options.columns || [];
    const rowOptions = options.rows || [];

    if (columnOptions.length) {
      axes.push({});
    }
    if (rowOptions.length) {
      axes.push({});
    }
    // @ts-expect-error the cells of the totals request hold counts
    const cells: number[][][] = this.parseCells(totalCountXml, [[{}], [{}, {}]], 1);
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

  public getFields(): DeferredObj<XmlaDiscoveredField[]> {
    const options = this._options;
    const { catalog } = options;
    const { cube } = options;
    const localeIdProperty = getLocaleIdProperty();
    const dimensionsRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_DIMENSIONS', localeIdProperty));
    const measuresRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_MEASURES', localeIdProperty));
    const hierarchiesRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_HIERARCHIES', localeIdProperty));
    const levelsRequest = this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_LEVELS', localeIdProperty));
    const result = Deferred<XmlaDiscoveredField[]>();

    when(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest)
      .then((dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) => {
        this.execXMLA(options, stringFormat(XMLA_DISCOVER_TEMPLATE, catalog, cube, 'MDSCHEMA_MEASUREGROUPS', localeIdProperty))
          .done((measureGroupsResponse) => {
            const dimensions = this.parseDimensionsDiscoverRowSet(dimensionsResponse);
            const hierarchies = this.parseDiscoverRowSet(hierarchiesResponse, 'HIERARCHY', dimensions);
            // @ts-expect-error the LEVEL rows have a hierarchyName
            const levels: (XmlaDiscoveredField & { hierarchyName: string })[] = this.parseDiscoverRowSet(levelsResponse, 'LEVEL', dimensions);
            const measureGroups = this.parseMeasureGroupDiscoverRowSet(measureGroupsResponse);
            const fields = this.parseDiscoverRowSet(measuresResponse, 'MEASURE', dimensions, measureGroups)
              .concat(hierarchies);
            const levelsByHierarchy: Record<string, XmlaDiscoveredField[]> = {};

            each(levels, (_, level) => {
              levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName]
                || [];
              levelsByHierarchy[level.hierarchyName].push(level);
            });

            each(hierarchies, (_, hierarchy) => {
              if (levelsByHierarchy[hierarchy.dataField]
                && levelsByHierarchy[hierarchy.dataField].length > 1) {
                hierarchy.hierarchyName = hierarchy.dataField;
                hierarchy.groupName = hierarchy.hierarchyName;

                fields.push(...levelsByHierarchy[hierarchy.hierarchyName]);
              }
            });
            result.resolve(fields);
          // @ts-expect-error fail() gets the error, but is typed with the resolve value
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          }).fail(result.reject);
      // @ts-expect-error fail() gets the error, but is typed with the resolve value
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(result.reject);

    return result;
  }

  public load(options: XmlaLoadOptions): DeferredObj<XmlaLoadResult> {
    const result = Deferred<XmlaLoadResult>();
    const storeOptions = this._options;
    const parseOptions: XmlaParseOptions = {
      skipValues: options.skipValues,
    };
    const mdxString = this.generateMDX(options, storeOptions.cube, parseOptions);

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if
    let rowCountMdx: string | undefined;
    if (options.rowSkip || options.rowTake || options.columnTake || options.columnSkip) {
      rowCountMdx = this.generateMDX(extend({}, options, {
        totalsOnly: true,
        rowSkip: null,
        rowTake: null,
        columnSkip: null,
        columnTake: null,
      }), storeOptions.cube, {});
    }

    const load = (): void => {
      if (mdxString) {
        when<Document | '' | undefined>(
          this.sendQuery(storeOptions, mdxString),
          rowCountMdx && this.sendQuery(storeOptions, rowCountMdx),
        )
          // @ts-expect-error when() types its results alike, but only the second can be empty
          .done((executeXml: Document, rowCountXml: Document | '' | undefined) => {
            const error = this.checkError(executeXml)
              ?? (rowCountXml && this.checkError(rowCountXml));
            if (!error) {
              const response = this.parseResult(executeXml, parseOptions);
              if (rowCountXml) {
                this.processTotalCount(response, options, rowCountXml);
              }

              result.resolve(response);
            } else {
              // @ts-expect-error reject() gets the error, but is typed with the resolve value
              result.reject(error);
            }
          // @ts-expect-error fail() gets the error, but is typed with the resolve value
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
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

  public supportPaging(): boolean {
    return true;
  }

  public getDrillDownItems(
    options: XmlaLoadOptions,
    params: DrillDownParams,
  ): DeferredObj<Record<string, string>[]> {
    const result = Deferred<Record<string, string>[]>();
    const storeOptions = this._options;
    const mdxString = this.generateDrillDownMDX(options, storeOptions.cube, params);

    if (mdxString) {
      when(this.sendQuery(storeOptions, mdxString)).done((executeXml) => {
        const error = this.checkError(executeXml);

        if (!error) {
          result.resolve(this.parseDrillDownRowSet(executeXml));
        } else {
          // @ts-expect-error reject() gets the error, but is typed with the resolve value
          result.reject(error);
        }
      // @ts-expect-error fail() gets the error, but is typed with the resolve value
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
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
