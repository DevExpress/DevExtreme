import type { AppointmentCollectorWithGeometry } from '../../../types';
import { getAppointmentGeometry, getAppointmentX } from './get_appointment_geometry';
import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const addGeometryInsideInterval = <T extends GeometryMinimalEntity>(
  entity: T,
  options: GeometryOptions,
): T & Geometry & AppointmentCollectorWithGeometry => {
  const { intervals, intervalSize, viewOrientation } = options;
  const dateInterval = intervals[entity.rowIndex];
  const intervalAbstractSize = getAbstractSizeByViewOrientation(intervalSize, viewOrientation);
  const interval = { ...dateInterval, ...intervalAbstractSize };
  const abstractGeometryInsideInterval = getAppointmentGeometry(entity, interval, options);
  const entityGeometry = getRealSizeByViewOrientation(
    abstractGeometryInsideInterval,
    viewOrientation,
  );
  const items = entity.items.map((item) => {
    const appointmentX = getAppointmentX({ ...entity, ...item }, interval);
    const itemRealSize = getRealSizeByViewOrientation(
      { sizeX: appointmentX.sizeX, sizeY: abstractGeometryInsideInterval.sizeY },
      viewOrientation,
    );

    return { ...item, ...itemRealSize };
  });

  return { ...entity, ...entityGeometry, items };
};
