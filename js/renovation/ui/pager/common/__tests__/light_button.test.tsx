import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { registerKeyboardAction } from '../../../../../ui/shared/accessibility';
import { LightButton, viewFunction as LightButtonComponent } from '../light_button';
import { subscribeToClickEvent } from '../../../../utils/subscribe_to_event';
import { closestClass } from '../../utils/closest_class';

jest.mock('../../../../../ui/shared/accessibility');
jest.mock('../../utils/closest_class');
jest.mock('../../../../utils/subscribe_to_event');

describe('LightButton', () => {
  describe('View', () => {
    it('should render valid markup', () => {
      const widgetRef = createRef();
      const props = {
        widgetRef: widgetRef as any,
        props: { children: 'text', className: 'class', label: 'label' },
      } as Partial<LightButton>;
      const tree = mount(<LightButtonComponent {...props as any} /> as any);

      expect(tree.find('div').instance()).toBe(widgetRef.current);

      expect(tree.html())
        .toBe('<div class="class" tabindex="0" role="button" aria-label="label">text</div>');
    });

    it('should render children', () => {
      const props = {
        props: { children: <div className="child" />, className: 'class', label: 'label' },
      } as Partial<LightButton>;
      const tree = mount(<LightButtonComponent {...props as any} /> as any);

      expect(tree.find('.child').exists()).toBe(true);
    });
  });

  describe('Effect', () => {
    describe('ClickEffect', () => {
      it('clickEffect', () => {
        const click = jest.fn();
        const widgetRef = {} as HTMLDivElement;
        const component = new LightButton({ onClick: click });
        component.widgetRef = widgetRef;
        const unsubscribeFn = component.subscribeToClick();
        expect(subscribeToClickEvent).toBeCalledTimes(1);
        expect(subscribeToClickEvent).toBeCalledWith(widgetRef, click);
        unsubscribeFn?.();
        expect(subscribeToClickEvent).toBeCalledTimes(1);
      });
    });

    describe('keyboardEffect', () => {
      it('should call registerKeyboardAction with right parameters', () => {
        const widgetRef = {} as HTMLDivElement;
        const onClick = jest.fn();
        const button = new LightButton({ onClick });
        button.widgetRef = widgetRef;
        button.keyboardEffect();

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
        const fakeWidget = (registerKeyboardAction as jest.Mock).mock.calls[0][1];
        expect(fakeWidget.option()).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(fakeWidget._createActionByOption()()).toBe(undefined);
      });

      it('should use the `closest` function inside parameters', () => {
        const pagerElement = {};
        (closestClass as jest.Mock).mockReturnValue(pagerElement);
        const button = new LightButton({ });
        button.keyboardEffect();

        const pagerInstance = (registerKeyboardAction as jest.Mock).mock.calls[0][1];
        expect(pagerInstance.element()).toBe(pagerElement);
      });
    });
  });
});
