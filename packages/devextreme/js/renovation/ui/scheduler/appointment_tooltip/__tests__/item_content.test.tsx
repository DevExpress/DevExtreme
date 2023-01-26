import { shallow } from 'enzyme';
import { viewFunction as TooltipItemContentView } from '../item_content';

describe('TooltipItemContent', () => {
  describe('Render', () => {
    const defaultProps = {
      text: 'text',
      formattedDate: 'formattedDate',
    };
    const render = (viewModel) => shallow(TooltipItemContentView({
      ...viewModel,
      props: { ...defaultProps, ...viewModel.props },
    }) as any);

    it('should combine `className` with predefined classes', () => {
      const tree = render({ props: { className: 'custom-class' } });

      expect(tree.hasClass('dx-tooltip-appointment-item-content'))
        .toBe(true);
      expect(tree.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(tree.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const tree = render({});

      expect(tree.is('.dx-tooltip-appointment-item-content'))
        .toEqual(true);
      expect(tree.children())
        .toHaveLength(2);

      const text = tree.childAt(0);
      expect(text.is('.dx-tooltip-appointment-item-content-subject'))
        .toBe(true);
      expect(text.text())
        .toBe('text');

      const date = tree.childAt(1);
      expect(date.is('.dx-tooltip-appointment-item-content-date'))
        .toBe(true);
      expect(date.text())
        .toBe('formattedDate');
    });
  });
});
