import { h } from 'preact';
import { mount } from 'enzyme';
import { viewFunction as VirtualTableView } from '../virtual_table';
import { Table } from '../table';

describe('LayoutBase', () => {
  describe('Render', () => {
    const render = (viewModel) => mount(VirtualTableView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    } as any) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('render should be correct', () => {
      const layout = render({
        props: {
          className: 'some-class',
          children: <div className="some-content" />,
        },
      });

      expect(layout.is(Table))
        .toBe(true);
      expect(layout.is('.dx-scheduler-table-virtual'))
        .toBe(true);
      expect(layout.hasClass('some-class'))
        .toBe(true);

      const virtualRows = layout.find('tr.dx-scheduler-virtual-row');
      expect(virtualRows)
        .toHaveLength(2);

      expect(layout.find('.some-content').exists())
        .toBe(true);
    });
  });
});
