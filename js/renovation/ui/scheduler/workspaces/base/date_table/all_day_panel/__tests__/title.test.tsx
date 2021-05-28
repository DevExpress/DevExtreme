import { shallow } from 'enzyme';
import { viewFunction as TitleView, AllDayPanelTitle } from '../title';

describe('AllDayPanelTitle', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TitleView({
      ...viewModel,
      props: { ...viewModel.props },
    }) as any);

    it('should spread restAttributes', () => {
      const title = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(title.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render correctly', () => {
      const title = render({
        classes: 'test-class',
        text: 'some text',
      });

      expect(title.hasClass('test-class'))
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

      describe('classes', () => {
        it('should not add "hidden" class if visible is true', () => {
          const title = new AllDayPanelTitle({
            className: 'some-class',
            visible: true,
          });

          expect(title.classes.split(' '))
            .toEqual([
              'dx-scheduler-all-day-title',
              'some-class',
            ]);
        });

        it('should add "hidden" class if visible is false', () => {
          const title = new AllDayPanelTitle({
            className: 'some-class',
            visible: false,
          });

          expect(title.classes.split(' '))
            .toEqual([
              'dx-scheduler-all-day-title',
              'dx-scheduler-all-day-title-hidden',
              'some-class',
            ]);
        });
      });
    });
  });
});
