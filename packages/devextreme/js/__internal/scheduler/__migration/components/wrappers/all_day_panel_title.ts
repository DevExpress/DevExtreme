import registerComponent from '@js/core/component_registrator';
import { ComponentWrapper } from '@ts/core/component_wrappers/index';

import { AllDayPanelTitle } from '../base/all_day_panel_title';

export class AllDayPanelTitleComponent extends ComponentWrapper {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: [],
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof AllDayPanelTitle {
    return AllDayPanelTitle;
  }
}
registerComponent('dxAllDayPanelTitle', AllDayPanelTitleComponent);
