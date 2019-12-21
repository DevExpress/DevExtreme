export interface JQuery { }export interface JQueryPromise<T> { }
export interface JQueryCallback { }
export interface PromiseLike<T> { }
export interface JQueryEventObject {
    cancel?: boolean;
}
export interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T, extraParameters: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
}
