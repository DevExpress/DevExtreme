module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer switch(true) over long if/else chains',
            recommended: false,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    minBranches: { type: 'integer', minimum: 2 },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            preferSwitchTrue: 'Prefer switch(true) over this if/else chain.',
        },
    },
    create(context) {
        const options = context.options && context.options[0] || {};
        const minBranches = Math.max(2, options.minBranches || 3); // total conditional branches (if + else-if's)

        function countChainBranches(ifNode) {
            let branches = 1; // start with initial if
            let current = ifNode.alternate;
            while(current && current.type === 'IfStatement') {
                branches += 1;
                current = current.alternate;
            }
            return branches;
        }

        return {
            IfStatement(node) {
                // Only evaluate at the head of the chain (parent isn't an else-if)
                const parent = node.parent;
                const isElseIf = parent && parent.type === 'IfStatement' && parent.alternate === node;
                if(isElseIf) return;

                const branches = countChainBranches(node);
                if(branches >= minBranches) {
                    context.report({ node, messageId: 'preferSwitchTrue' });
                }
            },
        };
    },
};


