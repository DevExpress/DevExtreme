import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import type { BoxItemData } from '@ts/ui/box';
import Box from '@ts/ui/box';
import type { EditorProperties } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';
import SelectBox from '@ts/ui/m_select_box';
import NumberBox from '@ts/ui/number_box/m_number_box';

import type { NumberBoxMaskProperties } from '../number_box/m_number_box.mask';
import dateUtils from './date_utils';

const TIMEVIEW_CLASS = 'dx-timeview';
const TIMEVIEW_CLOCK_CLASS = 'dx-timeview-clock';
const TIMEVIEW_FIELD_CLASS = 'dx-timeview-field';
const TIMEVIEW_HOURARROW_CLASS = 'dx-timeview-hourarrow';
const TIMEVIEW_TIME_SEPARATOR_CLASS = 'dx-timeview-time-separator';
const TIMEVIEW_FORMAT12_CLASS = 'dx-timeview-format12';
const TIMEVIEW_FORMAT12_AM = -1;
const TIMEVIEW_FORMAT12_PM = 1;
const TIMEVIEW_MINUTEARROW_CLASS = 'dx-timeview-minutearrow';

const cssRotate = ($arrow: dxElementWrapper, angle: number, offset = 0): void => {
  $arrow.css('transform', `rotate(${angle}deg) translate(0,${offset}px)`);
};

const rotateArrow = (
  $arrow: dxElementWrapper | undefined,
  angle: number,
  offset?: number,
): void => {
  if (!$arrow) {
    return;
  }

  cssRotate($arrow, angle, offset);
};

export interface TimeViewProperties extends Omit<EditorProperties, 'value'> {
  use24HourFormat?: boolean;
  value: Date;
  _showClock?: boolean;
  _arrowOffset?: number;
}

class TimeView extends Editor<TimeViewProperties> {
  _format12!: SelectBox;

  _minuteBox!: NumberBox;

  _hourBox!: NumberBox;

  _$minuteArrow?: dxElementWrapper;

  _$hourArrow?: dxElementWrapper;

  _getDefaultOptions(): TimeViewProperties {
    return {
      ...super._getDefaultOptions(),
      value: new Date(Date.now()),
      use24HourFormat: true,
      _showClock: true,
      _arrowOffset: 5,
    };
  }

  _getValue(): Date {
    const { value } = this.option();
    return value || new Date();
  }

  _init(): void {
    super._init();

    this.$element().addClass(TIMEVIEW_CLASS);
  }

  _render(): void {
    super._render();

    this._renderBox();
    this._updateTime();
  }

  _renderBox(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _showClock } = this.option();

    const $box = $('<div>').appendTo(this.$element());
    const items: BoxItemData[] = [];

    if (_showClock) {
      items.push({
        ratio: 1,
        shrink: 0,
        baseSize: 'auto',
        template: this._renderClock.bind(this),
      });
    }

    items.push({
      ratio: 0,
      shrink: 0,
      baseSize: 'auto',
      template: this._renderField.bind(this),
    });

    this._createComponent($box, Box, {
      height: '100%',
      width: '100%',
      direction: 'col',
      items,
    });
  }

  _renderClock(_: BoxItemData, __: number, container: dxElementWrapper): void {
    this._$hourArrow = $('<div>').addClass(TIMEVIEW_HOURARROW_CLASS);
    this._$minuteArrow = $('<div>').addClass(TIMEVIEW_MINUTEARROW_CLASS);

    const $container = $(container);
    $container.addClass(TIMEVIEW_CLOCK_CLASS)
      .append(this._$hourArrow)
      .append(this._$minuteArrow);

    this.setAria('role', 'presentation', $container);
  }

  _updateClock(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _arrowOffset } = this.option();

    const time = this._getValue();
    const hourArrowAngle = (time.getHours() / 12) * 360 + (time.getMinutes() / 60) * 30;
    const minuteArrowAngle = (time.getMinutes() / 60) * 360;

    rotateArrow(this._$hourArrow, hourArrowAngle, _arrowOffset);
    rotateArrow(this._$minuteArrow, minuteArrowAngle, _arrowOffset);
  }

  _getBoxItems(is12HourFormat: boolean): BoxItemData[] {
    const items: BoxItemData[] = [{
      ratio: 0,
      shrink: 0,
      baseSize: 'auto',
      template: (): dxElementWrapper => this._hourBox.$element(),
    }, {
      ratio: 0,
      shrink: 0,
      baseSize: 'auto',
      // @ts-expect-error core/DateLocalization type should be fixed
      template: (): dxElementWrapper => $('<div>').addClass(TIMEVIEW_TIME_SEPARATOR_CLASS).text(dateLocalization.getTimeSeparator()),
    }, {
      ratio: 0,
      shrink: 0,
      baseSize: 'auto',
      template: (): dxElementWrapper => this._minuteBox.$element(),
    }];

    if (is12HourFormat) {
      items.push({
        ratio: 0,
        shrink: 0,
        baseSize: 'auto',
        template: () => this._format12?.$element(),
      });
    }

    return items;
  }

  _renderField(): dxElementWrapper {
    const { use24HourFormat } = this.option();
    const is12HourFormat = !use24HourFormat;

    this._createHourBox(is12HourFormat);
    this._createMinuteBox();

    if (is12HourFormat) {
      this._createFormat12Box();
    }

    return this._createComponent(
      $('<div>').addClass(TIMEVIEW_FIELD_CLASS),
      Box,
      {
        direction: 'row',
        align: 'center',
        crossAlign: 'center',
        items: this._getBoxItems(is12HourFormat),
      },
    ).$element();
  }

  _createHourBox(is12HourFormat: boolean): void {
    this._hourBox = this._createComponent(
      $('<div>'),
      NumberBox,
      {
        min: -1,
        max: is12HourFormat ? 13 : 24,
        value: this._getValue().getHours(),
        onValueChanged: this._onHourBoxValueChanged.bind(this),
        onKeyboardHandled: (opts: KeyboardKeyDownEvent) => this._keyboardHandler(opts),
        ...this._getNumberBoxConfig(),
      },
    );

    this._hourBox.setAria('label', 'hours');
  }

  _isPM(): boolean {
    const { use24HourFormat } = this.option();

    const format12Value = this._format12?.option().value;

    return !use24HourFormat && format12Value === TIMEVIEW_FORMAT12_PM;
  }

  _onHourBoxValueChanged({ value, component }: { value: number; component: NumberBox }): void {
    const currentValue = this._getValue();
    const newValue = new Date(currentValue);
    let newHours = this._convertMaxHourToMin(value);

    component.option('value', newHours);

    if (this._isPM()) {
      newHours += 12;
    }

    newValue.setHours(newHours);
    dateUtils.normalizeTime(newValue);
    this.option('value', newValue);
  }

  _convertMaxHourToMin(hours: number): number {
    const { use24HourFormat } = this.option();

    const maxHoursValue = use24HourFormat ? 24 : 12;
    return (maxHoursValue + hours) % maxHoursValue;
  }

  _createMinuteBox(): void {
    this._minuteBox = this._createComponent(
      $('<div>'),
      NumberBox,
      {
        min: -1,
        max: 60,
        value: this._getValue().getMinutes(),
        onKeyboardHandled: (opts: KeyboardKeyDownEvent) => this._keyboardHandler(opts),
        onValueChanged: ({ value, component }: { value: number; component: NumberBox }) => {
          const newMinutes = (60 + value) % 60;
          component.option('value', newMinutes);

          const time = new Date(this._getValue());
          time.setMinutes(newMinutes);
          dateUtils.normalizeTime(time);
          this.option('value', time);
        },
        ...this._getNumberBoxConfig(),
      },
    );

    this._minuteBox.setAria('label', 'minutes');
  }

  _createFormat12Box(): void {
    // @ts-expect-error core/DateLocalization type should be fixed
    const periodNames = dateLocalization.getPeriodNames();
    const { stylingMode } = this.option();

    this._format12 = this._createComponent(
      $('<div>').addClass(TIMEVIEW_FORMAT12_CLASS),
      SelectBox,
      {
        items: [
          { value: TIMEVIEW_FORMAT12_AM, text: periodNames[0] },
          { value: TIMEVIEW_FORMAT12_PM, text: periodNames[1] },
        ],
        valueExpr: 'value',
        displayExpr: 'text',
        onKeyboardHandled: (opts: KeyboardKeyDownEvent) => this._keyboardHandler(opts),
        onValueChanged: ({ value }) => {
          const hours = this._getValue().getHours();
          const time = new Date(this._getValue());
          const newHours = (hours + value * 12) % 24;

          time.setHours(newHours);
          this.option('value', time);
        },
        dropDownOptions: {
          container: this.$element(),
        },
        value: this._getValue().getHours() >= 12 ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM,
        stylingMode,
      },
    );

    this._format12.setAria('label', 'type');
  }

  _refreshFormat12(): void {
    const { use24HourFormat } = this.option();

    if (use24HourFormat) return;

    const value = this._getValue();
    const hours = value.getHours();
    const isPM = hours >= 12;
    const newValue = isPM ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM;

    this._silentEditorValueUpdate(this._format12, newValue);
  }

  _silentEditorValueUpdate(editor: NumberBox | SelectBox | undefined, value: number): void {
    if (!editor) {
      return;
    }

    editor._suppressValueChangeAction();
    editor.option('value', value);
    editor._resumeValueChangeAction();
  }

  _getNumberBoxConfig(): NumberBoxMaskProperties {
    const { stylingMode } = this.option();

    return {
      showSpinButtons: true,
      displayValueFormatter(value): string {
        return (value < 10 ? '0' : '') + value;
      },
      stylingMode,
    };
  }

  _normalizeHours(hours: number): number {
    const { use24HourFormat } = this.option();
    return use24HourFormat ? hours : hours % 12 || 12;
  }

  _updateField(): void {
    const hours = this._normalizeHours(this._getValue().getHours());

    this._silentEditorValueUpdate(this._hourBox, hours);
    this._silentEditorValueUpdate(this._minuteBox, this._getValue().getMinutes());

    this._refreshFormat12();
  }

  _updateTime(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _showClock } = this.option();

    if (_showClock) {
      this._updateClock();
    }

    this._updateField();
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._updateTime();
    }
  }

  _optionChanged(args: OptionChanged<TimeViewProperties>): void {
    switch (args.name) {
      case 'value':
        this._updateTime();
        super._optionChanged(args);
        break;
      case '_arrowOffset':
        break;
      case 'use24HourFormat':
      case '_showClock':
      case 'stylingMode':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxTimeView', TimeView);

export default TimeView;
