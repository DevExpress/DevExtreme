import { ElementRef } from '@angular/core';

export function isSlotEmpty(slot: ElementRef | undefined): boolean {
  if (slot?.nativeElement) {
    const nativeEl = slot.nativeElement;
    const children = nativeEl.parentElement ? [...nativeEl.parentElement.childNodes] : [];
    const startIndex = children.indexOf(nativeEl);
    const endIndex = children
      .findIndex((node, index) => index > startIndex && (node as HTMLElement)?.classList?.contains('dx-slot-end'));
    return !children
      .slice(startIndex + 1, endIndex - 1)
      // nodeType == 8 is comment DOM node.
      // If slot content contains only commented node it's empty.
      .some((node) => node.nodeType !== 8);
  }
  return false;
}
