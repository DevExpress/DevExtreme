import { h } from 'preact';
import { shallow } from 'enzyme';
import ScrollView, { ScrollViewProps, viewFunction } from '../../../js/renovation/scroll-view';

describe('ScrollView', () => {
  describe('Render', () => {
    it('should render parent container', () => {
      const scrollView = shallow(viewFunction({
        cssClasses: 'dx-scrollview',
        props: { },
      } as any) as any);

      expect(scrollView.hasClass('dx-scrollview')).toBe(true);
    });

    it('should render scrollable content', () => {
      const scrollView = shallow(viewFunction({ props: { } } as any) as any);
      const scrollViewContent = scrollView.find('.dx-scrollable-wrapper .dx-scrollable-container .dx-scrollable-content');
      expect(scrollViewContent.exists()).toBe(true);
    });

    it('should render template', () => {
      const scrollView = shallow(viewFunction({
        props: { children: <div className="content" /> },
      } as any) as any);

      const content = scrollView.find('.dx-scrollable-content .content');
      expect(content.exists()).toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add scrolling classes', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-native-generic'));
        });

        it('should add vertical direction class', () => {
          expect(new ScrollView({ direction: 'vertical' }).cssClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));
        });

        it('should add horizontal direction class', () => {
          expect(new ScrollView({ direction: 'horizontal' }).cssClasses).toEqual(expect.stringMatching('dx-scrollable-horizontal'));
        });

        it('should add both direction class', () => {
          expect(new ScrollView({ direction: 'both' }).cssClasses).toEqual(expect.stringMatching('dx-scrollable-both'));
        });
      });
    });

    describe('Default options', () => {
      it('should be vertical direction by default', () => {
        expect(new ScrollViewProps().direction).toEqual('vertical');
      });
    });
  });
});
