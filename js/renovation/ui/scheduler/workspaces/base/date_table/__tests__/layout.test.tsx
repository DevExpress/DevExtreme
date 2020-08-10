import { mount } from 'enzyme';
import {
  viewFunction as LayoutView,
  DateTableLayoutBase,
} from '../layout';
import { Table } from '../../table';
import { DateTableBody } from '../table_body';

jest.mock('../table_body', () => ({
  DateTableBody: () => null,
}));

describe('DateTableLayoutBase', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: {
        cellTemplate,
        viewData,
        ...viewModel.props,
      },
    } as any) as any);

    afterEach(() => jest.resetAllMocks());

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render table', () => {
      const layout = render({});

      expect(layout.find(Table).exists())
        .toBe(true);

      const tableBody = layout.find(DateTableBody);
      expect(tableBody.exists())
        .toBe(true);
      expect(tableBody.props())
        .toMatchObject({
          viewData,
          cellTemplate,
        });
    });

    it('should render virtual table', () => {
      const layout = render({
        isVirtual: true,
        topVirtualRowHeight: 100,
        bottomVirtualRowHeight: 200,
      });

      const table = layout.find(Table);
      expect(table.exists())
        .toBe(true);
      expect(table.prop('isVirtual'))
        .toBe(true);
      expect(table.prop('topVirtualRowHeight'))
        .toEqual(100);
      expect(table.prop('bottomVirtualRowHeight'))
        .toEqual(200);

      const tableBody = layout.find(DateTableBody);
      expect(tableBody.exists())
        .toBe(true);
      expect(tableBody.props())
        .toMatchObject({
          viewData,
          cellTemplate,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      [true, false].forEach((isVirtual) => {
        it(`should get correct isVirtial flag if isVirtual=${isVirtual}`, () => {
          const layout = new DateTableLayoutBase({ viewData: { groupedData: [], isVirtual } });

          expect(layout.isVirtual)
            .toBe(isVirtual);
        });
      });

      it('topVirtualRowHeight, bottomVirtualRowHeight', () => {
        const layout = new DateTableLayoutBase({
          viewData: {
            groupedData: [],
            topVirtualRowHeight: 100,
            bottomVirtualRowHeight: 200,
          },
        });

        expect(layout.topVirtualRowHeight)
          .toEqual(100);
        expect(layout.bottomVirtualRowHeight)
          .toEqual(200);
      });
    });
  });
});
