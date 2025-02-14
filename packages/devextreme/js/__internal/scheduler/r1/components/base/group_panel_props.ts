import type { PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';
import type { JSXTemplate } from '@ts/core/r1/types';

import type { GroupItem, GroupPanelData, GroupRenderItem } from '../../types';
import type { DefaultProps, PropsWithViewContext, ResourceCellTemplateProps } from '../types';

export interface GroupPanelBaseProps extends
  Partial<PropsWithClassName>,
  PropsWithStyles,
  PropsWithViewContext {
  groupPanelData: GroupPanelData;
  groupByDate: boolean;
  height?: number;
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelBaseDefaultProps: DefaultProps<GroupPanelBaseProps> = {
  groupPanelData: {
    groupPanelItems: [],
    baseColSpan: 1,
  },
  groupByDate: false,
  styles: {},
};

export interface GroupPanelCellProps extends PropsWithClassName {
  id: string | number;
  text?: string;
  color?: string;
  data: GroupItem;
  index: number;
  cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelCellDefaultProps = {
  id: 0,
  text: '',
  data: {
    id: 0,
  },
  className: '',
};

export interface GroupPanelRowProps extends PropsWithClassName {
  groupItems: GroupRenderItem[];
  cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelRowDefaultProps = {
  groupItems: [],
  className: '',
};
