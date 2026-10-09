import { isObject } from '@js/core/utils/type';
import Quill from 'devextreme-quill';

import type {
  BlotConstructorBase,
  ImageAttributes,
  ImageBlotConstructor,
  ImageFormats,
  QuillDependent,
} from '../types';

type ExtendedImageValue = string | ImageAttributes;
type ImageAttributeName = 'alt' | 'width' | 'height';

interface ExtendedImageFormats extends ImageFormats {
  imageSrc?: string | null;
}

/** The `extendedImage` blot class */
interface ExtendedImageConstructor extends BlotConstructorBase {
  create: (data: ExtendedImageValue) => HTMLElement;
  formats: (domNode: HTMLElement) => ExtendedImageFormats;
  value: (domNode: HTMLElement) => ImageAttributes;
  match: (url: string) => boolean;
  sanitize: (url: string) => string;
}

// eslint-disable-next-line import/no-mutable-exports
let ExtImageFormat: QuillDependent<ExtendedImageConstructor> = {};

if (Quill) {
  const Image: ImageBlotConstructor<ExtendedImageValue> = Quill.import('formats/image');

  ExtImageFormat = class ExtImage extends Image {
    static create(data: ExtendedImageValue): HTMLElement {
      // @ts-expect-error a string image value has no src
      const SRC: ExtendedImageValue = data?.src || data;
      const node = super.create(SRC);

      if (isObject(data)) {
        const setAttribute = (
          attr: ImageAttributeName,
          value: ImageAttributes[ImageAttributeName],
        ): void => {
          if (data[attr]) {
            node.setAttribute(attr, String(value));
          }
        };
        setAttribute('alt', data.alt);
        setAttribute('width', data.width);
        setAttribute('height', data.height);
      }

      return node;
    }

    static formats(domNode: HTMLElement): ExtendedImageFormats {
      const formats: ExtendedImageFormats = super.formats(domNode);

      formats.imageSrc = domNode.getAttribute('src');

      return formats;
    }

    formats(): Record<string, unknown> {
      const formats = super.formats();
      const floatValue = this.domNode.style.float;

      if (floatValue) {
        formats.float = floatValue;
      }

      return formats;
    }

    format(name: string, value: unknown): void {
      if (name === 'float') {
        // @ts-expect-error format value is untyped; the CSSOM coerces it (null clears the float)
        this.domNode.style[name] = value;
      } else {
        super.format(name, value);
      }
    }

    static value(domNode: HTMLElement): ImageAttributes {
      return {
        src: domNode.getAttribute('src'),
        width: domNode.getAttribute('width'),
        height: domNode.getAttribute('height'),
        alt: domNode.getAttribute('alt'),
      };
    }
  };
  ExtImageFormat.blotName = 'extendedImage';
}

export default ExtImageFormat;
