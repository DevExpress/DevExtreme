/* eslint-disable import/exports-last */
import {
  createSelector,
  createStore,
  Selector,
  StateConfigMap,
  Store,
  UpdateStateAction,
} from '@devextreme/core';
import {
  ROOT_CONTAINER_PROP_MAPPERS,
  RootContainerProps,
} from '../root-container';
import { ExtractMapperType } from '../root-container/types';

// === base component ===
export const RADIO_GROUP_CONTAINER_PROPS_MAPPER = ROOT_CONTAINER_PROP_MAPPERS.accessKey
  .chain(ROOT_CONTAINER_PROP_MAPPERS.active)
  .chain(ROOT_CONTAINER_PROP_MAPPERS.attributes)
  .chain(ROOT_CONTAINER_PROP_MAPPERS.disabled)
  .chain(ROOT_CONTAINER_PROP_MAPPERS.focus)
  .chain(ROOT_CONTAINER_PROP_MAPPERS.hint)
  .chain(ROOT_CONTAINER_PROP_MAPPERS.hover);

export type RadioGroupContainerDomOptions =
  ExtractMapperType<typeof RADIO_GROUP_CONTAINER_PROPS_MAPPER>;

// === props ===
export type ValueProps<T> = {
  value?: T;
};

export type ReadonlyProps = RadioGroupContainerDomOptions;

// eslint-disable-next-line @typescript-eslint/ban-types
export type TemplateProps = {};

// === state ===
export type RadioGroupState<T> = ValueProps<T> & { readonly: ReadonlyProps };

// === actions ===

function updateValueAction<T>(
  value: T | undefined,
): UpdateStateAction<RadioGroupState<T>> {
  return (state) => ({
    ...state,
    value,
  });
}

function updateReadonlyAction<T>(
  readonlyPart: Partial<ReadonlyProps>,
): UpdateStateAction<RadioGroupState<T>> {
  return (state) => ({
    ...state,
    readonly: {
      ...state.readonly,
      ...readonlyPart,
    },
  });
}

export const RADIO_GROUP_ACTIONS = {
  updateValue: updateValueAction,
  updateReadonly: updateReadonlyAction,
};

// TODO Vinogradov: Make the aggregate const for RG selectors (like RADIO_GROUP_ACTIONS).
// === selectors ===
export function createCheckedSelector<T>(
  value: T | undefined,
): Selector<RadioGroupState<T>, boolean> {
  return createSelector(
    (state) => ({ stateValue: state.value }),
    ({ stateValue }: { stateValue: T | undefined }) => stateValue === value,
  );
}

export function createContainerPropsSelector<T>()
: Selector<RadioGroupState<T>, RootContainerProps> {
  return createSelector(
    (state) => state.readonly,
    (
      readonly: ReadonlyProps,
    ) => RADIO_GROUP_CONTAINER_PROPS_MAPPER.map({ cssClass: [], attributes: {} }, readonly),
  );
}

// === component ===
export type RadioGroupStore<T> = Store<RadioGroupState<T>>;

export function createRadioGroupStore<T>(
  initialState: RadioGroupState<T>,
  config: StateConfigMap<RadioGroupState<T>>,
): RadioGroupStore<T> {
  return createStore(initialState, config);
}
