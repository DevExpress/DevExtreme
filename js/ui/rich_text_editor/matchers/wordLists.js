function getListType(matches) {
    const prefix = matches[1];
    return prefix.match(/\S+\./) ? 'ordered' : 'bullet';
}

function getIndent(node) {
    const style = node.getAttribute('style').replace(/\n+/g, '');
    const level = style.match(/level(\d+)/);

    return level ? level[1] - 1 : 0;
}

const getMatcher = (quill) => {
    const Delta = quill.import("delta");

    return (node, delta) => {
        let ops = delta.ops.slice();

        let firstOperation = ops[0];
        firstOperation.insert = firstOperation.insert.replace(/^\s+/, "");
        const firstMatch = firstOperation.insert.match(/^(\S+)\s+/);

        if(!firstMatch) {
            return delta;
        }

        firstOperation.insert = firstOperation.insert.substring(firstMatch[0].length, firstOperation.insert.length);
        const indent = getIndent(node);

        ops.push({ insert: '\n', attributes: { list: getListType(firstMatch), indent } });

        return new Delta(ops);
    };
};

module.exports = getMatcher;
