interface PromiseCallback<T> {
    (value?: T, ...args: any[]): void;
}
export interface Promise<T> {
    then(doneFilter: (value?: T, ...values: any[]) => void, failFilter?: (...reasons: any[]) => any): Promise<void>;
    done(doneCallback?: PromiseCallback<T>): Promise<T>;
    fail(failCallback?: PromiseCallback<T>): Promise<T>;
    always(alwaysCallback?: PromiseCallback<T>): Promise<T>;
    progress(progressCallback?: PromiseCallback<T>): Promise<T>;
    state(): string;
    promise(target?: any): Promise<T>;
}

export interface Deferred<T> {
    state(): string;
    always(alwaysCallback?: PromiseCallback<T>): Deferred<T>;
    done(doneCallback?: PromiseCallback<T>): Deferred<T>;
    fail(failCallback?: PromiseCallback<T>): Deferred<T>;
    progress(progressCallback?: PromiseCallback<T>): Deferred<T>;
    notify(value?: any, ...args: any[]): Deferred<T>;
    notifyWith(context: any, args?: any[]): Deferred<T>;
    reject(value?: any, ...args: any[]): Deferred<T>;
    rejectWith(context: any, args?: any[]): Deferred<T>;
    resolve(value?: T, ...args: any[]): Deferred<T>;
    resolveWith(context: any, args?: T[]): Deferred<T>;
    promise(target?: any): Promise<T>;
}
