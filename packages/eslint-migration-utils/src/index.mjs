import { rules as stylisticRules } from '@eslint-stylistic/metadata';

const REMOVED_TYPESCRIPT_RULES = [
    '@typescript-eslint/no-throw-literal',
    '@typescript-eslint/ban-types',
];

// TODO Salimov: We need to remove this function after updating eslint-config-devextreme
export const changeRulesToStylistic = (devExtremeRules) => (
    {
        ...Object.fromEntries(Object
            .entries(devExtremeRules)
            .filter(([key]) => !REMOVED_TYPESCRIPT_RULES.includes(key))
            .map(([key, value]) => {
                const tsRulePrefix = '@typescript-eslint/';
                const isTsRule = key.startsWith(tsRulePrefix);
                const normalizedKey = isTsRule ? key.replace(tsRulePrefix, '') : key;

                const rule = stylisticRules.find((r) => normalizedKey === r.name);
                const newKey = rule ? `@stylistic/${rule.name}` : key;
                
                return [newKey, value];
            })),
    }
);