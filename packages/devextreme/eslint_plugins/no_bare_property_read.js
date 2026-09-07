const TRANSPARENT_WRAPPERS = [
    'ChainExpression',
    'TSNonNullExpression',
    'TSAsExpression',
];

function collectBareReads(node) {
    if(!node) {
        return [];
    }

    if(node.type === 'MemberExpression') {
        return [node];
    }

    if(TRANSPARENT_WRAPPERS.includes(node.type)) {
        return collectBareReads(node.expression);
    }

    if(node.type === 'UnaryExpression' && node.operator === 'void') {
        return collectBareReads(node.argument);
    }

    if(node.type === 'SequenceExpression') {
        return node.expressions.flatMap((expression) => collectBareReads(expression));
    }

    return [];
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent standalone property reads, which minifiers with compress.pure_getters delete.',
        },
        schema: [],
        messages: {
            bareRead: 'A standalone property read is deleted by minifiers with compress.pure_getters (T1334012). If this is a signal subscription, use "track(...)" from "@ts/core/state_manager/index"; otherwise delete the statement.',
        },
    },

    create(context) {
        return {
            ExpressionStatement(node) {
                collectBareReads(node.expression).forEach((read) => {
                    context.report({
                        node: read,
                        messageId: 'bareRead',
                    });
                });
            },
        };
    },
};
