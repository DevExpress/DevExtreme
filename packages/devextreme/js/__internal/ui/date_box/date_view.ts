import type { Device } from '@js/common/core/environment';
import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import type { OptionChanged } from '@ts/core/widget/types';
import Editor from '@ts/ui/editor/editor';

import type { EditorProperties } from '../editor/editor';
import uiDateUtils from './date_utils';
import DateViewRoller from './date_view_roller';

const DATEVIEW_CLASS = 'dx-dateview';
const DATEVIEW_COMPACT_CLASS = 'dx-dateview-compact';
const DATEVIEW_WRAPPER_CLASS = 'dx-dateview-wrapper';
const DATEVIEW_ROLLER_CONTAINER_CLASS = 'dx-dateview-rollers';
const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';

const TYPE = {
  date: 'date',
  datetime: 'datetime',
  time: 'time',
};

const ROLLER_TYPE = {
  year: 'year',
  month: 'month',
  day: 'day',
  hours: 'hours',
};

export interface RollerConfig {
  type: string;
  setValue: string;
  valueItems: number[];
  displayItems: string[];
  selectedIndex?: number;
  getIndex: (value: Date) => number;
}

export interface DateViewProperties extends EditorProperties {
  applyCompactClass?: boolean;

  minDate: Date;

  maxDate: Date;

  type?: string;
}

class DateView extends Editor<DateViewProperties> {
  _$rollersContainer?: dxElementWrapper;

  _$wrapper?: dxElementWrapper;

  _rollerConfigs!: Record<string, RollerConfig>;

  _rollers!: Record<string, DateViewRoller>;

  _valueOption(): Date {
    const { value } = this.option();
    const date = new Date(value);

    return !value || isNaN(date.getTime()) ? this._getDefaultDate() : date;
  }

  _getDefaultDate(): Date {
    const date = new Date();

    const { type } = this.option();

    if (type === TYPE.date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    return date;
  }

  _getDefaultOptions(): DateViewProperties {
    return {
      ...super._getDefaultOptions(),
      minDate: uiDateUtils.MIN_DATEVIEW_DEFAULT_DATE,
      maxDate: uiDateUtils.MAX_DATEVIEW_DEFAULT_DATE,
      type: TYPE.date,
      value: new Date(),
      applyCompactClass: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<DateViewProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(device: Device): boolean {
          return device.deviceType !== 'desktop';
        },
        options: {
          applyCompactClass: true,
        },
      },
    ]);
  }

  _render(): void {
    super._render();
    this.$element().addClass(DATEVIEW_CLASS);

    const { type = 'date' } = this.option();

    this._toggleFormatClasses(type);
    this._toggleCompactClass();
  }

  _toggleFormatClasses(currentFormat: string, previousFormat?: string): void {
    this.$element().addClass(`${DATEVIEW_CLASS}-${currentFormat}`);

    if (previousFormat) {
      this.$element().removeClass(`${DATEVIEW_CLASS}-${previousFormat}`);
    }
  }

  _toggleCompactClass(): void {
    const { applyCompactClass } = this.option();

    this.$element().toggleClass(DATEVIEW_COMPACT_CLASS, applyCompactClass);
  }

  _wrapper(): dxElementWrapper | undefined {
    return this._$wrapper;
  }

  _renderContentImpl(): void {
    this._$wrapper = $('<div>').addClass(DATEVIEW_WRAPPER_CLASS);
    this._renderRollers();
    this._$wrapper.appendTo(this.$element());
  }

  _renderRollers(): void {
    this._$rollersContainer ??= $('<div>').addClass(DATEVIEW_ROLLER_CONTAINER_CLASS);

    this._$rollersContainer.empty();
    this._createRollerConfigs();

    this._rollers = {};

    Object.keys(this._rollerConfigs).forEach((name: string) => {
      const rollerType = this._rollerConfigs[name].type;

      const $roller = $('<div>').appendTo(this._$rollersContainer as dxElementWrapper)
        .addClass(`${DATEVIEW_ROLLER_CLASS}-${rollerType}`);

      this._rollers[rollerType] = this._createComponent($roller, DateViewRoller, {
        items: this._rollerConfigs[name].displayItems,
        selectedIndex: this._rollerConfigs[name].selectedIndex,
        showScrollbar: 'never',
        scrollByContent: true,
        onStart: (e): void => {
          const { component } = e;
          const rollerConfig = this._rollerConfigs[name];

          component._toggleActive(true);
          this._setActiveRoller(rollerConfig);
        },
        onEnd: (e): void => {
          e.component._toggleActive(false);
        },

        onClick: (e): void => {
          const { component } = e;
          const { selectedIndex = 0 } = component.option();
          const rollerConfig = this._rollerConfigs[name];

          component._toggleActive(true);
          this._setActiveRoller(rollerConfig);
          this._setRollerState(rollerConfig, selectedIndex);
          component._toggleActive(false);
        },
        onSelectedIndexChanged: (e) => {
          const { component } = e;
          const { selectedIndex = 0 } = component.option();
          const rollerConfig = this._rollerConfigs[name];

          this._setRollerState(rollerConfig, selectedIndex);
        },
      });
    });

    const $wrapper = this._wrapper();
    if ($wrapper) {
      this._$rollersContainer.appendTo($wrapper);
    }
  }

  _createRollerConfigs(type?: string): void {
    const { type: defaultType } = this.option();
    const selectedType = type ?? defaultType;
    this._rollerConfigs = {};

    dateLocalization
      // @ts-expect-error core/DateLocalization type should be fixed
      .getFormatParts(uiDateUtils.FORMATS_MAP[selectedType as string])
      .forEach((partName: string) => {
        this._createRollerConfig(partName);
      });
  }

  _createRollerConfig(componentName: string): void {
    const componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName];

    const valueRange = this._calculateRollerConfigValueRange(componentName);
    const { startValue } = valueRange;
    const { endValue } = valueRange;

    const { formatter } = componentInfo;

    const curDate = this._getCurrentDate();

    const config: RollerConfig = {
      type: componentName,
      setValue: componentInfo.setter,
      valueItems: [],
      displayItems: [],
      getIndex(value: Date): number {
        return value[componentInfo.getter]() - startValue;
      },
    };

    for (let i = startValue; i <= endValue; i += 1) {
      config.valueItems.push(i);
      config.displayItems.push(formatter(i, curDate));
    }
    config.selectedIndex = config.getIndex(curDate);

    this._rollerConfigs[componentName] = config;
  }

  _setActiveRoller(currentRoller: RollerConfig): void {
    const activeRoller = currentRoller && this._rollers[currentRoller.type];

    Object.values(this._rollers).forEach((roller) => {
      roller.toggleActiveState(roller === activeRoller);
    });
  }

  _updateRollersPosition(): void {
    const currentDate = this._getCurrentDate();

    Object.keys(this._rollers).forEach((type: string) => {
      const correctIndex = this._rollerConfigs[type].getIndex(currentDate);
      this._rollers[type].option('selectedIndex', correctIndex);
    });
  }

  _setRollerState(roller: RollerConfig, selectedIndex: number): void {
    if (selectedIndex !== roller.selectedIndex) {
      const rollerValue = roller.valueItems[selectedIndex];
      const { setValue } = roller;
      let currentValue = new Date(this._getCurrentDate());
      let currentDate = currentValue.getDate();
      const { minDate, maxDate } = this.option();

      if (roller.type === ROLLER_TYPE.month) {
        currentDate = Math.min(
          currentDate,
          uiDateUtils.getMaxMonthDay(currentValue.getFullYear(), rollerValue),
        );
      } else if (roller.type === ROLLER_TYPE.year) {
        currentDate = Math.min(
          currentDate,
          uiDateUtils.getMaxMonthDay(rollerValue, currentValue.getMonth()),
        );
      }

      currentValue.setDate(currentDate);
      currentValue[setValue](rollerValue);

      const normalizedDate = dateUtils.normalizeDate(currentValue, minDate, maxDate);
      // @ts-expect-error ts-error
      currentValue = uiDateUtils.mergeDates(normalizedDate, currentValue, 'time');
      currentValue = dateUtils.normalizeDate(currentValue, minDate, maxDate);

      this.option('value', currentValue);

      roller.selectedIndex = selectedIndex;
    }

    if (roller.type === ROLLER_TYPE.year) {
      this._refreshRollers();
    }

    if (roller.type === ROLLER_TYPE.month) {
      this._refreshRoller(ROLLER_TYPE.day);
      this._refreshRoller(ROLLER_TYPE.hours);
    }
  }

  _refreshRoller(rollerType: string): void {
    const roller = this._rollers[rollerType];

    if (roller) {
      const { items = [] } = roller.option();

      this._createRollerConfig(rollerType);
      const rollerConfig = this._rollerConfigs[rollerType];

      if (rollerType === ROLLER_TYPE.day
        || rollerConfig.displayItems.toString() !== items.toString()) {
        roller.option({
          items: rollerConfig.displayItems,
          selectedIndex: rollerConfig.selectedIndex,
        });
      }
    }
  }

  _getCurrentDate(): Date {
    const curDate = this._valueOption();
    const { minDate, maxDate } = this.option();

    return dateUtils.normalizeDate(curDate, minDate, maxDate) as Date;
  }

  _calculateRollerConfigValueRange(
    componentName: string,
  ): { startValue: number; endValue: number } {
    const curDate = this._getCurrentDate();
    const { minDate, maxDate } = this.option();

    const minYear = dateUtils.sameYear(curDate, minDate);
    const minMonth = minYear && curDate.getMonth() === minDate.getMonth();
    const maxYear = dateUtils.sameYear(curDate, maxDate);
    const maxMonth = maxYear && curDate.getMonth() === maxDate.getMonth();
    const minHour = minMonth && curDate.getDate() === minDate.getDate();
    const maxHour = maxMonth && curDate.getDate() === maxDate.getDate();
    const componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName];
    let { startValue } = componentInfo;
    let { endValue } = componentInfo;

    if (componentName === ROLLER_TYPE.year) {
      startValue = minDate.getFullYear();
      endValue = maxDate.getFullYear();
    }

    if (componentName === ROLLER_TYPE.month) {
      if (minYear) {
        startValue = minDate.getMonth();
      }
      if (maxYear) {
        endValue = maxDate.getMonth();
      }
    }

    if (componentName === ROLLER_TYPE.day) {
      endValue = uiDateUtils.getMaxMonthDay(curDate.getFullYear(), curDate.getMonth());
      if (minYear && minMonth) {
        startValue = minDate.getDate();
      }
      if (maxYear && maxMonth) {
        endValue = maxDate.getDate();
      }
    }

    if (componentName === ROLLER_TYPE.hours) {
      startValue = minHour ? minDate.getHours() : startValue;
      endValue = maxHour ? maxDate.getHours() : endValue;
    }

    return {
      startValue,
      endValue,
    };
  }

  _refreshRollers(): void {
    this._refreshRoller(ROLLER_TYPE.month);
    this._refreshRoller(ROLLER_TYPE.day);
    this._refreshRoller(ROLLER_TYPE.hours);
  }

  _optionChanged(args: OptionChanged<DateViewProperties>): void {
    switch (args.name) {
      case 'minDate':
      case 'maxDate':
      case 'type':
        this._renderRollers();

        if (args.value) {
          this._toggleFormatClasses(args.value as string, args.previousValue as string);
        }
        break;
      case 'visible':
        super._optionChanged(args);
        if (args.value) {
          this._renderRollers();
        }
        break;
      case 'value':
        this.option('value', this._valueOption());
        this._refreshRollers();
        this._updateRollersPosition();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _clean(): void {
    super._clean();
    delete this._$rollersContainer;
  }
}

registerComponent('dxDateView', DateView);

export default DateView;
