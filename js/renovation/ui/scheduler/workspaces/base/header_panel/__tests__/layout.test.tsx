import { shallow } from 'enzyme';
import { viewFunction as LayoutView, HeaderPanelLayout, HeaderPanelLayoutProps } from '../layout';
import { Row } from '../../row';
import * as utilsModule from '../../../utils';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';

const isVerticalGroupOrientation = jest.spyOn(utilsModule, 'isVerticalGroupOrientation');

describe('HeaderPanelLayoutBase', () => {
  describe('Render', () => {
    const cellTemplate = () => null;
    const viewCellsData: any = [[{
      startDate: new Date(2020, 6, 9),
      endDate: new Date(2020, 6, 10),
      today: true,
      groups: { id: 1 },
      groupIndex: 1,
      index: 0,
      key: '0',
    }, {
      startDate: new Date(2020, 6, 10),
      endDate: new Date(2020, 6, 11),
      today: false,
      groups: { id: 1 },
      groupIndex: 1,
      index: 1,
      key: '1',
    }]];
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        ...(new HeaderPanelLayoutProps()),
        cellTemplate,
        viewCellsData,
        ...viewModel.props,
      },
    }) as any);

    it('should combine `className` with predefined classes', () => {
      const layout = render({ props: { className: 'custom-class' } });

      expect(layout.hasClass('dx-scheduler-header-panel'))
        .toBe(true);
      expect(layout.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const layout = render({});

      expect(layout.find('table').exists())
        .toBe(true);
      expect(layout.find('thead').exists())
        .toBe(true);

      const row = layout.find(Row);
      expect(row.exists())
        .toBe(true);
      expect(row)
        .toHaveLength(1);
      expect(row.children())
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them in basic case', () => {
      const dateCellTemplate = () => null;
      const layout = render({
        props: { dateCellTemplate },
      });

      const cells = layout.find(cellTemplate);
      expect(cells)
        .toHaveLength(2);

      const firstCell = cells.at(0);
      expect(firstCell.props())
        .toMatchObject({
          startDate: viewCellsData[0][0].startDate,
          endDate: viewCellsData[0][0].endDate,
          today: viewCellsData[0][0].today,
          groups: viewCellsData[0][0].groups,
          groupIndex: viewCellsData[0][0].groupIndex,
          index: viewCellsData[0][0].index,
          // dateCellTemplate,
        });
      expect(firstCell.key())
        .toBe(viewCellsData[0][0].key);

      const secondCell = cells.at(1);
      expect(secondCell.props())
        .toMatchObject({
          startDate: viewCellsData[0][1].startDate,
          endDate: viewCellsData[0][1].endDate,
          today: viewCellsData[0][1].today,
          groups: viewCellsData[0][1].groups,
          groupIndex: viewCellsData[0][1].groupIndex,
          index: viewCellsData[0][1].index,
          // dateCellTemplate,
        });
      expect(secondCell.key())
        .toBe(viewCellsData[0][1].key);
    });

    it('should not pass groups and groupInex to cells in case of Vertical Gruping', () => {
      const layout = render({
        isVerticalGroupOrientation: true,
      });

      const cells = layout.find(cellTemplate);
      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          groups: undefined,
          groupIndex: undefined,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          groups: undefined,
          groupIndex: undefined,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('should calculate isVerticalGroupOrientation correctly', () => {
        const layout = new HeaderPanelLayout({
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.isVerticalGroupOrientation;

        expect(isVerticalGroupOrientation)
          .toHaveBeenCalledWith(VERTICAL_GROUP_ORIENTATION);
      });
    });
  });
});
