import {
  ComponentBindings,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import {
  ResourceCellTemplateProps,
} from '../../types';
import { GroupPanelData } from '../../../../../../__internal/scheduler/__migration/types';

@ComponentBindings()
export class GroupPanelBaseProps {
  @OneWay() groupPanelData: GroupPanelData = {
    groupPanelItems: [],
    baseColSpan: 1,
  };

  @OneWay() groupByDate = false;

  @OneWay() height?: number;

  @OneWay() className?: string;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}
