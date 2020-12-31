import { mount } from 'enzyme';

import {
  ScrollView,
  viewFunction,
} from '../scroll_view';

import devices from '../../../../core/devices';
// eslint-disable-next-line import/default
import themes from '../../../../ui/themes';

type Mock = jest.Mock;

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('ScrollView', () => {
  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('Check default property values', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
        });

        it('should render scrollView content', () => {
          const scrollView = mount(viewFunction({ props: { } } as any) as JSX.Element);
          const scrollViewContent = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(true);
        });

        it('should not render top & bottom pockets', () => {
          const scrollView = mount(viewFunction({ props: { } } as any) as JSX.Element);
          const topPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
          expect(topPocket.exists()).toBe(true);
          const bottomPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
          expect(bottomPocket.exists()).toBe(true);
        });
      });
    });
  });

  describe('Default options', () => {
    beforeEach(() => {
      (devices.real as Mock).mockImplementation(() => ({ platform: 'generic' }));
      ((themes as any).current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('Texts', () => {
      it('theme: material, texts options: undefined', () => {
        ((themes as any).current as Mock).mockImplementation(() => 'material');

        const scrollView = mount(viewFunction(new ScrollView({})) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('');
      });

      it('theme: material, texts options: "value"', () => {
        ((themes as any).current as Mock).mockImplementation(() => 'material');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: 'value_1',
          pulledDownText: 'value_2',
          refreshingText: 'value_3',
          reachBottomText: 'value_4',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('value_1');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('value_2');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('value_3');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('value_4');
      });

      it('theme: generic, texts options: "value"', () => {
        ((themes as any).current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: 'value_1',
          pulledDownText: 'value_2',
          refreshingText: 'value_3',
          reachBottomText: 'value_4',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('value_1');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('value_2');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('value_3');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('value_4');
      });

      it('theme: generic, texts options: undefined', () => {
        ((themes as any).current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({})) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('Pull down to refresh...');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('Release to refresh...');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('Refreshing...');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('Loading...');
      });
    });
  });
});
