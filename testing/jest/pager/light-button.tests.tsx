import { h } from 'preact';
import { mount } from 'enzyme';
import { EVENT, emit, getEventHandlers } from '../utils/events-mock';
import { registerKeyboardAction } from '../../../js/ui/shared/accessibility';
import LightButton, { LightButtonProps, dxClickEffect } from '../../../js/renovation/pager/light-button';

jest.mock('../../../js/ui/shared/accessibility');

describe('LightButton', () => {
  describe('View', () => {
    const render = (props) => {
      window.h = h;
      return mount(<LightButton {...new LightButtonProps()} {...props} />);
    };

    it('should render valid markup', () => {
      const tree = render({
        children: 'text', className: 'class', label: 'label',
      });

      expect(tree.html())
        .toBe('<div class="class" tabindex="0" role="button" aria-label="label">text</div>');
    });

    it('should render children', () => {
      const tree = render({ children: <div className="child" /> });

      expect(tree.find('.child').exists()).toBe(true);
    });
  });

  describe('Effect', () => {
    describe('dxClickEffect', () => {
      it('should not subscribe to click event without handler', () => {
        dxClickEffect(null, null);

        expect(getEventHandlers(EVENT.dxClick)).toBe(undefined);
      });

      it('should subscribe to click event', () => {
        const clickHandler = jest.fn();
        dxClickEffect(null, clickHandler);
        expect(clickHandler).toHaveBeenCalledTimes(0);

        emit(EVENT.dxClick);
        expect(clickHandler).toHaveBeenCalledTimes(1);
      });

      it('should return unsubscribe function', () => {
        const clickHandler = jest.fn();
        const unsubscribeFn = dxClickEffect(null, clickHandler);

        emit(EVENT.dxClick);
        expect(clickHandler).toHaveBeenCalledTimes(1);

        unsubscribeFn();

        emit(EVENT.dxClick);
        expect(clickHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('keyboardEffect', () => {
      beforeEach(() => {
        jest.resetAllMocks();
      });
      it('should call registerKeyboardAction with right parameters', () => {
        const widgetRef = jest.fn();
        const onClick = jest.fn();
        const button = new LightButton({});

        button.keyboardEffect.bind({ props: { onClick }, widgetRef })();

        expect(registerKeyboardAction).toHaveBeenCalledTimes(1);
        expect(registerKeyboardAction).toHaveBeenCalledWith(
          'pager',
          {
            option: expect.any(Function),
            element: expect.any(Function),
            _createActionByOption: expect.any(Function),
          },
          widgetRef,
          undefined,
          onClick,
        );
      });

      it('should use the `closest` function inside parameters', () => {
        const widgetRef = document.createElement('div');
        const onClick = jest.fn();
        const button = new LightButton({});

        button.keyboardEffect.bind({ props: { onClick }, widgetRef })();

        const pagerInstance = registerKeyboardAction.mock.calls[0][1];

        expect(pagerInstance.element()).toBe(null);
      });
    });
  });
});
