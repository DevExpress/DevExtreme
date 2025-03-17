import type { InfernoEffect } from '@ts/core/r1/runtime/inferno/index';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { HeaderPanelProps } from '../base/header_panel';
import { HeaderPanel, HeaderPanelDefaultProps } from '../base/header_panel';
import { TimelineDateHeaderLayout } from './date_header_timeline';

export class HeaderPanelTimeline extends InfernoWrapperComponent<HeaderPanelProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      viewContext,
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
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);
    const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);

    return (
      // @ts-ignore
      <HeaderPanel
        viewContext={viewContext}
        dateHeaderData={dateHeaderData}
        groupPanelData={groupPanelData}
        groupByDate={groupByDate}
        groups={groups}
        groupOrientation={groupOrientation}
        isRenderDateHeader={isRenderDateHeader}
        dateHeaderTemplate={TimelineDateHeaderLayout}
        resourceCellTemplate={ResourceCellTemplateComponent}
        dateCellTemplate={DateCellTemplateComponent}
        timeCellTemplate={TimeCellTemplateComponent}
      />
    );
  }
}
HeaderPanelTimeline.defaultProps = HeaderPanelDefaultProps;
