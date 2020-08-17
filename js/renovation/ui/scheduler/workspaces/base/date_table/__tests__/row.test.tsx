import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as RowView } from '../row';

jest.mock('../../row', () => ({
  ...require.requireActual('../../row'),
  Row: (props): JSX.Element => <div {...props} />,
}));

describe('RowBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(RowView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should spread restAttributes', () => {
      const row = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(row.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render component correctly', () => {
      const row = render({ props: { className: 'custom-class' } });

      expect(row.hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
    });
  });
});
