module.exports = {
    meta: {
        type: 'suggestion',
        //fixable: 'code',
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.importKind === 'value' && node.specifiers.length > 1
                    && node.specifiers.some(
                        (specifier) => specifier.type === 'ImportDefaultSpecifier')
                ) {
                    context.report({
                        node,
                        message: 'Do not use mixed default and named imports at the same row!',
                    });
                }
            },
        };
    },
}
