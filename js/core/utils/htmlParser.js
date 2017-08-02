"use strict";

var isTagName = (/<([a-z][^\/\0>\x20\t\r\n\f]+)/i);

var $ = require("../renderer");
var merge = require("./array").merge;

var tagWrappers = {
    default: {
        tagsCount: 0,
        startTags: "",
        endTags: ""
    },
    thead: {
        tagsCount: 1,
        startTags: "<table>",
        endTags: "</table>"
    },
    td: {
        tagsCount: 3,
        startTags: "<table><tbody><tr>",
        endTags: "</tr></tbody></table>"
    },
    col: {
        tagsCount: 2,
        startTags: "<table><colgroup>",
        endTags: "</colgroup></table>"
    },
    tr: {
        tagsCount: 2,
        startTags: "<table><tbody>",
        endTags: "</tbody></table>"
    },
};

tagWrappers.tbody = tagWrappers.colgroup = tagWrappers.caption = tagWrappers.tfoot = tagWrappers.thead;
tagWrappers.th = tagWrappers.td;

var removeScriptTags = function(fragment) {
    var searchResult = fragment.querySelectorAll("script");

    for(var i = 0; i < searchResult.length; i++) {
        $(searchResult[i]).remove();
    }
};

function buildFragment(html) {
    var fragment = document.createDocumentFragment();
    var container = fragment.appendChild(document.createElement("div"));

    var firstRootTag = (isTagName.exec(html) || [ "", "" ])[1].toLowerCase();
    var tagWrapper = tagWrappers[firstRootTag] || tagWrappers.default;

    container.innerHTML = tagWrapper.startTags + html + tagWrapper.endTags;

    removeScriptTags(fragment);

    for(var i = 0; i < tagWrapper.tagsCount; i++) {
        container = container.lastChild;
    }

    var nodes = merge([], container.childNodes);

    return nodes;
}

var parseHTML = function(html, context) {
    if(typeof html !== "string") {
        return null;
    }

    var parsed = buildFragment(html);

    return parsed;
};

module.exports = parseHTML;
