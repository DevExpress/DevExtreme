import { isDefined } from '@ts/core/utils/m_type';

interface SettingsItem {
  partIndex?: number;
  partTotalCount?: number;
}
interface Item {
  needRepaint: boolean;
  needRemove: boolean;
  settings: SettingsItem[];
}

const countVisibleRepeats = (settings: SettingsItem[]): number => {
  let isPreviousPart = false;

  return settings.reduce((total, settingsItem) => {
    const result = isPreviousPart ? total : total + 1;
    const { partIndex, partTotalCount } = settingsItem;

    isPreviousPart = isDefined(partTotalCount) && partIndex !== (partTotalCount - 1);

    return result;
  }, 0);
};

export const countVisibleAppointments = (items: Item[]): number => items
  .filter(({ needRemove }) => !needRemove)
  .reduce((total, item) => total + countVisibleRepeats(item.settings), 0);
