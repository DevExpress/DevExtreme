
import ko from 'knockout';
let getClosestNodeWithContext;

if(ko) {
    getClosestNodeWithContext = (node) => {
        const context = ko.contextFor(node);
        if(!context && node.parentNode) {
            return getClosestNodeWithContext(node.parentNode);
        }

        return node;
    };
}

export { getClosestNodeWithContext };
