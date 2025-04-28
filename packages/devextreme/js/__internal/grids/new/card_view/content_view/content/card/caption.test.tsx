import {
  describe, expect, it,
} from '@jest/globals';
import type { Cell } from '@ts/grids/new/grid_core/columns_controller/types';
import { render } from 'inferno';

import { Caption } from './caption';

describe('Content View', () => {
  describe('Caption', () => {
    it('should render title', () => {
      const container = document.createElement('div');

      const cell = { column: { caption: 'TEST_TITLE' } } as unknown as Cell;

      render(<Caption cell={cell} />, container);

      expect(container).toMatchSnapshot();
    });

    it('should render template with title', () => {
      const container = document.createElement('div');

      const cell = { column: { caption: 'TEST_TITLE' } } as unknown as Cell;

      render(<Caption cell={cell}
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      template={({ cell }) => (<div test-template="true">{cell.column.caption}</div>)}
      />, container);

      expect(container).toMatchSnapshot();
    });
  });
});
