import { compileGetter, ItemLike } from '@devextreme/interim';
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
  itemRender?: (data: ItemLike, index?: number) => JSX.Element;
  itemComponent?: ComponentType<ItemComponentProps>;
  valueExpr?: string;
  displayExpr?: string;
}

type ValueGetter = <T>(item: ItemLike) => T;
type LabelGetter = (item: ItemLike) => string;

//* Component={"name":"RadioGroupCompatible", "jQueryRegistered":true}
export function RadioGroupCompatible<T>({
  items,
  itemRender,
  itemComponent: ItemComponent,
  valueExpr,
  displayExpr,
  ...radioGroupProps
}: CompatibleRadioGroupProps<T>) {
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
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RadioGroup<T> {...radioGroupProps}>
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
  );
}
