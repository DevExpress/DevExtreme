import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import {
  DateHeaderData,
  DateTimeCellTemplateProps,
} from '../../types';
import { isHorizontalGroupingApplied } from '../../utils';
import { GroupPanel, GroupPanelProps } from '../group_panel/group_panel';
import { DateHeaderLayout, DateHeaderLayoutProps } from './date_header/layout';
import { HeaderPanel } from '../../../../../component_wrapper/scheduler/header_panel';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderData,
    groupByDate,
    groups,
    groupOrientation,
    groupPanelData,
    isRenderDateHeader,
    resourceCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
    dateHeaderTemplate: DateHeader,
  },
}: HeaderPanelLayout): JSX.Element => (
  <thead>
    {isHorizontalGrouping && !groupByDate && (
      <GroupPanel
        groupPanelData={groupPanelData}
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        resourceCellTemplate={resourceCellTemplate}
      />
    )}
    {isRenderDateHeader && (
      <DateHeader
        groupByDate={groupByDate}
        dateHeaderData={dateHeaderData}
        groupOrientation={groupOrientation}
        groups={groups}
        dateCellTemplate={dateCellTemplate}
        timeCellTemplate={timeCellTemplate}
      />
    )}
    {groupByDate && (
      <GroupPanel
        groupPanelData={groupPanelData}
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        resourceCellTemplate={resourceCellTemplate}
      />
    )}
  </thead>
);

@ComponentBindings()
export class HeaderPanelLayoutProps extends GroupPanelProps {
  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() isRenderDateHeader = true;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateHeaderTemplate: JSXTemplate<DateHeaderLayoutProps, 'dateHeaderData'> = DateHeaderLayout;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: HeaderPanel,
  },
})
export class HeaderPanelLayout extends JSXComponent<HeaderPanelLayoutProps, 'dateHeaderData'>() {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupingApplied(groups, groupOrientation);
  }
}
