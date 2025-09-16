import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const addGroupingOffset = (
  entity: GeometryMinimalEntity & Geometry,
  {
    groupCount,
    groupOrientation,
    viewOrientation,
    hasAllDayPanel,
    isGroupByDate,
    cellSize,
    groupSize,
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
        entity.top += entity.groupIndex * groupSize.height
        + (entity.groupIndex + Number(!entity.isAllDayPanelOccupied))
          * Number(hasAllDayPanel) * cellSize.height;
    }
  }
};
