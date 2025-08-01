import { isObject } from '@js/core/utils/type';
import Quill from 'devextreme-quill';

import EmptyModule from '../modules/empty';
import type { BlotConstructor } from '../types/quill';

interface LinkData {
  href?: string;
  text?: string;
  target?: boolean;
}

interface LinkFormats {
  href: string | null;
  target: string | null;
}

type ConditionalLinkBlot = BlotConstructor | typeof EmptyModule;

const ExtLink = ((): ConditionalLinkBlot => {
  if (!Quill) return EmptyModule;

  const Link = Quill.import('formats/link');

  return class ExtendedLink extends Link {
    static create(data: string | LinkData): HTMLAnchorElement {
      const HREF = (typeof data === 'object' && data?.href) ?? data;
      const node = super.create(HREF) as HTMLAnchorElement;

      if (isObject(data)) {
        const linkData = data;
        if (linkData.text) {
          node.innerText = linkData.text;
        }
        if (!linkData.target) {
          node.removeAttribute('target');
        }
      }

      return node;
    }

    static formats(domNode: HTMLAnchorElement): LinkFormats {
      return {
        href: domNode.getAttribute('href'),
        target: domNode.getAttribute('target'),
      };
    }

    formats(): Record<string, unknown> {
      const formats = super.formats() as Record<string, unknown>;
      const { href, target } = ExtendedLink.formats(this.domNode as HTMLAnchorElement);

      formats.link = href;
      formats.target = target;

      return formats;
    }

    format(name: string, value: unknown): void {
      if (name === 'link' && isObject(value)) {
        const linkValue = value as LinkData;
        if (linkValue.text) {
          (this.domNode as HTMLAnchorElement).innerText = linkValue.text;
        }
        if (linkValue.target) {
          (this.domNode as HTMLAnchorElement).setAttribute('target', '_blank');
        } else {
          (this.domNode as HTMLAnchorElement).removeAttribute('target');
        }
        if (linkValue.href) {
          (this.domNode as HTMLAnchorElement).setAttribute('href', linkValue.href);
        }
      } else {
        super.format(name, value);
      }
    }

    static value(domNode: HTMLAnchorElement): LinkData {
      return {
        href: domNode.getAttribute('href') ?? '',
        text: domNode.innerText,
        target: !!domNode.getAttribute('target'),
      };
    }
  };
})();

export default ExtLink;
