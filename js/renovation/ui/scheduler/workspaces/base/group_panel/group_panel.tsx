import {
  Component,
  JSXComponent,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { isVerticalGroupOrientation } from '../../utils';
import { GroupPanelProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { GroupPanelLayoutProps } from './group_panel_layout_props';
import { GroupRenderItem } from '../../types.d';
import { getGroupsRenderData } from './utils';

export const viewFunction = ({
  layout: Layout,
  groupsRenderData,
  props: {
    groups,
    groupByDate,
    height,
    baseColSpan,
    className,
    resourceCellTemplate,
  },
}: GroupPanel): JSX.Element => (
  <Layout
    groups={groups}
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    groupByDate={groupByDate}
    className={className}
    groupsRenderData={groupsRenderData}
    baseColSpan={baseColSpan}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get layout(): JSXTemplate<GroupPanelLayoutProps> {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation)
      ? GroupPanelVerticalLayout
      : GroupPanelHorizontalLayout;
  }

  get groupsRenderData(): GroupRenderItem[][] {
    const { groups, columnCountPerGroup, groupByDate } = this.props;

    return getGroupsRenderData(groups, columnCountPerGroup, groupByDate);
  }
}
