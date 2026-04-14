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

  get resourceIcon(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-resources-group .dx-icon');
  }

  get recurrenceWeekDayButtons(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-days-of-week-buttons');
  }

  get saveButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Save' }) as HTMLElement;
  }

  get cancelButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Cancel' }) as HTMLElement;
  }

  get closeButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Close' }) as HTMLElement;
  }

  get backButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Back' }) as HTMLElement;
  }

  get editSeriesButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Edit series' }) as HTMLElement;
  }

  get deleteSeriesButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Delete series' }) as HTMLElement;
  }

  get editAppointmentButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Edit appointment' }) as HTMLElement;
  }

  get deleteAppointmentButton(): HTMLElement {
    return this.queries.getByRole('button', { name: 'Delete appointment' }) as HTMLElement;
  }

  get recurrenceSettingsButton(): HTMLElement {
    return queryRequiredElement(this.element, '.dx-scheduler-form-recurrence-settings-button');
  }

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
