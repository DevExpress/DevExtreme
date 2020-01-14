const merge = require('./array').merge;
const domAdapter = require('../dom_adapter');

const isTagName = (/<([a-z][^/\0>\x20\t\r\n\f]+)/i);

const tagWrappers = {
    default: {
        tagsCount: 0,
        startTags: '',
        endTags: ''
    },
    thead: {
        tagsCount: 1,
        startTags: '<table>',
        endTags: '</table>'
    },
    td: {
        tagsCount: 3,
        startTags: '<table><tbody><tr>',
        endTags: '</tr></tbody></table>'
    },
    col: {
        tagsCount: 2,
        startTags: '<table><colgroup>',
        endTags: '</colgroup></table>'
    },
    tr: {
        tagsCount: 2,
        startTags: '<table><tbody>',
        endTags: '</tbody></table>'
    },
};

tagWrappers.tbody = tagWrappers.colgroup = tagWrappers.caption = tagWrappers.tfoot = tagWrappers.thead;
tagWrappers.th = tagWrappers.td;

const parseHTML = function(html) {
    if(typeof html !== 'string') {
        return null;
    }

    const fragment = domAdapter.createDocumentFragment();
    let container = fragment.appendChild(domAdapter.createElement('div'));
    const tags = isTagName.exec(html);
    const firstRootTag = tags && tags[1].toLowerCase();
    const tagWrapper = tagWrappers[firstRootTag] || tagWrappers.default;

    container.innerHTML = tagWrapper.startTags + html + tagWrapper.endTags;

    for(let i = 0; i < tagWrapper.tagsCount; i++) {
        container = container.lastChild;
    }

    return merge([], container.childNodes);
};

const isTablePart = function(html) {
    const tags = isTagName.exec(html);
    return tags && tags[1] in tagWrappers;
};

exports.parseHTML = parseHTML;
exports.isTablePart = isTablePart;
