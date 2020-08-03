import React from 'react';
import { shallow } from 'enzyme';
import ScrollView, { viewFunction } from '../scroll_view';

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

    it('should render slot', () => {
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
          const { cssClasses } = new ScrollView({ direction: 'vertical' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));
        });

        it('should add horizontal direction class', () => {
          const { cssClasses } = new ScrollView({ direction: 'horizontal' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-horizontal'));
        });

        it('should add both direction class', () => {
          const { cssClasses } = new ScrollView({ direction: 'both' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-both'));
        });
      });
    });
  });
});
