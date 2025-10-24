import $ from '@js/core/renderer';
import type dxForm from '@js/ui/form';
import type dxPopup from '@js/ui/popup';

export class PopupModel {
  element: HTMLDivElement;

  component: dxPopup;

  constructor(element: HTMLDivElement) {
    this.element = element;

    // @ts-expect-error
    this.component = $('.dx-scheduler-appointment-popup.dx-popup.dx-widget').dxPopup('instance') as dxPopup;
  }

  get form(): dxForm {
    // @ts-expect-error
    return $(this.element.querySelector('.dx-form')).dxForm('instance') as dxForm;
  }

  get startDate(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-start-date-editor .dx-datebox.dx-widget');
  }

  get startTime(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-start-time-editor .dx-datebox.dx-widget');
  }

  get startTimeZone(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-start-date-timezone-editor .dx-selectbox.dx-widget');
  }

  get endDate(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-end-date-editor .dx-datebox.dx-widget');
  }

  get endTime(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-end-time-editor .dx-datebox.dx-widget');
  }

  get endTimeZone(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-end-date-timezone-editor .dx-selectbox.dx-widget');
  }

  get repeatEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-repeat-editor .dx-selectbox.dx-widget');
  }

  get frequencyEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-frequency-editor .dx-selectbox.dx-widget');
  }

  get intervalEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-interval-editor .dx-textbox.dx-widget');
  }

  get byMonthEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-by-month-editor .dx-selectbox.dx-widget');
  }

  get dayOfMonthEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-day-of-month-editor .dx-numberbox.dx-widget');
  }

  get countEditor(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-count-editor .dx-numberbox.dx-widget');
  }

  get repeatEndEditors(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-end-editors .dx-radiogroup.dx-widget');
  }

  get recurrenceGroup(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-group');
  }

  get recurrenceSettingsButton(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-settings-button');
  }

  get recurrenceRepeatEveryInput(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-repeat-every-group [type="text"]');
  }

  get recurrenceWeekDayButtons(): Element | null {
    return this.element.querySelector('.dx-scheduler-days-of-week-buttons');
  }

  get recurrenceMonthDayInput(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-day-of-month-group [type="text"]');
  }

  get recurrenceYearlyInputs(): NodeListOf<Element> {
    return this.element.querySelectorAll('.dx-scheduler-form-recurrence-repeat-on-yearly-group [type="text"]');
  }

  get recurrenceEndRadioGroup(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-end-radio');
  }

  get recurrenceEndInputGroup(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-recurrence-end-inputs');
  }

  get recurrenceMonthlyGroup(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-day-of-month-group');
  }

  get recurrenceYearlyGroup(): Element | null {
    return this.element.querySelector('.dx-scheduler-form-day-of-year-group');
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

  getTitle = (): HTMLElement | null => document.querySelector('.dx-popup-title .dx-toolbar-label');

  getSaveButton = (): HTMLButtonElement => {
    const saveButton = this.element.querySelector('.dx-button.dx-popup-done') as HTMLButtonElement;
    if (!saveButton) {
      throw new Error('Done button not found');
    }
    return saveButton;
  };

  getBackButton = (): HTMLButtonElement => {
    const backButton = this.element.querySelector('.dx-toolbar-button  .dx-button[aria-label="Back"]') as HTMLButtonElement;
    if (!backButton) {
      throw new Error('Back button not found');
    }
    return backButton;
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

  getFormEditor = (fieldName: string): HTMLElement | null => {
    const form = this.getForm();
    if (form === null) {
      return null;
    }
    return form.querySelector(`[data-field="${fieldName}"]`);
  };

  getEditSeriesButton = (): HTMLElement => {
    const editSeriesButton = document.querySelector('[aria-label="Edit series"]') as HTMLElement;
    if (!editSeriesButton) {
      throw new Error('Edit series button not found');
    }
    return editSeriesButton;
  };

  openRecurrenceSettings = (): void => {
    if (!this.repeatEditor) {
      throw new Error('Repeat editor not found');
    }

    // @ts-expect-error
    const repeatEditorInstance = $(this.repeatEditor).dxSelectBox('instance');
    const buttons = repeatEditorInstance.option('buttons');
    const settingsButton = buttons?.find((btn: { name: string }) => btn.name === 'settings');

    if (settingsButton?.options?.onClick) {
      settingsButton.options.onClick();
    } else {
      throw new Error('Settings button not found or onClick is not defined');
    }
  };

  openRecurrenceForm = (freq = 'Daily'): void => {
    if (!this.repeatEditor) {
      throw new Error('Repeat editor not found');
    }

    // @ts-expect-error
    const repeatEditorInstance = $(this.repeatEditor).dxSelectBox('instance');
    repeatEditorInstance.option('value', freq.toLowerCase());

    // Trigger the settings to open
    this.openRecurrenceSettings();
  };

  setRecurrenceInterval = (interval: number): void => {
    const input = this.recurrenceRepeatEveryInput as HTMLInputElement;
    if (!input) {
      throw new Error('Recurrence interval input not found');
    }

    input.value = interval.toString();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  selectRecurrenceWeekDays = (days: string[]): void => {
    const buttonsContainer = this.recurrenceWeekDayButtons;
    if (!buttonsContainer) {
      throw new Error('Week day buttons not found');
    }

    days.forEach((day) => {
      const dayKey = day.slice(0, 2).toUpperCase();
      const button = buttonsContainer.querySelector(`[data-day-key="${dayKey}"]`) as HTMLElement;

      if (!button) {
        throw new Error(`Day button for "${day}" not found`);
      }

      button.click();
    });
  };

  setRecurrenceMonthDay = (day: number): void => {
    const input = this.recurrenceMonthDayInput as HTMLInputElement;
    if (!input) {
      throw new Error('Month day input not found');
    }

    input.value = day.toString();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  setRecurrenceYearlyDate = (month: number, day: number): void => {
    const inputs = this.recurrenceYearlyInputs;
    if (inputs.length < 2) {
      throw new Error('Yearly date inputs not found');
    }

    const monthInput = inputs[0] as HTMLInputElement;
    const dayInput = inputs[1] as HTMLInputElement;

    monthInput.value = month.toString();
    monthInput.dispatchEvent(new Event('input', { bubbles: true }));
    monthInput.dispatchEvent(new Event('change', { bubbles: true }));

    dayInput.value = day.toString();
    dayInput.dispatchEvent(new Event('input', { bubbles: true }));
    dayInput.dispatchEvent(new Event('change', { bubbles: true }));
  };

  setRecurrenceEnd = (type: 'never' | 'count' | 'until', value?: number | string): void => {
    const radioGroup = this.recurrenceEndRadioGroup;
    const inputGroup = this.recurrenceEndInputGroup;

    if (!radioGroup) {
      throw new Error('Recurrence end radio group not found');
    }

    const radioButtons = radioGroup.querySelectorAll('.dx-radiobutton');

    switch (type) {
      case 'never': {
        const neverRadio = radioButtons[0] as HTMLElement;
        if (neverRadio) {
          neverRadio.click();
        }
        break;
      }
      case 'until': {
        const untilRadio = radioButtons[1] as HTMLElement;
        if (untilRadio) {
          untilRadio.click();
        }

        if (value !== undefined && inputGroup) {
          const untilInput = inputGroup.querySelector('[type="text"]') as HTMLInputElement;
          if (untilInput) {
            untilInput.value = value.toString();
            untilInput.dispatchEvent(new Event('input', { bubbles: true }));
            untilInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        break;
      }
      case 'count': {
        const countRadio = radioButtons[2] as HTMLElement;
        if (countRadio) {
          countRadio.click();
        }

        if (value !== undefined && inputGroup) {
          const inputs = inputGroup.querySelectorAll('[type="text"]');
          const countInput = inputs[1] as HTMLInputElement;
          if (countInput) {
            countInput.value = value.toString();
            countInput.dispatchEvent(new Event('input', { bubbles: true }));
            countInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        break;
      }
      default:
        break;
    }
  };
}
