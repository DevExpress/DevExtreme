import domAdapter from '../../../../core/dom_adapter';

export function closestClass(child: HTMLDivElement, className: string): HTMLElement | null {
  let el: HTMLElement | null = child;
  const selector = `.${className}`;
  while (el !== null && el.nodeType === 1) {
    if ((domAdapter).elementMatches(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
