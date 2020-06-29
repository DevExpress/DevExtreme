
import ko from 'knockout';

const getClosestNodeWithContext = (node) => {
    const context = ko.contextFor(node);
    if(!context && node.parentNode) {
        return getClosestNodeWithContext(node.parentNode);
    }

    return node;
};

export { getClosestNodeWithContext };
