import '../jquery_augmentation';

interface PromiseType<T> extends JQueryPromise<T> { }

export type TPromise<T> = {} extends PromiseType<T> ? Promise<T> : PromiseType<T>
