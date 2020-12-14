import { mount } from 'enzyme';

import {
  ScrollView,
  viewFunction,
} from '../scroll_view';

describe('ScrollView', () => {
  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('Check default property values', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
        });

        it('should render scrollView content', () => {
          const scrollable = mount(viewFunction({ props: { } } as any) as JSX.Element);
          const scrollViewContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(true);
        });
      });
    });
  });
});
