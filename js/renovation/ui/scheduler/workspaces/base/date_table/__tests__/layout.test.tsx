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
        startDate: new Date(2020, 6, 9, 0),
        endDate: new Date(2020, 6, 9, 0, 30),
        groups: { id: 1 },
        text: '',
        index: 0,
        isFirstGroupCell: false,
        isLastGroupCell: false,
        key: '1',
      }], [{
        startDate: new Date(2020, 6, 9, 0, 30),
        endDate: new Date(2020, 6, 9, 1),
        groups: { id: 2 },
        text: '',
        index: 0,
        isFirstGroupCell: false,
        isLastGroupCell: false,
        key: '2',
      }]],
      groupIndex: 1,
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
        leftVirtualCellWidth: 300,
        rightVirtualCellWidth: 400,
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
          cellTemplate,
          dataCellTemplate,
          isVirtual: 'isVirtual',
          leftVirtualCellWidth: 300,
          rightVirtualCellWidth: 400,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('classes', () => {
        const layout = new DateTableLayoutBase({ className: 'some-class' } as any);

        expect(layout.classes.split(' '))
          .toEqual([
            'dx-scheduler-date-table',
            'some-class',
          ]);
      });

      [true, false].forEach((isVirtual) => {
        it(`should get correct isVirtial flag if isVirtual=${isVirtual}`, () => {
          const layout = new DateTableLayoutBase({
            viewData: { ...viewDataBase, isVirtual },
          } as any);

          expect(layout.isVirtual)
            .toBe(isVirtual);
        });
      });

      it('should correctly set top and bottom virtual height', () => {
        const layout = new DateTableLayoutBase({
          viewData: {
            ...viewDataBase,
            topVirtualRowHeight: 100,
            bottomVirtualRowHeight: 200,
          },
        } as any);

        expect(layout.topVirtualRowHeight)
          .toEqual(100);

        expect(layout.bottomVirtualRowHeight)
          .toEqual(200);
      });

      it('should correctly set left and right virtual width', () => {
        const layout = new DateTableLayoutBase({
          viewData: {
            ...viewDataBase,
            leftVirtualCellWidth: 100,
            rightVirtualCellWidth: 200,
          },
        } as any);

        expect(layout.leftVirtualCellWidth)
          .toEqual(100);

        expect(layout.rightVirtualCellWidth)
          .toEqual(200);
      });

      it('virtualCellsCount', () => {
        const layout = new DateTableLayoutBase({ viewData: viewDataBase } as any);

        expect(layout.virtualCellsCount)
          .toBe(1);
      });
    });
  });
});
