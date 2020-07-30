import { mount } from 'enzyme';
import { viewFunction as TableBodyView } from '../table_body';
import { AllDayPanelRow as Row } from '../row';
import { AllDayPanelCell as Cell } from '../cell';
import { getKeyByDateAndGroup } from '../../../../utils';

jest.mock('../../../../utils', () => ({
  ...require.requireActual('../../../../utils'),
  getKeyByDateAndGroup: jest.fn(),
}));

describe('AllDayPanelTableBody', () => {
  describe('Render', () => {
    const render = (viewModel) => mount(TableBodyView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    } as any) as any);

    afterEach(() => jest.resetAllMocks());

    it('should spread restAttributes', () => {
      const tableBody = render({
        restAttributes: { customAttribute: 'customAttribute' },
        props: { viewData: [{ startDate: new Date(2020, 7, 28) }] },
      });

      expect(tableBody.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render component correctly', () => {
      const tableBody = render({
        props: {
          className: 'custom-class',
          viewData: [
            { startDate: new Date(2020, 7, 28) },
            { startDate: new Date(2020, 7, 29) },
          ],
        },
      });

      expect(tableBody.find(Row))
        .toHaveLength(1);

      expect(tableBody.find(Row).find(Cell))
        .toHaveLength(2);
    });

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      const viewData = [
        { startDate: new Date(2020, 7, 28), groups: '1' },
        { startDate: new Date(2020, 7, 28), groups: '2' },
      ];

      render({ props: { viewData } });

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(2);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1,
          viewData[0].startDate,
          viewData[0].groups,
        );

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          2,
          viewData[1].startDate,
          viewData[1].groups,
        );
    });
  });
});
