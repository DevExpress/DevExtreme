
const ko = require("knockout");

const getNodeWithContext = (node) => {
    var context = ko.contextFor(node);
    if(!context && node.parentNode) {
        return getNodeWithContext(node.parentNode);
    }

    return node;
};

module.exports.getNodeWithContext = getNodeWithContext;
