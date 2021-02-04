import {
  ComponentBindings,
  OneWay,
  Template,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData, DataCellTemplateProps } from '../types.d';
import { GroupOrientation } from '../../types.d';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData: GroupedViewData = {
    groupedData: [],
    cellCountInGroupRow: 0,
  };

  @OneWay() groupOrientation?: GroupOrientation;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}
