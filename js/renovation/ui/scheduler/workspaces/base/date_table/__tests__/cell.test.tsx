import React from 'react';
import { shallow } from 'enzyme';
import {
  viewFunction as CellView,
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../cell';
import { CellBase } from '../../cell';
import * as combineClassesModule from '../../../../../../utils/combine_classes';

const combineClasses = jest.spyOn(combineClassesModule, 'combineClasses');

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(<CellView {...{
      ...viewModel,
      props: { ...viewModel.props },
    }}
    />);

    it('should pass correct props to the base cell', () => {
      const dataCellTemplate = () => null;
      const dataCellTemplateProps = {};
      const cell = render({
        classes: 'test-class',
        dataCellTemplateProps,
        props: {
          isFirstGroupCell: true,
          isLastGroupCell: false,
          dataCellTemplate,
        },
      });

      expect(cell.is(CellBase))
        .toBe(true);
      expect(cell.hasClass('test-class'))
        .toBe(true);
      expect(cell.props())
        .toMatchObject({
          isFirstGroupCell: true,
          isLastGroupCell: false,
          contentTemplate: dataCellTemplate,
          contentTemplateProps: dataCellTemplateProps,
        });
    });

    it('should render children', () => {
      const cell = render({ props: { children: <div className="child" /> } });

      expect(cell.find('.child').exists())
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        afterEach(jest.resetAllMocks);

        it('should call combineClasses with correct parameters', () => {
          const cell = new DateTableCellBase({ index: 0 });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          cell.classes;

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-cell-sizes-horizontal': true,
              'dx-scheduler-cell-sizes-vertical': true,
              'dx-scheduler-date-table-cell': true,
              '': true,
            });
        });

        it('should not assign several classes when the cell is all-day', () => {
          const cell = new DateTableCellBase({ index: 0, allDay: true });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          cell.classes;

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-cell-sizes-horizontal': true,
              'dx-scheduler-cell-sizes-vertical': false,
              'dx-scheduler-date-table-cell': false,
              '': true,
            });
        });

        it('should take into account className', () => {
          const cell = new DateTableCellBase({ index: 0, className: 'test-class' });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          cell.classes;

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-cell-sizes-horizontal': true,
              'dx-scheduler-cell-sizes-vertical': true,
              'dx-scheduler-date-table-cell': true,
              'test-class': true,
            });
        });
      });

      describe('dataCellTemplateProps', () => {
        it('should collect template props correctly', () => {
          const data = {
            startDate: new Date(2020, 7, 26),
            endDate: new Date(2020, 7, 27),
            groups: { id: 1 },
            groupIndex: 3,
            allDay: true,
          };
          const props = {
            ...(new DateTableCellBaseProps()),
            index: 0,
            ...data,
          };
          const cell = new DateTableCellBase(props);

          const templateProps = cell.dataCellTemplateProps;

          expect(templateProps)
            .toEqual({
              index: props.index,
              data: {
                ...data,
                text: '',
              },
            });
        });

        it('should add all-day prop correctly', () => {
          const data = {
            startDate: new Date(2020, 7, 26),
            endDate: new Date(2020, 7, 27),
            groups: { id: 1 },
            groupIndex: 3,
            allDay: false,
          };
          const props = {
            ...(new DateTableCellBaseProps()),
            index: 0,
            ...data,
          };
          const cell = new DateTableCellBase(props);

          const templateProps = cell.dataCellTemplateProps;

          expect(templateProps)
            .toEqual({
              index: props.index,
              data: {
                ...data,
                allDay: undefined,
                text: '',
              },
            });
        });

        it('should add groupIndex prop correctly if groups undefined', () => {
          const data = {
            startDate: new Date(2020, 7, 26),
            endDate: new Date(2020, 7, 27),
            groups: undefined,
            groupIndex: 3,
          };
          const props = {
            ...(new DateTableCellBaseProps()),
            index: 0,
            ...data,
          };
          const cell = new DateTableCellBase(props);

          const templateProps = cell.dataCellTemplateProps;

          expect(templateProps)
            .toEqual({
              index: props.index,
              data: {
                ...data,
                groupIndex: undefined,
                text: '',
              },
            });
        });

        it('should add contentTemplateProps', () => {
          const data = {
            startDate: new Date(2020, 7, 26),
            endDate: new Date(2020, 7, 27),
          };
          const props = {
            contentTemplateProps: {
              data: { text: 'test text' },
              index: 0,
            },
            index: 0,
            ...data,
          };
          const cell = new DateTableCellBase(props);

          const templateProps = cell.dataCellTemplateProps;

          expect(templateProps)
            .toEqual({
              index: props.index,
              data: {
                ...data,
                text: 'test text',
              },
            });
        });
      });
    });
  });
});
