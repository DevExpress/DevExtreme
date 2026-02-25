const SELECTORS = {
  fieldValue: 'dx-cardview-field-value',
  fieldCaption: 'dx-cardview-field-caption',
};

export class CardModel {
  constructor(private readonly element: HTMLElement) {}

  public getFieldValues(): NodeListOf<HTMLElement> {
    return this.element.querySelectorAll(`.${SELECTORS.fieldValue}`);
  }

  public getFieldValue(index: number): string | null {
    const fieldValues = this.getFieldValues();
    return fieldValues[index]?.textContent?.trim() ?? null;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
