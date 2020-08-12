
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';

export const getClosestNodeWithContext = (node) => {
    const context = ko.contextFor(node);
    if(!context && node.parentNode) {
        return getClosestNodeWithContext(node.parentNode);
    }

    return node;
};
