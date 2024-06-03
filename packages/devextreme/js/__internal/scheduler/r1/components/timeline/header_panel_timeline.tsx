import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
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
        // @ts-expect-error JSXTemplate types issue
        dateHeaderTemplate={TimelineDateHeaderLayout}
        // @ts-expect-error
        resourceCellTemplate={ResourceCellTemplateComponent}
        // @ts-expect-error
        dateCellTemplate={DateCellTemplateComponent}
        // @ts-expect-error
        timeCellTemplate={TimeCellTemplateComponent}
      />
    );
  }
}
HeaderPanelTimeline.defaultProps = HeaderPanelDefaultProps;
