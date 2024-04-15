import registerComponent from '@js/core/component_registrator';
import { ComponentWrapper } from '@ts/core/r1/index';

import { GroupPanel } from '../base/group_panel';

export class GroupPanelComponent extends ComponentWrapper {
  _setOptionsByReference(): void {
    // @ts-expect-error badly typed DomComponent
    super._setOptionsByReference();
    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = {
      // @ts-expect-error badly typed DomComponent
      ...this._optionsByReference,
      resourceCellTemplate: true,
    };
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['resourceCellTemplate'],
      props: ['groups', 'groupOrientation', 'groupPanelData', 'groupByDate', 'height', 'className', 'resourceCellTemplate'],
    };
  }

  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof GroupPanel {
    return GroupPanel;
  }
}

registerComponent('dxGroupPanel', GroupPanelComponent);
