import { h } from 'preact';
import { mount } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { Row } from '../../row';
import { TimePanelCell as Cell } from '../cell';
import { getIsGroupedAllDayPanel } from '../../../utils';
import { AllDayPanelTitle } from '../../date_table/all_day_panel/title';

jest.mock('devextreme-generator/component_declaration/common', () => ({
  ...require.requireActual('devextreme-generator/component_declaration/common'),
  Fragment: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../../utils', () => ({
  ...require.requireActual('../../../utils'),
  getIsGroupedAllDayPanel: jest.fn(),
}));

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
      props: { viewData, ...viewModel.props },
    }) as any);

    afterEach(() => jest.resetAllMocks());

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

    it('should render correct first, last group cells', () => {
      const layout = render({
        props: {
          viewData: {
            groupedData: [{
              dateTable: [
                [{ startDate: new Date(2020, 6, 9, 0), text: '0:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 1), text: '1:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 2), text: '2:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 3), text: '3:00 AM' }],
              ],
            }],
          },
        },
      });

      const assert = (
        cells: any,
        index: number,
        isFirstCell: boolean,
        isLastCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.prop('isFirstCell'))
          .toBe(isFirstCell);
        expect(cell.prop('isLastCell'))
          .toBe(isLastCell);
      };

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(4);

      assert(cells, 0, true, false);
      assert(cells, 1, false, false);
      assert(cells, 2, false, false);
      assert(cells, 3, false, true);
    });

    it('should call getIsGroupedAllDayPanel with correct arguments', () => {
      render({ });

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledTimes(1);

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenNthCalledWith(
          1,
          viewData,
        );
    });

    [true, false].forEach((mockValue) => {
      it(`AllDayPanelTitle if groupedAllDayPanel=${mockValue}`, () => {
        (getIsGroupedAllDayPanel as jest.Mock).mockReturnValueOnce(mockValue);

        const layout = render({ });

        expect(layout.find(AllDayPanelTitle).exists())
          .toBe(mockValue);
      });
    });
  });
});
