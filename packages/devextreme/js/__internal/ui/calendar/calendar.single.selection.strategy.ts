import type { DxEvent } from '@js/events';

import type Calendar from './calendar';
import CalendarSelectionStrategy from './calendar.selection.strategy';

class CalendarSingleSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component: Calendar) {
    super(component);
    this.NAME = 'SingleSelection';
  }

  dateOption(optionName: 'min' | 'max' | 'value'): Date | null {
    if (optionName === 'value') {
      return this.calendar._getDateOption('value') as Date | null;
    }
    return this.calendar._getDateOption(optionName);
  }

  getViewOptions(): {
    value: Date | undefined;
    range: Date[];
    selectionMode: 'single';
  } {
    const value = this.dateOption('value') ?? undefined;

    return {
      value,
      range: [],
      selectionMode: 'single',
    };
  }

  selectValue(selectedValue: Date, e: DxEvent): void {
    this.skipNavigate();
    this.dateValue(selectedValue, e);
  }

  updateAriaSelected(val?: (Date | null)[], previousVal?: (Date | null)[]): void {
    const value = val ?? [this.dateOption('value')];
    const previousValue = previousVal ?? [];

    super.updateAriaSelected(value, previousValue);
  }

  getDefaultCurrentDate(): Date | null {
    return this.dateOption('value');
  }

  restoreValue(): void {
    this.calendar.option('value', null);
  }

  _updateViewsValue(value: Date[]): void {
    this._updateViewsOption('value', value[0]);
  }
}

export default CalendarSingleSelectionStrategy;
