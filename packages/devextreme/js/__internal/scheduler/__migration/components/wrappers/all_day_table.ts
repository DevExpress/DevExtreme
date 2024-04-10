import registerComponent from '@js/core/component_registrator';
import { AllDayTable } from '@ts/scheduler/__migration/components/base/all_day_panel_table';

import {
  DateTableComponent,
} from './date_table';

export class AllDayTableComponent extends DateTableComponent {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['dataCellTemplate'],
      props: ['viewData', 'groupOrientation', 'leftVirtualCellWidth', 'rightVirtualCellWidth', 'topVirtualRowHeight', 'bottomVirtualRowHeight', 'addDateTableClass', 'addVerticalSizesClassToRows', 'width', 'dataCellTemplate'],
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof AllDayTable {
    return AllDayTable;
  }
}
registerComponent('dxAllDayTable', AllDayTableComponent);
