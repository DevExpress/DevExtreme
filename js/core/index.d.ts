export interface PromiseType<T> { }
export type TPromise<T> = {} extends PromiseType<T> ? Promise<T> : PromiseType<T>
