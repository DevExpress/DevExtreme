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
          leftVirtualCellWidth: 300,
          rightVirtualCellWidth: 400,
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
      describe('classes', () => {
        it('should been set correctly', () => {
          const layout = new DateTableLayoutBase({ className: 'some-class' } as any);

          expect(layout.classes.split(' '))
            .toEqual([
              'dx-scheduler-date-table',
              'some-class',
            ]);
        });
      });

      describe('isVirtual', () => {
        [true, false].forEach((isVirtual) => {
          it(`should return correct value if viewData.isVirtual=${isVirtual}`, () => {
            const layout = new DateTableLayoutBase({
              viewData: { ...viewDataBase, isVirtual },
            } as any);

            expect(layout.isVirtual)
              .toBe(isVirtual);
          });
        });
      });

      describe('topVirtualRowHeight, bottomVirtualRowHeight', () => {
        [{
          top: undefined,
          bottom: undefined,
          expectedTop: 0,
          expectedBottom: 0,
        }, {
          top: 100,
          bottom: 200,
          expectedTop: 100,
          expectedBottom: 200,
        }].forEach(({
          top, bottom, expectedTop, expectedBottom,
        }) => {
          it(`should be calculated correctly if viewData.topVirtualRowHeight=${top}, viewData.bottomVirtualRowHeight=${bottom}`, () => {
            const layout = new DateTableLayoutBase({
              viewData: {
                ...viewDataBase,
                topVirtualRowHeight: top,
                bottomVirtualRowHeight: bottom,
              },
            } as any);

            expect(layout.topVirtualRowHeight)
              .toEqual(expectedTop);

            expect(layout.bottomVirtualRowHeight)
              .toEqual(expectedBottom);
          });
        });
      });

      describe('leftVirtualCellWidth, rightVirtualCellWidth', () => {
        [{
          left: undefined,
          right: undefined,
          expectedLeft: 0,
          expectedRight: 0,
        }, {
          left: 100,
          right: 200,
          expectedLeft: 100,
          expectedRight: 200,
        }].forEach(({
          left, right, expectedLeft, expectedRight,
        }) => {
          it(`should be calculated correctly if viewData.leftVirtualCellWidth=${left}, viewData.rightVirtualCellWidth=${right}`, () => {
            const layout = new DateTableLayoutBase({
              viewData: {
                ...viewDataBase,
                leftVirtualCellWidth: left,
                rightVirtualCellWidth: right,
              },
            } as any);

            expect(layout.leftVirtualCellWidth)
              .toEqual(expectedLeft);

            expect(layout.rightVirtualCellWidth)
              .toEqual(expectedRight);
          });
        });
      });

      describe('virtualCellsCount', () => {
        it('should been set correctly', () => {
          const layout = new DateTableLayoutBase({ viewData: viewDataBase } as any);

          expect(layout.virtualCellsCount)
            .toBe(1);
        });
      });
    });
  });
});
