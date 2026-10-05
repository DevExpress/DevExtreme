import { describe, expect, it } from '@jest/globals';
import { data as elementData } from '@js/core/element_data';
import $ from '@js/core/renderer';
import {
  attachInstanceToElement,
  getInstanceByElement,
  name as getComponentName,
} from '@ts/core/utils/m_public_component';

const ANONYMOUS_NAME = /^dxPrivateComponent(\d+)$/;

const createComponentClass = (): new () => { id: number } => class {
  public id = 0;
};

const getAnonymousIndex = (componentName: string | undefined): number => {
  const match = ANONYMOUS_NAME.exec(componentName as string);

  return match ? Number(match[1]) : NaN;
};

describe('Public component utils', () => {
  describe('name', () => {
    it('should generate a numbered name for a class once', () => {
      const First = createComponentClass();
      const Second = createComponentClass();

      const firstName = getComponentName(First);
      const secondName = getComponentName(Second);

      expect(firstName).toMatch(ANONYMOUS_NAME);
      expect(getAnonymousIndex(secondName)).toBe(getAnonymousIndex(firstName) + 1);
      expect(getComponentName(First)).toBe(firstName);
      expect(getComponentName(Second)).toBe(secondName);
    });

    it('should store the given name of a class', () => {
      const Widget = createComponentClass();

      expect(getComponentName(Widget, 'dxWidget')).toBeUndefined();
      expect(getComponentName(Widget)).toBe('dxWidget');
    });

    it('should rename a class', () => {
      const Widget = createComponentClass();

      getComponentName(Widget, 'dxFirst');
      getComponentName(Widget, 'dxSecond');

      expect(getComponentName(Widget)).toBe('dxSecond');
    });
  });

  describe('attachInstanceToElement and getInstanceByElement', () => {
    it('should return the instance attached to an element by its class', () => {
      const Widget = createComponentClass();
      const element = document.createElement('div');
      const instance = new Widget();

      attachInstanceToElement($(element), instance);

      expect(getInstanceByElement($(element), Widget)).toBe(instance);
    });

    it('should keep the instances of different classes apart', () => {
      const First = createComponentClass();
      const Second = createComponentClass();
      const Third = createComponentClass();
      const element = document.createElement('div');
      const first = new First();
      const second = new Second();

      attachInstanceToElement($(element), first);
      attachInstanceToElement($(element), second);

      expect(getInstanceByElement($(element), First)).toBe(first);
      expect(getInstanceByElement($(element), Second)).toBe(second);
      expect(getInstanceByElement($(element), Third)).toBeUndefined();
    });

    it('should not share the instances between elements', () => {
      const Widget = createComponentClass();
      const element = document.createElement('div');

      attachInstanceToElement($(element), new Widget());

      expect(getInstanceByElement($(document.createElement('div')), Widget)).toBeUndefined();
    });

    it('should list the names of the attached components on the element in the order of attaching', () => {
      const First = createComponentClass();
      const Second = createComponentClass();
      const element = document.createElement('div');

      attachInstanceToElement($(element), new First());
      attachInstanceToElement($(element), new Second());

      expect(elementData(element, 'dxComponents')).toEqual([
        getComponentName(First),
        getComponentName(Second),
      ]);
    });

    it('should call the dispose function on the instance when the element is removed', () => {
      const Widget = createComponentClass();
      const element = document.createElement('div');
      const instance = new Widget();
      const receivers: unknown[] = [];
      document.body.appendChild(element);

      attachInstanceToElement($(element), instance, function dispose(this: unknown) {
        receivers.push(this);
      });

      expect(receivers).toEqual([]);

      $(element).remove();

      expect(receivers).toEqual([instance]);
    });
  });
});
