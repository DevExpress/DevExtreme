import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isRenderer, isString } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import { copyResolvedStyles } from '@ts/core/utils/css_variables';

const window = getWindow();

function getMarkup(element: Node, backgroundColor?: string): string {
  const clone = element.cloneNode(true);
  const serializer = new XMLSerializer();

  copyResolvedStyles(element as Element, clone as Element);

  if (backgroundColor) {
    $(clone).css('backgroundColor', backgroundColor);
  }

  return serializer.serializeToString(clone);
}

function fixNamespaces(markup: string): string {
  let fixedMarkup = markup;

  if (!markup.includes('xmlns:xlink')) {
    fixedMarkup = markup.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  return fixedMarkup.replace(/xmlns:NS1="[\s\S]*?"/gi, '')
    .replace(/NS1:xmlns:xlink="([\s\S]*?)"/gi, 'xmlns:xlink="$1"');
}

// T428345 we decode only restricted HTML entities, looks like other entities do not cause problems
// as they presented as symbols itself, not named entities
function decodeHtmlEntities(markup: string): string {
  return markup.replace(/&quot;/gi, '&#34;')
    .replace(/&amp;/gi, '&#38;')
    .replace(/&apos;/gi, '&#39;')
    .replace(/&lt;/gi, '&#60;')
    .replace(/&gt;/gi, '&#62;')
    .replace(/&nbsp;/gi, '&#160;')
    .replace(/\u00A0/g, '&#160;')
    .replace(/&shy;/gi, '&#173;')
    .replace(/\u00AD/g, '&#173;');
}

export const HIDDEN_FOR_EXPORT = 'hidden-for-export';

export function getSvgMarkup(element: Node, backgroundColor?: string): string {
  return fixNamespaces(decodeHtmlEntities(getMarkup(element, backgroundColor)));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers read Element members
export function getSvgElement(markup: string | Node | dxElementWrapper): any {
  if (isString(markup)) {
    // @ts-expect-error DOMParser do not exist in std window type
    const parsedMarkup = new window.DOMParser()
      .parseFromString(markup, 'image/svg+xml')
      .childNodes[0];

    return parsedMarkup;
  } if (domAdapter.isNode(markup)) {
    return markup;
  } if (isRenderer(markup)) {
    return markup.get(0);
  }

  return undefined;
}

export default {
  getSvgElement,
  getSvgMarkup,
  HIDDEN_FOR_EXPORT,
};
