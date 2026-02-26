import { describe, expect, it } from '@jest/globals';

import { createFormIconTemplate } from './utils';

describe('createFormIconTemplate', () => {
  describe('FontAwesome icons support', () => {
    it('should create icon element with FontAwesome classes', () => {
      const template = createFormIconTemplate('fas fa-home');
      const $icon = template();

      expect($icon.hasClass('dx-icon')).toBe(true);
      expect($icon.hasClass('fas')).toBe(true);
      expect($icon.hasClass('fa-home')).toBe(true);
    });

    it('should create icon element with FontAwesome solid icon', () => {
      const template = createFormIconTemplate('fa-solid fa-user');
      const $icon = template();

      expect($icon.hasClass('dx-icon')).toBe(true);
      expect($icon.hasClass('fa-solid')).toBe(true);
      expect($icon.hasClass('fa-user')).toBe(true);
    });
  });

  describe('DevExtreme icons support', () => {
    it('should create icon element with DevExtreme icon class', () => {
      const template = createFormIconTemplate('tags');
      const $icon = template();

      expect($icon.hasClass('dx-icon')).toBe(true);
      expect($icon.hasClass('dx-icon-tags')).toBe(true);
    });
  });

  describe('empty icon', () => {
    it('should create sized gap element when icon name is empty', () => {
      const template = createFormIconTemplate('');
      const $element = template();

      expect($element.hasClass('dx-scheduler-form-icon-sized-gap')).toBe(true);
    });
  });
});
