import type CleanCSS from 'clean-css';

export const cleanCssOptions: CleanCSS.Options = {
    rebase: false,
    format: {
        breaks: {
            afterAtRule: true,
            afterBlockBegins: true,
            afterBlockEnds: true,
            afterComment: false,
            afterProperty: true,
            afterRuleBegins: true,
            afterRuleEnds: true,
            beforeBlockEnds: true,
            betweenSelectors: true
        },
        breakWith: '\n',
        indentBy: 2,
        indentWith: 'space',
        spaces: {
            aroundSelectorRelation: true,
            beforeBlockBegins: true,
            beforeValue: true
        },
        wrapAt: false,
    },
    level: {
        1: {
            all: false,
            semicolonAfterLastProperty: true
        },
        2: {
            all: true
        }
    }
};
