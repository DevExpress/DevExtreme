'use strict';
const experimental_utils = require('@typescript-eslint/experimental-utils');
const util = require('@typescript-eslint/eslint-plugin/dist/util');

module.exports = {
    name: 'no-non-null-assertion',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallows non-null assertions using the `!` postfix operator',
            category: 'Stylistic Issues',
            recommended: 'warn',
            suggestion: true,
        },
        messages: {
            noNonNull: 'Forbidden non-null assertion.',
            suggestOptionalChain: 'Consider using the optional chain operator `?.` instead. This operator includes runtime checks, so it is safer than the compile-only non-null assertion operator.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        const parserServices = util.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        return {
            TSNonNullExpression(node) {
                let _a; let _b;
                const suggest = [];
                function convertTokenToOptional(replacement) {
                    return (fixer) => {
                        const operator = sourceCode.getTokenAfter(node.expression, util.isNonNullAssertionPunctuator);
                        if(operator) {
                            return fixer.replaceText(operator, replacement);
                        }
                        return null;
                    };
                }
                function removeToken() {
                    return (fixer) => {
                        const operator = sourceCode.getTokenAfter(node.expression, util.isNonNullAssertionPunctuator);
                        if(operator) {
                            return fixer.remove(operator);
                        }
                        return null;
                    };
                }
                if(node.expression) {
                    const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node.expression.object);
                    const ownerType = checker.getTypeAtLocation(originalNode);
                    if(ownerType.aliasSymbol) {
                        const ownerTypeName = ownerType.aliasSymbol.escapedName;
                        if(ownerTypeName === 'RefObject') {
                            return;
                        }
                    }
                }
                if(((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === experimental_utils.AST_NODE_TYPES.MemberExpression &&
                    node.parent.object === node) {
                    if(!node.parent.optional) {
                        if(node.parent.computed) {
                            // it is x![y]?.z
                            suggest.push({
                                messageId: 'suggestOptionalChain',
                                fix: convertTokenToOptional('?.'),
                            });
                        } else {
                            // it is x!.y?.z
                            suggest.push({
                                messageId: 'suggestOptionalChain',
                                fix: convertTokenToOptional('?'),
                            });
                        }
                    } else {
                        if(node.parent.computed) {
                            // it is x!?.[y].z
                            suggest.push({
                                messageId: 'suggestOptionalChain',
                                fix: removeToken(),
                            });
                        } else {
                            // it is x!?.y.z
                            suggest.push({
                                messageId: 'suggestOptionalChain',
                                fix: removeToken(),
                            });
                        }
                    }
                } else if(((_b = node.parent) === null || _b === void 0 ? void 0 : _b.type) === experimental_utils.AST_NODE_TYPES.CallExpression &&
                    // eslint-disable-next-line spellcheck/spell-checker
                    node.parent.callee === node) {
                    if(!node.parent.optional) {
                        // it is x.y?.z!()
                        suggest.push({
                            messageId: 'suggestOptionalChain',
                            fix: convertTokenToOptional('?.'),
                        });
                    } else {
                        // it is x.y.z!?.()
                        suggest.push({
                            messageId: 'suggestOptionalChain',
                            fix: removeToken(),
                        });
                    }
                }
                context.report({
                    node,
                    messageId: 'noNonNull',
                    suggest,
                });
            },
        };
    },
};
