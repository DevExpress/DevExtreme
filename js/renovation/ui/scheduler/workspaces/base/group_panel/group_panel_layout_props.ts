import {
  ComponentBindings,
  CSSAttributes,
  OneWay,
} from '@devextreme-generator/declarations';
import { GroupPanelProps } from './group_panel_props';
import { GroupRenderItem } from '../../types.d';

@ComponentBindings()
export class GroupPanelLayoutProps extends GroupPanelProps {
  @OneWay() groupsRenderData: GroupRenderItem[][] = [];

  @OneWay() style?: CSSAttributes;
}
