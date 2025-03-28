import messageLocalization from '@js/common/core/localization/message';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import { extend } from '@ts/core/utils/m_extend';

import type { SchedulerHeader } from './m_header';

const TODAY_BUTTON_CLASS = 'dx-scheduler-today';
const TODAY_BUTTON_KEY = 'dxScheduler-navigationToday';

export const getTodayButtonOptions = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => extend(true, {}, {
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  cssClass: TODAY_BUTTON_CLASS,
  options: {
    text: messageLocalization.format(TODAY_BUTTON_KEY),
    icon: 'today',
    stylingMode: 'outlined',
    type: 'normal',
    onClick() {
      header._updateCurrentDate(new Date());
    },
  },
}, item) as ToolbarItem;
