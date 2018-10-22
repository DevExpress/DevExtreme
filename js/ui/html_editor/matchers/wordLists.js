function getListType(matches) {
    const prefix = matches[1];
    return prefix.match(/\S+\./) ? 'ordered' : 'bullet';
}

function getIndent(node) {
    const style = node.getAttribute('style').replace(/\n+/g, '');
    const level = style.match(/level(\d+)/);

    return level ? level[1] - 1 : 0;
}

function removeNewLineChar(operations) {
    let newLineOperation = operations[operations.length - 1];
    newLineOperation.insert = newLineOperation.insert.trim();
}

const getMatcher = (quill) => {
    const Delta = quill.import("delta");

    return (node, delta) => {
        let ops = delta.ops.slice();

        let insertOperation = ops[0];
        insertOperation.insert = insertOperation.insert.replace(/^\s+/, "");
        const listDecoratorMatches = insertOperation.insert.match(/^(\S+)\s+/);

        if(!listDecoratorMatches) {
            return delta;
        }

        insertOperation.insert = insertOperation.insert.substring(listDecoratorMatches[0].length, insertOperation.insert.length);
        const indent = getIndent(node);

        removeNewLineChar(ops);

        ops.push({ insert: '\n', attributes: { list: getListType(listDecoratorMatches), indent } });
        return new Delta(ops);
    };
};

export default getMatcher;
