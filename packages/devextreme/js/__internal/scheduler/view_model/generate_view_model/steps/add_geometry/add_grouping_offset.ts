import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

const getGroupHeight = (
  groupHeights: number[] | undefined,
  groupIndex: number,
  defaultHeight: number,
): number => groupHeights?.[groupIndex] ?? defaultHeight;

const getCumulativeGroupOffset = (
  groupHeights: number[] | undefined,
  groupIndex: number,
  defaultHeight: number,
): number => {
  let offset = 0;

  for (let i = 0; i < groupIndex; i += 1) {
    offset += getGroupHeight(groupHeights, i, defaultHeight);
  }

  return offset;
};

export const addGroupingOffset = (
  entity: GeometryMinimalEntity & Geometry,
  {
    groupCount,
    groupOrientation,
    viewOrientation,
    hasAllDayPanel,
    isGroupByDate,
    allDayPanelCellSize,
    cellSize,
    groupSize,
    groupHeights,
  }: GeometryOptions,
): void => {
  if (groupCount) {
    switch (true) {
      case groupOrientation === 'horizontal' && isGroupByDate:
        entity.left
          += (groupCount - 1) * cellSize.width * (
            viewOrientation === 'horizontal' ? entity.columnIndex : entity.rowIndex
          ) // cells before date
          + cellSize.width * entity.groupIndex; // cells inside date
        break;
      case groupOrientation === 'horizontal':
        entity.left += entity.groupIndex * groupSize.width; // intervals before
        break;
      default:
        entity.top += getCumulativeGroupOffset(
          groupHeights,
          entity.groupIndex,
          groupSize.height,
        )
        + (entity.groupIndex + Number(!entity.isAllDayPanelOccupied))
          * Number(hasAllDayPanel) * allDayPanelCellSize.height;
    }
  }
};
