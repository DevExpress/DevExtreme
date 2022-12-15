import { ItemLike } from '@devextreme/interim';
import { ComponentType } from 'react';
import { RadioButton } from '../../components/radio-button';
import {
  RadioGroup,
  RadioGroupProps,
  RadioGroupValue,
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

// TODO: uncomment after fixing interim package import problems
// type ValueGetter = (item: ItemLike) => RadioGroupValue;
// type LabelGetter = (item: ItemLike) => string;

const createItemPropGetter = (propName: string) => (item: ItemLike) => (
  Object.prototype.hasOwnProperty.call(item, propName) ? item[propName] : item
);

const valuePropNameDefault = 'text';

export function RadioGroupCompatible<TValue extends RadioGroupValue>({
  items,
  itemRender,
  itemComponent: ItemComponent,
  defaultValue,
  valueExpr,
  displayExpr,
}: CompatibleRadioGroupProps<TValue>) {
  // TODO: uncomment after fixing interim package import problems
  // const getItemLabel = compileGetter(displayExpr || valuePropNameDefault) as LabelGetter;
  // const getItemValue = compileGetter(valueExpr || valuePropNameDefault) as ValueGetter;
  const getItemLabel = createItemPropGetter(displayExpr || valuePropNameDefault);
  const getItemValue = createItemPropGetter(valueExpr || valuePropNameDefault);

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
