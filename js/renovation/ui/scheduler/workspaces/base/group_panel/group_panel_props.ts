import {
  ComponentBindings,
  ForwardRef,
  JSXTemplate,
  OneWay,
  RefObject,
  Template,
} from '@devextreme-generator/declarations';
import {
  GroupPanelData,
  ResourceCellTemplateProps,
} from '../../types.d';

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

  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}
