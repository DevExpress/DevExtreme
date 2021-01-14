import {
  Component,
  JSXComponent,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { isVerticalGroupOrientation } from '../../utils';
import { GroupPanelProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';

export const viewFunction = ({
  layout: Layout,
  props: {
    groups,
    groupByDate,
    height,
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
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get layout(): JSXTemplate<GroupPanelProps> {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation)
      ? GroupPanelVerticalLayout
      : GroupPanelVerticalLayout; // TODO: horizontal layout
  }
}
