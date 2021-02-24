interface dxPromiseCallback<T> {
    (value?: T, ...args: any[]): void;
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
    promise(target?: any): Promise<T>;
}

export function Deferred<T>(): dxDeferred<T>;
