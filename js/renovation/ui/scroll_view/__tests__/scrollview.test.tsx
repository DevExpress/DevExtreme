import { mount } from 'enzyme';
import each from 'jest-each';

import {
  ScrollView,
  viewFunction,
} from '../scroll_view';

import {
  defaultOptionRules,
} from '../scrollable';

import devices from '../../../../core/devices';
import { convertRulesToOptions } from '../../../../core/options/utils';
import { current } from '../../../../ui/themes';
import { ScrollViewProps } from '../scroll_view_props';

type Mock = jest.Mock;

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const real = actualDevices.real.bind(actualDevices);
  const platform = actualDevices.real.bind(actualDevices);
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);
  actualDevices.current = jest.fn(platform);

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
      (devices as any).isSimulator.mockImplementation(() => false);
      (current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('Texts', () => {
      it('theme: material, texts options: undefined', () => {
        (current as Mock).mockImplementation(() => 'material');

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
        (current as Mock).mockImplementation(() => 'material');

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
        (current as Mock).mockImplementation(() => 'generic');

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
        (current as Mock).mockImplementation(() => 'generic');

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

      it('theme: generic, texts options: empty string', () => {
        (current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: '',
          pulledDownText: '',
          refreshingText: '',
          reachBottomText: '',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('');
      });
    });

    describe('Options', () => {
      const getDefaultOptions = (): ScrollViewProps => Object.assign(new ScrollViewProps(),
        convertRulesToOptions(defaultOptionRules));

      each([false]).describe('isSimulator: %o', (isSimulator) => {
        each(['desktop']).describe('deviceType: %o', (deviceType) => {
          each(['generic']).describe('platform: %o', (platform) => {
            it('scrollByThumb, showScrollbar', () => {
              (devices as any).isSimulator.mockImplementation(() => isSimulator);
              (devices.real as Mock).mockImplementation(() => ({ deviceType }));
              (devices.current as Mock).mockImplementation(() => ({ platform }));

              if (!isSimulator && deviceType === 'desktop' && platform === 'generic') {
                expect(getDefaultOptions().scrollByThumb).toBe(true);
                expect(getDefaultOptions().showScrollbar).toBe('onHover');
              } else {
                expect(getDefaultOptions().scrollByThumb).toBe(false);
                expect(getDefaultOptions().showScrollbar).toBe('onScroll');
              }
            });
          });
        });
      });
    });
  });
});
