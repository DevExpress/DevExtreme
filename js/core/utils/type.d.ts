type GenericTypeChecker<T> = (object: T | {}) => object is T;

export declare const isBoolean: GenericTypeChecker<boolean>;

export declare const isDate: GenericTypeChecker<Date>;

export declare const isString: GenericTypeChecker<string>;

export declare const isNumeric: GenericTypeChecker<number>;

export declare function type(object: any): string;

export declare function isFunction(object: any): boolean;

export declare function isExponential(value: number): boolean;

export declare function isDefined(object: any): boolean;

export declare function isObject(object: any): boolean;

export declare function isEmptyObject(object: any): boolean;

export declare function isPlainObject(object: any): boolean;

export declare function isPrimitive(value: any): boolean;

export declare function isWindow(object: any): boolean;

export declare function isRenderer(object: any): boolean;

export declare function isPromise(object: any): boolean;

export declare function isDeferred(object: any): boolean;
