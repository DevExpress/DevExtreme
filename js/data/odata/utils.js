const Class = require('../../core/class');
const extend = require('../../core/utils/extend').extend;
const typeUtils = require('../../core/utils/type');
const iteratorUtils = require('../../core/utils/iterator');
const each = require('../../core/utils/iterator').each;
const ajax = require('../../core/utils/ajax');
const Guid = require('../../core/guid');
const isDefined = typeUtils.isDefined;
const isPlainObject = typeUtils.isPlainObject;
const grep = require('../../core/utils/common').grep;
const Deferred = require('../../core/utils/deferred').Deferred;

const errors = require('../errors').errors;
const dataUtils = require('../utils');

const GUID_REGEX = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;

const VERBOSE_DATE_REGEX = /^\/Date\((-?\d+)((\+|-)?(\d+)?)\)\/$/;
const ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]{1}\d{2}(:?)(\d{2})?)?$/;

// Request processing
const JSON_VERBOSE_MIME_TYPE = 'application/json;odata=verbose';

const makeArray = function(value) {
    return typeUtils.type(value) === 'string' ? value.split() : value;
};

const hasDot = function(x) {
    return /\./.test(x);
};

const pad = function(text, length, right) {
    text = String(text);
    while(text.length < length) {
        text = right ? (text + '0') : ('0' + text);
    }
    return text;
};

function formatISO8601(date, skipZeroTime, skipTimezone) {
    const bag = [];

    const isZeroTime = function() {
        return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;
    };

    const padLeft2 = function(text) { return pad(text, 2); };

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
}

function parseISO8601(isoString) {
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
}

function isAbsoluteUrl(url) {
    return /^(?:[a-z]+:)?\/\//i.test(url);
}

function toAbsoluteUrl(basePath, relativePath) {
    let part;
    const baseParts = stripParams(basePath).split('/');
    const relativeParts = relativePath.split('/');

    function stripParams(url) {
        const index = url.indexOf('?');
        if(index > -1) {
            return url.substr(0, index);
        }
        return url;
    }

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
}

const param = function(params) {
    const result = [];

    for(const name in params) {
        result.push(name + '=' + params[name]);
    }

    return result.join('&');
};

const ajaxOptionsForRequest = function(protocolVersion, request, options) {
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

    options = options || {};

    const beforeSend = options.beforeSend;
    if(beforeSend) {
        beforeSend(request);
    }

    const method = (request.method || 'get').toLowerCase();
    const isGet = method === 'get';
    const useJsonp = isGet && options.jsonp;
    const params = extend({}, request.params);
    const ajaxData = isGet ? params : formatPayload(request.payload);
    const qs = !isGet && param(params);
    let url = request.url;
    const contentType = !isGet && JSON_VERBOSE_MIME_TYPE;

    if(qs) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + qs;
    }

    if(useJsonp) {
        ajaxData['$format'] = 'json';
    }

    return {
        url: url,
        data: ajaxData,
        dataType: useJsonp ? 'jsonp' : 'json',
        jsonp: useJsonp && '$callback',
        method: method,
        async: request.async,
        timeout: request.timeout,
        headers: request.headers,
        contentType: contentType,
        accepts: {
            json: [JSON_VERBOSE_MIME_TYPE, 'text/plain'].join()
        },
        xhrFields: {
            withCredentials: options.withCredentials
        }
    };

    function formatPayload(payload) {
        return JSON.stringify(payload, function(key, value) {

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

                default: throw errors.Error('E4002');
            }
        });
    }
};

const sendRequest = function(protocolVersion, request, options) {
    const d = new Deferred();
    const ajaxOptions = ajaxOptionsForRequest(protocolVersion, request, options);

    ajax.sendRequest(ajaxOptions).always(function(obj, textStatus) {
        const transformOptions = {
            deserializeDates: options.deserializeDates,
            fieldTypes: options.fieldTypes
        };
        const tuple = interpretJsonFormat(obj, textStatus, transformOptions, ajaxOptions);
        const error = tuple.error;
        const data = tuple.data;
        let nextUrl = tuple.nextUrl;
        let extra;

        if(error) {
            if(error.message !== dataUtils.XHR_ERROR_UNLOAD) {
                d.reject(error);
            }
        } else if(options.countOnly) {

            if(isFinite(tuple.count)) {
                d.resolve(tuple.count);
            } else {
                d.reject(new errors.Error('E4018'));
            }

        } else if(nextUrl && !options.isPaged) {
            if(!isAbsoluteUrl(nextUrl)) {
                nextUrl = toAbsoluteUrl(ajaxOptions.url, nextUrl);
            }

            sendRequest(protocolVersion, { url: nextUrl }, options)
                .fail(d.reject)
                .done(function(nextData) {
                    d.resolve(data.concat(nextData));
                });
        } else {
            if(isFinite(tuple.count)) {
                extra = { totalCount: tuple.count };
            }

            d.resolve(data, extra);
        }
    });

    return d.promise();
};

const formatDotNetError = function(errorObj) {
    let message;
    let currentError = errorObj;

    if('message' in errorObj) {
        if(errorObj.message.value) {
            message = errorObj.message.value;
        } else {
            message = errorObj.message;
        }
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
const errorFromResponse = function(obj, textStatus, ajaxOptions) {
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
        httpStatus = obj.status;
        message = dataUtils.errorMessageFromXhr(obj, textStatus);
        try {
            response = JSON.parse(obj.responseText);
        } catch(x) {
        }
    }
    const errorObj = response &&
        // NOTE: $.Deferred rejected and response contain error message
        (response.then && response
        // NOTE: $.Deferred resolved with odata error
        || response.error || response['odata.error'] || response['@odata.error']);

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

function interpretJsonFormat(obj, textStatus, transformOptions, ajaxOptions) {
    const error = errorFromResponse(obj, textStatus, ajaxOptions);
    let value;

    if(error) {
        return { error: error };
    }

    if(!isPlainObject(obj)) {
        return { data: obj };
    }

    if('d' in obj && (Array.isArray(obj.d) || typeUtils.isObject(obj.d))) {
        value = interpretVerboseJsonFormat(obj, textStatus);
    } else {
        value = interpretLightJsonFormat(obj, textStatus);
    }

    transformTypes(value, transformOptions);

    return value;
}

function interpretVerboseJsonFormat(obj) {
    let data = obj.d;
    if(!isDefined(data)) {
        return { error: Error('Malformed or unsupported JSON response received') };
    }

    if(isDefined(data.results)) {
        data = data.results;
    }

    return {
        data: data,
        nextUrl: obj.d.__next,
        count: parseInt(obj.d.__count, 10)
    };
}

function interpretLightJsonFormat(obj) {
    let data = obj;

    if(isDefined(data.value)) {
        data = data.value;
    }

    return {
        data: data,
        nextUrl: obj['@odata.nextLink'],
        count: parseInt(obj['@odata.count'], 10)
    };
}

// Serialization and parsing

/**
* @name EdmLiteral
* @type object
* @namespace DevExpress.data
* @module data/odata/utils
* @export EdmLiteral
*/
const EdmLiteral = Class.inherit({
    /**
    * @name EdmLiteralMethods.ctor
    * @publicName ctor(value)
    * @param1 value:string
    */
    ctor: function(value) {
        this._value = value;
    },

    /**
    * @name EdmLiteralMethods.valueOf
    * @publicName valueOf()
    * @return string
    */
    valueOf: function() {
        return this._value;
    }
});

function transformTypes(obj, options) {
    options = options || {};

    each(obj, function(key, value) {
        if(value !== null && typeof value === 'object') {

            if('results' in value) {
                obj[key] = value.results;
            }

            transformTypes(obj[key], options);
        } else if(typeof value === 'string') {
            const fieldTypes = options.fieldTypes;
            const canBeGuid = !fieldTypes || fieldTypes[key] !== 'String';

            if(canBeGuid && GUID_REGEX.test(value)) {
                obj[key] = new Guid(value);
            }

            if(options.deserializeDates !== false) {
                if(value.match(VERBOSE_DATE_REGEX)) {
                    const date = new Date(Number(RegExp.$1) + RegExp.$2 * 60 * 1000);
                    obj[key] = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
                } else if(ISO8601_DATE_REGEX.test(value)) {
                    obj[key] = new Date(parseISO8601(obj[key]).valueOf());
                }
            }
        }
    });
}

const serializeDate = function(date) {
    return 'datetime\'' + formatISO8601(date, true, true) + '\'';
};

const serializeString = function(value) {
    return '\'' + value.replace(/'/g, '\'\'') + '\'';
};

const serializePropName = function(propName) {
    if(propName instanceof EdmLiteral) {
        return propName.valueOf();
    }

    return propName.replace(/\./g, '/');
};

const serializeValueV4 = function(value) {
    if(value instanceof Date) {
        return formatISO8601(value, false, false);
    }
    if(value instanceof Guid) {
        return value.valueOf();
    }
    if(Array.isArray(value)) {
        return '[' + value.map(function(item) {
            return serializeValueV4(item);
        }).join(',') + ']';
    }
    return serializeValueV2(value);
};

function serializeValueV2(value) {
    if(value instanceof Date) {
        return serializeDate(value);
    }
    if(value instanceof Guid) {
        return 'guid\'' + value + '\'';
    }
    if(value instanceof EdmLiteral) {
        return value.valueOf();
    }
    if(typeof value === 'string') {
        return serializeString(value);
    }
    return String(value);
}

const serializeValue = function(value, protocolVersion) {
    switch(protocolVersion) {
        case 2:
        case 3:
            return serializeValueV2(value);
        case 4:
            return serializeValueV4(value);
        default: throw errors.Error('E4002');
    }
};

const serializeKey = function(key, protocolVersion) {
    if(isPlainObject(key)) {
        const parts = [];
        each(key, function(k, v) {
            parts.push(serializePropName(k) + '=' + serializeValue(v, protocolVersion));
        });
        return parts.join();
    }
    return serializeValue(key, protocolVersion);
};

/**
* @const Utils.keyConverters
* @publicName odata.keyConverters
* @type object
* @namespace DevExpress.data.utils.odata
* @module data/odata/utils
* @export keyConverters
*/
const keyConverters = {

    String: function(value) {
        return value + '';
    },

    Int32: function(value) {
        return Math.floor(value);
    },

    Int64: function(value) {
        if(value instanceof EdmLiteral) {
            return value;
        }
        return new EdmLiteral(value + 'L');
    },

    Guid: function(value) {
        if(value instanceof Guid) {
            return value;
        }
        return new Guid(value);
    },

    Boolean: function(value) {
        return !!value;
    },

    Single: function(value) {
        if(value instanceof EdmLiteral) {
            return value;
        }
        return new EdmLiteral(value + 'f');
    },

    Decimal: function(value) {
        if(value instanceof EdmLiteral) {
            return value;
        }
        return new EdmLiteral(value + 'm');
    }
};

const convertPrimitiveValue = function(type, value) {
    if(value === null) return null;
    const converter = keyConverters[type];
    if(!converter) {
        throw errors.Error('E4014', type);
    }
    return converter(value);
};

const generateSelect = function(oDataVersion, select) {
    if(!select) {
        return;
    }

    if(oDataVersion < 4) {
        return serializePropName(select.join());
    }

    return grep(select, hasDot, true).join();
};

const generateExpand = function(oDataVersion, expand, select) {
    const generatorV2 = function() {
        const hash = {};

        if(expand) {
            iteratorUtils.each(makeArray(expand), function() {
                hash[serializePropName(this)] = 1;
            });
        }

        if(select) {
            iteratorUtils.each(makeArray(select), function() {
                const path = this.split('.');
                if(path.length < 2) {
                    return;
                }

                path.pop();
                hash[serializePropName(path.join('.'))] = 1;
            });
        }

        return iteratorUtils.map(hash, function(k, v) { return v; }).join();
    };

    const generatorV4 = function() {
        const format = function(hash) {
            const formatCore = function(hash) {
                let result = '';
                const selectValue = [];
                const expandValue = [];

                iteratorUtils.each(hash, function(key, value) {
                    if(Array.isArray(value)) {
                        [].push.apply(selectValue, value);
                    }

                    if(isPlainObject(value)) {
                        expandValue.push(key + formatCore(value));
                    }
                });

                if(selectValue.length || expandValue.length) {
                    result += '(';

                    if(selectValue.length) {
                        result += '$select=' + iteratorUtils.map(selectValue, serializePropName).join();
                    }

                    if(expandValue.length) {
                        if(selectValue.length) {
                            result += ';';
                        }

                        result += '$expand=' + iteratorUtils.map(expandValue, serializePropName).join();
                    }
                    result += ')';
                }

                return result;
            };

            const result = [];

            iteratorUtils.each(hash, function(key, value) {
                result.push(key + formatCore(value));
            });

            return result.join();
        };

        const parseTree = function(exprs, root, stepper) {
            const parseCore = function(exprParts, root, stepper) {
                const result = stepper(root, exprParts.shift(), exprParts);
                if(result === false) {
                    return;
                }

                parseCore(exprParts, result, stepper);
            };

            iteratorUtils.each(exprs, function(_, x) {
                parseCore(x.split('.'), root, stepper);
            });
        };

        const hash = {};

        if(expand || select) {
            if(expand) {
                parseTree(makeArray(expand), hash, function(node, key, path) {
                    node[key] = node[key] || {};

                    if(!path.length) {
                        return false;
                    }

                    return node[key];
                });
            }

            if(select) {
                parseTree(grep(makeArray(select), hasDot), hash, function(node, key, path) {
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

    if(oDataVersion < 4) {
        return generatorV2();
    }

    return generatorV4();
};

exports.sendRequest = sendRequest;
exports.serializePropName = serializePropName;
exports.serializeValue = serializeValue;
exports.serializeKey = serializeKey;
exports.keyConverters = keyConverters;
exports.convertPrimitiveValue = convertPrimitiveValue;
exports.generateExpand = generateExpand;
exports.generateSelect = generateSelect;

exports.EdmLiteral = EdmLiteral;

///#DEBUG
exports.OData__internals = {
    interpretJsonFormat: interpretJsonFormat
};
///#ENDDEBUG
