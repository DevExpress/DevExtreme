export declare function type(object: any): string;

export declare function isBoolean(object: any): object is boolean;

export declare function isDate(object: any): object is Date;

export declare function isString(object: any): object is string;

export declare function type(object: any): 'object' | 'array' | 'string' | 'date' | 'null';

export declare function isNumeric(object: any): object is number;

export declare function isFunction(object: any): object is Function;

export declare function isExponential(object: any): object is number;

export declare function isDefined<T>(object: T): object is NonNullable<T>;

export declare function isObject<T = {}>(object: unknown): object is object;

export declare function isEmptyObject<T = {}>(object: T): boolean;

export declare function isPlainObject(object: any): object is { [key: string]: any };

export declare function isPrimitive<T>(value: T): value is Exclude<T, Function>&Exclude<T, object>&Exclude<T, any[]>;

export declare function isWindow(object: any): object is (Window & typeof globalThis);

export declare function isRenderer(object: any): boolean;

export declare function isPromise(object: any): object is Promise<any>;

export declare function isDeferred(object: any): boolean;
