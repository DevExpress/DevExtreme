import type { PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';
import type { JSXTemplate, RefObject } from '@ts/core/r1/types';

import type { GroupItem, GroupPanelData, GroupRenderItem } from '../../../types';
import type { DefaultProps, PropsWithViewContext, ResourceCellTemplateProps } from '../types';

export type GroupPanelVerticalLayout = 'sidebar' | 'timeline';

export interface GroupPanelBaseProps extends
  Partial<PropsWithClassName>,
  PropsWithStyles,
  PropsWithViewContext {
  groupPanelData: GroupPanelData;
  groupByDate: boolean;
  height?: number;
  elementRef?: RefObject<HTMLDivElement>;
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
  verticalLayout?: GroupPanelVerticalLayout;
}

export const GroupPanelBaseDefaultProps: DefaultProps<GroupPanelBaseProps> = {
  groupPanelData: {
    groupTree: [],
    groupPanelItems: [],
    maxDepth: 0,
    baseColSpan: 1,
  },
  groupByDate: false,
  styles: {},
  verticalLayout: 'sidebar',
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
