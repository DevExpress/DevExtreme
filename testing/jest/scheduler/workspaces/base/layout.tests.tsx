import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../js/renovation/scheduler/workspaces/base/layout';

describe('LayoutBase', () => {
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

    it('should render templates', () => {
      const layout = render({});

      const header = layout.find(headerPanelTemplate);
      expect(header.exists())
        .toBe(true);
      expect(header.props())
        .toMatchObject({ viewCellsData });

      const dateTable = layout.find(dateTableTemplate);
      expect(dateTable.exists())
        .toBe(true);
      expect(dateTable.props())
        .toMatchObject({ viewCellsData });
    });
  });
});
