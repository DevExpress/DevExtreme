import { shallow } from 'enzyme';
import {
  viewFunction as RowView,
} from '../row';
import {
  GroupPanelVerticalCell as Cell,
} from '../cell';

jest.mock('../cell', () => ({
  GroupPanelVerticalCell: (): null => null,
}));

describe('GroupPanel Vertical Row', () => {
  describe('Render', () => {
    const groupItems = [{
      text: 'item 1', id: 1, color: 'color 1', resourceName: 'group 1', key: '1',
    }, {
      text: 'item 2', id: 2, color: 'color 2', resourceName: 'group 1', key: '2',
    }];
    const render = (viewModel) => shallow(RowView({
      ...viewModel,
      props: { groupItems, ...viewModel.props },
    }) as any);

    it('should combine default and custom classNames', () => {
      const row = render({ props: { className: 'custom-class' } });

      expect(row.hasClass('custom-class'))
        .toBe(true);
      expect(row.hasClass('dx-scheduler-group-row'))
        .toBe(true);
    });

    it('should render cells and pass correct props to them', () => {
      const cellTemplate = (): null => null;
      const row = render({ props: { cellTemplate } });

      const cells = row.find(Cell);
      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          text: 'item 1', id: 1, color: 'color 1', cellTemplate,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          text: 'item 2', id: 2, color: 'color 2', cellTemplate,
        });
    });
  });
});
