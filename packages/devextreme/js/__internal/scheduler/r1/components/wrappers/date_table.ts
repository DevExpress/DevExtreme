import registerComponent from '@js/core/component_registrator';
import { ComponentWrapper } from '@ts/core/r1/index';

import { DateTable } from '../base/date_table';

export class DateTableComponent extends ComponentWrapper {
  _setOptionsByReference(): void {
    // @ts-expect-error badly typed DomComponent
    super._setOptionsByReference();

    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = {
      // @ts-expect-error badly typed DomComponent
      ...this._optionsByReference,
      dataCellTemplate: true,
    };
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['cellTemplate', 'dataCellTemplate'],
      props: [
        'cellTemplate',
        'viewData',
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

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof DateTable {
    return DateTable;
  }
}

registerComponent('dxDateTableLayoutBase', DateTableComponent);
