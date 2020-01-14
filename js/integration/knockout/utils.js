
const ko = require('knockout');

const getClosestNodeWithContext = (node) => {
    const context = ko.contextFor(node);
    if(!context && node.parentNode) {
        return getClosestNodeWithContext(node.parentNode);
    }

    return node;
};

module.exports.getClosestNodeWithContext = getClosestNodeWithContext;
