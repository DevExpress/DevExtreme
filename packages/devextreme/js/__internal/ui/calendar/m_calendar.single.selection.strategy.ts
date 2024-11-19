import CalendarSelectionStrategy from './m_calendar.selection.strategy';

class CalendarSingleSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component) {
    super(component);
    this.NAME = 'SingleSelection';
  }

  getViewOptions() {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'single',
    };
  }

  selectValue(selectedValue, e) {
    this.skipNavigate();
    this.dateValue(selectedValue, e);
  }

  updateAriaSelected(value, previousValue) {
    value ??= [this.dateOption('value')];
    previousValue ??= [];

    super.updateAriaSelected(value, previousValue);
  }

  getDefaultCurrentDate() {
    const date = this.dateOption('value');

    if (date === '') {
      return new Date();
    }

    return date;
  }

  restoreValue(): void {
    this.calendar.option('value', null);
  }

  _updateViewsValue(value) {
    this._updateViewsOption('value', value[0]);
  }
}

export default CalendarSingleSelectionStrategy;
