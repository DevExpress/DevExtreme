import { UnknownRecord } from '@devextreme/core';

export type DomAttributes = Record<string, unknown>;

export type Props = {
  cssClass: string[];
  attributes: DomAttributes,
};

export type DomOptions = {
  accessKey: {
    // NOTE: this prop named shortcut because accessKey name causes a11y eslint errors.
    // jsx-a11y/no-access-key
    shortcutKey?: string;
  },
  active: {
    activeStateEnabled: boolean;
  },
  attributes: {
    attributes: DomAttributes,
  },
  disabled: {
    disabled: boolean,
  },
  focus: {
    focusStateEnabled: boolean,
    tabIndex: number,
  },
  hint: {
    hint?: string,
  },
  hover: {
    hoverStateEnabled: boolean,
  },
};

export type DomOptionsCompatible = DomOptions & {
  accessKey: {
    accessKey?: string;
  },
  size: {
    width?: string;
    height?: string;
  },
  visible: {
    visible: boolean;
  }
};

export type PropMapFunc<T> = (props: Props, domOptions: T) => Props;

export type PropMappers = {
  [K in keyof DomOptions]: Mapper<DomOptions[K]>
};

export type MapperBase<T extends UnknownRecord> = {
  defaultValue: T;
  map: PropMapFunc<T>;
};

export type Mapper<T extends UnknownRecord> = MapperBase<T>
& {
  getDomOptions: (params: Partial<T>) => T;
  chain: <K extends UnknownRecord>(mapper: MapperBase<K>) => Mapper<T & K>
};

export type ExtractMapperType<Type> = Type extends Mapper<infer T> ? T : never;
