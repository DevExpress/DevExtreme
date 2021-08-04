import {
  ComponentBindings,
  CSSAttributes,
  OneWay,
} from '@devextreme-generator/declarations';
import { GroupPanelBaseProps } from './group_panel_props';

@ComponentBindings()
export class GroupPanelLayoutProps extends GroupPanelBaseProps {
  @OneWay() styles?: CSSAttributes;
}
