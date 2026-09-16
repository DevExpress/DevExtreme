import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import * as themes from '@js/ui/themes';

import { getDefaultAppointmentSize, getMinAppointmentSize } from './get_min_appointment_size';

jest.mock('@js/ui/themes', () => ({
  current: jest.fn().mockReturnValue('generic.light'),
  isCompact: jest.fn().mockReturnValue(false),
}));

const monthView = { isTimelineView: false, isAdaptivityEnabled: false, isMonthView: true };

describe('appointment minimum height', () => {
  beforeEach(() => {
    (themes.isCompact as jest.Mock).mockReturnValue(false);
  });

  it('is the height the theme declares', () => {
    expect(getMinAppointmentSize({ ...monthView, appointmentMinHeight: 26 }).height).toBe(26);
  });

  it('falls back to the legacy literals when the theme declares nothing', () => {
    expect(getMinAppointmentSize(monthView).height).toBe(20);

    (themes.isCompact as jest.Mock).mockReturnValue(true);

    expect(getMinAppointmentSize(monthView).height).toBe(18);
  });

  it('sizes the default appointment by the same height', () => {
    const size = getDefaultAppointmentSize({
      ...monthView, viewOrientation: 'horizontal', appointmentMinHeight: 26,
    });

    expect(size.height).toBe(26);
  });

  it('leaves the day view minimum alone', () => {
    const size = getMinAppointmentSize({
      isTimelineView: false,
      isAdaptivityEnabled: false,
      isMonthView: false,
      appointmentMinHeight: 26,
    });

    expect(size.height).toBe(12);
  });
});
