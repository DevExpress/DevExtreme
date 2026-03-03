import { within } from '@testing-library/dom';

export class ToolbarModel {
  element: HTMLElement;

  private readonly queries: ReturnType<typeof within>;

  constructor(element: HTMLElement) {
    this.element = element;
    this.queries = within(element);
  }

  getPrevButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Previous page' }) as HTMLElement;
  }

  getNextButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Next page' }) as HTMLElement;
  }
}
