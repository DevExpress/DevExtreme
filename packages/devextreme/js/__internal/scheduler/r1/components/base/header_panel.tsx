import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { DateHeaderData } from '../../types';
import { isHorizontalGroupingApplied } from '../../utils/index';
import type { DateTimeCellTemplateProps } from '../types';
import type { DateHeaderProps } from './date_header';
import { DateHeader } from './date_header';
import type { GroupPanelProps } from './group_panel';
import { GroupPanel, GroupPanelDefaultProps } from './group_panel';

export interface HeaderPanelProps extends GroupPanelProps {
  dateHeaderData: DateHeaderData;
  isRenderDateHeader: boolean;
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
  dateHeaderTemplate: JSXTemplate<DateHeaderProps, 'dateHeaderData'>;
}

export const HeaderPanelDefaultProps = {
  ...GroupPanelDefaultProps,
  isRenderDateHeader: true,
  dateHeaderTemplate: DateHeader,
};

export class HeaderPanel extends InfernoWrapperComponent<HeaderPanelProps> {
  // eslint-disable-next-line class-methods-use-this
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      viewContext,
      dateHeaderData,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      dateCellTemplate,
      dateHeaderTemplate,
      resourceCellTemplate,
      timeCellTemplate,
    } = this.props;
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);
    const DateHeaderTemplateComponent = getTemplate(dateHeaderTemplate);
    const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);

    return (
      <thead>
      {
        isHorizontalGrouping && !groupByDate && (
          // @ts-ignore
          <GroupPanel
            viewContext={viewContext}
            groupPanelData={groupPanelData}
            groups={groups}
            groupByDate={groupByDate}
            groupOrientation={groupOrientation}
            resourceCellTemplate={ResourceCellTemplateComponent}
          />
        )
      }
      {
        isRenderDateHeader && DateHeaderTemplateComponent({
          viewContext,
          groupByDate,
          dateHeaderData,
          groupOrientation,
          groups,
          dateCellTemplate: DateCellTemplateComponent,
          timeCellTemplate: TimeCellTemplateComponent,
        })
      }
      {
        groupByDate && (
          // @ts-ignore
          <GroupPanel
            viewContext={viewContext}
            groupPanelData={groupPanelData}
            groups={groups}
            groupByDate={groupByDate}
            groupOrientation={groupOrientation}
            resourceCellTemplate={ResourceCellTemplateComponent}
          />
        )
      }
      </thead>
    );
  }
}

HeaderPanel.defaultProps = HeaderPanelDefaultProps;
