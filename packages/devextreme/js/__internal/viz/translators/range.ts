/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */

import { extend } from '@ts/core/utils/m_extend';
import { isDate, isDefined, isFunction } from '@ts/core/utils/m_type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { unique } from '@ts/viz/core/utils';

const _isDefined = isDefined;
const _isDate = isDate;
const _isFunction = isFunction;

const minSelector = 'min';
const maxSelector = 'max';
const minVisibleSelector = 'minVisible';
const maxVisibleSelector = 'maxVisible';
const baseSelector = 'base';
const axisTypeSelector = 'axisType';

type ValueComparer = (thisValue: ThemeValue, otherValue: ThemeValue) => boolean;

export interface RangeData {
  [key: string]: ThemeValue;
  min?: ThemeValue;
  max?: ThemeValue;
  minVisible?: ThemeValue;
  maxVisible?: ThemeValue;
  categories?: ThemeValue[];
  axisType?: string;
  dataType?: string;
  interval?: number;
}

function otherLessThan(thisValue: ThemeValue, otherValue: ThemeValue): boolean {
  return otherValue < thisValue;
}

function otherGreaterThan(thisValue: ThemeValue, otherValue: ThemeValue): boolean {
  return otherValue > thisValue;
}

function compareAndReplace(
  thisValue: ThemeValue,
  otherValue: ThemeValue,
  setValue: (value: ThemeValue) => void,
  compare: ValueComparer,
): void {
  const otherValueDefined = _isDefined(otherValue);

  if (_isDefined(thisValue)) {
    if (otherValueDefined && compare(thisValue, otherValue)) {
      setValue(otherValue);
    }
  } else if (otherValueDefined) {
    setValue(otherValue);
  }
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Range = class Range {
  declare min?: ThemeValue;

  declare max?: ThemeValue;

  declare minVisible?: ThemeValue;

  declare maxVisible?: ThemeValue;

  declare categories?: ThemeValue[];

  declare axisType?: string;

  declare dataType?: string;

  declare base?: number;

  declare invert?: boolean;

  declare interval?: number;

  declare containsConstantLine?: boolean;

  declare isSpacedMargin?: boolean;

  declare allowNegatives?: boolean;

  declare linearThreshold?: number;

  declare breaks?: ThemeValue[];

  declare userBreaks?: ThemeValue[];

  constructor(range?: RangeData) {
    range && extend(this, range);
  }

  addRange(otherRange: RangeData): this {
    const that = this;
    const { categories } = that;
    const otherCategories = otherRange.categories;
    const isDiscrete = that[axisTypeSelector] === 'discrete';

    const compareAndReplaceByField = function (field: string, compare: ValueComparer): void {
      compareAndReplace(that[field], otherRange[field], (value) => { that[field] = value; }, compare);
    };

    const controlValuesByVisibleBounds = function (valueField: string, visibleValueField: string, compare: ValueComparer): void {
      compareAndReplace(that[valueField], that[visibleValueField], (value) => { _isDefined(that[valueField]) && (that[valueField] = value); }, compare);
    };

    const checkField = function (field: string): void {
      that[field] = that[field] || otherRange[field];
    };

    checkField('invert');
    checkField('containsConstantLine');
    checkField(axisTypeSelector);
    checkField('dataType');
    checkField('isSpacedMargin');

    if (that[axisTypeSelector] === 'logarithmic') {
      checkField(baseSelector);
    } else {
      that[baseSelector] = undefined;
    }

    compareAndReplaceByField(minSelector, otherLessThan);
    compareAndReplaceByField(maxSelector, otherGreaterThan);
    if (isDiscrete) {
      checkField(minVisibleSelector);
      checkField(maxVisibleSelector);
    } else {
      compareAndReplaceByField(minVisibleSelector, otherLessThan);
      compareAndReplaceByField(maxVisibleSelector, otherGreaterThan);
    }
    compareAndReplaceByField('interval', otherLessThan);

    if (!isDiscrete) {
      controlValuesByVisibleBounds(minSelector, minVisibleSelector, otherLessThan);
      controlValuesByVisibleBounds(minSelector, maxVisibleSelector, otherLessThan);
      controlValuesByVisibleBounds(maxSelector, maxVisibleSelector, otherGreaterThan);
      controlValuesByVisibleBounds(maxSelector, minVisibleSelector, otherGreaterThan);
    }

    if (categories === undefined) {
      that.categories = otherCategories;
    } else {
      that.categories = otherCategories ? unique(categories.concat(otherCategories)) : categories;
    }

    if (that[axisTypeSelector] === 'logarithmic') {
      checkField('allowNegatives');
      compareAndReplaceByField('linearThreshold', otherLessThan);
    }

    return that;
  }

  isEmpty(): boolean {
    return (!_isDefined(this[minSelector]) || !_isDefined(this[maxSelector])) && (!this.categories || this.categories.length === 0);
  }

  correctValueZeroLevel(): this {
    const that = this;

    if (_isDate(that[maxSelector]) || _isDate(that[minSelector])) {
      return that;
    }

    function setZeroLevel(min: string, max: string): void {
      (that[min] < 0 && that[max] < 0) && (that[max] = 0);
      (that[min] > 0 && that[max] > 0) && (that[min] = 0);
    }

    setZeroLevel(minSelector, maxSelector);
    setZeroLevel(minVisibleSelector, maxVisibleSelector);
    return that;
  }

  sortCategories(sort?: ThemeValue): void {
    if (sort === false || !this.categories) {
      return;
    }

    if (Array.isArray(sort)) {
      const sortValues = sort.map((item): ThemeValue => item.valueOf());
      const filteredSeriesCategories = this.categories.filter((item) => !sortValues.includes(item.valueOf()));
      this.categories = sort.concat(filteredSeriesCategories);
    } else {
      const notAFunction = !_isFunction(sort);

      if (notAFunction && this.dataType !== 'string') {
        sort = (a, b): number => a.valueOf() - b.valueOf();
      } else if (notAFunction) {
        sort = false;
      }
      sort && this.categories.sort(sort);
    }
  }
};

export type RangeInstance = InstanceType<typeof Range>;

/// #DEBUG
export function DEBUG_set_Range(value: typeof Range): void {
  Range = value;
}
/// #ENDDEBUG
