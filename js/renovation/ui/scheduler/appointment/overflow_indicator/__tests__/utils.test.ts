import {
  getOverflowIndicatorStyles,
  getOverflowIndicatorColor,
  getIndicatorColor,
} from '../utils';
import { getAppointmentColor } from '../../../resources/utils';

const colorPromise = Promise.resolve('#aabbcc');
const undefinedColorPromise = Promise.resolve(undefined);
jest.mock('../../../resources/utils', () => ({
  ...jest.requireActual('../../../resources/utils'),
  getAppointmentColor: jest.fn(({ resources }) => (resources.length
    ? colorPromise
    : undefinedColorPromise)),
}));

describe('Compact appointment utils', () => {
  describe('getOverflowIndicatorStyles', () => {
    it('should return correct styles', () => {
      const styles = getOverflowIndicatorStyles({
        geometry: {
          left: 123,
          top: 234,
          width: 345,
          height: 456,
        },
        color: '#ffeeaa',
      } as any);

      expect(styles)
        .toEqual({
          left: '123px',
          top: '234px',
          width: '345px',
          height: '456px',
          boxShadow: 'inset 345px 0 0 0 rgba(0, 0, 0, 0.3)',
        });
    });
  });

  describe('getOverflowIndicatorColor', () => { // TODO remove
    it('should return correct color for empty colors', () => {
      expect(getOverflowIndicatorColor('#aabbcc', []))
        .toBe('#aabbcc');
    });

    it('should return correct color for different colors', () => {
      expect(getOverflowIndicatorColor('#aabbcc', ['#aabbcc', '#aabbee']))
        .toBe(undefined);
    });

    it('should return correct color', () => {
      expect(getOverflowIndicatorColor('#aabbcc', ['#aabbcc', '#aabbcc', '#aabbcc']))
        .toBe('#aabbcc');
    });
  });

  describe('getIndicatorColor', () => {
    [
      { groupIndex: undefined, expectedGroupIndex: 0 },
      { groupIndex: 123, expectedGroupIndex: 123 },
    ].forEach(({ groupIndex, expectedGroupIndex }) => {
      it(`should call getAppointmentColor with correct arguments if groupIndex is ${groupIndex}`, () => {
        const appointmentContext = {
          resources: ['resources'],
          resourceLoaderMap: ['resourceLoaderMap'],
          dataAccessors: { resources: [] },
          loadedResources: [],
        } as any;
        const viewModel = {
          groupIndex,
          items: {
            settings: [{
              appointment: [],
            }],
          },
        } as any;

        return getIndicatorColor(
          appointmentContext,
          viewModel,
          ['groups'],
        )
          .then(() => {
            expect(getAppointmentColor)
              .toBeCalledWith(
                {
                  resources: appointmentContext.resources,
                  resourceLoaderMap: appointmentContext.resourceLoaderMap,
                  resourcesDataAccessors: appointmentContext.dataAccessors.resources,
                  loadedResources: appointmentContext.loadedResources,
                },
                {
                  itemData: [],
                  groupIndex: expectedGroupIndex,
                  groups: ['groups'],
                },
              );
          });
      });
    });
  });
});
