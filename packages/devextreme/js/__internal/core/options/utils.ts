import type { Device } from '@js/core/devices';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options';
import { findBestMatches } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isEmptyObject, isFunction } from '@js/core/utils/type';

type NestedOptionGetter = (obj: object, options: { functionsAsIs: boolean }) => unknown;

const cachedGetters: Record<string, NestedOptionGetter> = {};

export const deviceMatch = (
  device: Device,
  filter: Device | Device[],
): boolean => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;

export const convertRulesToOptions = <T>(rules: DefaultOptionsRule<T>[]): T => {
  const currentDevice = devices.current();
  // @ts-expect-error {} is not assignable to T
  return rules.reduce((options, { device, options: ruleOptions }) => {
    const deviceFilter = device || {};
    const match = isFunction(deviceFilter)
      ? deviceFilter(currentDevice)
      : deviceMatch(currentDevice, deviceFilter);

    if (match) {
      extend(true, options, ruleOptions);
    }
    return options;
  }, {});
};

export const normalizeOptions = (
  options: string | Record<string, unknown>,
  value: unknown,
): Record<string, unknown> => (typeof options !== 'string' ? options : { [options]: value });

type FieldName<T extends string> = T extends `${string}.${infer TRest}` ? FieldName<TRest> : T;

export function getFieldName<T extends string>(fullName: T): FieldName<T>;
export function getFieldName(fullName: string): string {
  return fullName.substr(fullName.lastIndexOf('.') + 1);
}

export const getParentName = (
  fullName: string,
): string => fullName.substr(0, fullName.lastIndexOf('.'));

export const getNestedOptionValue = function (optionsObject: object, name: string): unknown {
  cachedGetters[name] = cachedGetters[name] || compileGetter(name);
  return cachedGetters[name](optionsObject, { functionsAsIs: true });
};

export const createDefaultOptionRules = <T>(
  options: DefaultOptionsRule<T>[] = [],
): DefaultOptionsRule<T>[] => options;
