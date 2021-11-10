import {
  ComponentBindings,
  OneWay,
  Template,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { GroupedViewData, DataCellTemplateProps } from '../types';
import { GroupOrientation } from '../../types';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData: GroupedViewData = {
    groupedData: [],
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

  @OneWay() addVerticalSizesClassToRows = true;

  @OneWay() width?: number;

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}
