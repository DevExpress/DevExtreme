import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';

jest.mock('../date_table/layout', () => ({
  MonthDateTableLayout: () => null,
}));
jest.mock('../../base/header_panel/layout', () => ({
  HeaderPanelLayout: () => null,
}));
jest.mock('../../base/ordinary_layout', () => ({
  OrdinaryLayout: (props) => <div {...props} />,
}));

describe('MonthLayout', () => {
  describe('Render', () => {
    const viewData = { groupedData: ['Test data'] };
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        viewData,
        ...viewModel.props,
      },
    }) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to base layout', () => {
      const layout = render({});

      expect(layout.props())
        .toMatchObject({
          // dateTableTemplate: MonthDateTableLayout,
          // headerPanelTemplate: expect.any(Function),
          viewData,
        });
      // expect(layout.find(MonthDateTableLayout).exists())
      //   .toBe(true);
      // expect(layout.find(HeaderPanelLayout).exists())
      //   .toBe(true);
    });
  });
});
