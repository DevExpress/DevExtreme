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
  DEFAULT_ROOT_CONTAINER_PROPS,
  ROOT_CONTAINER_PROP_BUILDERS,
  RootContainerDomOptions,
  RootContainerProps,
} from '../root-container';

// === base component ===
export type RadioGroupContainerDomOptions = RootContainerDomOptions['accessKey']
& RootContainerDomOptions['active']
& RootContainerDomOptions['attributes']
& RootContainerDomOptions['disabled']
& RootContainerDomOptions['focus']
& RootContainerDomOptions['hint']
& RootContainerDomOptions['hover'];

export const RADIO_GROUP_CONTAINER_PROPS_BUILDER = ROOT_CONTAINER_PROP_BUILDERS.accessKey
  .chain(ROOT_CONTAINER_PROP_BUILDERS.active)
  .chain(ROOT_CONTAINER_PROP_BUILDERS.attributes)
  .chain(ROOT_CONTAINER_PROP_BUILDERS.disabled)
  .chain(ROOT_CONTAINER_PROP_BUILDERS.focus)
  .chain(ROOT_CONTAINER_PROP_BUILDERS.hint)
  .chain(ROOT_CONTAINER_PROP_BUILDERS.hover);

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
    ) => RADIO_GROUP_CONTAINER_PROPS_BUILDER.build(readonly)(DEFAULT_ROOT_CONTAINER_PROPS),
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
