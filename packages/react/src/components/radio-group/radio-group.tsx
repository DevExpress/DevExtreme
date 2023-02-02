/* eslint-disable react/jsx-props-no-spreading, import/exports-last */
import {
  RADIO_GROUP_ACTIONS as ACTIONS,
  createContainerPropsSelector,
  createRadioGroupStore,
<<<<<<< HEAD
  RADIO_GROUP_CONTAINER_PROPS_MAPPER as PROPS_MAPPERS,
=======
  RADIO_GROUP_CONTAINER_PROPS_BUILDER as PROP_MAPPER,
>>>>>>> f9a364655e (R2 React RG: Complete compatible base widget functionality.)
} from '@devextreme/components';
import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  PropsWithChildren,
  useMemo,
  useRef,
} from 'react';
import {
  useCallbackRef, useCustomComponentRef, useSecondEffect, useStoreSelector,
} from '../../internal/hooks';
import { EditorProps, FocusableProps, WithCustomRef } from '../../internal/props';
import { RadioGroupStoreContext } from '../radio-common';

import '@devextreme/styles/src/radio-group/radio-group.scss';

export type RadioGroupRef = {
  focus(options?: FocusOptions): void,
};

function RadioGroupInternal<T>({ componentRef, ...props }: RadioGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // NOTE: Workaround for the useImperativeHandler hook.
  useCustomComponentRef(
    componentRef,
    () => ({
      focus(options?: FocusOptions) {
        containerRef.current?.focus(options);
      },
    }),
    [containerRef.current],
  );

  const isValueControlled = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
<<<<<<< HEAD
    readonly: PROPS_MAPPERS.getDomOptions(props),
=======
    readonly: PROP_MAPPER.getDomOptions(props),
>>>>>>> f9a364655e (R2 React RG: Complete compatible base widget functionality.)
    value: isValueControlled ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode: isValueControlled,
      changeCallback: (value: T) => { valueChange.current(value); },
    },
  }), []);

  const containerProps = useStoreSelector(store, createContainerPropsSelector, []);

  useSecondEffect(() => {
    if (isValueControlled) {
      store.addUpdate(ACTIONS.updateValue(props.value));
    }
  }, [props.value]);

<<<<<<< HEAD
  const readonlyValues = PROPS_MAPPERS.getDomOptions(props);
=======
  const readonlyValues = PROP_MAPPER.getDomOptions(props);
>>>>>>> f9a364655e (R2 React RG: Complete compatible base widget functionality.)
  useSecondEffect(() => {
    store.addUpdate(ACTIONS.updateReadonly(readonlyValues));
  }, [...Object.values(readonlyValues)]);

  useSecondEffect(() => {
    store.commitPropsUpdates();
  });

  return (
    <RadioGroupStoreContext.Provider value={store}>
      <div
        ref={containerRef}
        className={`dxr-radio-group ${containerProps.cssClass.join(' ')}`}
        {...containerProps.attributes}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      >
        {props.name
          ? Children.map(
            props.children,
            child => (
              isValidElement<EditorProps<T>>(child)
                ? cloneElement(child, { name: props.name })
                : child
            ),
          )
          : props.children}
      </div>
    </RadioGroupStoreContext.Provider>
  );
}

export type RadioGroupProps<T> = PropsWithChildren<
EditorProps<T>
& FocusableProps
& WithCustomRef<RadioGroupRef>
>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupInternal) as <T>(
  props: RadioGroupProps<T>,
) => ReturnType<typeof RadioGroupInternal>;
