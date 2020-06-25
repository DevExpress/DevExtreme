import { h } from 'preact';
import { shallow } from 'enzyme';
import { viewFunction as TooltipItemContentView } from '../../../../js/renovation/scheduler/appointment-tooltip/item-content';

describe('TooltipItemContent', () => {
  describe('View', () => {
    const defaultProps = {
      text: 'text',
      formattedDate: 'formattedDate',
    };
    it('should combine `className` with predefined classes', () => {
      const tree = shallow(
        <TooltipItemContentView
          props={{ ...defaultProps, className: 'custom-class' }}
        />,
      );

      expect(tree.hasClass('dx-tooltip-appointment-item-content'))
        .toBe(true);
      expect(tree.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = shallow(
        <TooltipItemContentView
          restAttributes={{ customAttribute: 'customAttribute' }}
          props={defaultProps}
        />,
      );

      expect(tree.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const tree = shallow(
        <TooltipItemContentView props={defaultProps} />,
      );

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
