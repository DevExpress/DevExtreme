export declare function isBoolean(object: any): object is boolean;

export declare function isDate(object: any): object is Date;

export declare function isString(object: any): object is string;

export declare function type(object: any): 'object' | 'array' | 'string' | 'date' | 'null' | string;

export declare function isNumeric(object: any): object is number;

export declare function isFunction(object: any): object is Function;

export declare function isExponential(object: any): object is number;

export declare function isDefined<T>(object: T): object is NonNullable<T>;

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
export declare function isObject<T = {}>(object: unknown): object is object;

export declare function isEmptyObject(object: any): boolean;

export declare function isPlainObject(object: any): object is { [key: string]: any };

export declare function isPrimitive(value: any): value is string | number | boolean | undefined | symbol | null;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore: globalThis was introduced in TypeScript 3.4
export declare function isWindow(object: any): object is (Window & typeof globalThis);

export declare function isRenderer(object: any): boolean;

export declare function isPromise(object: any): object is Promise<any>;

export declare function isDeferred(object: any): boolean;
