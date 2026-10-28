import type { DataKey } from '@ts/core/element_data';
import { LIST_ITEM_DATA_KEY as LIST_ITEM_DATA_KEY_NAME } from '@ts/ui/list/list.base';

import type { AppointmentTooltipItem } from './types';

export const LIST_ITEM_DATA_KEY: DataKey<AppointmentTooltipItem> = LIST_ITEM_DATA_KEY_NAME;
export const LIST_ITEM_CLASS = 'dx-list-item';
export const APPOINTMENT_SETTINGS_KEY = 'dxAppointmentSettings';

export const VERTICAL_GROUP_ORIENTATION = 'vertical';
export const HORIZONTAL_GROUP_ORIENTATION = 'horizontal';

export const VERTICAL_VIEW_TYPES = ['day', 'week', 'workWeek'];
