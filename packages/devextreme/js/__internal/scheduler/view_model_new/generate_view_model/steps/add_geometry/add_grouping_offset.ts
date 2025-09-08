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
    isTimelineView,
    cellSize,
    groupSize,
    intervals,
  }: GeometryOptions,
): void => {
  if (groupCount) {
    const intervalsCount = intervals.length;

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

    if (isTimelineView) {
      switch (true) {
        case groupOrientation === 'horizontal' && isGroupByDate:
          // grouped intervals before
          entity.left += (groupCount - 1) * entity.rowIndex * groupSize.width;
          break;
        case groupOrientation === 'horizontal':
          // intervals of groups before
          entity.left += entity.groupIndex * intervalsCount * groupSize.width;
          break;
        default:
      }
    }
  }
};
