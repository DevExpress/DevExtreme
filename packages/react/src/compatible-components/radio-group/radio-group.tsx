import { ComponentType } from 'react';
import { RadioButton } from '../../components/radio-button';
import {
  RadioGroup,
  RadioGroupProps,
  RadioGroupValue,
} from '../../components/radio-group';

// Types temporary taken from devextreme ------
interface CollectionWidgetItem {
  disabled?: boolean;
  html?: string;
  // template?: ....
  text?: string;
  visible?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemLike = string | CollectionWidgetItem | any;
//------------------------------

const createItemPropGetter = (propName: string) => (item: ItemLike) => (
  Object.prototype.hasOwnProperty.call(item, propName) ? item[propName] : item
);

interface ItemComponentProps {
  data: ItemLike
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

const valuePropNameDefault = 'text';

export function RadioGroupCompatible({
  items,
  itemRender,
  itemComponent: ItemComponent,
  defaultValue,
  valueExpr,
  displayExpr,
}: CompatibleRadioGroupProps<RadioGroupValue>) {
  const getItemLabel = createItemPropGetter(displayExpr || valuePropNameDefault);
  const getItemValue = createItemPropGetter(valueExpr || valuePropNameDefault);

  const renderLabel = (item: ItemLike, index: number) => {
    if (ItemComponent) {
      return (<ItemComponent data={item} />);
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
