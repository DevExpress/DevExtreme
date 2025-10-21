import type { InfernoEffect } from '@ts/core/r1/runtime/inferno/index';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';
import type { JSXTemplate } from '@ts/core/r1/types';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';

import type { DateHeaderData } from '../../../types';
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
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups.length, groupOrientation);

    return (
      <thead>
      {
        isHorizontalGrouping && !groupByDate && (
          <GroupPanel
            viewContext={viewContext}
            groupPanelData={groupPanelData}
            groups={groups}
            groupByDate={groupByDate}
            groupOrientation={groupOrientation}
            resourceCellTemplate={resourceCellTemplate}
          />
        )
      }
      {
        isRenderDateHeader
        && <PublicTemplate
          template={dateHeaderTemplate}
          templateProps={{
            viewContext,
            groupByDate,
            dateHeaderData,
            groupOrientation,
            groups,
            dateCellTemplate,
            timeCellTemplate,
          }}
        />
      }
      {
        groupByDate && (
          <GroupPanel
            viewContext={viewContext}
            groupPanelData={groupPanelData}
            groups={groups}
            groupByDate={groupByDate}
            groupOrientation={groupOrientation}
            resourceCellTemplate={resourceCellTemplate}
          />
        )
      }
      </thead>
    );
  }
}

HeaderPanel.defaultProps = HeaderPanelDefaultProps;
