import { shallow } from 'enzyme';
import { viewFunction as LayoutView, HeaderPanelLayout } from '../layout';
import { Row } from '../../row';
import * as utilsModule from '../../../utils';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';

const getKeyByDateAndGroup = jest.spyOn(utilsModule, 'getKeyByDateAndGroup');
const isVerticalGroupOrientation = jest.spyOn(utilsModule, 'isVerticalGroupOrientation');

describe('HeaderPanelLayoutBase', () => {
  describe('Render', () => {
    const cellTemplate = () => null;
    const viewCellsData = [[{
      startDate: new Date(2020, 6, 9),
      endDate: new Date(2020, 6, 10),
      today: true,
      groups: { id: 1 },
      groupIndex: 1,
      index: 0,
    }, {
      startDate: new Date(2020, 6, 10),
      endDate: new Date(2020, 6, 11),
      today: false,
      groups: { id: 1 },
      groupIndex: 1,
      index: 1,
    }]];
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: { cellTemplate, ...viewModel.props, viewCellsData },
    }) as any);

    beforeEach(() => getKeyByDateAndGroup.mockClear());

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

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewCellsData[0][0].startDate,
          endDate: viewCellsData[0][0].endDate,
          today: viewCellsData[0][0].today,
          groups: viewCellsData[0][0].groups,
          groupIndex: viewCellsData[0][0].groupIndex,
          index: viewCellsData[0][0].index,
          dateCellTemplate,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData[0][1].startDate,
          endDate: viewCellsData[0][1].endDate,
          today: viewCellsData[0][1].today,
          groups: viewCellsData[0][1].groups,
          groupIndex: viewCellsData[0][1].groupIndex,
          index: viewCellsData[0][1].index,
          dateCellTemplate,
        });
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

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(2);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1, viewCellsData[0][0].startDate,
          viewCellsData[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1, viewCellsData[0][0].startDate,
          viewCellsData[0][0].groups,
        );
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('should calculate isVerticalGroupOrientation correctly', () => {
        const cell = new HeaderPanelLayout({
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        cell.isVerticalGroupOrientation;

        expect(isVerticalGroupOrientation)
          .toHaveBeenCalledWith(VERTICAL_GROUP_ORIENTATION);
      });
    });
  });
});
