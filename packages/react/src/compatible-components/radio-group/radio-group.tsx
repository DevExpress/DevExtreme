/* eslint-disable react/jsx-props-no-spreading, react/jsx-handler-names */
import { RootContainerDomOptionsCompatible } from '@devextreme/components/src';
import { DomOptionsCompatible } from '@devextreme/components/src/root-container/types';
import { compileGetter, ItemLike } from '@devextreme/interim';
import { ComponentType } from 'react';
import { RadioButton } from '../../components/radio-button';
import {
  RadioGroup,
  RadioGroupProps,
} from '../../components/radio-group';
import { useCompatibleLifecycle } from '../../internal/hooks';
import {
  CompatibleOmittedProps,
  FocusablePropsCompatible, LifecyclePropsCompatible,
} from '../../internal/props';

type ItemComponentProps = {
  data: ItemLike;
};

type CompatibleRadioGroupProps<T> = Omit<RadioGroupProps<T>, CompatibleOmittedProps>
& FocusablePropsCompatible
& LifecyclePropsCompatible
& Partial<RootContainerDomOptionsCompatible['accessKey']>
& Partial<RootContainerDomOptionsCompatible['size']>
& Partial<DomOptionsCompatible['visible']>
& {
  items: Array<ItemLike>;
  itemRender?: (data: ItemLike, index?: number) => JSX.Element;
  itemComponent?: ComponentType<ItemComponentProps>;
  valueExpr?: string;
  displayExpr?: string;
};

type ValueGetter = <T>(item: ItemLike) => T;
type LabelGetter = (item: ItemLike) => string;

//* Component={"name":"RadioGroupCompatible", "jQueryRegistered":true}
export function RadioGroupCompatible<T>({
  items,
  itemRender,
  itemComponent: ItemComponent,
  valueExpr,
  displayExpr,
  className,
  style,
  ...otherProps
}: CompatibleRadioGroupProps<T>) {
  useCompatibleLifecycle(otherProps);

  const getItemLabel = compileGetter(displayExpr || '') as LabelGetter;
  const getItemValue = compileGetter(valueExpr || '') as ValueGetter;

  const renderLabel = (item: ItemLike, index: number) => {
    if (ItemComponent) {
      return <ItemComponent data={item} />;
    }
    if (itemRender) {
      return itemRender(item, index);
    }
    return getItemLabel(item);
  };

  const cssStyle = {
    ...style,
    width: otherProps.width || '',
    height: otherProps.height || '',
  };

  return (
    (otherProps.visible ?? true)
      ? (
        <RadioGroup<T>
          {...otherProps}
          className={className}
          style={cssStyle}
          shortcutKey={otherProps.accessKey}
          onFocus={otherProps.onFocusIn}
          onBlur={otherProps.onFocusOut}
        >
          {items.map((item, index) => {
            const value = getItemValue(item);
            const key = `${value}-${index}`;
            return (
              <RadioButton
                key={key}
                value={value}
                label={renderLabel(item, index)}
              />
            );
          })}
        </RadioGroup>
      )
      : null
  );
}
