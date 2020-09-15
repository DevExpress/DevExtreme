import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableView, Table } from '../table';

describe('LayoutBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TableView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }) as any);

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
        style: {
          height: 100,
        },
      });

      const table = layout.find('table');
      expect(table.exists())
        .toBe(true);
      expect(table.hasClass('some-class'))
        .toBe(true);
      expect(table.prop('style'))
        .toStrictEqual({ height: 100 });

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

  describe('Logic', () => {
    describe('Getters', () => {
      it('style', () => {
        const layout = new Table({ height: 100 });

        expect(layout.style)
          .toStrictEqual({ height: '100px' });
      });
    });
  });
});
