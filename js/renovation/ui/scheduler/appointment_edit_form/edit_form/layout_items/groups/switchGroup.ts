import type { GroupItem } from '../../../../../../../ui/form';
import { ItemLabels } from '../const';
import { getSwitchLayoutItemConfig } from '../switch';

export const getSwitchGroupConfig = (
  allDayEditorTemplate: JSX.Element,
  repeatEditorTemplate: JSX.Element,
  allDayExpr: string,
): GroupItem => ({
  itemType: 'group',
  colCountByScreen: {
    lg: 3,
    xs: 3,
  },
  colSpan: 2,
  items: [
    getSwitchLayoutItemConfig(
      allDayEditorTemplate,
      allDayExpr,
      ItemLabels.allDay,
    ),
    getSwitchLayoutItemConfig(
      repeatEditorTemplate,
      'repeat',
      ItemLabels.repeat,
    ),
    {
      itemType: 'empty',
      colSpan: 2,
    },
  ],
});
