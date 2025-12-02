module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow Deferred in favor of native Promise',
            recommended: false,
        },
        messages: {
            noDeferred: 'Use native Promise instead of Deferred.',
        },
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source && node.source.value;
                if(typeof source !== 'string') return;
                const specs = node.specifiers || [];
                for(let i = 0; i < specs.length; i += 1) {
                    const spec = specs[i];
                    if(spec.imported && spec.imported.name === 'Deferred') {
                        context.report({ node: spec, messageId: 'noDeferred' });
                    }
                }
            },
            Identifier(node) {
                if(node.name === 'Deferred') {
                    context.report({ node, messageId: 'noDeferred' });
                }
            },
            NewExpression(node) {
                // eslint-disable-next-line spellcheck/spell-checker
                if(node.callee && node.callee.name === 'Deferred') {
                    context.report({ node, messageId: 'noDeferred' });
                }
            },
            MemberExpression(node) {
                // e.g., $.Deferred()
                if(node.property && node.property.type === 'Identifier' && node.property.name === 'Deferred') {
                    context.report({ node, messageId: 'noDeferred' });
                }
            },
        };
    },
};


