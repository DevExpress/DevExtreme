import { equalByValue } from '@js/core/utils/common';

import type { SafeAppointment } from '../../types';
import type { AppointmentDataSource } from '../../view_model/m_appointment_data_source';
import type { AppointmentCollectorViewModel, AppointmentItemViewModel } from '../../view_model/types';
import { isCollectorViewModel } from './type_helpers';

type Item = AppointmentItemViewModel | AppointmentCollectorViewModel;

export interface DiffItem {
  needToAdd?: boolean;
  needToRemove?: boolean;
  needToResize?: boolean;
  item: AppointmentItemViewModel | AppointmentCollectorViewModel;
}

const getObjectToCompare = (item: Item, includeDimensions: boolean): object => {
  const result = isCollectorViewModel(item)
    ? {
      allDay: item.allDay,
      groupIndex: item.groupIndex,
      items: item.items.length,
    }
    : {
      allDay: item.allDay,
      groupIndex: item.groupIndex,
      direction: item.direction,
      reduced: item.reduced,
      partIndex: item.partIndex,
      partTotalCount: item.partTotalCount,
      rowIndex: item.rowIndex,
      columnIndex: item.columnIndex,
    };

  return includeDimensions
    ? {
      ...result,
      left: item.left,
      top: item.top,
      height: item.height,
      width: item.width,
    }
    : result;
};

const isAppointmentDataChanged = (
  appointmentData: SafeAppointment,
  appointmentDataSource: AppointmentDataSource,
): boolean => {
  const updatedAppointmentData = appointmentDataSource.getUpdatedAppointment();

  if (updatedAppointmentData === appointmentData) {
    return true;
  }

  const updateAppointmentKeys = appointmentDataSource.getUpdatedAppointmentKeys();

  return updateAppointmentKeys.some((item) => appointmentData[item.key] === item.value);
};

function getArraysDiff(options: {
  a: Item[];
  b: Item[];
  match: (x: Item, y: Item) => boolean;
  equal: (x: Item, y: Item) => boolean;
  canResize: (x: Item, y: Item) => boolean;
}): DiffItem[] {
  const {
    a, b, match, equal, canResize,
  } = options;
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = 1; i <= n; i += 1) {
    const ai = a[i - 1];
    for (let j = 1; j <= m; j += 1) {
      dp[i][j] = match(ai, b[j - 1])
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffItem[] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    const ai = a[i - 1];
    const bj = b[j - 1];

    if (match(ai, bj)) {
      if (equal(ai, bj)) {
        result.push({ item: bj });
      } else if (canResize(ai, bj)) {
        result.push({ item: bj, needToResize: true });
      } else {
        result.push({ item: ai, needToRemove: true });
        result.push({ item: bj, needToAdd: true });
      }

      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.push({ item: ai, needToRemove: true });
      i -= 1;
    } else {
      result.push({ item: bj, needToAdd: true });
      j -= 1;
    }
  }

  while (i > 0) {
    result.push({ item: a[i - 1], needToRemove: true });
    i -= 1;
  }
  while (j > 0) {
    result.push({ item: b[j - 1], needToAdd: true });
    j -= 1;
  }

  result.reverse();
  return result;
}

export const getViewModelDiff = (
  oldViewModel: Item[],
  newViewModel: Item[],
  appointmentDataSource: AppointmentDataSource,
): DiffItem[] => {
  const match = (a: Item, b: Item): boolean =>
    a.itemData === b.itemData && !isAppointmentDataChanged(b.itemData, appointmentDataSource);

  const equal = (a: Item, b: Item): boolean =>
    equalByValue(getObjectToCompare(a, true), getObjectToCompare(b, true));

  const canResize = (a: Item, b: Item): boolean =>
    equalByValue(getObjectToCompare(a, false), getObjectToCompare(b, false));

  const result = getArraysDiff({
    a: oldViewModel,
    b: newViewModel,
    match,
    equal,
    canResize,
  });

  return result;
};
