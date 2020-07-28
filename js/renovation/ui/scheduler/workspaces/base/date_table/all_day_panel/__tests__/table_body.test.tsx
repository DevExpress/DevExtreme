import { h } from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableBodyView } from '../table_body';
import { AllDayPanelRow as Row } from '../row';
import { AllDayPanelCell as Cell } from '../cell';

jest.mock('devextreme-generator/component_declaration/common', () => ({
  ...require.requireActual('devextreme-generator/component_declaration/common'),
  Fragment: ({ children }) => <div>{children}</div>,
}));

describe('AllDayPanelTableBody', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TableBodyView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    } as any) as any).childAt(0);

    it('should render component correctly', () => {
      const tableBody = render({
        props: {
          className: 'custom-class',
          viewData: [
            { startDate: new Date(2020, 7, 28) },
            { startDate: new Date(2020, 7, 29) },
          ],
        },
      });

      expect(tableBody.find(Row))
        .toHaveLength(1);

      expect(tableBody.find(Row).find(Cell))
        .toHaveLength(2);
    });
  });
});
