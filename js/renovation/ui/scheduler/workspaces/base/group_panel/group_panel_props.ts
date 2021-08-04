import {
  ComponentBindings,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { GroupOrientation } from '../../../types.d';
import {
  Group,
  GroupPanelData,
  ResourceCellTemplateProps,
} from '../../types.d';

@ComponentBindings()
export class GroupPanelProps {
  @OneWay() groups: Group[] = [];

  @OneWay() groupPanelData: GroupPanelData = {
    groupPanelItems: [],
    baseColSpan: 1,
  };

  @OneWay() groupOrientation: GroupOrientation = VERTICAL_GROUP_ORIENTATION;

  @OneWay() groupByDate = false;

  @OneWay() height?: number;

  @OneWay() columnCountPerGroup = 1;

  @OneWay() className?: string;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}
