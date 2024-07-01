import registerComponent from '@js/core/component_registrator';

import { HeaderPanelTimeline } from '../timeline/header_panel_timeline';
import { HeaderPanelComponent } from './header_panel';

export class HeaderPanelTimelineComponent extends HeaderPanelComponent {
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

  get _viewComponent(): typeof HeaderPanelTimeline {
    return HeaderPanelTimeline;
  }
}
registerComponent('dxTimelineHeaderPanelLayout', HeaderPanelTimelineComponent);
