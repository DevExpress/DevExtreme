import {
  Component,
  JSXComponent,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { isVerticalGroupingApplied } from '../../utils';
import { GroupPanelProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { GroupPanelLayoutProps } from './group_panel_layout_props';

export const viewFunction = ({
  layout: Layout,
  restAttributes,
  props: {
    height,
    className,
    groupPanelData,
    resourceCellTemplate,
  },
}: GroupPanel): JSX.Element => (
  <Layout
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    className={className}
    groupPanelData={groupPanelData}
    // eslint-disable-next-line react/jsx-props-no-spreading
    styles={restAttributes.style}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get layout(): JSXTemplate<GroupPanelLayoutProps> {
    const { groupOrientation, groups } = this.props;

    return isVerticalGroupingApplied(groups, groupOrientation)
      ? GroupPanelVerticalLayout
      : GroupPanelHorizontalLayout;
  }
}
