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

    it('should pass correct attributes', () => {
      const cell = render({ props: { colSpan: 3, text: 'Test' } });

      expect(cell.prop('colSpan'))
        .toBe(3);
      expect(cell.prop('title'))
        .toBe('Test');
    });

    it('should render text', () => {
      const cell = render({ props: { text: 'Test text' } });

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.childAt(0).text())
        .toBe('Test text');
    });

    describe('templates', () => {
      it('should render date cell template and should not render default markup', () => {
        const timeCellTemplate = () => null;
        const dateCellTemplate = () => null;

        const cell = render({
          useTemplate: true,
          props: {
            dateCellTemplate,
            timeCellTemplate,
            isTimeCellTemplate: false,
          },
        });

        expect(cell.children())
          .toHaveLength(1);
        expect(cell.find(dateCellTemplate).exists())
          .toBe(true);
        expect(cell.find(timeCellTemplate).exists())
          .toBe(false);
      });

      it('should render time cell template and should not render default markup and date cell template', () => {
        const timeCellTemplate = () => null;
        const dateCellTemplate = () => null;

        const cell = render({
          useTemplate: true,
          props: {
            timeCellTemplate,
            dateCellTemplate,
            isTimeCellTemplate: true,
          },
        });

        expect(cell.children())
          .toHaveLength(1);
        expect(cell.find(timeCellTemplate).exists())
          .toBe(true);
        expect(cell.find(dateCellTemplate).exists())
          .toBe(false);
      });

      it('should pass correct props to the date cell template', () => {
        const dateCellTemplate = () => null;
        const props = {
          groups: { id: 1 },
          groupIndex: 1,
          index: 0,
          text: 'Test text',
          dateCellTemplate,
        };

        const cell = render({ props, useTemplate: true });

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

      it('should pass correct props to the time cell template', () => {
        const timeCellTemplate = () => null;
        const props = {
          groups: { id: 1 },
          groupIndex: 1,
          index: 0,
          text: 'Test text',
          timeCellTemplate,
          isTimeCellTemplate: true,
        };

        const cell = render({ props, useTemplate: true });

        const renderedTemplate = cell.find(timeCellTemplate);

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
            isWeekDayCell: 'isWeekDayCell',
          } as any);

          expect(cell.classes)
            .toBe('getGroupCellClasses');

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-header-panel-cell': true,
              'dx-scheduler-cell-sizes-horizontal': true,
              'dx-scheduler-header-panel-current-time-cell': 'today',
              'dx-scheduler-header-panel-week-cell': 'isWeekDayCell',
              class: true,
            });

          expect(getGroupCellClasses)
            .toHaveBeenCalledWith('isFirstGroupCell', 'isLastGroupCell', 'combineClasses');
        });
      });

      describe('useTemplate', () => {
        [true, false].forEach((isTimeCellTemplate) => {
          [{
            dateCellTemplate: undefined,
            timeCellTemplate: undefined,
            description: `should work correctly if both temlates are undefined and "isTimeCellTemplate" is ${isTimeCellTemplate}`,
            expectedResult: false,
          }, {
            dateCellTemplate: () => null,
            timeCellTemplate: undefined,
            description: `should work correctly if timeCellTemplate is undefined and "isTimeCellTemplate" is ${isTimeCellTemplate}`,
            expectedResult: !isTimeCellTemplate,
          }, {
            dateCellTemplate: undefined,
            timeCellTemplate: () => null,
            description: `should work correctly if dateCellTemplate is undefined and "isTimeCellTemplate" is ${isTimeCellTemplate}`,
            expectedResult: isTimeCellTemplate,
          }, {
            dateCellTemplate: () => null,
            timeCellTemplate: () => null,
            description: `should work correctly if both temlates are defined and "isTimeCellTemplate" is ${isTimeCellTemplate}`,
            isTimeCellTemplate: false,
            expectedResult: true,
          }].forEach(({
            dateCellTemplate,
            timeCellTemplate,
            description,
            expectedResult,
          }) => {
            test(description, () => {
              const cell = new DateHeaderCell({
                dateCellTemplate,
                timeCellTemplate,
                isTimeCellTemplate,
              });

              expect(cell.useTemplate)
                .toBe(expectedResult);
            });
          });
        });
      });
    });
  });
});
