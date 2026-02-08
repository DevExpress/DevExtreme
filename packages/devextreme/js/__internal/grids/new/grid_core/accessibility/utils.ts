import messageLocalization from '@js/localization/message';

import type { Position } from './types';

export const getCardRoleDescription = (
  isEditable?: boolean,
): string => (isEditable ? messageLocalization.format('dxCardView-ariaEditableCard') : messageLocalization.format('dxCardView-ariaCard'));

// @ts-expect-error ts-error
const getPositionDescription = (position?: Position): string => (position ? messageLocalization.format('dxCardView-ariaCardPosition', position.rowIndex + 1, position.columnIndex + 1) : '');

export const getCardStateDescription = (
  position?: Position,
  isSelectable?: boolean,
  isSelected?: boolean,
): string => {
  const parts: string[] = [getPositionDescription(position)];
  if (isSelectable) {
    parts.push(isSelected ? messageLocalization.format('dxCardView-ariaSelectedCardState') : messageLocalization.format('dxCardView-ariaNotSelectedCardState'));
  }
  return parts.join(', ');
};

export const getCardDescriptiveLabel = (
  hasCover: boolean,
  coverId: string,
  contentId: string,
): string => {
  const ids: string[] = [];
  if (hasCover) {
    ids.push(coverId);
  }

  ids.push(contentId);

  return ids.join(' ');
};

export const getPosition = (idx: number, columnCount: number): Position => ({
  rowIndex: Math.floor(idx / columnCount),
  columnIndex: idx % columnCount,
});
