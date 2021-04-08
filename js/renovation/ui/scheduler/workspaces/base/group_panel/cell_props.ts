import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { GroupItem, ResourceCellTemplateProps } from '../../types.d';

@ComponentBindings()
export class GroupPanelCellProps {
  @OneWay() id: string | number = 0;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data: GroupItem = { id: 0 };

  @OneWay() index?: number;

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className = '';
}
