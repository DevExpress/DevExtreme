import {
    Device
} from '../devices';

export declare type Rule<T> = {
    device: ((device: Device) => boolean) | Device | Device[];
    options: Partial<T>;
};

export declare function convertRulesToOptions<T>(rules: Rule<T>[]): T;

export declare function normalizeOptions(options: string | object, value): { [name: string]: string };

export declare function deviceMatch(device: Device, filter): boolean;

export declare function getFieldName(fullName: string): string;

export declare function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: Rule<T>[]): Rule<T>[];
