import { h } from 'preact';
import { shallow } from 'enzyme';
import {
  Row, viewFunction as RowView,
} from '../../../../../js/renovation/scheduler/workspaces/base/row';

describe('RowBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(RowView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should pass className and style', () => {
      const row = render({ props: { className: 'custom-class' }, style: 'style' });

      expect(row.is('.custom-class'))
        .toBe(true);
      expect(row.prop('style'))
        .toBe('style');
    });

    it('should spread restAttributes', () => {
      const row = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(row.prop('customAttribute'))
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
        it('should return an empty obbject if height is undefined', () => {
          const row = new Row({});

          expect(row.style)
            .toEqual({});
        });

        it('should return ucorrect style if height is provided', () => {
          const row = new Row({ height: 500 });

          expect(row.style)
            .toEqual({
              height: '500px',
            });
        });
      });
    });
  });
});
