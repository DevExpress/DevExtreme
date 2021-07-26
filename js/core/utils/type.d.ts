// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isBoolean(object: any): object is boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isDate(object: any): object is Date;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isString(object: any): object is string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function type(object: any): 'object' | 'array' | 'string' | 'date' | 'null' | string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isNumeric(object: any): object is number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isFunction(object: any): object is Function;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isExponential(object: any): object is number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isDefined<T>(object: T): object is NonNullable<T>;

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
export declare function isObject<T = {}>(object: unknown): object is object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isEmptyObject(object: any): boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isPlainObject(object: any): object is { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isPrimitive(value: any): value is string | number | boolean | undefined | symbol | null;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore: globalThis was introduced in TypeScript 3.4
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isWindow(object: any): object is (Window & typeof globalThis);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isRenderer(object: any): boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isPromise(object: any): object is Promise<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function isDeferred(object: any): boolean;
