/* eslint-disable react/jsx-props-no-spreading */
import {
  createContainerPropsSelector,
  createRadioGroupStore,
  RADIO_GROUP_ACTIONS,
  RADIO_GROUP_CONTAINER_PROPS_BUILDER,
} from '@devextreme/components';
import {
  Children,
  cloneElement,
  ForwardedRef,
  forwardRef,
  isValidElement,
  memo,
  PropsWithChildren,
  useMemo,
} from 'react';
import { useCallbackRef, useSecondEffect, useStoreSelector } from '../../internal/hooks';
import { EditorProps, FocusableComponent } from '../../internal/props';
import { RadioGroupStoreContext } from '../radio-common';

import '@devextreme/styles/src/radio-group/radio-group.scss';

function RadioGroupInternal<T>(
  props: RadioGroupProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isValueControlled = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
    readonly: RADIO_GROUP_CONTAINER_PROPS_BUILDER.getDomOptions(props),
    value: isValueControlled ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode: isValueControlled,
      changeCallback: (value: T) => { valueChange.current(value); },
    },
  }), []);

  const containerProps = useStoreSelector(store, createContainerPropsSelector, []);

  const readonlyValues = RADIO_GROUP_CONTAINER_PROPS_BUILDER.getDomOptions(props);
  useSecondEffect(() => {
    if (isValueControlled) {
      store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(props.value));
    }

    store.addUpdate(RADIO_GROUP_ACTIONS.updateReadonly(readonlyValues));

    store.commitPropsUpdates();
  }, [props.value, ...Object.values(readonlyValues)]);

  return (
    <RadioGroupStoreContext.Provider value={store}>
      <div
        ref={ref}
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

export type RadioGroupProps<T> = PropsWithChildren<EditorProps<T> & FocusableComponent>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(forwardRef(RadioGroupInternal)) as typeof RadioGroupInternal;
