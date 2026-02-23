import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type dxForm from '@js/ui/form';
import type dxPopup from '@js/ui/popup';
import { within } from '@testing-library/dom';

const queryRequiredElement = (parent: HTMLElement, selector: string): HTMLElement => {
  const element = parent.querySelector(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  return element as HTMLElement;
};

export class PopupModel {
  element: HTMLDivElement;

  component: dxPopup;

  private readonly queries: ReturnType<typeof within>;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.queries = within(element);

    // @ts-expect-error
    this.component = $('.dx-scheduler-appointment-popup.dx-popup.dx-widget').dxPopup('instance') as dxPopup;
  }

  get dxForm(): dxForm {
    // @ts-expect-error
    return $(this.element.querySelector('.dx-form')).dxForm('instance') as dxForm;
  }

  get mainGroup(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-main-group');
  }

  get recurrenceGroup(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-recurrence-group');
  }

  get subjectIcon(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-subject-group .dx-scheduler-form-icon .dx-icon');
  }

  get recurrenceWeekDayButtons(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-days-of-week-buttons');
  }

  private getButtonByNameOrSelector(name: string, selector: string): HTMLElement {
    return this.queries.queryByRole('button', { name }) as HTMLElement
      ?? queryRequiredElement(this.element, selector);
  }

  get saveButton(): HTMLElement {
    return this.getButtonByNameOrSelector('Save', '.dx-button.dx-popup-done');
  }

  get cancelButton(): HTMLElement {
    return this.getButtonByNameOrSelector('Cancel', '.dx-button.dx-popup-cancel');
  }

  get closeButton(): HTMLElement {
    return this.getButtonByNameOrSelector('Close', '.dx-closebutton.dx-button');
  }

  get backButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Back' }) as HTMLElement;
  }

  get editSeriesButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Edit series' }) as HTMLElement;
  }

  get editAppointmentButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Edit appointment' }) as HTMLElement;
  }

  get recurrenceSettingsButton(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-recurrence-settings-button');
  }

  getLabelIdByText = (labelText: string): string => {
    const labels = Array.from(this.element.querySelectorAll('label'));

    const label = labels.find(
      (labelElement) => labelElement?.textContent?.trim()?.startsWith(labelText),
    );

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
    if (!group) {
      throw new Error('Radiogroup not found');
    }

    const radios = Array.from(group.querySelectorAll('[role="radio"]'));

    const target = radios.find((radio) => {
      const label = radio.getAttribute('aria-label')?.trim();
      const text = radio.textContent?.trim();
      return label === value || text === value;
    });

    if (!target) {
      throw new Error(`Radio with value "${value}" not found`);
    }

    radios.forEach((radio) => {
      radio.setAttribute('aria-checked', 'false');
      radio.classList.remove('dx-item-selected', 'dx-radiobutton-checked');
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

  getCloseButton = (): HTMLButtonElement => {
    const closeButton = this.element.querySelector('.dx-closebutton.dx-button') as HTMLButtonElement;

    if (!closeButton) {
      throw new Error('Close button not found');
    }

    return closeButton;
  };

  getFormEditor = (fieldName: string): HTMLElement | null => this.getForm()?.querySelector(`[data-field="${fieldName}"]`) ?? null;

  getEditSeriesButton = (): HTMLElement => this.editSeriesButton;

  isMainGroupVisible(): boolean {
    return !this.mainGroup.classList.contains('dx-scheduler-form-main-group-hidden');
  }

  isRecurrenceGroupVisible(): boolean {
    return !this.recurrenceGroup.classList.contains('dx-scheduler-form-recurrence-group-hidden');
  }

  getInput = (editorName: string): HTMLInputElement => {
    const editor = this.dxForm.getEditor(editorName);

    let $input: dxElementWrapper | undefined | null = null;

    if (editorName === 'startDateTimeZoneEditor' || editorName === 'endDateTimeZoneEditor') {
      $input = editor?.$element().find('input[type="hidden"]');
    }

    if (!$input?.length) {
      $input = editor?.$element().find('.dx-texteditor-input');
    }

    if (!$input?.length) {
      $input = editor?.$element().find('input');
    }

    if (!$input?.length) {
      throw new Error(`Input element of editor with name "${editorName}" not found`);
    }

    return $input.get(0) as HTMLInputElement;
  };

  getInputValue = (editorName: string): string => {
    const input = this.getInput(editorName);
    return input.value as unknown as string;
  };

  setInputValue = (editorName: string, value: string | number | Date | boolean | null): void => {
    this.dxForm.getEditor(editorName)?.option('value', value);
  };

  isInputVisible = (editorName: string): boolean => {
    const editor = this.dxForm.getEditor(editorName);
    return !!editor?.$element().get(0).isConnected;
  };

  getWeekDaysSelection = (): boolean[] => {
    const buttons = Array.from(this.recurrenceWeekDayButtons.querySelectorAll('.dx-button'));

    return buttons.map((button) => button.classList.contains('dx-button-mode-contained'));
  };

  selectRepeatValue = (value: string): void => {
    this.getInput('repeatEditor').click();

    const items = document.querySelectorAll('.dx-selectbox-popup-wrapper .dx-list .dx-list-item');

    const itemToSelect = Array.from(items)
      .find((item) => item.textContent?.toLowerCase() === value.toLowerCase()) as HTMLElement;

    if (!itemToSelect) {
      throw new Error(`Repeat value "${value}" not found`);
    }

    itemToSelect.click();
  };
}
