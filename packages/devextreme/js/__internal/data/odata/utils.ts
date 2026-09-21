import { errors } from '@js/common/data/errors';
import { errorMessageFromXhr, XHR_ERROR_UNLOAD } from '@js/common/data/utils';
import Guid from '@js/core/guid';
import ajax from '@js/core/utils/ajax';
// @ts-expect-error grep is not declared in js/core/utils/common.d.ts
import { grep } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { format as stringFormat } from '@js/core/utils/string';
import {
  isDefined, isObject, isPlainObject, type,
} from '@js/core/utils/type';

const GUID_REGEX = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;

const VERBOSE_DATE_REGEX = /^\/Date\((-?\d+)((\+|-)?(\d+)?)\)\/$/;
const ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]{1}\d{2}(:?)(\d{2})?)?$/;

// Request processing
const JSON_VERBOSE_MIME_TYPE = 'application/json;odata=verbose';

// NOTE: OData v2 sends the error message as `{ lang, value }`, OData v4 as a plain string.
// The intersection describes both without narrowing every read site.
type ODataErrorMessage = string & { value?: string };

interface ODataErrorObject {
  code?: unknown;
  message?: ODataErrorMessage;
  // eslint-disable-next-line spellcheck/spell-checker
  innererror?: ODataErrorObject;
  // eslint-disable-next-line spellcheck/spell-checker
  internalexception?: ODataErrorObject;
}

interface ODataVerboseData {
  results?: unknown;
  __next?: string;
  __count?: unknown;
}

interface ODataResponse {
  status?: number;
  responseText?: string;
  d?: ODataVerboseData;
  value?: unknown;
  then?: ODataErrorObject;
  error?: ODataErrorObject;
  'odata.error'?: ODataErrorObject;
  '@odata.error'?: ODataErrorObject;
  '@odata.nextLink'?: string;
  '@odata.count'?: unknown;
}

interface ODataResponseInfo {
  error?: Error;
  data?: unknown;
  nextUrl?: string;
  count?: number;
}

interface TransformTypesOptions {
  fieldTypes?: Record<string, string>;
  processDatesAsUtc?: boolean;
}

interface ODataRequest {
  async?: boolean;
  method?: string;
  url?: string;
  params?: Record<string, unknown>;
  payload?: unknown;
  headers?: Record<string, unknown>;
  timeout?: number;
}

interface ODataNormalizedRequest {
  async: boolean;
  method: string;
  url: string;
  params: Record<string, unknown>;
  payload: unknown;
  headers: Record<string, unknown>;
  timeout: number;
}

interface ODataRequestOptions extends TransformTypesOptions {
  beforeSend?: Function;
  jsonp?: boolean;
  withCredentials?: boolean;
  countOnly?: boolean;
  isPaged?: boolean;
}

interface AjaxRequestOptions {
  url: string;
  data: Record<string, unknown> | string;
  dataType: string;
  jsonp: string | boolean | undefined;
  method: string;
  async: boolean;
  timeout: number;
  headers: Record<string, unknown>;
  contentType: string | false;
  accepts: { json: string };
  xhrFields: { withCredentials: boolean | undefined };
}

type SelectExpr = string | string[] | Function;

// The `$expand` tree mixes nested nodes with leaf arrays of selected property names.
interface ExpandTreeNode {
  [key: string]: ExpandTreeNode | string[];
}

type ExpandTreeStepper = (
  node: ExpandTreeNode,
  key: string,
  path: string[],
) => ExpandTreeNode | string[] | false;

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';

// NOTE: `[String(value)]` is the former `value.split()`: a missing separator yields one item.
const makeArray = (value: SelectExpr): SelectExpr => (type(value) === 'string' ? [String(value)] : value);

const hasDot = (x: string): boolean => x.includes('.');

const pad = (text: string | number, length: number, right?: boolean): string => {
  let result = String(text);
  while (result.length < length) {
    result = right ? `${result}0` : `0${result}`;
  }
  return result;
};

const formatISO8601 = (date: Date, skipZeroTime?: boolean, skipTimezone?: boolean): string => {
  const bag: (string | number)[] = [];

  const isZeroTime = (): boolean => date.getHours() + date.getMinutes()
    + date.getSeconds() + date.getMilliseconds() < 1;
  const padLeft2 = (text: number): string => pad(text, 2);

  bag.push(date.getFullYear());
  bag.push('-');
  bag.push(padLeft2(date.getMonth() + 1));
  bag.push('-');
  bag.push(padLeft2(date.getDate()));

  if (!(skipZeroTime && isZeroTime())) {
    bag.push('T');
    bag.push(padLeft2(date.getHours()));
    bag.push(':');
    bag.push(padLeft2(date.getMinutes()));
    bag.push(':');
    bag.push(padLeft2(date.getSeconds()));

    if (date.getMilliseconds()) {
      bag.push('.');
      bag.push(pad(date.getMilliseconds(), 3));
    }

    if (!skipTimezone) {
      bag.push('Z');
    }
  }

  return bag.join('');
};

const parseISO8601 = (isoString: string): Date => {
  const result = new Date(new Date(0).getTimezoneOffset() * 60 * 1000);
  const chunks = isoString.replace('Z', '').split('T');
  const date = /(\d{4})-(\d{2})-(\d{2})/.exec(chunks[0]);
  const time = /(\d{2}):(\d{2}):(\d{2})\.?(\d{0,7})?/.exec(chunks[1]);

  if (date) {
    result.setFullYear(Number(date[1]));
    result.setMonth(Number(date[2]) - 1);
    result.setDate(Number(date[3]));
  }

  if (Array.isArray(time) && time.length) {
    result.setHours(Number(time[1]));
    result.setMinutes(Number(time[2]));
    result.setSeconds(Number(time[3]));

    const fractional = pad((time[4] || '').slice(0, 3), 3, true);
    result.setMilliseconds(Number(fractional));
  }

  return result;
};

const isAbsoluteUrl = (url: string): boolean => /^(?:[a-z]+:)?\/{2,2}/i.test(url);

const stripParams = (url: string): string => {
  const index = url.indexOf('?');
  if (index > -1) {
    return url.substr(0, index);
  }
  return url;
};

const toAbsoluteUrl = (basePath: string, relativePath: string): string => {
  const baseParts = stripParams(basePath).split('/');
  const relativeParts = relativePath.split('/');

  baseParts.pop();
  while (relativeParts.length) {
    const part = relativeParts.shift() ?? '';

    if (part === '..') {
      baseParts.pop();
    } else {
      baseParts.push(part);
    }
  }

  return baseParts.join('/');
};

const param = (params: Record<string, unknown>): string => {
  const result: string[] = [];
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in params) {
    result.push(`${name}=${String(params[name])}`);
  }

  return result.join('&');
};

const ajaxOptionsForRequest = (
  protocolVersion: number,
  request: ODataRequest,
  options: ODataRequestOptions = {},
): AjaxRequestOptions => {
  const formatPayload = (payload: unknown): string => JSON.stringify(payload, function (
    key: string,
    value: unknown,
  ): unknown {
    if (!(this[key] instanceof Date)) {
      return value;
    }
    const formatted = formatISO8601(this[key]);
    switch (protocolVersion) {
      case 2:
        return formatted.substr(0, formatted.length - 1);

      case 3:
      case 4:
        return formatted;

      default: throw errors.Error('E4002');
    }
  });

  const requestOptions: ODataNormalizedRequest = extend(
    {
      async: true,
      method: 'get',
      url: '',
      params: {},
      payload: null,
      headers: {
      },
      timeout: 30000,
    },
    request,
  );
  options.beforeSend?.(requestOptions);

  const { async, timeout, headers } = requestOptions;
  let { url, method } = requestOptions;
  const { jsonp, withCredentials } = options;

  method = (method || 'get').toLowerCase();
  const isGet = method === 'get';
  const useJsonp = isGet && jsonp;
  const params: Record<string, unknown> = extend({}, requestOptions.params);
  const ajaxData = isGet ? params : formatPayload(requestOptions.payload);
  const qs = !isGet && param(params);
  const contentType = !isGet && JSON_VERBOSE_MIME_TYPE;

  if (qs) {
    url += (url.includes('?') ? '&' : '?') + qs;
  }

  if (useJsonp) {
    // NOTE: `ajaxData` is the very same object when the request is a GET one.
    params.$format = 'json';
  }

  return {
    url,
    data: ajaxData,
    dataType: useJsonp ? 'jsonp' : 'json',
    jsonp: useJsonp && '$callback',
    method,
    async,
    timeout,
    headers,
    contentType,
    accepts: {
      json: [JSON_VERBOSE_MIME_TYPE, 'text/plain'].join(),
    },
    xhrFields: {
      withCredentials,
    },
  };
};

const formatDotNetError = (errorObj: ODataErrorObject): string | undefined => {
  let message = 'message' in errorObj
    ? errorObj.message?.value || errorObj.message
    : undefined;
  let currentError: ODataErrorObject | undefined = errorObj;

  /* eslint-disable spellcheck/spell-checker, no-cond-assign */
  while (currentError = currentError.innererror || currentError.internalexception) {
    const currentMessage = currentError.message;
    message = currentMessage ?? message;
    if (currentError.internalexception && message?.includes('inner exception') === false) {
      break;
    }
  }
  return message;
};

// TODO split: decouple HTTP errors from OData errors
const errorFromResponse = (
  obj: ODataResponse,
  textStatus: string,
  ajaxOptions: AjaxRequestOptions,
): Error | null => {
  if (textStatus === 'nocontent') {
    return null; // workaround for http://bugs.jquery.com/ticket/13292
  }

  let message = 'Unknown error';
  let response = obj;
  let httpStatus = 200;
  const errorData: {
    requestOptions: AjaxRequestOptions;
    errorDetails?: ODataErrorObject;
    httpStatus?: number;
  } = {
    requestOptions: ajaxOptions,
  };

  if (textStatus !== 'success') {
    const { status, responseText } = obj;

    httpStatus = Number(status);
    message = errorMessageFromXhr(obj, textStatus);
    try {
      response = JSON.parse(responseText ?? '');
      // eslint-disable-next-line no-empty
    } catch (x) {
    }
  }
  const errorObj = response?.then || response?.error || response?.['odata.error'] || response?.['@odata.error'];
  // NOTE: $.Deferred rejected and response contain error message
  // NOTE: $.Deferred resolved with odata error

  if (errorObj) {
    message = formatDotNetError(errorObj) || message;
    errorData.errorDetails = errorObj;

    if (httpStatus === 200) {
      httpStatus = 500;
    }

    const customCode = Number(errorObj.code);
    if (isFinite(customCode) && customCode >= 400) {
      httpStatus = customCode;
    }
  }

  if (httpStatus >= 400 || httpStatus === 0) {
    errorData.httpStatus = httpStatus;
    const result: Error = extend(Error(message), errorData);
    return result;
  }

  return null;
};

const transformTypes = (obj: unknown, options: TransformTypesOptions = {}): void => {
  each(obj, (key: string, value: unknown): void => {
    if (!isRecord(obj)) {
      return;
    }

    if (value !== null && typeof value === 'object') {
      if ('results' in value) {
        obj[key] = value.results;
      }

      transformTypes(obj[key], options);
    } else if (typeof value === 'string') {
      const { fieldTypes, processDatesAsUtc } = options;
      const canBeGuid = !fieldTypes || fieldTypes[key] !== 'String';

      if (canBeGuid && GUID_REGEX.test(value)) {
        obj[key] = new Guid(value);
      }

      if (processDatesAsUtc !== false) {
        if (VERBOSE_DATE_REGEX.exec(value)) {
          const date = new Date(Number(RegExp.$1) + Number(RegExp.$2) * 60 * 1000);
          obj[key] = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        } else if (ISO8601_DATE_REGEX.test(value)) {
          obj[key] = new Date(parseISO8601(value).valueOf());
        }
      }
    }
  });
};

const interpretVerboseJsonFormat = ({ d: data }: ODataResponse): ODataResponseInfo => {
  if (!isDefined(data)) {
    return { error: Error('Malformed or unsupported JSON response received') };
  }

  return {
    data: data.results ?? data,
    nextUrl: data.__next,
    count: parseInt(String(data.__count), 10),
  };
};

const interpretLightJsonFormat = (obj: ODataResponse): ODataResponseInfo => ({
  data: obj.value ?? obj,
  nextUrl: obj['@odata.nextLink'],
  count: parseInt(String(obj['@odata.count']), 10),
});

const interpretJsonFormat = (
  obj: ODataResponse,
  textStatus: string,
  transformOptions: TransformTypesOptions,
  ajaxOptions: AjaxRequestOptions,
): ODataResponseInfo => {
  const error = errorFromResponse(obj, textStatus, ajaxOptions);

  if (error) {
    return { error };
  }

  if (!isPlainObject(obj)) {
    return { data: obj };
  }

  const value = 'd' in obj && (Array.isArray(obj.d) || isObject(obj.d))
    ? interpretVerboseJsonFormat(obj)
    : interpretLightJsonFormat(obj);

  transformTypes(value, transformOptions);

  return value;
};

export const sendRequest = (
  protocolVersion: number,
  request: ODataRequest,
  options: ODataRequestOptions,
): DeferredObj<unknown> => {
  const {
    processDatesAsUtc, fieldTypes, countOnly, isPaged,
  } = options;
  const d = Deferred<unknown>();
  const ajaxOptions = ajaxOptionsForRequest(protocolVersion, request, options);

  ajax.sendRequest(ajaxOptions).always((obj: ODataResponse, textStatus: string): void => {
    const transformOptions = {
      processDatesAsUtc,
      fieldTypes,
    };
    const tuple = interpretJsonFormat(obj, textStatus, transformOptions, ajaxOptions);
    const { error, data, count } = tuple;
    let { nextUrl } = tuple;

    if (error) {
      if (error.message !== XHR_ERROR_UNLOAD) {
        d.reject(error);
      }
    } else if (countOnly) {
      if (isFinite(Number(count))) {
        d.resolve(count);
      } else {
        d.reject(errors.Error('E4018'));
      }
    } else if (nextUrl && !isPaged) {
      if (!isAbsoluteUrl(nextUrl)) {
        nextUrl = toAbsoluteUrl(ajaxOptions.url, nextUrl);
      }

      sendRequest(protocolVersion, { url: nextUrl }, options)
        .fail((...args: unknown[]) => { d.reject(...args); })
        // @ts-expect-error the ajax payload is untyped, a paged OData response is an array
        .done((nextData: unknown): void => { d.resolve(data.concat(nextData)); });
    } else {
      const extra = isFinite(Number(count)) ? { totalCount: count } : undefined;

      d.resolve(data, extra);
    }
  });

  // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
  return d.promise();
};

// Serialization and parsing

export class EdmLiteral {
  _value: string;

  constructor(value: string) {
    this._value = value;
  }

  valueOf(): string {
    return this._value;
  }
}

const serializeDate = (date: Date): string => `datetime'${formatISO8601(date, true, true)}'`;

const serializeString = (value: string): string => `'${value.replace(/'/g, '\'\'')}'`;

export const serializePropName = (propName: string | EdmLiteral): string => (
  propName instanceof EdmLiteral
    ? propName.valueOf()
    : propName.replace(/\./g, '/'));

const serializeValueV2 = (value: unknown, fieldType?: string): string => {
  if (value instanceof Date) {
    return serializeDate(value);
  }
  if (value instanceof Guid) {
    return `guid'${value}'`;
  }
  if (value instanceof EdmLiteral) {
    return value.valueOf();
  }
  if (fieldType && ['Date', 'DateTimeOffset'].includes(fieldType)) {
    return String(value);
  }
  if (typeof value === 'string') {
    return serializeString(value);
  }
  return String(value);
};

const serializeValueV4 = (value: unknown, fieldType?: string): string => {
  if (value instanceof Date) {
    return formatISO8601(value, false, false);
  }
  if (value instanceof Guid) {
    return value.valueOf();
  }
  if (Array.isArray(value)) {
    return `[${value.map((item: unknown): string => serializeValueV4(item, fieldType)).join(',')}]`;
  }
  return serializeValueV2(value, fieldType);
};

export const serializeValue = (
  value: unknown,
  protocolVersion: number,
  fieldType?: string,
): string => {
  switch (protocolVersion) {
    case 2:
    case 3:
      return serializeValueV2(value, fieldType);
    case 4:
      return serializeValueV4(value, fieldType);
    default: throw errors.Error('E4002');
  }
};

export const serializeKey = (key: unknown, protocolVersion: number): string => {
  if (isPlainObject(key)) {
    const parts: string[] = [];
    each(key, (k: string, v: unknown): void => {
      parts.push(`${serializePropName(k)}=${serializeValue(v, protocolVersion)}`);
    });
    return parts.join();
  }
  return serializeValue(key, protocolVersion);
};

export const keyConverters: Record<string, (value: unknown) => unknown> = {

  String: (value) => String(value),

  Int32: (value) => Math.floor(Number(value)),

  Int64: (value) => (value instanceof EdmLiteral ? value : new EdmLiteral(`${String(value)}L`)),

  Guid: (value) => {
    if (value instanceof Guid) {
      return value;
    }
    // NOTE: `new Guid()` is what the constructor falls back to for a falsy value.
    const text = String(value);

    return value ? new Guid(text) : new Guid();
  },

  Boolean: (value) => !!value,

  Single: (value) => (value instanceof EdmLiteral ? value : new EdmLiteral(`${String(value)}f`)),

  Decimal: (value) => (value instanceof EdmLiteral ? value : new EdmLiteral(`${String(value)}m`)),

  DateTimeOffset: (value) => value,

  Date: (value) => value,
};

export const convertPrimitiveValue = (fieldType: string, value: unknown): unknown => {
  if (value === null) return null;
  const converter = keyConverters[fieldType];
  if (!converter) {
    throw errors.Error('E4014', fieldType);
  }
  return converter(value);
};

export const generateSelect = (oDataVersion: number, select?: SelectExpr): string | undefined => {
  if (!select) {
    return undefined;
  }

  if (oDataVersion < 4) {
    return serializePropName(Array.isArray(select) ? select.join() : String(select));
  }

  const dottedNames: string[] = grep(select, hasDot, true);

  return dottedNames.join();
};

const formatCore = (hash: unknown): string => {
  let result = '';
  const selectValue: unknown[] = [];
  const expandValue: string[] = [];

  each(hash, (key: string, value: unknown): void => {
    if (Array.isArray(value)) {
      selectValue.push(...value);
    }

    if (isPlainObject(value)) {
      expandValue.push(`${key}${formatCore(value)}`);
    }
  });

  if (selectValue.length || expandValue.length) {
    result += '(';

    if (selectValue.length) {
      const names: string[] = map(selectValue, serializePropName);
      result += `$select=${names.join()}`;
    }

    if (expandValue.length) {
      if (selectValue.length) {
        result += ';';
      }

      const names: string[] = map(expandValue, serializePropName);
      result += `$expand=${names.join()}`;
    }
    result += ')';
  }

  return result;
};

const format = (hash: ExpandTreeNode): string => {
  const result: string[] = [];
  each(hash, (key: string, value: unknown): void => {
    result.push(`${key}${formatCore(value)}`);
  });

  return result.join();
};

const parseCore = (exprParts: string[], root: ExpandTreeNode, stepper: ExpandTreeStepper): void => {
  const result = stepper(root, exprParts.shift() ?? '', exprParts);
  if (result === false) {
    return;
  }

  // @ts-expect-error the tree mixes nested nodes and leaf arrays, only nodes are stepped into
  parseCore(exprParts, result, stepper);
};

const parseTree = (exprs: unknown, root: ExpandTreeNode, stepper: ExpandTreeStepper): void => {
  each(exprs, (_: number, x: string): void => {
    parseCore(x.split('.'), root, stepper);
  });
};

const generatorV2 = (expand?: SelectExpr, select?: SelectExpr): string => {
  const hash: Record<string, number> = {};

  if (expand) {
    each(makeArray(expand), function (): void {
      hash[serializePropName(this)] = 1;
    });
  }

  if (select) {
    each(makeArray(select), function (): void {
      const path = this.split('.');
      if (path.length < 2) {
        return;
      }

      path.pop();
      hash[serializePropName(path.join('.'))] = 1;
    });
  }

  const names: string[] = map(hash, (_: number, v: string): string => v);

  return names.join();
};

const generatorV4 = (expand?: SelectExpr, select?: SelectExpr): string | undefined => {
  const hash: ExpandTreeNode = {};

  if (expand || select) {
    if (expand) {
      parseTree(makeArray(expand), hash, (node, key, path) => {
        node[key] = node[key] || {};

        return !path.length ? false : node[key];
      });
    }

    if (select) {
      parseTree(grep(makeArray(select), hasDot), hash, (node, key, path) => {
        if (!path.length) {
          node[key] = node[key] || [];
          // @ts-expect-error a leaf of the tree is a string array, node[key] is a union here
          node[key].push(key);
          return false;
        }
        // eslint-disable-next-line no-return-assign
        return (node[key] = node[key] || {});
      });
    }

    return format(hash);
  }

  return undefined;
};

export const generateExpand = (
  oDataVersion: number,
  expand?: SelectExpr,
  select?: SelectExpr,
): string | undefined => (oDataVersion < 4
  ? generatorV2(expand, select)
  : generatorV4(expand, select));

export const formatFunctionInvocationUrl = (
  baseUrl: string,
  args?: Record<string, unknown> | null,
): string => {
  const pairs: string[] = map(args || {}, (value: unknown, key: string): string => {
    const pair: string = stringFormat('{0}={1}', key, value);

    return pair;
  });
  const invocation: string = stringFormat('{0}({1})', baseUrl, pairs.join(','));

  return invocation;
};

export const escapeServiceOperationParams = (
  params: Record<string, unknown> | null | undefined,
  version: number,
): Record<string, string> | null | undefined => {
  if (!params) {
    return params;
  }

  // From WCF Data Services docs:
  // The type of each parameter must be a primitive type.
  // Any data of a non-primitive type must be serialized and passed into a string parameter
  const result: Record<string, string> = {};
  each(params, (k: string, v: unknown): void => {
    result[k] = serializeValue(v, version);
  });
  return result;
};

/// #DEBUG
// eslint-disable-next-line @typescript-eslint/naming-convention
export const OData__internals = {
  interpretJsonFormat,
};
/// #ENDDEBUG
