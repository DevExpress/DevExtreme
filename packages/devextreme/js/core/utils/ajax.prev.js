// Based on https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/experiment/ng-http-client/experiments/ng-http-client-helper.js

import { Deferred } from './deferred';
import {
    HttpClient, HttpEventType,
    HttpParams,
    HttpXhrBackend,
} from '@angular/common/http';
import { timeout, throwError } from 'rxjs';
import httpRequest from '../http_request';
import { extendFromObject } from './extend';
import { getWindow, hasWindow } from './window';
import domAdapter from '../dom_adapter';
import injector from './dependency_injector';
const window = getWindow();

const PARSER_ERROR = 'parsererror';
const SUCCESS = 'success';
const NO_CONTENT = 'nocontent';
const TIMEOUT = 'timeout';
const STATUS_ABORT = 0;

const removeScript = function(scriptNode) {
    scriptNode.parentNode.removeChild(scriptNode);
};

const appendToHead = function(element) {
    return domAdapter.getHead().appendChild(element);
};

const createScript = function(options) {
    const script = domAdapter.createElement('script');
    for(const name in options) {
        script[name] = options[name];
    }
    return script;
};

const evalScript = function(code) {
    const script = createScript({ text: code });
    appendToHead(script);
    removeScript(script);
};

function getMethod(options) {
    return (options.method || 'GET').toUpperCase();
}

const getContentTypeHeader = function(options) {
    let defaultContentType = '';
    if(options.data && !options.upload && getMethod(options) !== 'GET') {
        defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
    }

    return options.contentType ||
        defaultContentType;
};

const paramsConvert = function(params) {
    const result = [];

    for(const name in params) {
        let value = params[name];

        if(value === undefined) {
            continue;
        }

        if(value === null) {
            value = '';
        }

        if(typeof value === 'function') {
            value = value();
        }

        result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    }

    return result.join('&');
};


const getAcceptHeader = function(options) {
    const dataType = options.dataType || '*';
    const scriptAccept = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript';
    const accepts = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        jsonp: scriptAccept,
        script: scriptAccept
    };
    extendFromObject(accepts, options.accepts, true);

    return accepts[dataType] ?
        accepts[dataType] + (dataType !== '*' ? ', */*; q=0.01' : '') :
        accepts['*'];
};

const getRequestOptions = function(options, headers) {

    let params = options.data;
    const paramsAlreadyString = typeof params === 'string';
    let url = options.url || window.location.href;

    if(!paramsAlreadyString && !options.cache) {
        params = params || {};
        params['_'] = Date.now();
    }

    if(params && !options.upload) {
        if(!paramsAlreadyString) {
            params = paramsConvert(params);
        }

        if(getMethod(options) === 'GET') {
            // it seems it no need if httpClient using
            if(params !== '') {
                url += (url.indexOf('?') > -1 ? '&' : '?') + params;
            }
            params = null;
        } else if(headers['Content-Type'] && headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
            params = params.replace(/%20/g, '+');
        }
    }

    return {
        url: url,
        parameters: params
    };
};

const isCrossDomain = function(url) {
    if(!hasWindow()) {
        return true;
    }

    let crossDomain = false;
    const originAnchor = domAdapter.createElement('a');
    const urlAnchor = domAdapter.createElement('a');

    originAnchor.href = window.location.href;

    try {
        urlAnchor.href = url;

        // NOTE: IE11
        // eslint-disable-next-line no-self-assign
        urlAnchor.href = urlAnchor.href;

        crossDomain = originAnchor.protocol + '//' + originAnchor.host !==
            urlAnchor.protocol + '//' + urlAnchor.host;
    } catch(e) {
        crossDomain = true;
    }
    return crossDomain;
};

const getJsonpCallbackName = function(options) {
    if(options.dataType === 'jsonp') {
        const random = Math.random().toString().replace(/\D/g, '');
        const callbackName = options.jsonpCallback || 'dxCallback' + Date.now() + '_' + random;
        const callbackParameter = options.jsonp || 'callback';

        options.data = options.data || {};
        options.data[callbackParameter] = callbackName;

        return callbackName;
    }
};

const getRequestHeaders = function(options) {
    const headers = options.headers || {};

    headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
    headers['Accept'] = headers['Accept'] || getAcceptHeader(options);

    if(!options.crossDomain && !headers['X-Requested-With']) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return headers;
};

function sendRequestFactory(httpClient) {
    const URLENCODED = 'application/x-www-form-urlencoded';
    const CONTENT_TYPE = 'Content-Type';

    let nonce = Date.now();

    function assignResponseProps(xhrSurrogate, response) {
        function getResponseHeader(name) {
            return response.headers.get(name);
        }

        function makeResponseText() {
            const body = 'error' in response ? response.error : response.body;

            if(typeof body !== 'string' || String(getResponseHeader(CONTENT_TYPE)).indexOf('application/json') === 0) {
                return JSON.stringify(body);
            }

            return body;
        }

        Object.assign(xhrSurrogate, {
            status: response.status,
            statusText: response.statusText,
            getResponseHeader,
            responseText: makeResponseText()
        });

        return xhrSurrogate;
    }

    function getAcceptHeader(options) {
        const dataType = options.dataType;
        const accepts = options.accepts;
        const fallback = ',*/*;q=0.01';

        if(dataType && accepts && accepts[dataType]) {
            return accepts[dataType] + fallback;
        }

        switch(dataType) {
            case 'json': return 'application/json, text/javascript' + fallback;
            case 'text': return 'text/plain' + fallback;
            case 'xml': return 'application/xml, text/xml' + fallback;
            case 'html': return 'text/html' + fallback;
            case 'script': return 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' + fallback;
        }

        return '*/*';
    }

    return (options) => {
        const d = Deferred();
        console.log('-----ajax.prev options----->', options);
        const method = (options.method || 'get').toLowerCase();
        const isGet = method === 'get';
        const needScriptEvaluation = options.dataType === 'jsonp' || options.dataType === 'script';
        if(options.cache === undefined) {
            options.cache = !needScriptEvaluation;
        }
        options.crossDomain = isCrossDomain(options.url);

        const jsonpCallBackName = getJsonpCallbackName(options);
        const headers = getRequestHeaders(options);
        const requestOptions = getRequestOptions(options, headers);
        const url = requestOptions.url;
        const parameters = requestOptions.parameters;
        const data = parameters;
        const upload = options.upload;
        const beforeSend = options.beforeSend;
        const xhrFields = options.xhrFields;
        const result = d.promise();

        // eslint-disable-next-line prefer-const
        let requestSubscription;

        result.abort = function() { // TODO need test
            requestSubscription.unsubscribe();
            d.reject({ status: STATUS_ABORT }, 'error');
            xhrSurrogate.uploadAborted = true;
            upload?.onabort?.(xhrSurrogate);
            console.log('----result.abort------>');
        };

        const xhrSurrogate = {
            ID: Math.random(20),
            abort() {

                console.log('---xhrSurrogate-abort---+--->');
                // upload?.onabort?.(xhrSurrogate); //
                result.abort();
            } };

        if(jsonpCallBackName) {
            window[jsonpCallBackName] = function(data) {
                d.resolve(data, SUCCESS, xhrSurrogate);
            };
        }

        if(options.cache === false && isGet && data) {
            data._ = nonce++;
        }

        if(!headers.Accept) {
            headers.Accept = getAcceptHeader(options);
        }

        if(!upload && !isGet && !headers[CONTENT_TYPE]) {
            headers[CONTENT_TYPE] = options.contentType || URLENCODED + ';charset=utf-8';
        }

        let params;
        let body;

        if(isGet) {
            params = data;
        } else {
            if(!upload && typeof data === 'object' && headers[CONTENT_TYPE].indexOf(URLENCODED) === 0) {
                body = new HttpParams();
                // tslint:disable-next-line:forin
                for(const key in data) {
                    body = body.set(key, data[key]);
                }
                body = body.toString();
            } else {
                body = data;
            }
        }


        if(beforeSend) {
            console.log('------beforeSend---->', options.beforeSend);
            beforeSend(xhrSurrogate);
            // xhrSurrogate.uploadStarted = true;
        }

        const request = options.crossDomain && needScriptEvaluation
            ? httpClient.jsonp(url, jsonpCallBackName)
            : httpClient.request(
                method,
                url,
                {
                    params,
                    body,
                    headers,
                    reportProgress: true,
                    withCredentials: xhrFields && xhrFields.withCredentials,
                    observe: upload ? 'events' : 'response',
                    responseType: options.responseType || (['jsonp', 'script'].includes(options.dataType) ? 'text' : options.dataType)
                }
            );

        const requestWithTimeout = (
            options.timeout ?
                request.pipe(timeout({
                    each: options.timeout,
                    with: () => throwError(() => ({ timeout: TIMEOUT }))
                }))
                : request
        );

        requestSubscription =
            !upload
                ? requestWithTimeout.subscribe(
                    (response) => {
                        console.log('-----RESPONSE OK---->', response);

                        if(needScriptEvaluation) {
                            evalScript(response.body);
                        }

                        return d.resolve(
                            response.body,
                            response.body ? 'success' : NO_CONTENT,
                            assignResponseProps(xhrSurrogate, response)
                        );
                    },
                    (response) => {
                        console.log('---REJECT------->', response);
                        const errorStatus = options.dataType === 'json' && response.message.includes('parsing')
                            ? PARSER_ERROR
                            : (response?.timeout || 'error');

                        return d.reject(assignResponseProps(xhrSurrogate, response), errorStatus, response);
                    }
                )
                : requestWithTimeout.subscribe(
                    (event) => {
                        console.log('-----UPLOAD EVENT---->', [event.type, event, xhrSurrogate]);
                        if(event.type === HttpEventType.Sent) {
                            // console.log('-----UPLOAD onloadstart---->');
                             options.upload['onloadstart']?.(event);
                        } else if(event.type === HttpEventType.UploadProgress) {
                           // options.upload['onloadstart']?.(event);
                            console.log('-----UPLOAD onprogress---+->');
                            options.upload['onprogress']?.(event);
                        } else if(event.type === HttpEventType.Response) {
                            console.log('-----UPLOAD Response-+--->');
                            return d.resolve(xhrSurrogate, SUCCESS, { test: 666 });
                        }

                    },
                    (error) => {
                        console.log('---REJECT--UPLOAD-+---->', error);
                        return d.reject(xhrSurrogate, error.status, error);
                    },
                    () => {
                        console.log('Request completed');
                    }
                );


        return result;
    };
}

let impl;

function sendRequest(options) {
    if(!impl) {
        impl = sendRequestFactory(
            new HttpClient(new HttpXhrBackend({ build: () => httpRequest.getXhr() }))
        );
    }

    return impl(options);
}

export default injector({ sendRequest: sendRequest });
