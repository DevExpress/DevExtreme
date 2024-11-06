export function querySelectorInSameDocument(el: HTMLElement, selector: string): HTMLElement | null {
  const root = el.getRootNode?.() as HTMLElement ?? document;

  return root.querySelector(selector);
}
