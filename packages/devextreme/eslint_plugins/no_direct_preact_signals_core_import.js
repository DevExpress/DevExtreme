/* eslint-disable spellcheck/spell-checker */

const INVALID_IMPORT = '@preact/signals-core';
const STATE_MANAGER_PATH = '/core/state_manager/';
const VALID_IMPORT = '"@ts/core/state_manager/index"';

function validate(context, node, sourceNode) {
    const filename = context.getFilename();
    const isStateManagerModule = filename.includes(STATE_MANAGER_PATH);

    if(!isStateManagerModule) {
        context.report({
            node: sourceNode,
            messageId: 'noDirectImport',
            fix(fixer) {
                return fixer.replaceText(sourceNode, VALID_IMPORT);
            },
        });
    }
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent direct imports from @preact/signals-core and enforce usage of the state manager.',
        },
        fixable: 'code',
        schema: [],
        messages: {
            noDirectImport: 'Direct imports from "@preact/signals-core" are not allowed. Use "@ts/core/state_manager/index" instead.',
        },
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                if(node.source.value === INVALID_IMPORT) {
                    validate(context, node, node.source);
                }
            },

            ImportExpression(node) {
                if(
                    node.source.type === 'Literal' &&
                    node.source.value === INVALID_IMPORT
                ) {
                    validate(context, node, node.source);
                }
            },

            CallExpression(node) {
                if(
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' &&
                    node.arguments.length === 1 &&
                    node.arguments[0].type === 'Literal' &&
                    node.arguments[0].value === INVALID_IMPORT
                ) {
                    validate(context, node, node.arguments[0]);
                }
            },
        };
    },
};
