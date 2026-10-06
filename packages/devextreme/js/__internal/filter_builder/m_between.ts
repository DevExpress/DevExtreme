import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { CustomOperation, Field } from '@js/ui/filter_builder';

const FILTER_BUILDER_RANGE_CLASS = 'dx-filterbuilder-range';
const FILTER_BUILDER_RANGE_START_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-start`;
const FILTER_BUILDER_RANGE_END_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-end`;
const FILTER_BUILDER_RANGE_SEPARATOR_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-separator`;

const SEPARATOR = '\u2013';

type RangeValue = (string | number | Date | null | undefined)[];

interface RangeConditionInfo {
  field: Field;
  value?: RangeValue;
  setValue: (value: RangeValue) => void;
}

export interface EditorFactoryOwner {
  _editorFactory: {
    createEditor: (
      this: EditorFactoryOwner,
      container: dxElementWrapper,
      options: object,
    ) => void;
  };
}

export type BetweenOperation = CustomOperation & {
  name: string;
  notForLookup: boolean;
  valueSeparator: string;
};

function editorTemplate(
  this: EditorFactoryOwner,
  conditionInfo: RangeConditionInfo,
  container: dxElementWrapper,
): void {
  const $editorStart = $('<div>').addClass(FILTER_BUILDER_RANGE_START_CLASS);
  const $editorEnd = $('<div>').addClass(FILTER_BUILDER_RANGE_END_CLASS);
  let values: RangeValue = conditionInfo.value || [];
  const getStartValue = function (rangeValues: RangeValue | undefined): RangeValue[number] {
    return rangeValues && rangeValues.length > 0 ? rangeValues[0] : null;
  };
  const getEndValue = function (rangeValues: RangeValue | undefined): RangeValue[number] {
    return rangeValues && rangeValues.length === 2 ? rangeValues[1] : null;
  };

  container.append($editorStart);
  container.append(
    $('<span>').addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text(SEPARATOR),
  );
  container.append($editorEnd);
  container.addClass(FILTER_BUILDER_RANGE_CLASS);

  this._editorFactory.createEditor.call(
    this,
    $editorStart,
    extend({}, conditionInfo.field, conditionInfo, {
      value: getStartValue(values),
      parentType: 'filterBuilder',
      setValue(value: RangeValue[number]) {
        values = [value, getEndValue(values)];
        conditionInfo.setValue(values);
      },
    }),
  );

  this._editorFactory.createEditor.call(
    this,
    $editorEnd,
    extend({}, conditionInfo.field, conditionInfo, {
      value: getEndValue(values),
      parentType: 'filterBuilder',
      setValue(value: RangeValue[number]) {
        values = [getStartValue(values), value];
        conditionInfo.setValue(values);
      },
    }),
  );
}

export function getConfig(
  caption: string | undefined,
  context: EditorFactoryOwner,
): BetweenOperation {
  return {
    name: 'between',
    caption,
    icon: 'range',
    valueSeparator: SEPARATOR,
    dataTypes: ['number', 'date', 'datetime'],
    editorTemplate: editorTemplate.bind(context),
    notForLookup: true,
  };
}
