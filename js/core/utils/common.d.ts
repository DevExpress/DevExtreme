export function noop(): void;

export function ensureDefined<T>(value: T, defaultValue: T): NonNullable<T>;

export function equalByValue(object1: any, object2: any, depth?: number, strict?: boolean): boolean;
