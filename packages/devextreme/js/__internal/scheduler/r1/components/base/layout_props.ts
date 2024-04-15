import type { JSXTemplate } from '@devextreme-generator/declarations';

import type { GroupOrientation } from '../../types';
import type { DataCellTemplateProps, GroupedViewData } from '../types';

export interface LayoutProps {
  viewData: GroupedViewData;
  groupOrientation?: GroupOrientation;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  topVirtualRowHeight: number;
  bottomVirtualRowHeight: number;
  addDateTableClass: boolean;
  addVerticalSizesClassToRows: boolean;
  width?: number;
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

export const LayoutDefaultProps: LayoutProps = {
  viewData: {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  },
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  addDateTableClass: true,
  addVerticalSizesClassToRows: true,
};
