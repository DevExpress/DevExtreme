import registerComponent from '@js/core/component_registrator';

import { DateTableMonth } from '../month/date_table_month';
import { DateTableComponent } from './date_table';

export class DateTableMonthComponent extends DateTableComponent {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['cellTemplate', 'dataCellTemplate'],
      props: [
        'viewData',
        'viewContext',
        'cellTemplate',
        'groupOrientation',
        'leftVirtualCellWidth',
        'rightVirtualCellWidth',
        'topVirtualRowHeight',
        'bottomVirtualRowHeight',
        'addDateTableClass',
        'addVerticalSizesClassToRows',
        'width',
        'dataCellTemplate',
      ],
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  get _viewComponent(): typeof DateTableMonth {
    return DateTableMonth;
  }
}
registerComponent('dxMonthDateTableLayout', DateTableMonthComponent);
