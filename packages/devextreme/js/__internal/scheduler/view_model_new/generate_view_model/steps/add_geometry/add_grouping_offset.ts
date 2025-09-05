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
    isGroupByDate,
    isTimeline,
    cellSize,
    intervalSize,
    intervals,
  }: Pick<GeometryOptions, 'groupCount' | 'groupOrientation' | 'isGroupByDate' | 'isTimeline' | 'cellSize' | 'intervalSize' | 'intervals'>,
): void => {
  if (groupCount) {
    const intervalsCount = intervals.length;

    switch (true) {
      case groupOrientation === 'horizontal' && isGroupByDate:
        entity.left
          += (groupCount - 1) * cellSize.width * entity.columnIndex // cells before date
          + cellSize.width * entity.groupIndex; // cells inside date
        break;
      case groupOrientation === 'horizontal':
        entity.left += entity.groupIndex * intervalSize.width; // intervals before
        break;
      default:
        entity.top += entity.groupIndex * intervalSize.height * intervalsCount;
    }

    if (isTimeline) {
      switch (true) {
        case groupOrientation === 'horizontal' && isGroupByDate:
          // grouped intervals before
          entity.left += (groupCount - 1) * entity.rowIndex * intervalSize.width;
          break;
        case groupOrientation === 'horizontal':
          // intervals of groups before
          entity.left += entity.groupIndex * intervalsCount * intervalSize.width;
          break;
        default:
      }
    }
  }
};
