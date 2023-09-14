import {
  getAppointmentColor,
} from '../utils';
import {
  getAppointmentColor as getDeferredAppointmentColor,
} from '../../../../../__internal/scheduler/resources/m_utils';

jest.mock('../../../../../__internal/scheduler/resources/m_utils', () => ({
  ...jest.requireActual('../../../../../__internal/scheduler/resources/m_utils'),
  getAppointmentColor: jest.fn(() => Promise.resolve('#aabbcc')),
}));

describe('Resource utils', () => {
  describe('getAppointmentColor', () => {
    it('should correctly invoke getAppointmentColor', () => {
      const resourceConfig = {
        resourcesDataAccessors: ['some_value'],
      } as any;
      const appointmentConfig = { some: 'value' } as any;

      return getAppointmentColor(
        resourceConfig,
        appointmentConfig,
      ).then(() => {
        expect(getDeferredAppointmentColor)
          .toHaveBeenCalledWith({
            dataAccessors: ['some_value'],
            resourcesDataAccessors: ['some_value'],
          },
          appointmentConfig);
      });
    });
  });
});
