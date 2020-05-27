import { h } from 'preact';
import { mount } from 'enzyme';
import InfoText, { viewFunction } from '../../../js/renovation/pager/info';

describe('Info', () => {
  describe('View', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const render = (props: Partial<InfoText>) => {
      window.h = h;
      const Component = viewFunction;
      return mount(<Component {...props as any} />);
    };

    it('should render valid markup', () => {
      const tree = render({ text: 'some text' });

      expect(tree.html())
        .toBe('<div class="dx-info">some text</div>');
    });
  });

  describe('InfoText', () => {
    it('get text with custom props', () => {
      const infoText = new InfoText({
        infoText: 'Page {0} of {1} ({2} items) (custom)', pageCount: 20, pageIndex: 5, totalCount: 200,
      });
      expect(infoText.text).toBe('Page 6 of 20 (200 items) (custom)');
    });
  });
});
