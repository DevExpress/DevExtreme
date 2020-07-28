import { h } from 'react';
import { shallow } from 'enzyme';
import { viewFunction as RowView } from '../row';

describe('AllDayPanelRow', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(RowView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should render component correctly', () => {
      const row = render({
        props: {
          className: 'custom-class',
          children: <div className="test-class" />,
        },
      });

      expect(row.hasClass('dx-scheduler-all-day-table-row custom-class'))
        .toBe(true);

      expect(row.find('.test-class').exists())
        .toBe(true);
    });
  });
});
