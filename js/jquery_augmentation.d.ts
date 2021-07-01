declare global {
    interface JQuery { }
    interface JQueryPromise<T> { }
    interface JQueryCallback { }
    interface JQueryEventObject {
        cancel?: boolean;
    }
    interface PromiseLike<T> { }
    interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: ((value: T, extraParameters?: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
            onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
        ): Promise<TResult1 | TResult2>;
    }
}

export const { };