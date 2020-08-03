import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as RowView } from '../row';

describe('AllDayPanelRow', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(<RowView {...{
      ...viewModel,
      props: { ...viewModel.props },
    }}
    />);

    it('should spread restAttributes', () => {
      const row = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(row.prop('custom-attribute'))
        .toBe('customAttribute');
    });

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
