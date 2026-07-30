import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { getAriaDescriptionIds, setAriaDescriptionIds } from '@ts/core/utils/m_dom';

describe('DOM utils', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('getAriaDescriptionIds', () => {
    it('should return an empty array when the attribute is absent', () => {
      expect(getAriaDescriptionIds(element)).toEqual([]);
    });

    it('should return an empty array when the attribute is empty', () => {
      element.setAttribute('aria-describedby', '');

      expect(getAriaDescriptionIds(element)).toEqual([]);
    });

    it('should return a single id', () => {
      element.setAttribute('aria-describedby', 'id-1');

      expect(getAriaDescriptionIds(element)).toEqual(['id-1']);
    });

    it('should split multiple ids separated by spaces', () => {
      element.setAttribute('aria-describedby', 'id-1 id-2 id-3');

      expect(getAriaDescriptionIds(element)).toEqual(['id-1', 'id-2', 'id-3']);
    });

    it('should ignore extra whitespace between ids', () => {
      element.setAttribute('aria-describedby', '  id-1   id-2  ');

      expect(getAriaDescriptionIds(element)).toEqual(['id-1', 'id-2']);
    });
  });

  describe('setAriaDescriptionIds', () => {
    it('should set the attribute for a single id', () => {
      setAriaDescriptionIds(element, ['id-1']);

      expect(element.getAttribute('aria-describedby')).toBe('id-1');
    });

    it('should join multiple ids with a single space', () => {
      setAriaDescriptionIds(element, ['id-1', 'id-2', 'id-3']);

      expect(element.getAttribute('aria-describedby')).toBe('id-1 id-2 id-3');
    });

    it('should remove the attribute when the ids list is empty', () => {
      element.setAttribute('aria-describedby', 'id-1');

      setAriaDescriptionIds(element, []);

      expect(element.hasAttribute('aria-describedby')).toBe(false);
    });

    it('should not rewrite the attribute when the value is unchanged', () => {
      element.setAttribute('aria-describedby', 'id-1 id-2');
      const setAttributeSpy = jest.spyOn(element, 'setAttribute');

      setAriaDescriptionIds(element, ['id-1', 'id-2']);

      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it('should be reversible with getAriaDescriptionIds', () => {
      setAriaDescriptionIds(element, ['id-1', 'id-2']);

      expect(getAriaDescriptionIds(element)).toEqual(['id-1', 'id-2']);
    });
  });
});
