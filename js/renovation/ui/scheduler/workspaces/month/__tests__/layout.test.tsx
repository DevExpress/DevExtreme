import { mount, ReactWrapper } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { MonthDateTableLayout } from '../date_table/layout';
import { HeaderPanelLayout } from '../../base/header_panel/layout';

jest.mock('../date_table/layout', () => ({
  MonthDateTableLayout: (): null => null,
}));
jest.mock('../../base/header_panel/layout', () => ({
  HeaderPanelLayout: (): null => null,
}));

describe('MonthLayout', () => {
  describe('Render', () => {
    const viewData = { groupedData: ['Test data'] };
    const render = (viewModel): ReactWrapper => mount(LayoutView({
      ...viewModel,
      props: {
        viewData,
        ...viewModel.props,
      },
    }));

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to base layout', () => {
      const layout = render({});

      expect(layout.props())
        .toMatchObject({
          dateTableTemplate: MonthDateTableLayout,
          headerPanelTemplate: expect.any(Function),
          viewData,
        });
      expect(layout.find(MonthDateTableLayout).exists())
        .toBe(true);
      expect(layout.find(HeaderPanelLayout).exists())
        .toBe(true);
    });
  });
});
