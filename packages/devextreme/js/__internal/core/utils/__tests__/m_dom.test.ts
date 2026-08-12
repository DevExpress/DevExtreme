import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import {
  addAriaDescriptionId,
  getAriaDescriptionIds,
  removeAriaDescriptionId,
  setAriaDescriptionIds,
} from '@ts/core/utils/m_dom';

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

  describe('addAriaDescriptionId', () => {
    it('should add the id to the empty attribute and return true', () => {
      const result = addAriaDescriptionId(element, 'id-1');

      expect(result).toBe(true);
      expect(element.getAttribute('aria-describedby')).toBe('id-1');
    });

    it('should append the id to existing ids and return true', () => {
      element.setAttribute('aria-describedby', 'id-1 id-2');

      const result = addAriaDescriptionId(element, 'id-3');

      expect(result).toBe(true);
      expect(element.getAttribute('aria-describedby')).toBe('id-1 id-2 id-3');
    });

    it('should not add the id if it already exists and return false', () => {
      element.setAttribute('aria-describedby', 'id-1 id-2');
      const setAttributeSpy = jest.spyOn(element, 'setAttribute');

      const result = addAriaDescriptionId(element, 'id-2');

      expect(result).toBe(false);
      expect(element.getAttribute('aria-describedby')).toBe('id-1 id-2');
      expect(setAttributeSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeAriaDescriptionId', () => {
    it('should do nothing if the attribute is absent', () => {
      const removeAttributeSpy = jest.spyOn(element, 'removeAttribute');
      const setAttributeSpy = jest.spyOn(element, 'setAttribute');

      removeAriaDescriptionId(element, 'id-1');

      expect(element.hasAttribute('aria-describedby')).toBe(false);
      expect(removeAttributeSpy).not.toHaveBeenCalled();
      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it('should remove the attribute when the last id is removed', () => {
      element.setAttribute('aria-describedby', 'id-1');

      removeAriaDescriptionId(element, 'id-1');

      expect(element.hasAttribute('aria-describedby')).toBe(false);
    });

    it('should remove a single id from the list of multiple ids', () => {
      element.setAttribute('aria-describedby', 'id-1 id-2 id-3');

      removeAriaDescriptionId(element, 'id-2');

      expect(element.getAttribute('aria-describedby')).toBe('id-1 id-3');
    });

    it('should not change the attribute if the id is not present', () => {
      element.setAttribute('aria-describedby', 'id-1 id-3');
      const setAttributeSpy = jest.spyOn(element, 'setAttribute');
      const removeAttributeSpy = jest.spyOn(element, 'removeAttribute');

      removeAriaDescriptionId(element, 'id-2');

      expect(element.getAttribute('aria-describedby')).toBe('id-1 id-3');
      expect(setAttributeSpy).not.toHaveBeenCalled();
      expect(removeAttributeSpy).not.toHaveBeenCalled();
    });
  });
});
