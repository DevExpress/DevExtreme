/* eslint-disable react/jsx-props-no-spreading */
import {
  RADIO_GROUP_ACTIONS as ACTIONS,
  createContainerPropsSelector,
  createRadioGroupStore,
  RADIO_GROUP_CONTAINER_PROPS_MAPPER as PROPS_MAPPERS,
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
import { withEditor } from '../common/hocs/with-editor';
import { RadioGroupStoreContext } from '../radio-common';

import '@devextreme/styles/src/radio-group/radio-group.scss';

function RadioGroupInternal<T>(
  props: RadioGroupProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isValueControlled = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
    readonly: PROPS_MAPPERS.getDomOptions(props),
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

  const readonlyValues = PROPS_MAPPERS.getDomOptions(props);
  useSecondEffect(() => {
    store.addUpdate(ACTIONS.updateReadonly(readonlyValues));
  }, [...Object.values(readonlyValues)]);

  useSecondEffect(() => {
    store.commitPropsUpdates();
  });

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

const RadioGroupEditor = withEditor(RadioGroupInternal);

export type RadioGroupProps<T> = PropsWithChildren<EditorProps<T> & FocusableComponent>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(forwardRef(RadioGroupEditor)) as typeof RadioGroupEditor;
