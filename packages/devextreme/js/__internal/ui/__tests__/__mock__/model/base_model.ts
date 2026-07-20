export class BaseModel<TElement extends HTMLElement | null = HTMLElement> {
  constructor(protected readonly root: TElement) {}

  public getElement(): TElement {
    return this.root;
  }
}
