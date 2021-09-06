import {
    Device,
} from '../devices';

import {
    DefaultsRule,
} from './index';

export function convertRulesToOptions<T>(rules: DefaultsRule<T>[]): T;

export function normalizeOptions(options: string | object, value): { [name: string]: string };

export function deviceMatch(device: Device, filter): boolean;

export function getFieldName(fullName: string): string;

export function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: DefaultsRule<T>[]): DefaultsRule<T>[];
