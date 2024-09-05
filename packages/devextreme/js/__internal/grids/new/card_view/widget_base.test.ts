import { CardView } from './widget_base';

describe('common', () => {
  describe('initial render', () => {
    it('should be successfull', () => {
      const container = document.createElement('div');
      const cardView = new CardView(container, {
        dataSource: [{ a: 'a' }],
      });

      expect(container).toMatchSnapshot();
    });
  });
});

describe('options', () => {
  describe('disabled', () => {
    it('should add dx-state-disabled class to container div', () => {
      const container = document.createElement('div');
      const cardView = new CardView(container, {
        disabled: true,
      });

      expect(container.classList).toContain('dx-state-disabled');
    });
  });
});
