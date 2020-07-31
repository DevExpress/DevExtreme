import { shallow } from 'enzyme';
import { viewFunction as TitleView, AllDayPanelTitle } from '../title';

describe('AllDayPanelTitle', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TitleView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should spread restAttributes', () => {
      const title = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(title.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render correctly', () => {
      const title = render({
        props: { className: 'test-class' },
        text: 'some text',
      });

      expect(title.hasClass('dx-scheduler-all-day-title test-class'))
        .toBe(true);
      expect(title.hasClass('test-class'))
        .toBe(true);
      expect(title.text())
        .toEqual('some text');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('text', () => {
        const title = new AllDayPanelTitle({});

        expect(title.text)
          .toEqual('All day');
      });
    });
  });
});
