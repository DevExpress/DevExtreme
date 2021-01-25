import { shallow } from 'enzyme';
import { combineClasses } from '../../../../../../../utils/combine_classes';
import { getGroupCellClasses } from '../../../../utils';
import {
  DateHeaderCell,
  viewFunction as CellView,
} from '../cell';

jest.mock('../../../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(() => 'combineClasses'),
}));
jest.mock('../../../../utils', () => ({
  getGroupCellClasses: jest.fn(() => 'getGroupCellClasses'),
}));

describe('DateHeaderCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9);
    const endDate = new Date(2020, 6, 10);
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }) as any);

    it('should pass classes to the root component', () => {
      const cell = render({ classes: 'test-class' });

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass colSpan', () => {
      const cell = render({ props: { colSpan: 3 } });

      expect(cell.prop('colSpan'))
        .toBe(3);
    });

    it('should render text', () => {
      const cell = render({ props: { text: 'Test text' } });

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.childAt(0).text())
        .toBe('Test text');
    });

    it('should render template and should not render children', () => {
      const dateCellTemplate = () => null;
      const cell = render({
        props: {
          dateCellTemplate,
        },
      });

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.find(dateCellTemplate).exists())
        .toBe(true);
    });

    it('should pass correct props to the template', () => {
      const dateCellTemplate = () => null;
      const props = {
        groups: { id: 1 },
        groupIndex: 1,
        index: 0,
        text: 'Test text',
        dateCellTemplate,
      };

      const cell = render({ props });

      const renderedTemplate = cell.find(dateCellTemplate);

      expect(renderedTemplate.props())
        .toEqual({
          data: {
            date: startDate,
            text: props.text,
            groups: props.groups,
            groupIndex: props.groupIndex,
          },
          index: props.index,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        test('should call "combineClasses" and "getGroupCellClasses" with correct parameters', () => {
          const cell = new DateHeaderCell({
            isFirstGroupCell: 'isFirstGroupCell',
            isLastGroupCell: 'isLastGroupCell',
            today: 'today',
            className: 'class',
          } as any);

          expect(cell.classes)
            .toBe('getGroupCellClasses');

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-header-panel-cell': true,
              'dx-scheduler-cell-sizes-horizontal': true,
              'dx-scheduler-header-panel-current-time-cell': 'today',
              class: true,
            });

          expect(getGroupCellClasses)
            .toHaveBeenCalledWith('isFirstGroupCell', 'isLastGroupCell', 'combineClasses');
        });
      });
    });
  });
});
