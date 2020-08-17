import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as TableView } from '../table';

describe('LayoutBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(TableView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }));

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('render should be correct', () => {
      const layout = render({
        props: {
          className: 'some-class',
        },
      });

      const table = layout.find('table');
      expect(table.exists())
        .toBe(true);
      expect(table.hasClass('some-class'))
        .toBe(true);

      const tbody = layout.find('tbody');
      expect(tbody.exists())
        .toBe(true);
    });

    it('should render content', () => {
      const layout = render({
        props: { children: <div className="some-class" /> },
      });

      const content = layout.find('.some-class');
      expect(content.exists())
        .toBe(true);
    });

    it('should render virtual table', () => {
      const layout = render({
        props: {
          className: 'some-class',
          children: <tr className="some-content" />,
          isVirtual: true,
        },
      });

      const table = layout.find('table');
      expect(table.hasClass('some-class'))
        .toBe(true);

      const virtualRows = layout.find('[isVirtual=true]');
      expect(virtualRows)
        .toHaveLength(2);

      expect(layout.find('.some-content').exists())
        .toBe(true);
    });

    it('should not render virtual table', () => {
      const layout = render({
        props: {
          className: 'some-class',
          children: <tr className="some-content" />,
        },
      });

      const table = layout.find('table');
      expect(table.hasClass('some-class'))
        .toBe(true);

      const virtualRows = layout.find('[isVirtual=true]');
      expect(virtualRows)
        .toHaveLength(0);

      expect(layout.find('.some-content').exists())
        .toBe(true);
    });
  });
});
