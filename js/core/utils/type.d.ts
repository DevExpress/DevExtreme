export declare function type(object: any): string;

export declare function isBoolean<T>(object: T): object is Extract<T, boolean>;

export declare function isDate<T>(object: T): object is Extract<T, Date>;

export declare function isString<T>(object: T): object is Extract<T, string>;

export declare function isNumeric<T>(object: T): object is Extract<T, number>;

export declare function isFunction<T>(object: T): object is Extract<T, Function>;

export declare function isExponential<T>(object: T): object is Extract<T, number>;

export declare function isDefined<T>(object: T): object is NonNullable<T>;

export declare function isObject<T>(object: T): object is Extract<T, object>;

export declare function isEmptyObject<T>(object: T): object is Extract<T, object>;

export declare function isPlainObject<T>(object: T): object is Extract<T, object>;

export declare function isPrimitive<T>(value: T): value is Exclude<T, Function>&Exclude<T, object>&Exclude<T, any[]>;

export declare function isWindow<T>(object: T): object is Extract<T, object>;

export declare function isRenderer<T>(object: T): object is T;

export declare function isPromise<T>(object: T): object is Extract<T, object>;

export declare function isDeferred<T>(object: T): object is Extract<T, object>;
