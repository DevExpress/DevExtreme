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
  const viewDataBase = {
    groupedData: [{
      dateTable: [[{
        startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: { id: 1 }, text: '', index: 0,
      }], [{
        startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: { id: 2 }, text: '', index: 0,
      }]],
    }],
    cellCountInGroupRow: 1,
  };

  describe('Render', () => {
    const cellTemplate = () => null;

    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: {
        cellTemplate,
        viewData: viewDataBase,
        viewType: 'month',
        ...viewModel.props,
      },
    } as any) as any);

    afterEach(jest.resetAllMocks);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render its components and pass correct props to them', () => {
      const dataCellTemplate = () => null;
      const layout = render({
        classes: 'some-class',
        props: { dataCellTemplate },
        isVirtual: 'isVirtual',
        topVirtualRowHeight: 100,
        bottomVirtualRowHeight: 200,
        virtualCellsCount: 3,
      });

      expect(layout.hasClass('some-class'))
        .toBe(true);

      const table = layout.find(Table);
      expect(table.exists())
        .toBe(true);

      expect(table.props())
        .toMatchObject({
          isVirtual: 'isVirtual',
          topVirtualRowHeight: 100,
          bottomVirtualRowHeight: 200,
          virtualCellsCount: 3,
        });
      expect(table.hasClass('some-class'))
        .toBe(true);

      const tableBody = layout.find(DateTableBody);
      expect(tableBody.exists())
        .toBe(true);

      expect(tableBody.props())
        .toMatchObject({
          viewData: viewDataBase,
          // cellTemplate,
          dataCellTemplate,
          viewType: 'month',
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('classes', () => {
        const layout = new DateTableLayoutBase({ className: 'some-class' });

        expect(layout.classes.split(' '))
          .toEqual([
            'dx-scheduler-date-table',
            'some-class',
          ]);
      });

      [true, false].forEach((isVirtual) => {
        it(`should get correct isVirtial flag if isVirtual=${isVirtual}`, () => {
          const layout = new DateTableLayoutBase({ viewData: { ...viewDataBase, isVirtual } });

          expect(layout.isVirtual)
            .toBe(isVirtual);
        });
      });

      [100, undefined].forEach((topVirtualRowHeight) => {
        [500, undefined].forEach((bottomVirtualRowHeight) => {
          it(`topVirtualRowHeight=${topVirtualRowHeight}, bottomVirtualRowHeight=${bottomVirtualRowHeight}`, () => {
            const layout = new DateTableLayoutBase({
              viewData: {
                ...viewDataBase,
                topVirtualRowHeight,
                bottomVirtualRowHeight,
              },
            });

            let value = topVirtualRowHeight || 0;
            expect(layout.topVirtualRowHeight)
              .toEqual(value);

            value = bottomVirtualRowHeight || 0;
            expect(layout.bottomVirtualRowHeight)
              .toEqual(value);
          });
        });
      });

      it('virtualCellsCount', () => {
        const layout = new DateTableLayoutBase({ viewData: viewDataBase });

        expect(layout.virtualCellsCount)
          .toBe(1);
      });
    });
  });
});
