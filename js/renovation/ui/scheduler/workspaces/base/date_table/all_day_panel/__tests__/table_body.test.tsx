import { mount } from 'enzyme';
import { viewFunction as TableBodyView } from '../table_body';
import { AllDayPanelRow as Row } from '../row';
import { AllDayPanelCell as Cell } from '../cell';

describe('AllDayPanelTableBody', () => {
  describe('Render', () => {
    const render = (viewModel) => mount(TableBodyView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    } as any) as any);

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
  });
});
