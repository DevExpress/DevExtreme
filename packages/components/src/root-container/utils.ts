import { getKeys, PipeFunc, UnknownRecord } from '@devextreme/core';
import {
  Builder,
  BuilderBase,
  DomAttributes,
  Props,
} from './types';

export function buildCss(
  condition: boolean,
  className: string,
): PipeFunc<Props> {
  return (props: Props) => (
    condition
      ? {
        ...props,
        cssClass: [
          ...props.cssClass,
          className,
        ],
      }
      : props
  );
}

export function buildAttributes(
  condition: boolean,
  attributes: DomAttributes,
): PipeFunc<Props> {
  return (props: Props) => (
    condition
      ? {
        ...props,
        attributes: {
          ...props.attributes,
          ...attributes,
        },
      }
      : props
  );
}

export function createGetDomOptionsMethod<T extends UnknownRecord>(
  defaultValue: T,
): (params: Partial<T>) => T {
  return (params) => getKeys(defaultValue).reduce(
    (result, key) => ({
      ...result,
      [key]: params[key] ?? defaultValue[key],
    }), {} as T,
  );
}

export function createChainMethod<T extends UnknownRecord,
  K extends UnknownRecord,
  >(
  fistBuilder: BuilderBase<T>,
): (builder: BuilderBase<K>) => Builder<T & K> {
  return (secondBuilder: BuilderBase<K>) => {
    const defaultValue = {
      ...fistBuilder.defaultValue,
      ...secondBuilder.defaultValue,
    };

    const build = (
      domOptions: T & K,
    ): PipeFunc<Props> => (
      props,
    ) => {
      const firstProps = fistBuilder.build(domOptions)(props);
      return secondBuilder.build(domOptions)(firstProps);
    };

    const newBuilder: BuilderBase<T & K> = {
      defaultValue,
      build,
    };

    return {
      ...newBuilder,
      getDomOptions: createGetDomOptionsMethod(defaultValue),
      chain: createChainMethod(newBuilder),
    };
  };
}

export function createBuilder<T extends UnknownRecord>(
  defaultValue: T,
  build: (domOptions: T) => PipeFunc<Props>,
): Builder<T> {
  const builder = {
    defaultValue,
    build,
  };

  return {
    ...builder,
    getDomOptions: createGetDomOptionsMethod(defaultValue),
    chain: createChainMethod(builder),
  };
}
