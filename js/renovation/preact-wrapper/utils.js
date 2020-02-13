import { h } from 'preact';

export const HTMLToPreact = (node, ...restChildren) => {
    // NOTE: nodeType === 3 => text node
    if(node.nodeType === 3) {
        return node.wholeText;
    }

    const tag = node.tagName;
    const childNodes = node.childNodes;

    const children = [];
    for(let i = 0; i < childNodes.length; i++) {
        children.push(HTMLToPreact(childNodes[i]));
    }

    const attributes = [...node.attributes].reduce((result, attr) => {
        result[attr.name] = attr.value;
        return result;
    }, {});

    return h(tag, attributes, [...children, ...restChildren]);
};
