import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const getCumulativeRowOffset = (
  heights: number[] | undefined,
  index: number,
  uniformSize: number,
): number => (heights?.length
  ? heights.slice(0, index).reduce((sum, height) => sum + height, 0)
  : index * uniformSize);

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
    autoRowHeights,
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
      default: {
        const groupTopOffset = getCumulativeRowOffset(
          autoRowHeights,
          entity.groupIndex,
          groupSize.height,
        );

        entity.top += groupTopOffset
          + (entity.groupIndex + Number(!entity.isAllDayPanelOccupied))
          * Number(hasAllDayPanel) * allDayPanelCellSize.height;
      }
    }
  }
};
