import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Row, viewFunction as RowView } from '../row';
import { addHeightToStyle } from '../../utils';

jest.mock('../../utils', () => ({
  addHeightToStyle: jest.fn(() => 'style'),
}));

describe('RowBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(RowView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should pass className and style', () => {
      const row = render({
        classes: 'custom-class',
        style: 'style',
      });

      expect(row.is('.custom-class'))
        .toBe(true);
      expect(row.prop('style'))
        .toBe('style');
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

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addHeightToStyle with proper parameters', () => {
          const style = { width: '555px', height: '666px' };
          const row = new Row({ height: 500 });
          row.restAttributes = { style };

          expect(row.style)
            .toBe('style');

          expect(addHeightToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });

      describe('classes', () => {
        it('should correctly combine classes if isVirtual', () => {
          const row = new Row({ className: 'some-class', isVirtual: true });

          expect(row.classes)
            .toEqual('dx-scheduler-virtual-row some-class');
        });

        it('should correctly combine classes if not isVirtual', () => {
          const row = new Row({ className: 'some-class' });

          expect(row.classes)
            .toEqual('some-class');
        });
      });
    });
  });
});
