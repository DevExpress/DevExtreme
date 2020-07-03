import domAdapter from '../../core/dom_adapter';
import { getWindow } from './window';
import $ from '../../core/renderer';

const window = getWindow();

function getMarkup(element, backgroundColor) {
    const temp = domAdapter.createElement('div');
    const clone = element.cloneNode(true);
    if(backgroundColor) {
        $(clone).css('backgroundColor', backgroundColor);
    }
    temp.appendChild(clone);
    return temp.innerHTML;
}

function fixNamespaces(markup) {
    let first = true;

    if(markup.indexOf('xmlns:xlink') === -1) {
        markup = markup.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    markup = markup.replace(/xmlns="[\s\S]*?"/gi, function(match) {
        if(!first) return '';
        first = false;
        return match;
    });

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
        .replace(/&shy;/gi, '&#173;');
}

export function getSvgMarkup(element, backgroundColor) {
    return fixNamespaces(decodeHtmlEntities(getMarkup(element, backgroundColor)));
}

export function getSvgElement(markup) {
    return domAdapter.isNode(markup)
        ? markup
        : (new window.DOMParser()
            .parseFromString(markup, 'image/svg+xml')
            .childNodes[0]);
}
