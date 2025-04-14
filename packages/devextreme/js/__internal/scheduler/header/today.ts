import messageLocalization from '@js/common/core/localization/message';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import { extend } from '@ts/core/utils/m_extend';

import type { SchedulerHeader } from './m_header';

export const getTodayButtonOptions = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => extend(true, {}, {
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  cssClass: 'dx-scheduler-today',
  options: {
    text: messageLocalization.format('dxScheduler-navigationToday'),
    icon: 'today',
    stylingMode: 'outlined',
    type: 'normal',
    onClick() {
      header._updateCurrentDate(header.option('indicatorTime') ?? new Date());
    },
  },
}, item) as ToolbarItem;
