function getListType(matches) {
    const prefix = matches[1];
    return prefix.match(/\S+\./) ? 'ordered' : 'bullet';
}

function getIndent(node) {
    const style = node.getAttribute('style');

    if(style) {
        const level = style
            .replace(/\n+/g, '')
            .match(/level(\d+)/);

        return level ? level[1] - 1 : 0;
    } else {
        return false;
    }
}

function removeNewLineChar(operations) {
    let newLineOperation = operations[operations.length - 1];
    newLineOperation.insert = newLineOperation.insert.trim();
}

const getMatcher = (quill) => {
    const Delta = quill.import('delta');

    return (node, delta) => {
        let ops = delta.ops.slice();

        let insertOperation = ops[0];
        insertOperation.insert = insertOperation.insert.replace(/^\s+/, '');
        const listDecoratorMatches = insertOperation.insert.match(/^(\S+)\s+/);
        const indent = listDecoratorMatches && getIndent(node);

        if(!listDecoratorMatches || indent === false) {
            return delta;
        }

        insertOperation.insert = insertOperation.insert.substring(listDecoratorMatches[0].length, insertOperation.insert.length);

        removeNewLineChar(ops);

        ops.push({ insert: '\n', attributes: { list: getListType(listDecoratorMatches), indent } });
        return new Delta(ops);
    };
};

export default getMatcher;
