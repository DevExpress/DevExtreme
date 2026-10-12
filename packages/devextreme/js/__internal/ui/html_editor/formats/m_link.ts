import { isObject } from '@js/core/utils/type';
import Quill from 'devextreme-quill';

import type {
  BlotConstructorBase,
  LinkBlotConstructor,
  LinkData,
  QuillDependent,
} from '../types';

type LinkValue = string | LinkData;

/** The `link` blot class */
interface ExtendedLinkConstructor extends BlotConstructorBase {
  create: (data: LinkValue) => HTMLElement;
  formats: (domNode: HTMLElement) => Pick<LinkData, 'href' | 'target'>;
  value: (domNode: HTMLElement) => LinkData;
  sanitize: (url: string) => string;
  PROTOCOL_WHITELIST: string[];
  SANITIZED_URL: string;
}

// eslint-disable-next-line import/no-mutable-exports
let ExtLinkFormat: QuillDependent<ExtendedLinkConstructor> = {};

if (Quill) {
  const Link: LinkBlotConstructor<LinkValue> = Quill.import('formats/link');

  ExtLinkFormat = class ExtLink extends Link {
    static create(data: LinkValue): HTMLElement {
      // @ts-expect-error a string link value has no href
      const HREF: LinkValue = data?.href ?? data;
      const node = super.create(HREF);

      if (isObject(data)) {
        if (data.text) {
          node.innerText = data.text;
        }
        if (!data.target) {
          node.removeAttribute('target');
        }
      }

      return node;
    }

    static formats(domNode: HTMLElement): Pick<LinkData, 'href' | 'target'> {
      return {
        href: domNode.getAttribute('href'),
        target: domNode.getAttribute('target'),
      };
    }

    formats(): Record<string, unknown> {
      const formats = super.formats();
      const { href, target } = ExtLink.formats(this.domNode);

      formats.link = href;
      formats.target = target;

      return formats;
    }

    format(name: string, value: unknown): void {
      if (name === 'link' && isObject(value)) {
        // @ts-expect-error the format value is untyped; isObject narrows it only to `object`
        if (value.text) {
          // @ts-expect-error the format value is untyped; isObject narrows it only to `object`
          this.domNode.innerText = value.text;
        }
        // @ts-expect-error the format value is untyped; isObject narrows it only to `object`
        if (value.target) {
          this.domNode.setAttribute('target', '_blank');
        } else {
          this.domNode.removeAttribute('target');
        }
        // @ts-expect-error the format value is untyped; isObject narrows it only to `object`
        this.domNode.setAttribute('href', value.href);
      } else {
        super.format(name, value);
      }
    }

    static value(domNode: HTMLElement): LinkData {
      return {
        href: domNode.getAttribute('href'),
        text: domNode.innerText,
        target: !!domNode.getAttribute('target'),
      };
    }
  };
}

export default ExtLinkFormat;
