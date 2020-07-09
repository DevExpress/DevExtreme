import { h } from 'preact';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../js/renovation/scheduler/workspaces/month/layout';
import { MonthDateTableLayout } from '../../../../../js/renovation/scheduler/workspaces/month/date-table/layout';

jest.mock('../../../../../js/renovation/scheduler/workspaces/base/layout', () => ({
  LayoutBase: (props) => <div {...props} />,
}));

describe('MonthLayout', () => {
  describe('Render', () => {
    const headerPanelTemplate = () => null;
    const dateTableTemplate = () => null;
    const viewCellsData = 'Test data';
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        headerPanelTemplate,
        dateTableTemplate,
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
    });
  });
});
