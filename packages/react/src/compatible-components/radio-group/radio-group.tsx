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

interface CompatibleRadioGroupProps<T> extends RadioGroupProps<T> {
  items: Array<ItemLike>;
  // eslint-disable-next-line react/require-default-props
  itemRender?: (data: ItemLike, index?: number) => JSX.Element;
  // eslint-disable-next-line react/require-default-props
  valueExpr?: string;
  // eslint-disable-next-line react/require-default-props
  displayExpr?: string;
}

const valuePropNameDefault = 'text';

export function RadioGroupCompatible({
  items,
  itemRender,
  defaultValue,
  valueExpr,
  displayExpr,
}: CompatibleRadioGroupProps<RadioGroupValue>) {
  const getItemLabel = createItemPropGetter(displayExpr || valuePropNameDefault);
  const getItemValue = createItemPropGetter(valueExpr || valuePropNameDefault);

  return (
    <RadioGroup defaultValue={defaultValue}>
      {items.map((item, index) => (
        <RadioButton
          value={getItemValue(item)}
          label={itemRender ? itemRender(item, index) : getItemLabel(item)}
        />
      ))}
    </RadioGroup>
  );
}
