import type { BaseNestedOption, INestedOptionContainer } from './nested-option';
import { DEPRECATED_CONFIG_COMPONENTS } from './deprecated-config-map';

const warnedUsages = new Set<string>();

const LEGACY_CLASS_NAME_REGEXP = /^Dx([io])([A-Za-z0-9]+)Component$/;

type DeprecatedConfigEntry = Record<string, string>;

function getLegacySelector(nestedOption: BaseNestedOption): string | undefined {
  const className = nestedOption?.constructor?.name;
  if (!className) {
    return undefined;
  }

  const match = LEGACY_CLASS_NAME_REGEXP.exec(className);
  if (!match) {
    return undefined;
  }

  const [, type, rest] = match;
  const prefix = type === 'o' ? 'dxo-' : 'dxi-';

  return `${prefix}${toKebabCase(rest)}`;
}

function getHostMapping(host: INestedOptionContainer | undefined): DeprecatedConfigEntry | undefined {
  const visited = new Set<INestedOptionContainer>();
  let current = host;

  while (current && !visited.has(current)) {
    visited.add(current);

    const ctorName = current.constructor?.name;
    if (ctorName && Object.prototype.hasOwnProperty.call(DEPRECATED_CONFIG_COMPONENTS, ctorName)) {
      return DEPRECATED_CONFIG_COMPONENTS[ctorName] as DeprecatedConfigEntry;
    }

    current = (current as { _host?: INestedOptionContainer })._host;
  }

  return undefined;
}

export function warnIfLegacyNestedComponent(nestedOption: BaseNestedOption, host: INestedOptionContainer | undefined): void {
  const legacySelector = getLegacySelector(nestedOption);
  if (!legacySelector) {
    return;
  }

  const mappingEntry = getHostMapping(host);
  if (!mappingEntry) {
    return;
  }

  const replacement = mappingEntry[legacySelector];
  if (!replacement) {
    return;
  }

  const cacheKey = `${legacySelector}|${replacement}`;
  if (warnedUsages.has(cacheKey)) {
    return;
  }

  warnedUsages.add(cacheKey);

  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(
      `You are using the legacy ${legacySelector} configuration component. `
      + `We recommend upgrading to the new ${replacement} configuration component.`,
    );
    //TODO: link to docs article, when available
  }
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}