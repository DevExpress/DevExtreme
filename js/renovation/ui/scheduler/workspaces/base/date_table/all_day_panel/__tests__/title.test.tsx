import { shallow } from 'enzyme';
import { viewFunction as TitleView, AllDayPanelTitle } from '../title';

describe('AllDayPanelTitle', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TitleView({
      ...viewModel,
      props: { ...viewModel.props },
    }) as any);

    it('should render correctly', () => {
      const title = render({
        text: 'some text',
      });

      expect(title.hasClass('dx-scheduler-all-day-title'))
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
