import type { AppointmentCollectorWithGeometry } from '../../../types';
import { addAdaptivityGeometryInsideInterval } from './add_adaptivity_geometry_inside_interval';
import { addGeometryInsideInterval } from './add_geometry_inside_interval';
import { addGroupingOffset } from './add_grouping_offset';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

const RTLSwap = (
  entity: GeometryMinimalEntity & Geometry,
  { panelSize, isRTLEnabled }: GeometryOptions,
): void => {
  if (isRTLEnabled) {
    const deltaWidth = entity.items.length ? 0 : entity.width;
    entity.left = panelSize.width - entity.left - deltaWidth;
  }
};

const addPanelOffset = <T extends GeometryMinimalEntity & Geometry>(
  entity: T,
  { intervalSize, viewOrientation, isTimelineView }: GeometryOptions,
): void => {
  switch (true) {
    case viewOrientation === 'horizontal' && !isTimelineView: // month
      entity.top += entity.rowIndex * intervalSize.height;
      break;
    case viewOrientation === 'horizontal' && isTimelineView: // timelineX
    case viewOrientation === 'vertical': // day, week, workWeek
      entity.left += entity.rowIndex * intervalSize.width;
      break;
    default:
  }
};

export const addGeometry = <T extends GeometryMinimalEntity>(
  entities: T[],
  options: GeometryOptions,
): (T & Geometry & AppointmentCollectorWithGeometry)[] => entities.map((rawEntity) => {
    const { isAdaptivityEnabled, maxAppointmentsPerCell } = options;
    const entity = isAdaptivityEnabled && maxAppointmentsPerCell === 0
      ? addAdaptivityGeometryInsideInterval(rawEntity, options)
      : addGeometryInsideInterval(rawEntity, options);
    addPanelOffset(entity, options);
    addGroupingOffset(entity, options);
    RTLSwap(entity, options);

    return entity;
  });
