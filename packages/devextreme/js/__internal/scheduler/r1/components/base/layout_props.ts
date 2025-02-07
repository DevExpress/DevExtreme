import type { JSXTemplate } from '@ts/core/r1/types';

import type { GroupOrientation } from '../../types';
import type {
  DataCellTemplateProps, DefaultProps, GroupedViewData, PropsWithViewContext,
} from '../types';

export interface LayoutProps extends PropsWithViewContext {
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

export const LayoutDefaultProps: DefaultProps<LayoutProps> = {
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
