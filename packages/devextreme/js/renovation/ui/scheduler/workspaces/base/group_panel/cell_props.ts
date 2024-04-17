import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { ResourceCellTemplateProps } from '../../types';
import { GroupItem } from '../../../../../../__internal/scheduler/r1/types';

@ComponentBindings()
export class GroupPanelCellProps {
  @OneWay() id: string | number = 0;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data: GroupItem = { id: 0 };

  @OneWay() index!: number;

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className = '';
}
