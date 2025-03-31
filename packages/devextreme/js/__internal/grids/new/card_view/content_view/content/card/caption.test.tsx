import {
  describe, expect, it,
} from '@jest/globals';
import { render } from 'inferno';

import { Caption } from './caption';

describe('Content View', () => {
  describe('Caption', () => {
    it('should render title', () => {
      const container = document.createElement('div');

      render(<Caption title={'TEST_TITLE'} />, container);

      expect(container).toMatchSnapshot();
    });

    it('should render template with title', () => {
      const container = document.createElement('div');

      render(<Caption title={'TEST_TITLE'}
                      template={(title) => (<div test-template="true">{title}</div>)}
      />, container);

      expect(container).toMatchSnapshot();
    });
  });
});
