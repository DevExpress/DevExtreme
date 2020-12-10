import {
  ScrollView,
} from '../scroll_view';

describe('ScrollView', () => {
  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('Check default property values', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
        });
      });
    });
  });
});
