import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as RowView } from '../row';

jest.mock('../../utils', () => ({
  addHeightToStyle: jest.fn(() => 'style'),
}));

describe('RowBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(RowView({
      ...viewModel,
      props: { ...viewModel.props },
    }) as any);

    it('should pass className', () => {
      const row = render({
        props: { className: 'custom-class' },
      });

      expect(row.is('.custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const row = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(row.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render children', () => {
      const row = render({ props: { children: <div className="child" /> } });

      expect(row.find('.child').exists())
        .toBe(true);
    });
  });
});
