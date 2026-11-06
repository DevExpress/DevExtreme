import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/file_uploader';
import FileUploader from '@js/ui/file_uploader';
import { implementationsMap } from '@ts/core/utils/size';

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
    jest.restoreAllMocks();
  });

  describe('isDirty (T1336605)', () => {
    it('should be true after a file is replaced by another file with the same content', () => {
      const fileUploader = createFileUploader({ value: [new File(['content'], 'file.txt')] });

      fileUploader.option('value', [new File(['content'], 'file.txt')]);

      expect(fileUploader.option('isDirty')).toBe(true);
    });
  });

  describe('file name max width', () => {
    const widths: Record<string, number> = {
      'dx-fileuploader-file-container': 400,
      'dx-fileuploader-button-container': 30,
      'dx-fileuploader-file-size': 50,
    };

    const mockWidths = (): void => {
      const { getWidth } = implementationsMap;

      jest.spyOn(implementationsMap, 'getWidth').mockImplementation((el) => {
        const className = Object.keys(widths).find((name) => $(el).hasClass(name));

        return className ? widths[className] : getWidth(el);
      });
    };

    it.each([
      { uploadMode: 'useButtons', maxWidth: '290px' },
      { uploadMode: 'useForm', maxWidth: '350px' },
    ] as const)('should leave room for the buttons and the file size in $uploadMode mode', ({ uploadMode, maxWidth }) => {
      mockWidths();

      const fileUploader = createFileUploader({
        uploadMode,
        value: [new File(['content'], 'a-long-file-name.txt')],
      });

      const fileName = fileUploader.element().querySelector<HTMLElement>('.dx-fileuploader-file-name');

      expect(fileName?.style.maxWidth).toBe(maxWidth);
    });
  });
});
