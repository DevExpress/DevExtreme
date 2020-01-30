module.exports = [
    // each object has one of these tasks:
    // widget - widget reference
    // comment - comment
    // newline - just new line
    { content: 'ex. core', task: 'comment' },
    // mixins - in place @use
    // typography
    { content: 'typography', task: 'widget', private: true },
    // common - used in typogrphy, in place @use
    // icons
    { content: 'icons', task: 'widget', private: true },
    // widget
    { content: 'widget', task: 'widget', private: true },
    // card
    { content: 'card', task: 'widget' },
    // fieldset
    { content: 'fieldset', task: 'widget' },


    { content: 'public widgets', task: 'comment' },
    // box
    { content: 'box', task: 'widget' },
    // responsivebox
    { content: 'responsiveBox', task: 'widget' },
    // button
    { content: 'button', task: 'widget' },
    // buttonGroup
    { content: 'buttonGroup', task: 'widget' },
    // scrollable
    { content: 'scrollable', task: 'widget', private: true },
    // scrollview
    { content: 'scrollView', task: 'widget' },
    // checkbox
    { content: 'checkBox', task: 'widget' },
    // switch
    { content: 'switch', task: 'widget' },
    // badge
    { content: 'badge', task: 'widget', private: true },
    // tabs
    { content: 'tabs', task: 'widget' },
    // navBar
    { content: 'navBar', task: 'widget' },
    // validation
    { content: 'validation', task: 'widget', private: true },
    // textEditor
    { content: 'textEditor', task: 'widget', private: true },
    // textBox
    { content: 'textBox', task: 'widget', private: true },
    // dropDownEditor
    { content: 'dropDownEditor', task: 'widget', private: true },
    // dropDownBox
    { content: 'dropDownBox', task: 'widget' },
    { task: 'newline' }
];
