function isLine(node) {
    if(node.childNodes.length === 0) {
        return false;
    }

    return [
        'address',
        'article',
        'blockquote',
        'canvas',
        'dd',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'iframe',
        'li',
        'main',
        'nav',
        'ol',
        'output',
        'p',
        'pre',
        'section',
        'table',
        'td',
        'tr',
        'ul',
        'video',
    ].indexOf(node.tagName.toLowerCase()) !== -1;
}

function deltaEndsWithNewLine(delta) {
    const { insert: text } = delta.ops[delta.ops.length - 1] || {};

    if(typeof text !== 'string') {
        return false;
    }

    return text.slice(-1) === '\n';
}

const getMatcher = () => {
    return (node, delta) => {
        if(!deltaEndsWithNewLine(delta)) {
            if(isLine(node)) {
                return delta.insert('\n');
            }
        }
        return delta;
    };
};

export default getMatcher;
