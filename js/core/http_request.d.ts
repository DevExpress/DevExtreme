type HttpRequestType = {
    getXhr: () => XMLHttpRequest;
    inject: (injection: object) => void;
};

declare const httpRequest: HttpRequestType;

export default httpRequest;
