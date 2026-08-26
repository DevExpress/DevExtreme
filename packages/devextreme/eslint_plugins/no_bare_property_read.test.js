/* eslint-disable spellcheck/spell-checker */
const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const rule = require('./no_bare_property_read');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

const tsRuleTester = new RuleTester({
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

const bareRead = (count = 1) => new Array(count).fill({
    messageId: 'bareRead',
    type: 'MemberExpression',
});

ruleTester.run('no-bare-property-read', rule, {
    valid: [
        'track(this.visibleColumnsLayout.value);',
        'const layout = this.visibleColumnsLayout.value;',
        'this.items.value = [];',
        'this.dataController.items.value.forEach(handler);',
        'if(this.isLoaded.value) { load(); }',
        'delete cache.items;',
        'load();',
        '\'use strict\';',
    ],

    invalid: [
        {
            code: 'this.visibleColumnsLayout.value;',
            errors: bareRead(),
        },
        {
            code: 'this.dataController.items.value;',
            errors: bareRead(),
        },
        {
            code: 'options[\'value\'];',
            errors: bareRead(),
        },
        {
            // `void` slips past the stock no-unused-expressions rule, and terser deletes it too
            code: 'void this.componentDescription.value;',
            errors: bareRead(),
        },
        {
            code: 'this.items.value, this.isLoaded.value;',
            errors: bareRead(2),
        },
        {
            code: 'this.searchController?.highlightTextOptions.value;',
            errors: bareRead(),
        },
    ],
});

tsRuleTester.run('no-bare-property-read (typescript)', rule, {
    valid: [
        'track(this.actionOption.value as unknown);',
    ],

    invalid: [
        {
            code: 'this.actionOption!.value;',
            errors: bareRead(),
        },
        {
            code: 'this.actionOption.value as unknown;',
            errors: bareRead(),
        },
    ],
});
