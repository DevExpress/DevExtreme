import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelProps } from './group_panel_props';
import { GroupRenderItem } from '../../types.d';

@ComponentBindings()
export class GroupPanelLayoutProps extends GroupPanelProps {
  @OneWay() groupsRenderData: GroupRenderItem[][] = [];
}
