import { compileGetter, ItemLike } from '@devextreme/interim';
import { RadioGroupValue } from '@devextreme/components';
import { ComponentType } from 'react';
import { RadioButton } from '../../components/radio-button';
import {
  RadioGroup,
  RadioGroupProps,
} from '../../components/radio-group';

interface ItemComponentProps {
  data: ItemLike;
}

interface CompatibleRadioGroupProps<T> extends RadioGroupProps<T> {
  items: Array<ItemLike>;
  // eslint-disable-next-line react/require-default-props
  itemRender?: (data: ItemLike, index?: number) => JSX.Element;
  // eslint-disable-next-line react/require-default-props
  itemComponent?: ComponentType<ItemComponentProps>;
  // eslint-disable-next-line react/require-default-props
  valueExpr?: string;
  // eslint-disable-next-line react/require-default-props
  displayExpr?: string;
}

type ValueGetter = (item: ItemLike) => RadioGroupValue;
type LabelGetter = (item: ItemLike) => string;

const valuePropNameDefault = 'text';

export function RadioGroupCompatible<TValue extends RadioGroupValue>({
  items,
  itemRender,
  itemComponent: ItemComponent,
  defaultValue,
  valueExpr,
  displayExpr,
}: CompatibleRadioGroupProps<TValue>) {
  const getItemLabel = compileGetter(displayExpr || valuePropNameDefault) as LabelGetter;
  const getItemValue = compileGetter(valueExpr || valuePropNameDefault) as ValueGetter;

  const renderLabel = (item: ItemLike, index: number) => {
    if (ItemComponent) {
      return <ItemComponent data={item} />;
    }
    if (itemRender) {
      return itemRender(item, index);
    }
    return getItemLabel(item);
  };

  return (
    <RadioGroup defaultValue={defaultValue}>
      {items.map((item, index) => {
        const value = getItemValue(item);
        return (
          <RadioButton
            key={value}
            value={value}
            label={renderLabel(item, index)}
          />
        );
      })}
    </RadioGroup>
  );
}
