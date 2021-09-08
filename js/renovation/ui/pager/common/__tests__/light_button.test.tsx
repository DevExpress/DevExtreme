import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../../../utils/effect_return.d';
import { LightButton, viewFunction as LightButtonComponent } from '../light_button';
import { subscribeToClickEvent } from '../../../../utils/subscribe_to_event';

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
        const widgetRef = { current: {} } as RefObject<HTMLDivElement>;
        const component = new LightButton({ onClick: click });
        component.widgetRef = widgetRef;
        const unsubscribeFn = component.subscribeToClick() as DisposeEffectReturn;
        expect(subscribeToClickEvent).toBeCalledTimes(1);
        expect(subscribeToClickEvent).toBeCalledWith(widgetRef.current, click);
        unsubscribeFn?.();
        expect(subscribeToClickEvent).toBeCalledTimes(1);
      });
    });

    describe('keyboardEffect', () => {
      it('should call registerKeyboardAction with right parameters', () => {
        const registerKeyboardAction = jest.fn();
        const widgetRef = { current: {} } as RefObject<HTMLDivElement>;
        const onClick = jest.fn();
        const button = new LightButton({ onClick });
        button.widgetRef = widgetRef;
        button.keyboardContext = { registerKeyboardAction };
        button.keyboardEffect();

        expect(registerKeyboardAction).toHaveBeenCalledTimes(1);
        expect(registerKeyboardAction).toHaveBeenCalledWith(
          widgetRef.current,
          onClick,
        );
      });
    });
  });
});
