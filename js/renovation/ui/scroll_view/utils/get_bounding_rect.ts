import { DomRect } from '../common/types.d';

export function getBoundingRect(
  el: Element | undefined | null,
): DomRect {
  return el ? el.getBoundingClientRect() : {
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  };
}
