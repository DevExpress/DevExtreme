import {
  ComponentBindings,
  OneWay,
  Template,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { GroupedViewData, DataCellTemplateProps } from '../types.d';
import { GroupOrientation } from '../../types.d';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData: GroupedViewData = {
    groupedData: [],
    cellCountInGroupRow: 0,
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @OneWay() groupOrientation?: GroupOrientation;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

  @OneWay() addDateTableClass = true;

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}
