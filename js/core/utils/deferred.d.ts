interface Callback<T> {
    (value?: T, ...args: any[]): void;
}
declare class DeferredObj<T> {
    constructor();
    state(): string;
    always(alwaysCallback?: Callback<T>): DeferredObj<T>;
    catch(catchCallback?: Callback<T>): DeferredObj<T>;
    then(resolveCallback?: Callback<T>, rejectCallback?: Callback<T>): DeferredObj<T>;
    done(doneCallback?: Callback<T>): DeferredObj<T>;
    fail(failCallback?: Callback<T>): DeferredObj<T>;
    progress(progressCallback?: Callback<T>): DeferredObj<T>;
    notify(value?: T, ...args: any[]): DeferredObj<T>;
    notifyWith(context: DeferredObj<T>, args?: any[]): DeferredObj<T>;
    reject(value?: T, ...args: any[]): DeferredObj<T>;
    rejectWith(context: DeferredObj<T>, args?: any[]): DeferredObj<T>;
    resolve(value?: T, ...args: any[]): DeferredObj<T>;
    resolveWith(context: DeferredObj<T>, args?: T[]): DeferredObj<T>;
    promise(target?: any): Promise<T>;
}

export function Deferred<T>(): DeferredObj<T>;
