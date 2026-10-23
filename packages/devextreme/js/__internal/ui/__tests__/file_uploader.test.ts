import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/file_uploader';
import FileUploader from '@js/ui/file_uploader';

const instances: FileUploader[] = [];

const createFileUploader = (options: Partial<Properties> = {}): FileUploader => {
  const $element = $('<div>').appendTo(document.body);

  const instance = new FileUploader($element.get(0) as HTMLElement, options);

  instances.push(instance);

  return instance;
};

describe('FileUploader', () => {
  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
  });

  describe('isDirty (T1336605)', () => {
    it('should be true after a file is replaced by another file with the same content', () => {
      const fileUploader = createFileUploader({ value: [new File(['content'], 'file.txt')] });

      fileUploader.option('value', [new File(['content'], 'file.txt')]);

      expect(fileUploader.option('isDirty')).toBe(true);
    });
  });
});
