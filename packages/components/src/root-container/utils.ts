import { getKeys, UnknownRecord } from '@devextreme/core';
import {
  DomAttributes,
  Mapper,
  MapperBase, PropMapFunc,
  Props,
} from './types';

export function mapCss(
  props: Props,
  condition: boolean,
  className: string,
): Props {
  if (condition) {
    props.cssClass.push(className);
  }

  return props;
}

export function mapAttributes(
  props: Props,
  condition: boolean,
  attributes: DomAttributes,
): Props {
  if (condition) {
    props.attributes = {
      ...props.attributes,
      ...attributes,
    };
  }

  return props;
}

export function createGetDomOptionsMethod<T extends UnknownRecord>(
  defaultValue: T,
): (params: Partial<T>) => T {
  return (params) => getKeys(defaultValue).reduce(
    (result, key) => {
      result[key] = params[key] ?? defaultValue[key];
      return result;
    }, {} as T,
  );
}

export function createChainMethod<T extends UnknownRecord,
  K extends UnknownRecord,
  >(
  firstMapper: MapperBase<T>,
): (mapper: MapperBase<K>) => Mapper<T & K> {
  return (secondMapper: MapperBase<K>) => {
    const defaultValue = {
      ...firstMapper.defaultValue,
      ...secondMapper.defaultValue,
    };

    const map = (props: Props, domOptions: T & K): Props => {
      const modifiedProps = firstMapper.map(props, domOptions);
      return secondMapper.map(modifiedProps, domOptions);
    };

    const newBuilder: MapperBase<T & K> = {
      defaultValue,
      map,
    };

    return {
      ...newBuilder,
      getDomOptions: createGetDomOptionsMethod(defaultValue),
      chain: createChainMethod(newBuilder),
    };
  };
}

export function createMapper<T extends UnknownRecord>(
  defaultValue: T,
  map: PropMapFunc<T>,
): Mapper<T> {
  const builder = {
    defaultValue,
    map,
  };

  return {
    ...builder,
    getDomOptions: createGetDomOptionsMethod(defaultValue),
    chain: createChainMethod(builder),
  };
}
