import { shallow } from 'enzyme';
import { combineClasses } from '../../../../../../../utils/combine_classes';
import {
  viewFunction as CellView,
  GroupPanelHorizontalCell,
} from '../cell';

jest.mock('../../../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(() => 'classes'),
}));

describe('GroupPanel Horizontal Cell', () => {
  describe('Render', () => {
    const cellTemplate = () => null;
    const cellData = {
      data: { text: 'text' },
      id: 1,
      text: 'Test text',
      color: 'Test color',
    };

    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        colSpan: 3,
        ...viewModel.props,
      },
    }) as any);

    it('should pass correct props to the root', () => {
      const cell = render({ classes: 'custom-class' });

      expect(cell.hasClass('custom-class'))
        .toBe(true);
      expect(cell.prop('colSpan'))
        .toBe(3);
    });

    it('should rendeer content', () => {
      const cell = render({ props: { text: 'Test text' } });
      const content = cell.find('.dx-scheduler-group-header-content');

      expect(content.exists())
        .toBe(true);
      expect(content.text())
        .toBe('Test text');
    });

    it('should render template if it is provided and pass correct props to it', () => {
      const cell = render({
        props: {
          cellTemplate,
          ...cellData,
          index: 32,
        },
      });

      const template = cell.find(cellTemplate);
      expect(template.exists())
        .toBe(true);
      expect(template.props())
        .toMatchObject({
          data: cellData,
          index: 32,
        });
    });

    it('should render content if template is defined', () => {
      const cell = render({ props: { cellTemplate } });

      expect(cell.find('.dx-scheduler-group-header-content').exists())
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        [true, false].forEach((isFirstGroupCell) => {
          [true, false].forEach((isLastGroupCell) => {
            it(
              'should call combineClasses with proper parameters '
              + `when isFistGroupCell=${isFirstGroupCell}, isLastGroupCell=${isLastGroupCell}`,
              () => {
                const cell = new GroupPanelHorizontalCell({
                  className: 'custom-class',
                  isFirstGroupCell,
                  isLastGroupCell,
                });

                expect(cell.classes)
                  .toBe('classes');

                expect(combineClasses)
                  .toHaveBeenCalledWith({
                    'dx-scheduler-group-header': true,
                    'dx-scheduler-first-group-cell': isFirstGroupCell,
                    'dx-scheduler-last-group-cell': isLastGroupCell,
                    'custom-class': true,
                  });
              },
            );
          });
        });
      });
    });
  });
});
