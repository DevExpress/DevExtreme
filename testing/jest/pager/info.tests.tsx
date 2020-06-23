import { h, createRef } from 'preact';
import { shallow } from 'enzyme';
import InfoText, { viewFunction as InfoTextComponent } from '../../../js/renovation/pager/info';

describe('Info, separate view and component approach', () => {
  describe('View', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    it('should render valid markup, view', () => {
      const tree = shallow(<InfoTextComponent {...{ text: 'some text', props: { visible: true } } as any} /> as any);
      expect(tree.html())
        .toBe('<div class="dx-info">some text</div>');
    });
    it('ref test', () => {
      const ref = createRef();
      shallow(<InfoTextComponent {...{ htmlRef: ref, text: 'text', props: { visible: true } } as any} /> as any);
      expect(ref.current).not.toBeNull();
      expect(ref.current.className).toBe('dx-info');
    });
  });

  describe('Logic', () => {
    it('getHtmlElement', () => {
      const infoText = new InfoText({ });
      infoText.htmlRef = {} as any;
      expect(infoText.getHtmlElement()).toBe(infoText.htmlRef);
    });
    it('text with changed infoText', () => {
      const infoText = new InfoText({
        infoText: 'Page {0} of {1} ({2} items) (custom)', pageCount: 20, pageIndex: 5, totalCount: 200,
      });
      expect(infoText.text).toBe('Page 6 of 20 (200 items) (custom)');
    });
  });
});
