import type { Position } from './types';

export const getCardRoleDescription = (
  isEditable?: boolean,
): string => (isEditable ? 'Editable card' : 'Card');

const getPositionDescription = (position: Position): string => `Row ${position.rowIndex + 1}, Column ${position.columnIndex + 1}`;

export const getCardStateDescription = (
  position: Position,
  isSelectable?: boolean,
  isSelected?: boolean,
): string => {
  const parts: string[] = [getPositionDescription(position)];
  if (isSelectable) {
    parts.push(isSelected ? 'Selected' : 'Not selected');
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
