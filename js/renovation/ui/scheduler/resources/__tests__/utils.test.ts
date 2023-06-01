import {
  getAppointmentColor,
} from '../utils';
import {
  getAppointmentColor as getDeferredAppointmentColor,
} from '../../../../../ui/scheduler/resources/utils';

jest.mock('../../../../../ui/scheduler/resources/utils', () => ({
  ...jest.requireActual('../../../../../ui/scheduler/resources/utils'),
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
          .toBeCalledWith({
            dataAccessors: ['some_value'],
            resourcesDataAccessors: ['some_value'],
          },
          appointmentConfig);
      });
    });
  });
});
