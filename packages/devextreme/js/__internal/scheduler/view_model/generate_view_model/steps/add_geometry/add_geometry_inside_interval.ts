import type { AppointmentCollectorWithGeometry } from '../../../types';
import { getAppointmentCollectorGeometry } from './get_appointment_collector_geometry';
import { getAppointmentGeometry } from './get_appointment_geometry';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const addGeometryInsideInterval = <T extends GeometryMinimalEntity>(
  entity: T,
  options: GeometryOptions,
): T & Geometry & AppointmentCollectorWithGeometry => {
  if (entity.items.length) {
    const entityGeometry = getAppointmentCollectorGeometry(entity, options);
    const items = entity.items.map((item) => {
      const size = getAppointmentGeometry({ ...entity, ...item }, options);
      return { ...item, width: size.width, height: size.height };
    });

    return { ...entity, ...entityGeometry, items };
  }

  const entityGeometry = getAppointmentGeometry(entity, options);

  return { ...entity, ...entityGeometry, items: [] };
};
