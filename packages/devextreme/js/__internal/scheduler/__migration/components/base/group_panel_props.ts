import type { JSXTemplate } from '@devextreme-generator/declarations';
import type { PropsWithClassName, PropsWithStyles } from '@ts/core/component_wrappers/index';

import type { GroupItem, GroupPanelData, GroupRenderItem } from '../../types';
import type { ResourceCellTemplateProps } from '../types';

export interface GroupPanelBaseProps extends Partial<PropsWithClassName>, PropsWithStyles {
  groupPanelData: GroupPanelData;
  groupByDate: boolean;
  height?: number;
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelBaseDefaultProps: GroupPanelBaseProps = {
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
  data: Object.freeze({
    id: 0,
  }),
  className: '',
};

export interface GroupPanelRowProps extends PropsWithClassName {
  groupItems: GroupRenderItem[];
  cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelRowDefaultProps = {
  groupItems: Object.freeze([]),
  className: '',
};
