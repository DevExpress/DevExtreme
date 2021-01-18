import {
  ComponentBindings,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { GroupOrientation } from '../../../types.d';
import {
  Group,
  ResourceCellTemplateProps,
} from '../../types.d';

@ComponentBindings()
export class GroupPanelProps {
  @OneWay() groups: Group[] = [];

  @OneWay() groupOrientation: GroupOrientation = VERTICAL_GROUP_ORIENTATION;

  @OneWay() groupByDate = false;

  @OneWay() height?: number;

  @OneWay() className?: string;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}
