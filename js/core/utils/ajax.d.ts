interface ajaxOptions {
    accepts?: any;
    async?: boolean;
    beforeSend? (xhr: XMLHttpRequest, settings: ajaxOptions): any;
    cache?: boolean;
    complete? (xhr: XMLHttpRequest, textStatus: string): any;
    contents?: { [key: string]: any; };
    contentType?: any;
    context?: any;
    converters?: { [key: string]: any; };
    crossDomain?: boolean;
    data?: any;
    dataFilter? (data: any, ty: any): any;
    dataType?: string;
    error? (xhr: XMLHttpRequest, textStatus: string, errorThrow: string): any;
    global?: boolean;
    headers?: { [key: string]: any; };
    ifModified?: boolean;
    isLocal?: boolean;
    jsonp?: string;
    jsonpCallback?: any;
    mimeType?: string;
    password?: string;
    processData?: boolean;
    scriptCharset?: string;
    statusCode?: { [key: string]: any; };
    success? (data: any, textStatus: string, xhr: XMLHttpRequest): any;
    timeout?: number;
    traditional?: boolean;
    type?: string;
    url?: string;
    username?: string;
    xhr?: XMLHttpRequest;
    xhrFields?: { [key: string]: any; };
}

type AjaxType = {
    sendRequest: (options: ajaxOptions) => any;
    inject: (injection: object) => void;
};

declare const ajax: AjaxType;

export default ajax;
