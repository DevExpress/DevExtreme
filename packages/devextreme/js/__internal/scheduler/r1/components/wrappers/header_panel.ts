/* eslint-disable class-methods-use-this */
import registerComponent from '@js/core/component_registrator';
import { ComponentWrapper } from '@ts/core/r1/index';

import {
  HeaderPanel,
} from '../base/header_panel';

export class HeaderPanelComponent extends ComponentWrapper {
  _setOptionsByReference(): void {
    // @ts-expect-error badly typed DomComponent
    super._setOptionsByReference();

    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = {
      // @ts-expect-error badly typed DomComponent
      ...this._optionsByReference,
      dateHeaderData: true,
      resourceCellTemplate: true,
      dateCellTemplate: true,
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
      templates: ['dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'resourceCellTemplate'],
      props: [
        'viewContext',
        'dateHeaderData',
        'isRenderDateHeader',
        'dateCellTemplate',
        'timeCellTemplate',
        'dateHeaderTemplate',
        'groups',
        'groupOrientation',
        'groupPanelData',
        'groupByDate',
        'height',
        'className',
        'resourceCellTemplate',
      ],
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof HeaderPanel {
    return HeaderPanel;
  }
}

registerComponent('dxHeaderPanelLayout', HeaderPanelComponent);
