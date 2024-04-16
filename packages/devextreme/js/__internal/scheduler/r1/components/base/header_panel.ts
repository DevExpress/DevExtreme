import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

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

  render(): VNode {
    const {
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
    const dateCellTemplateComponent = getTemplate(dateCellTemplate);
    const dateHeaderTemplateComponent = getTemplate(dateHeaderTemplate);
    const resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const timeCellTemplateComponent = getTemplate(timeCellTemplate);

    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);

    return createVNode(
      1,
      'thead',
      null,
      [isHorizontalGrouping
      && !groupByDate
      && createComponentVNode(2, GroupPanel, {
        groupPanelData,
        groups,
        groupByDate,
        groupOrientation,
        resourceCellTemplate: resourceCellTemplateComponent,
      }), isRenderDateHeader && dateHeaderTemplateComponent({
        groupByDate,
        dateHeaderData,
        groupOrientation,
        groups,
        dateCellTemplate: dateCellTemplateComponent,
        timeCellTemplate: timeCellTemplateComponent,
      }), groupByDate && createComponentVNode(2, GroupPanel, {
        groupPanelData,
        groups,
        groupByDate,
        groupOrientation,
        resourceCellTemplate: resourceCellTemplateComponent,
      })],
      0,
    );
  }
}

HeaderPanel.defaultProps = HeaderPanelDefaultProps;
