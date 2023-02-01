import { PipeFunc, UnknownRecord } from '@devextreme/core';

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

export type PropBuilders = {
  [K in keyof DomOptions]: Builder<DomOptions[K]>
};

export type BuilderBase<T extends UnknownRecord> = {
  defaultValue: T;
  build: (domOptions: T) => PipeFunc<Props>;
};

export type Builder<T extends UnknownRecord> = BuilderBase<T>
& {
  getDomOptions: (params: Partial<T>) => T;
  chain: <K extends UnknownRecord>(propBuilder: BuilderBase<K>) => Builder<T & K>
};
