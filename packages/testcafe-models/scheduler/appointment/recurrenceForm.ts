import { Selector } from 'testcafe';

export const SELECTORS = {
  recurrenceGroup: '.dx-scheduler-form-recurrence-group',
  repeatEditor: '.dx-scheduler-form-repeat-editor .dx-selectbox',
  repeatEditorButton: '.dx-scheduler-form-repeat-editor .dx-button-has-icon',
  repeatEveryInput: '.dx-scheduler-form-recurrence-repeat-every-group [type="text"]',
  weekDayButtons: '.dx-scheduler-recurrence-byday-buttons .dx-button',
  monthDayInput: '.dx-scheduler-form-recurrence-repeat-on-monthly-group [type="text"]',
  yearlyMonthInput: '.dx-scheduler-form-recurrence-repeat-on-yearly-group [type="text"]',
  radioGroup: '.dx-scheduler-form-recurrence-end-radio',
  inputGroup: '.dx-scheduler-form-recurrence-end-inputs',
  listOption: '.dx-list-item',
};

export default class RecurrenceForm {
  element: Selector;

  repeatEditor: Selector;

  repeatEditorButton: Selector;

  repeatEveryInput: Selector;

  weekDayButtons: Selector;

  monthDayInput: Selector;

  yearlyMonthInput: Selector;

  radioGroup: Selector;

  inputGroup: Selector;

  constructor() {
    this.element = Selector(SELECTORS.recurrenceGroup);
    this.repeatEditor = Selector(SELECTORS.repeatEditor);
    this.repeatEditorButton = Selector(SELECTORS.repeatEditorButton);
    this.repeatEveryInput = Selector(SELECTORS.repeatEveryInput);
    this.weekDayButtons = Selector(SELECTORS.weekDayButtons);
    this.monthDayInput = Selector(SELECTORS.monthDayInput);
    this.yearlyMonthInput = Selector(SELECTORS.yearlyMonthInput);
    this.radioGroup = Selector(SELECTORS.radioGroup);
    this.inputGroup = Selector(SELECTORS.inputGroup);
  }

  async open(t: TestController, freq = 'Daily'): Promise<void> {
    await t.click(this.repeatEditor);

    const option = Selector(SELECTORS.listOption).withText(freq);
    await t.click(option);

    await t.wait(500);
  }

  async openSettings(t: TestController): Promise<void> {
    await t.click(this.repeatEditorButton);
    await t.wait(500);
  }

  async setRepeatEvery(t: TestController, interval: number): Promise<void> {
    await t
      .selectText(this.repeatEveryInput)
      .typeText(this.repeatEveryInput, interval.toString(), { replace: true });
  }

  async selectWeekDays(t: TestController, days: string[]): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const day of days) {
      const dayButton = this.weekDayButtons.withAttribute('data-day-key', day.slice(0, 2).toUpperCase());
      await t.click(dayButton);
    }
  }

  async setMonthDay(t: TestController, day: number): Promise<void> {
    await t
      .selectText(this.monthDayInput)
      .typeText(this.monthDayInput, day.toString(), { replace: true });
  }

  async setYearlyDate(t: TestController, month: number, day: number): Promise<void> {
    const monthEditor = this.yearlyMonthInput.nth(0);
    const dayEditor = this.yearlyMonthInput.nth(1);

    await t
      .selectText(monthEditor)
      .typeText(monthEditor, month.toString(), { replace: true });

    await t
      .selectText(dayEditor)
      .typeText(dayEditor, day.toString(), { replace: true });
  }

  async setRepeatEnd(
    t: TestController,
    type: 'never' | 'count' | 'until',
    value?: number | string,
  ): Promise<void> {
    if (type === 'never') {
      const neverRadio = this.radioGroup.find('.dx-radiobutton').nth(0);
      await t.click(neverRadio);
    } else if (type === 'until') {
      const untilRadio = this.radioGroup.find('.dx-radiobutton').nth(1);
      await t.click(untilRadio);

      if (value !== undefined) {
        const untilEditor = this.inputGroup.find('[type="text"]').nth(0);
        await t
          .selectText(untilEditor)
          .typeText(untilEditor, value.toString(), { replace: true });
      }
    } else if (type === 'count') {
      const countRadio = this.radioGroup.find('.dx-radiobutton').nth(2);
      await t.click(countRadio);

      if (value !== undefined) {
        const countEditor = this.inputGroup.find('[type="text"]').nth(1);
        await t
          .selectText(countEditor)
          .typeText(countEditor, value.toString(), { replace: true });
      }
    }
  }
}

