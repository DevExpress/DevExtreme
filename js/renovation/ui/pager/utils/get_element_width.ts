import getElementComputedStyle from '../../../utils/get_computed_style';
import { toNumber } from '../../../utils/type_conversion';

export function getElementWidth(element: Element | undefined): number {
  return toNumber(getElementComputedStyle(element)?.width);
}
export function getElementMinWidth(element: Element | undefined): number {
  return toNumber(getElementComputedStyle(element)?.minWidth);
}
