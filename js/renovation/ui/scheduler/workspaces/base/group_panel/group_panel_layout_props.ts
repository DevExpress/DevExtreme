import {
  ComponentBindings,
  CSSAttributes,
  OneWay,
} from '@devextreme-generator/declarations';
import { GroupPanelProps } from './group_panel_props';

@ComponentBindings()
export class GroupPanelLayoutProps extends GroupPanelProps {
  @OneWay() styles?: CSSAttributes;
}
