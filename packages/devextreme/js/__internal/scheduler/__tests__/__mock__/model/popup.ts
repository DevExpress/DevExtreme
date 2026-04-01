import { within } from '@testing-library/dom';

export class PopupModel {
  element: HTMLDivElement;

  private readonly queries: ReturnType<typeof within>;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.queries = within(element);
  }

  get deleteSeriesButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Delete series' }) as HTMLElement;
  }

  get deleteAppointmentButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Delete appointment' }) as HTMLElement;
  }

  getLabelIdByText = (labelText: string): string => {
    const labels = Array.from(this.element.querySelectorAll('label'));

    const label = labels.find((l) => l?.textContent?.trim()?.startsWith(labelText));

    if (!label) {
      throw new Error(`Label with text "${labelText}" not found`);
    }

    const forId = label.getAttribute('for');
    if (!forId) {
      throw new Error(`Label with text "${labelText}" has no "for" attribute`);
    }
    return forId;
  };

  getInputByLabel = (labelText: string): HTMLInputElement => {
    const forId = this.getLabelIdByText(labelText);

    const input = this.element.querySelector(`input#${forId}`) as HTMLInputElement;

    if (!input) {
      throw new Error(`Input with id "${forId}" not found`);
    }

    return input;
  };

  setInputValueByLabel = (labelText: string, value: string): HTMLInputElement => {
    const input = this.getInputByLabel(labelText);
    if (!input) {
      throw new Error(`Input with label "${labelText}" not found`);
    }
    input.value = '';

    value.split('').forEach((char) => {
      input.value += char;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: char }));
      input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, key: char }));
      input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: char }));
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));

    return input;
  };

  getSwitchByName = (name: string): HTMLInputElement => {
    const hiddenInput = this.element.querySelector<HTMLInputElement>(`input[name=${name}]`);

    if (!hiddenInput) {
      throw new Error(`Switch with name "${name}" not found`);
    }

    return hiddenInput;
  };

  selectRadio = (value: string): Element | null => {
    const group = this.element.querySelector('[role="radiogroup"]');
    if (!group) throw new Error('Radiogroup not found');

    const radios = Array.from(group.querySelectorAll('[role="radio"]'));

    const target = radios.find((radio) => {
      const label = radio.getAttribute('aria-label')?.trim();
      const text = radio.textContent?.trim();
      return label === value || text === value;
    });

    if (!target) throw new Error(`Radio with value "${value}" not found`);

    radios.forEach((r) => {
      r.setAttribute('aria-checked', 'false');
      r.classList.remove('dx-item-selected', 'dx-radiobutton-checked');
    });

    target.setAttribute('aria-checked', 'true');
    target.classList.add('dx-item-selected', 'dx-radiobutton-checked');

    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    return target;
  };

  getSelectedRadio = (): HTMLElement | null => this.element.querySelector('[role="radio"][aria-checked="true"]');

  getSelectedRadioValue = (): string | null => {
    const selected = this.getSelectedRadio();
    return selected?.getAttribute('aria-label') ?? selected?.textContent?.trim() ?? null;
  };

  getForm = (): HTMLElement | null => this.element.querySelector('.dx-form');

  getTitle = (): HTMLElement | null => document.querySelector('.dx-popup-title');

  getDoneButton = (): HTMLButtonElement => {
    const doneButton = this.element.querySelector('.dx-button.dx-popup-done') as HTMLButtonElement;

    if (!doneButton) {
      throw new Error('Done button not found');
    }

    return doneButton;
  };

  getCancelButton = (): HTMLButtonElement => {
    const cancelButton = this.element.querySelector('.dx-button.dx-popup-cancel') as HTMLButtonElement;

    if (!cancelButton) {
      throw new Error('Cancel button not found');
    }

    return cancelButton;
  };

  getCloseButton = (): HTMLButtonElement => this.queries.getByRole('button', { name: 'Close' }) as HTMLButtonElement;

  getFormEditor = (fieldName: string): HTMLElement | null => {
    const form = this.getForm();
    if (form === null) {
      return null;
    }
    return form.querySelector(`[data-field="${fieldName}"]`);
  };

  getEditSeriesButton = (): HTMLElement => this.queries.getByRole('button', { name: 'Edit series' }) as HTMLElement;
}
