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
