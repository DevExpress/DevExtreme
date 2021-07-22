import type {
    Device,
} from '../devices';

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export interface Rule<T> {
    device: ((device: Device) => boolean) | Device | Device[];
    options: RecursivePartial<T>;
}

export function convertRulesToOptions<T>(rules: Rule<T>[]): T;

export function normalizeOptions(options: string | object, value): { [name: string]: string };

export function deviceMatch(device: Device, filter): boolean;

export function getFieldName(fullName: string): string;

export function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: Rule<T>[]): Rule<T>[];
