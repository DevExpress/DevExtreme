import {
  Component,
  ComponentBindings,
  ForwardRef,
  JSXComponent,
  JSXTemplate,
  OneWay,
  RefObject,
} from '@devextreme-generator/declarations';
import { isVerticalGroupingApplied } from '../../utils';
import { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelVerticalLayout, VerticalGroupPanelLayoutProps } from './vertical/layout';
import { GroupPanelHorizontalLayout, HorizontalGroupPanelLayoutProps } from './horizontal/layout';
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
    elementRef,
  },
}: GroupPanel): JSX.Element => (
  <Layout
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    className={className}
    groupPanelData={groupPanelData}
    elementRef={elementRef}
    styles={restAttributes.style}
  />
);

@ComponentBindings()
export class GroupPanelProps extends GroupPanelBaseProps {
  @OneWay() groups: Group[] = [];

  @OneWay() groupOrientation: GroupOrientation = VERTICAL_GROUP_ORIENTATION;

  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get layout():
  JSXTemplate<VerticalGroupPanelLayoutProps> | JSXTemplate<HorizontalGroupPanelLayoutProps> {
    const { groupOrientation, groups } = this.props;

    return isVerticalGroupingApplied(groups, groupOrientation)
      ? GroupPanelVerticalLayout
      : GroupPanelHorizontalLayout;
  }
}
