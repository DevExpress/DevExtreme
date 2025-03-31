import {
  describe, expect, it,
} from '@jest/globals';
import { render } from 'inferno';

import { ValueText } from './value_text';

describe('Content View', () => {
  describe('ValueText', () => {
    it('should set root classes', () => {
      const container = document.createElement('div');

      render(
        <ValueText alignment={'center'} wordWrapEnabled={false} text={'TEST'} highlightedText={null} />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should add title attribute', () => {
      const container = document.createElement('div');

      render(
        <ValueText alignment={'center'}
                   wordWrapEnabled={false}
                   text={'TEST'}
                   highlightedText={null}
                   cellHintEnabled={true}
        />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render plain text if highlighted text is null', () => {
      const container = document.createElement('div');

      render(
        <ValueText alignment={'center'}
                   wordWrapEnabled={false}
                   text={'TEST_TEXT'}
                   highlightedText={null}
        />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render highlighted text if passed', () => {
      const container = document.createElement('div');

      render(
        <ValueText alignment={'center'}
                   wordWrapEnabled={false}
                   text={'TEST_TEXT'}
                   highlightedText={[
                     { type: 'usual', text: 'USUAL_PART ' },
                     { type: 'highlighted', text: 'MATCH_PART' },
                     { type: 'usual', text: ' USUAL_PART' },
                   ]}
        />,
        container,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
