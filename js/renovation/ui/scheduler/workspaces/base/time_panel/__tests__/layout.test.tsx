import { mount } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { Row } from '../../row';
import { TimePanelCell as Cell } from '../cell';

describe('TimePanelLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), text: '0:00 AM' }, { startDate: new Date(2020, 6, 9, 1), text: '0:00 AM' }],
          [{ startDate: new Date(2020, 6, 9, 1), text: '1:00 AM' }, { startDate: new Date(2020, 6, 9, 2), text: '1:00 AM' }],
        ],
      }],
    };
    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewData },
    }) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const layout = render({ props: { className: 'test-class' } });

      const table = layout.find('table');

      expect(table.exists())
        .toBe(true);

      expect(table.hasClass('dx-scheduler-time-panel'))
        .toBe(true);

      const tbody = layout.find('tbody');

      expect(tbody.exists())
        .toBe(true);

      expect(tbody.hasClass(''))
        .toBe(true);

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({ });

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      const { dateTable } = viewData.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: dateTable[0][0].startDate,
          text: dateTable[0][0].text,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: dateTable[1][0].startDate,
          text: dateTable[1][0].text,
        });
    });
  });
});
