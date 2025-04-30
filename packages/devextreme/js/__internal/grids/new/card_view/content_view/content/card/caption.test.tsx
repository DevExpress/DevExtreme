import {
  describe, expect, it,
} from '@jest/globals';
import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { render } from 'inferno';

import { Caption } from './caption';

describe('Content View', () => {
  describe('Caption', () => {
    it('should render title', () => {
      const container = document.createElement('div');

      const field = { column: { caption: 'TEST_TITLE' } } as unknown as FieldInfo;

      render(<Caption field={field} />, container);

      expect(container).toMatchSnapshot();
    });

    it('should render template with title', () => {
      const container = document.createElement('div');

      const field = { column: { caption: 'TEST_TITLE' } } as unknown as FieldInfo;

      render(<Caption field={field}
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      template={({ field }) => (<div test-template="true">{field.column.caption}</div>)}
      />, container);

      expect(container).toMatchSnapshot();
    });
  });
});
