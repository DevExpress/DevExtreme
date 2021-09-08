import { shallow } from 'enzyme';
import {
  viewFunction as CellView,
} from '../cell';

describe('GroupPanel Vertical Cell', () => {
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
      props: { ...viewModel.props },
    }) as any);

    it('should combine default and custom classNames', () => {
      const cell = render({ props: { className: 'custom-class' } });

      expect(cell.hasClass('custom-class'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-group-header'))
        .toBe(true);
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

    it('should not render content if template is defined', () => {
      const cell = render({ props: { cellTemplate } });

      expect(cell.find('.dx-scheduler-group-header-content').exists())
        .toBe(false);
    });
  });
});
