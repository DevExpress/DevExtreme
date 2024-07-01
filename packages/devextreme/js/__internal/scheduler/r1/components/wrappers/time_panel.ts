import registerComponent from '@js/core/component_registrator';
import { ComponentWrapper } from '@ts/core/r1/index';

import { TimePanelTable } from '../base/time_panel_table';

export class TimePanelComponent extends ComponentWrapper {
  _setOptionsByReference(): void {
    // @ts-expect-error badly typed DomComponent
    super._setOptionsByReference();

    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = {
      // @ts-expect-error badly typed DomComponent
      ...this._optionsByReference,
      timeCellTemplate: true,
    };
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['timeCellTemplate'],
      props: [
        'viewContext',
        'groupOrientation',
        'timePanelData',
        'timeCellTemplate',
      ],
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof TimePanelTable {
    return TimePanelTable;
  }
}

registerComponent('dxTimePanelTableLayout', TimePanelComponent);
