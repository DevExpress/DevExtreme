/* eslint-disable react/prop-types */
import {
  Component,
  ComponentBindings,
  ForwardRef,
  JSXComponent,
  OneWay,
  RefObject,
} from '@devextreme-generator/declarations';
import { isVerticalGroupingApplied } from '../../utils';
import { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { Group } from '../../types';
import { GroupOrientation } from '../../../types';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { GroupPanelWrapper } from '../../../../../component_wrapper/scheduler/group_panel';

export const viewFunction = ({
  restAttributes,
  isVerticalLayout,
  props: {
    height,
    className,
    groupPanelData,
    resourceCellTemplate,
    elementRef,
  },
}: GroupPanel): JSX.Element => (isVerticalLayout ? (
  <GroupPanelVerticalLayout
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    className={className}
    groupPanelData={groupPanelData}
    elementRef={elementRef}
    styles={restAttributes.style}
  />
) : (
  <GroupPanelHorizontalLayout
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    className={className}
    groupPanelData={groupPanelData}
    elementRef={elementRef}
    styles={restAttributes.style}
  />
));

@ComponentBindings()
export class GroupPanelProps extends GroupPanelBaseProps {
  @OneWay() groups: Group[] = [];

  @OneWay() groupOrientation: GroupOrientation = VERTICAL_GROUP_ORIENTATION;

  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: GroupPanelWrapper,
  },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get isVerticalLayout(): boolean {
    const { groupOrientation, groups } = this.props;

    return isVerticalGroupingApplied(groups, groupOrientation);
  }
}
