interface dxPromiseCallback<T> {
    (value?: T, ...args: any[]): void;
}
export interface dxPromise<T> {
    then(doneFilter: (value?: T, ...values: any[]) => void, failFilter?: (...reasons: any[]) => any): dxPromise<void>;
    done(doneCallback?: dxPromiseCallback<T>): dxPromise<T>;
    fail(failCallback?: dxPromiseCallback<T>): dxPromise<T>;
    always(alwaysCallback?: dxPromiseCallback<T>): dxPromise<T>;
    progress(progressCallback?: dxPromiseCallback<T>): dxPromise<T>;
    state(): string;
    promise(target?: any): dxPromise<T>;
}

export interface dxDeferred<T> {
    state(): string;
    always(alwaysCallback?: dxPromiseCallback<T>): dxDeferred<T>;
    done(doneCallback?: dxPromiseCallback<T>): dxDeferred<T>;
    fail(failCallback?: dxPromiseCallback<T>): dxDeferred<T>;
    progress(progressCallback?: dxPromiseCallback<T>): dxDeferred<T>;
    notify(value?: any, ...args: any[]): dxDeferred<T>;
    notifyWith(context: any, args?: any[]): dxDeferred<T>;
    reject(value?: any, ...args: any[]): dxDeferred<T>;
    rejectWith(context: any, args?: any[]): dxDeferred<T>;
    resolve(value?: T, ...args: any[]): dxDeferred<T>;
    resolveWith(context: any, args?: T[]): dxDeferred<T>;
    promise(target?: any): dxPromise<T>;
}

export function Deferred<T>(): dxDeferred<T>;
