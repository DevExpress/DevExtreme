import { mount } from 'enzyme';
import each from 'jest-each';

import {
  ScrollView,
  viewFunction,
  defaultOptionRules,
} from '../scroll_view';

import { ScrollViewProps } from '../scroll_view_props';

import devices from '../../../../core/devices';
import themes from '../../../../ui/themes';
import messageLocalization from '../../../../localization/message';
import { convertRulesToOptions } from '../../../../core/options/utils';

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
    const getDefaultOptions = (): ScrollViewProps => Object.assign(new ScrollViewProps(),
      convertRulesToOptions(defaultOptionRules));

    beforeEach(() => {
      (devices.real as Mock).mockImplementation(() => ({ platform: 'generic' }));
      ((themes as any).current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('refreshStrategy', () => {
      it('platform: android', () => {
        (devices.real as Mock).mockImplementation(() => ({ platform: 'android' }));
        expect(getDefaultOptions().refreshStrategy).toBe('swipeDown');
      });

      it('platform: generic', () => {
        expect(getDefaultOptions().refreshStrategy).toBe('pullDown');
      });
    });

    describe('Texts', () => {
      each(['pullingDownText', 'pulledDownText', 'refreshingText', 'reachBottomText']).describe('Option: %o', (textOption) => {
        it('theme: material', () => {
          ((themes as any).current as Mock).mockImplementation(() => 'material');
          expect(getDefaultOptions()[textOption]).toBe('');
        });

        it('theme: generic', () => {
          ((themes as any).current as Mock).mockImplementation(() => 'generic');
          expect(getDefaultOptions()[textOption]).toBe(messageLocalization.format(`dxScrollView-${textOption}`));
        });
      });
    });
  });
});
