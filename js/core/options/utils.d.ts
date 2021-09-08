import {
    Device,
} from '../devices';

import {
    DefaultOptionsRule,
} from './index';

// TODO: Remove after https://trello.com/c/me612NxO/2872-rename-rule-to-defauloptionrule is ready
export type Rule<T> = DefaultOptionsRule<T>;

export function convertRulesToOptions<T>(rules: DefaultOptionsRule<T>[]): T;

export function normalizeOptions(options: string | object, value): { [name: string]: string };

export function deviceMatch(device: Device, filter): boolean;

export function getFieldName(fullName: string): string;

export function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: DefaultOptionsRule<T>[]): DefaultOptionsRule<T>[];
