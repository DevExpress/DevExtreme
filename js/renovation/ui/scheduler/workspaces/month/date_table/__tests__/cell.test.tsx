import React from 'react';
import { shallow } from 'enzyme';
import {
  MonthDateTableCell as Cell,
  viewFunction as CellView,
} from '../cell';
import * as combineClassesModule from '../../../../../../utils/combine_classes';

const combineClasses = jest.spyOn(combineClassesModule, 'combineClasses');

jest.mock('../../../base/date_table/cell', () => ({
  ...jest.requireActual('../../../base/date_table/cell'),
  DateTableCellBase: (props) => <div {...props} />,
}));

describe('MonthDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9);
    const endDate = new Date(2020, 6, 10);
    const text = 'test text';

    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
        text,
      },
    }) as any);

    it('should pass correct class', () => {
      const cell = render({ classes: 'test' });

      expect(cell.is('.test'))
        .toBe(true);
    });

    it('should render text correctly', () => {
      const cell = render({});

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.childAt(0).text())
        .toBe(text);
    });

    it('should pass correct props to the base cell', () => {
      const groups = { id: 1 };
      const groupIndex = 234;
      const index = 123;
      const isFirstGroupCell = true;
      const isLastGroupCell = false;
      const dataCellTemplate = () => null;
      const contentTemplateProps = { data: 'test' };

      const cell = render({
        props: {
          groups,
          groupIndex,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          dataCellTemplate,
        },
        contentTemplateProps,
      });

      expect(cell.props())
        .toMatchObject({
          groups,
          groupIndex,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          dataCellTemplate,
          startDate,
          endDate,
          text,
          contentTemplateProps,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        it('should call "combineClasses" with correct parameters', () => {
          const cell = new Cell({
            otherMonth: true,
            firstDayOfMonth: true,
            today: true,
            className: 'custom-class',
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          cell.classes;

          expect(combineClasses)
            .toHaveBeenCalledTimes(1);
          expect(combineClasses)
            .toHaveBeenCalledWith({
              'custom-class': true,
              'dx-scheduler-date-table-current-date': true,
              'dx-scheduler-date-table-first-of-month': true,
              'dx-scheduler-date-table-other-month': true,
            });
        });
      });

      describe('contentTemplateProps', () => {
        it('should add text to contentTemplateProps', () => {
          const cell = new Cell({
            text: 'Custom text',
            index: 0,
          });

          const props = cell.contentTemplateProps;

          expect(props)
            .toEqual({
              data: { text: 'Custom text' },
              index: 0,
            });
        });
      });
    });
  });
});
