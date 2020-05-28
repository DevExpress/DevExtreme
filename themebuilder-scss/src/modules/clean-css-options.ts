// TODO we need to share this option with scss compiler (in gulp task)

import CleanCSS from 'clean-css';

const config: CleanCSS.Options = {
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
      betweenSelectors: true,
    },
    breakWith: '\n',
    indentBy: 2,
    indentWith: 'space',
    spaces: {
      aroundSelectorRelation: true,
      beforeBlockBegins: true,
      beforeValue: true,
    },
    wrapAt: false,
    semicolonAfterLastProperty: true,
  },
  level: 2,
};

export default config;
