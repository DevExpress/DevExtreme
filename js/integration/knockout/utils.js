
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import $ from '../../core/renderer';

export const getClosestNodeWithContext = (node) => {
    const context = ko.contextFor(node);
    if(!context && node.parentNode) {
        return getClosestNodeWithContext(node.parentNode);
    }

    return node;
};
export const getClosestNodeWithKoCreation = (node) => {
    const $el = $(node);
    const data = $el.data();
    const hasFlag = data && data['dxKoCreation'];
    if(hasFlag) {
        return node;
    }
    if(node.parentNode) {
        return getClosestNodeWithKoCreation(node.parentNode);
    }
    return null;
};
