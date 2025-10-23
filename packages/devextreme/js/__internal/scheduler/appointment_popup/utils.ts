import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { SimpleItem } from '@js/ui/form';

// eslint-disable-next-line arrow-body-style
export const createFormIconTemplate = (iconName: string): (() => void) => {
  return (): dxElementWrapper => $('<i>').addClass('dx-icon').addClass(`dx-icon-${iconName}`);
};

export const getStartDateCommonConfig = (firstDayOfWeek: string): SimpleItem => ({
  colSpan: 1,
  itemType: 'simple',
  editorType: 'dxDateBox',
  validationRules: [{
    type: 'required',
  }],
  editorOptions: {
    type: 'date',
    useMaskBehavior: true,
    calendarOptions: {
      firstDayOfWeek,
    },
  } as unknown as DateBoxProperties,
});
