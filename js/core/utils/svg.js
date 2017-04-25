"use strict";

function getMarkup(element) {
    var temp = document.createElement('div');
    temp.appendChild(element.cloneNode(true));
    return temp.innerHTML;
}

function fixIENamespaces(markup) {
    var first = true;

    markup = markup.replace(/xmlns="[\s\S]*?"/gi, function(match) {
        if(!first) return "";
        first = false;
        return match;
    });

    return markup.replace(/xmlns:NS1="[\s\S]*?"/gi, "")
        .replace(/NS1:xmlns:xlink="([\s\S]*?)"/gi, 'xmlns:xlink="$1"');
}

//T428345 we decode only restricted HTML entities, looks like other entities do not cause problems
//as they presented as symbols itself, not named entities
function decodeHtmlEntities(markup) {
    return markup.replace(/&quot;/gi, "&#34;")
        .replace(/&amp;/gi, "&#38;")
        .replace(/&apos;/gi, "&#39;")
        .replace(/&lt;/gi, "&#60;")
        .replace(/&gt;/gi, "&#62;")
        .replace(/&nbsp;/gi, "&#160;")
        .replace(/&shy;/gi, "&#173;");
}

exports.getSvgMarkup = function(element) {
    return fixIENamespaces(decodeHtmlEntities(getMarkup(element)));
};
