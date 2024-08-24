import { render } from 'inferno';

import { normalizeColumn } from '../../grid_core/columns_controller/utils';
import type { CardProps } from './card';
import { Card } from './card';

const testProps: CardProps = {
  row: {
    cells: [{
      value: 'qwe',
      column: normalizeColumn('asd'),
    }],
    key: 1,
  },
};

it('should be rendered', () => {
  const container = document.createElement('div');
  render(<Card row={testProps.row}/>, container);
  expect(container.innerHTML).toMatchSnapshot();
});
