/**
 * ESLint rule: no-is-ready-without-expect
 *
 * Disallows calling `.isReady()` outside of `t.expect()`.
 *
 * Correct:
 *   await t.expect(dataGrid.isReady()).ok()
 * or
 *   await t
 *     .expect(dataGrid.isReady())
 *     .ok()
 *
 * Incorrect:
 *   await dataGrid.isReady()
 *   dataGrid.isReady()
 *   const ready = await dataGrid.isReady()
 */

/* eslint-disable spellcheck/spell-checker */
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow calling .isReady() outside of t.expect()',
        },
        messages: {
            noIsReadyWithoutExpect:
                'isReady() must be used inside t.expect(), e.g.: await t.expect(widget.isReady()).ok()',
        },
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;

                if (
                    callee.type !== 'MemberExpression'
                    || callee.property.type !== 'Identifier'
                    || callee.property.name !== 'isReady'
                ) {
                    return;
                }

                // Walk up to find if this call is an argument of .expect()
                let current = node;
                let parent = current.parent;

                while(parent) {
                    if (
                        parent.type === 'CallExpression'
                        && parent.callee.type === 'MemberExpression'
                        && parent.callee.property.type === 'Identifier'
                        && parent.callee.property.name === 'expect'
                    ) {
                        // isReady() is inside .expect() — allowed
                        return;
                    }

                    current = parent;
                    parent = current.parent;
                }

                context.report({
                    node,
                    messageId: 'noIsReadyWithoutExpect',
                });
            },
        };
    },
};
