import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { isDefined, isPlainObject, type, isObject } from '../../core/utils/type';
import { each, map } from '../../core/utils/iterator';
import ajax from '../../core/utils/ajax';
import Guid from '../../core/guid';
import { grep } from '../../core/utils/common';
import { Deferred } from '../../core/utils/deferred';
import errorsUtils from '../errors';
import Utils from '../utils';
import { format as stringFormat } from '../../core/utils/string';

const GUID_REGEX = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;

const VERBOSE_DATE_REGEX = /^\/Date\((-?\d+)((\+|-)?(\d+)?)\)\/$/;
const ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]{1}\d{2}(:?)(\d{2})?)?$/;

// Request processing
const JSON_VERBOSE_MIME_TYPE = 'application/json;odata=verbose';

const makeArray = value => type(value) === 'string' ? value.split() : value;

const hasDot = x => /\./.test(x);

const pad = (text, length, right) => {
    text = String(text);
    while(text.length < length) {
        text = right ? (`${text}0`) : (`0${text}`);
    }
    return text;
};

const formatISO8601 = (date, skipZeroTime, skipTimezone) => {
    const bag = [];

    const isZeroTime = () => date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;

    const padLeft2 = text => pad(text, 2);

    bag.push(date.getFullYear());
    bag.push('-');
    bag.push(padLeft2(date.getMonth() + 1));
    bag.push('-');
    bag.push(padLeft2(date.getDate()));

    if(!(skipZeroTime && isZeroTime())) {
        bag.push('T');
        bag.push(padLeft2(date.getHours()));
        bag.push(':');
        bag.push(padLeft2(date.getMinutes()));
        bag.push(':');
        bag.push(padLeft2(date.getSeconds()));

        if(date.getMilliseconds()) {
            bag.push('.');
            bag.push(pad(date.getMilliseconds(), 3));
        }

        if(!skipTimezone) {
            bag.push('Z');
        }
    }

    return bag.join('');
};

const parseISO8601 = (isoString) => {
    const result = new Date(new Date(0).getTimezoneOffset() * 60 * 1000);
    const chunks = isoString.replace('Z', '').split('T');
    const date = /(\d{4})-(\d{2})-(\d{2})/.exec(chunks[0]);
    const time = /(\d{2}):(\d{2}):(\d{2})\.?(\d{0,7})?/.exec(chunks[1]);

    result.setFullYear(Number(date[1]));
    result.setMonth(Number(date[2]) - 1);
    result.setDate(Number(date[3]));

    if(Array.isArray(time) && time.length) {
        result.setHours(Number(time[1]));
        result.setMinutes(Number(time[2]));
        result.setSeconds(Number(time[3]));

        let fractional = (time[4] || '').slice(0, 3);
        fractional = pad(fractional, 3, true);
        result.setMilliseconds(Number(fractional));
    }

    return result;
};

const isAbsoluteUrl = (url) => /^(?:[a-z]+:)?\/\//i.test(url);

const stripParams = (url) => {
    const index = url.indexOf('?');
    if(index > -1) {
        return url.substr(0, index);
    }
    return url;
};

const toAbsoluteUrl = (basePath, relativePath) => {
    let part;
    const baseParts = stripParams(basePath).split('/');
    const relativeParts = relativePath.split('/');

    baseParts.pop();
    while(relativeParts.length) {
        part = relativeParts.shift();

        if(part === '..') {
            baseParts.pop();
        } else {
            baseParts.push(part);
        }
    }

    return baseParts.join('/');
};

const param = (params) => {
    const result = [];

    for(const name in params) {
        result.push(name + '=' + params[name]);
    }

    return result.join('&');
};

const ajaxOptionsForRequest = (protocolVersion, request, options = {}) => {
    const formatPayload = (payload) => JSON.stringify(payload, function(key, value) {
        if(!(this[key] instanceof Date)) {
            return value;
        }

        value = formatISO8601(this[key]);
        switch(protocolVersion) {
            case 2:
                return value.substr(0, value.length - 1);

            case 3:
            case 4:
                return value;

            default: throw errorsUtils.errors.Error('E4002');
        }
    });

    request = extend(
        {
            async: true,
            method: 'get',
            url: '',
            params: {},
            payload: null,
            headers: {
            },
            timeout: 30000
        },
        request
    );

    options.beforeSend?.(request);

    const { async, timeout, headers } = request;
    let { url, method } = request;
    const { jsonp, withCredentials } = options;

    method = (method || 'get').toLowerCase();
    const isGet = method === 'get';
    const useJsonp = isGet && jsonp;
    const params = extend({}, request.params);
    const ajaxData = isGet ? params : formatPayload(request.payload);
    const qs = !isGet && param(params);
    const contentType = !isGet && JSON_VERBOSE_MIME_TYPE;

    if(qs) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + qs;
    }

    if(useJsonp) {
        ajaxData['$format'] = 'json';
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
            json: [JSON_VERBOSE_MIME_TYPE, 'text/plain'].join()
        },
        xhrFields: {
            withCredentials
        }
    };
};

export const sendRequest = (protocolVersion, request, options) => {
    const { deserializeDates, fieldTypes, countOnly, isPaged } = options;
    const d = new Deferred();
    const ajaxOptions = ajaxOptionsForRequest(protocolVersion, request, options);

    ajax.sendRequest(ajaxOptions).always((obj, textStatus) => {
        const transformOptions = {
            deserializeDates,
            fieldTypes
        };
        const tuple = interpretJsonFormat(obj, textStatus, transformOptions, ajaxOptions);
        const { error, data, count } = tuple;
        let { nextUrl } = tuple;

        if(error) {
            if(error.message !== Utils.XHR_ERROR_UNLOAD) {
                d.reject(error);
            }
        } else if(countOnly) {

            if(isFinite(count)) {
                d.resolve(count);
            } else {
                d.reject(new errorsUtils.errors.Error('E4018'));
            }

        } else if(nextUrl && !isPaged) {
            if(!isAbsoluteUrl(nextUrl)) {
                nextUrl = toAbsoluteUrl(ajaxOptions.url, nextUrl);
            }

            sendRequest(protocolVersion, { url: nextUrl }, options)
                .fail(d.reject)
                .done((nextData) => d.resolve(data.concat(nextData)));
        } else {
            const extra = isFinite(count) ? { totalCount: count } : undefined;

            d.resolve(data, extra);
        }
    });

    return d.promise();
};

const formatDotNetError = (errorObj) => {
    let message;
    let currentError = errorObj;

    if('message' in errorObj) {
        message = errorObj.message?.value || errorObj.message;
    }
    while((currentError = (currentError['innererror'] || currentError['internalexception']))) {
        message = currentError.message;
        if(currentError['internalexception'] && (message.indexOf('inner exception') === -1)) {
            break;
        }
    }
    return message;
};

// TODO split: decouple HTTP errors from OData errors
const errorFromResponse = (obj, textStatus, ajaxOptions) => {
    if(textStatus === 'nocontent') {
        return null; // workaround for http://bugs.jquery.com/ticket/13292
    }

    let message = 'Unknown error';
    let response = obj;
    let httpStatus = 200;
    const errorData = {
        requestOptions: ajaxOptions
    };

    if(textStatus !== 'success') {
        const { status, responseText } = obj;

        httpStatus = status;
        message = Utils.errorMessageFromXhr(obj, textStatus);
        try {
            response = JSON.parse(responseText);
        } catch(x) {
        }
    }
    const errorObj = response?.then || response?.error || response?.['odata.error'] || response?.['@odata.error'];
    // NOTE: $.Deferred rejected and response contain error message
    // NOTE: $.Deferred resolved with odata error


    if(errorObj) {
        message = formatDotNetError(errorObj) || message;
        errorData.errorDetails = errorObj;

        if(httpStatus === 200) {
            httpStatus = 500;
        }

        const customCode = Number(errorObj.code);
        if(isFinite(customCode) && customCode >= 400) {
            httpStatus = customCode;
        }
    }

    if(httpStatus >= 400 || httpStatus === 0) {
        errorData.httpStatus = httpStatus;
        return extend(Error(message), errorData);
    }

    return null;
};

const interpretJsonFormat = (obj, textStatus, transformOptions, ajaxOptions) => {
    const error = errorFromResponse(obj, textStatus, ajaxOptions);

    if(error) {
        return { error };
    }

    if(!isPlainObject(obj)) {
        return { data: obj };
    }

    const value = 'd' in obj && (Array.isArray(obj.d) || isObject(obj.d))
        ? interpretVerboseJsonFormat(obj, textStatus)
        : interpretLightJsonFormat(obj, textStatus);

    transformTypes(value, transformOptions);

    return value;
};

const interpretVerboseJsonFormat = ({ d: data }) => {
    if(!isDefined(data)) {
        return { error: Error('Malformed or unsupported JSON response received') };
    }

    return {
        data: data.results ?? data,
        nextUrl: data.__next,
        count: parseInt(data.__count, 10)
    };
};

const interpretLightJsonFormat = obj => ({
    data: obj.value ?? obj,
    nextUrl: obj['@odata.nextLink'],
    count: parseInt(obj['@odata.count'], 10)
});

// Serialization and parsing

export const EdmLiteral = Class.inherit({
    /**
    * @name EdmLiteralMethods.ctor
    * @publicName ctor(value)
    * @param1 value:string
    */
    ctor(value) {
        this._value = value;
    },

    valueOf() {
        return this._value;
    }
});

const transformTypes = (obj, options = {}) => {
    each(obj, (key, value) => {
        if(value !== null && typeof value === 'object') {

            if('results' in value) {
                obj[key] = value.results;
            }

            transformTypes(obj[key], options);
        } else if(typeof value === 'string') {
            const { fieldTypes, deserializeDates } = options;
            const canBeGuid = !fieldTypes || fieldTypes[key] !== 'String';

            if(canBeGuid && GUID_REGEX.test(value)) {
                obj[key] = new Guid(value);
            }

            if(deserializeDates !== false) {
                if(value.match(VERBOSE_DATE_REGEX)) {
                    const date = new Date(Number(RegExp.$1) + RegExp.$2 * 60 * 1000);
                    obj[key] = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
                } else if(ISO8601_DATE_REGEX.test(value)) {
                    obj[key] = new Date(parseISO8601(obj[key]).valueOf());
                }
            }
        }
    });
};

const serializeDate = date => `datetime'${formatISO8601(date, true, true)}'`;

const serializeString = value => `'${value.replace(/'/g, '\'\'')}'`;

export const serializePropName = propName =>
    propName instanceof EdmLiteral
        ? propName.valueOf()
        : propName.replace(/\./g, '/');

const serializeValueV4 = (value) => {
    if(value instanceof Date) {
        return formatISO8601(value, false, false);
    }
    if(value instanceof Guid) {
        return value.valueOf();
    }
    if(Array.isArray(value)) {
        return `[${value.map((item) => serializeValueV4(item)).join(',')}]`;
    }
    return serializeValueV2(value);
};

const serializeValueV2 = (value) => {
    if(value instanceof Date) {
        return serializeDate(value);
    }
    if(value instanceof Guid) {
        return `guid'${value}'`;
    }
    if(value instanceof EdmLiteral) {
        return value.valueOf();
    }
    if(typeof value === 'string') {
        return serializeString(value);
    }
    return String(value);
};

export const serializeValue = (value, protocolVersion) => {
    switch(protocolVersion) {
        case 2:
        case 3:
            return serializeValueV2(value);
        case 4:
            return serializeValueV4(value);
        default: throw errorsUtils.errors.Error('E4002');
    }
};

export const serializeKey = (key, protocolVersion) => {
    if(isPlainObject(key)) {
        const parts = [];
        each(key, (k, v) => parts.push(`${serializePropName(k)}=${serializeValue(v, protocolVersion)}`));
        return parts.join();
    }
    return serializeValue(key, protocolVersion);
};

export const keyConverters = {

    String: value => `${value}`,

    Int32: value => Math.floor(value),

    Int64: value => value instanceof EdmLiteral ? value : new EdmLiteral(`${value}L`),

    Guid: value => value instanceof Guid ? value : new Guid(value),

    Boolean: value => !!value,

    Single: value => value instanceof EdmLiteral ? value : new EdmLiteral(value + 'f'),

    Decimal: value => value instanceof EdmLiteral ? value : new EdmLiteral(value + 'm')
};

export const convertPrimitiveValue = (type, value) => {
    if(value === null) return null;
    const converter = keyConverters[type];
    if(!converter) {
        throw errorsUtils.errors.Error('E4014', type);
    }
    return converter(value);
};

export const generateSelect = (oDataVersion, select) => {
    if(!select) {
        return;
    }

    return oDataVersion < 4
        ? serializePropName(select.join())
        : grep(select, hasDot, true).join();
};

const formatCore = (hash) => {
    let result = '';
    const selectValue = [];
    const expandValue = [];

    each(hash, (key, value) => {
        if(Array.isArray(value)) {
            [].push.apply(selectValue, value);
        }

        if(isPlainObject(value)) {
            expandValue.push(`${key}${formatCore(value)}`);
        }
    });

    if(selectValue.length || expandValue.length) {
        result += '(';

        if(selectValue.length) {
            result += `$select=${map(selectValue, serializePropName).join()}`;
        }

        if(expandValue.length) {
            if(selectValue.length) {
                result += ';';
            }

            result += `$expand=${map(expandValue, serializePropName).join()}`;
        }
        result += ')';
    }

    return result;
};

const format = (hash) => {
    const result = [];

    each(hash, (key, value) => result.push(`${key}${formatCore(value)}`));

    return result.join();
};

const parseCore = (exprParts, root, stepper) => {
    const result = stepper(root, exprParts.shift(), exprParts);
    if(result === false) {
        return;
    }

    parseCore(exprParts, result, stepper);
};

const parseTree = (exprs, root, stepper) =>
    each(exprs, (_, x) => parseCore(x.split('.'), root, stepper));

const generatorV2 = (expand, select) => {
    const hash = {};

    if(expand) {
        each(makeArray(expand), function() {
            hash[serializePropName(this)] = 1;
        });
    }

    if(select) {
        each(makeArray(select), function() {
            const path = this.split('.');
            if(path.length < 2) {
                return;
            }

            path.pop();
            hash[serializePropName(path.join('.'))] = 1;
        });
    }

    return map(hash, (_, v) => v).join();
};

const generatorV4 = (expand, select) => {
    const hash = {};

    if(expand || select) {
        if(expand) {
            parseTree(makeArray(expand), hash, (node, key, path) => {
                node[key] = node[key] || {};

                return !path.length ? false : node[key];
            });
        }

        if(select) {
            parseTree(grep(makeArray(select), hasDot), hash, (node, key, path) => {
                if(!path.length) {
                    node[key] = node[key] || [];
                    node[key].push(key);
                    return false;
                }

                return (node[key] = node[key] || {});
            });
        }

        return format(hash);
    }
};

export const generateExpand = (oDataVersion, expand, select) =>
    oDataVersion < 4
        ? generatorV2(expand, select)
        : generatorV4(expand, select);

export const formatFunctionInvocationUrl = (baseUrl, args) =>
    stringFormat(
        '{0}({1})',
        baseUrl,
        map(args || {}, (value, key) => stringFormat('{0}={1}', key, value)).join(',')
    );

export const escapeServiceOperationParams = (params, version) => {
    if(!params) {
        return params;
    }

    // From WCF Data Services docs:
    // The type of each parameter must be a primitive type.
    // Any data of a non-primitive type must be serialized and passed into a string parameter
    const result = {};
    each(params, (k, v) => {
        result[k] = serializeValue(v, version);
    });
    return result;
};

///#DEBUG
export const OData__internals = {
    interpretJsonFormat
};
///#ENDDEBUG
