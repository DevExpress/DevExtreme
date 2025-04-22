import {
  describe, expect, it,
} from '@jest/globals';
import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { render } from 'inferno';

import { ValueText } from './value_text';

describe('Content View', () => {
  describe('ValueText', () => {
    it('should set root classes', () => {
      const container = document.createElement('div');

      const field = {
        column: { alignment: 'center' }, text: 'TEST', highlightedText: null,
      } as unknown as FieldInfo;

      render(
        <ValueText field={field}/>,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should add title attribute', () => {
      const container = document.createElement('div');

      const field = {
        column: { alignment: 'center' },
        text: 'TEST',
        highlightedText: null,
      } as unknown as FieldInfo;

      render(
        <ValueText field={field}
                   cellHintEnabled={true}
        />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render plain text if highlighted text is null', () => {
      const container = document.createElement('div');

      const field = {
        column: { alignment: 'center' },
        text: 'TEST_TEXT',
        highlightedText: null,
      } as unknown as FieldInfo;

      render(
        <ValueText field={field} />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render highlighted text if passed', () => {
      const container = document.createElement('div');

      const field = {
        column: { alignment: 'center' },
        text: 'TEST_TEXT',
        highlightedText: [
          { type: 'usual', text: 'USUAL_PART ' },
          { type: 'highlighted', text: 'MATCH_PART' },
          { type: 'usual', text: ' USUAL_PART' },
        ],
      } as unknown as FieldInfo;

      render(
        <ValueText field={field} />,
        container,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
