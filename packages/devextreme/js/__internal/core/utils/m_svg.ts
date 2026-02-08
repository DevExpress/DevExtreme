import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { isRenderer, isString } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();

function getMarkup(element, backgroundColor) {
  const clone = element.cloneNode(true);
  const serializer = new XMLSerializer();

  if (backgroundColor) {
    $(clone).css('backgroundColor', backgroundColor);
  }

  return serializer.serializeToString(clone);
}

function fixNamespaces(markup) {
  if (markup.indexOf('xmlns:xlink') === -1) {
    markup = markup.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  return markup.replace(/xmlns:NS1="[\s\S]*?"/gi, '')
    .replace(/NS1:xmlns:xlink="([\s\S]*?)"/gi, 'xmlns:xlink="$1"');
}

// T428345 we decode only restricted HTML entities, looks like other entities do not cause problems
// as they presented as symbols itself, not named entities
function decodeHtmlEntities(markup) {
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

export function getSvgMarkup(element, backgroundColor?) {
  return fixNamespaces(decodeHtmlEntities(getMarkup(element, backgroundColor)));
}

export function getSvgElement(markup) {
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
}

export default {
  getSvgElement,
  getSvgMarkup,
  HIDDEN_FOR_EXPORT,
};
