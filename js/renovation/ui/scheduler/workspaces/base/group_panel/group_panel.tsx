import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
} from '@devextreme-generator/declarations';
import { isVerticalGroupingApplied } from '../../utils';
import { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { GroupPanelLayoutProps } from './group_panel_layout_props';
import { Group } from '../../types';
import { GroupOrientation } from '../../../types';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';

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

@ComponentBindings()
export class GroupPanelProps extends GroupPanelBaseProps {
  @OneWay() groups: Group[] = [];

  @OneWay() groupOrientation: GroupOrientation = VERTICAL_GROUP_ORIENTATION;
}

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
