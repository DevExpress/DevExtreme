import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import type { HeaderPanelProps } from '../base/header_panel';
import { HeaderPanel, HeaderPanelDefaultProps } from '../base/header_panel';
import { TimelineDateHeaderLayout } from './date_header_timeline';

export class HeaderPanelTimeline extends InfernoWrapperComponent<HeaderPanelProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): VNode {
    const {
      dateCellTemplate,
      dateHeaderData,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      resourceCellTemplate,
      timeCellTemplate,
    } = this.props;
    const dateCellTemplateComponent = getTemplate(dateCellTemplate);
    const resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const timeCellTemplateComponent = getTemplate(timeCellTemplate);

    return createComponentVNode(2, HeaderPanel, {
      dateHeaderTemplate: TimelineDateHeaderLayout,
      dateHeaderData,
      groupPanelData,
      groupByDate,
      groups,
      groupOrientation,
      isRenderDateHeader,
      resourceCellTemplate: resourceCellTemplateComponent,
      dateCellTemplate: dateCellTemplateComponent,
      timeCellTemplate: timeCellTemplateComponent,
    });
  }
}
HeaderPanelTimeline.defaultProps = HeaderPanelDefaultProps;
