import { h } from 'preact';
import { mount } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../js/renovation/scheduler/workspaces/month/layout';
import { MonthDateTableLayout } from '../../../../../js/renovation/scheduler/workspaces/month/date-table/layout';
import { HeaderPanelLayout } from '../../../../../js/renovation/scheduler/workspaces/base/header-panel/layout';

jest.mock('../../../../../js/renovation/scheduler/workspaces/base/layout', () => ({
  LayoutBase: (props) => (
    <div {...props}>
      <props.headerPanelTemplate />
      <props.dateTableTemplate />
    </div>
  ),
}));
jest.mock('../../../../../js/renovation/scheduler/workspaces/month/date-table/layout', () => ({
  MonthDateTableLayout: () => null,
}));
jest.mock('../../../../../js/renovation/scheduler/workspaces/base/header-panel/layout', () => ({
  HeaderPanelLayout: () => null,
}));

describe('MonthLayout', () => {
  describe('Render', () => {
    const viewCellsData = 'Test data';
    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: {
        viewCellsData,
        ...viewModel.props,
      },
    } as any) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to base layout', () => {
      const layout = render({});

      expect(layout.props())
        .toMatchObject({
          dateTableTemplate: MonthDateTableLayout,
          headerPanelTemplate: expect.any(Function),
          viewCellsData,
        });
      expect(layout.find(MonthDateTableLayout).exists())
        .toBe(true);
      expect(layout.find(HeaderPanelLayout).exists())
        .toBe(true);
    });
  });
});
