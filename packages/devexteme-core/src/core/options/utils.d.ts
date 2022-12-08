import {
    Device,
} from '../devices';

import {
    DefaultOptionsRule,
} from '../options';

export {
    DefaultOptionsRule,
} from '../options';

export function convertRulesToOptions<T>(rules: DefaultOptionsRule<T>[]): T;

export function normalizeOptions(options: string | object, value: any): { [name: string]: string };

export function deviceMatch(device: Device, filter: any): boolean;

export function getFieldName(fullName: string): string;

export function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: DefaultOptionsRule<T>[]): DefaultOptionsRule<T>[];
