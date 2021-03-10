import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as CellView, TimePanelCell } from '../cell';

describe('TimePanelCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const text = 'Some Text';
    const render = (viewModel) => shallow(<CellView {...{
      ...viewModel,
      props: {
        startDate,
        text,
        ...viewModel.props,
      },
    }}
    />);

    it('should render time cell correctly', () => {
      const cell = render({ props: { className: 'test-class' } });

      expect(cell.children())
        .toHaveLength(1);

      expect(cell.childAt(0).text())
        .toBe(text);

      expect(cell.hasClass('dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical'))
        .toBe(true);

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });

    it('should pass correct props to the base cell', () => {
      const timeCellTemplateProps = {};
      const timeCellTemplate = () => null;
      const cell = render({
        props: {
          isFirstGroupCell: true,
          isLastGroupCell: true,
          timeCellTemplate,
        },
        timeCellTemplateProps,
      });

      expect(cell.props())
        .toMatchObject({
          isFirstGroupCell: true,
          isLastGroupCell: true,
          contentTemplate: timeCellTemplate,
          contentTemplateProps: timeCellTemplateProps,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('timeCellTemplateProps', () => {
        it('should collect template props correctly', () => {
          const data = {
            startDate: new Date(2020, 7, 26),
            groups: { id: 1 },
            groupIndex: 3,
            text: 'Test text',
          };
          const props = {
            index: 0,
            ...data,
          };
          const cell = new TimePanelCell(props);

          const templateProps = cell.timeCellTemplateProps;

          expect(templateProps)
            .toEqual({
              index: props.index,
              data: {
                date: data.startDate,
                groups: data.groups,
                groupIndex: data.groupIndex,
                text: data.text,
              },
            });
        });
      });
    });
  });
});
