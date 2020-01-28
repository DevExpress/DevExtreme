module.exports = [
    // each object has one of these tasks:
    // widget - widget reference
    // comment - comment
    // newline - just new line
    { content: 'ex. core', task: 'comment' },
    // mixins - in place @use
    // typography
    { content: 'typography', task: 'widget' },
    // common - used in typogrphy, in place @use
    // icons
    { content: 'icons', task: 'widget' },
    // widget
    { content: 'widget', task: 'widget' },
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
    // scrollable - non-public
    { content: 'scrollable', task: 'widget' },
    // scrollview
    { content: 'scrollView', task: 'widget' },
    // checkbox
    // { content: 'checkBox', task: 'widget' },
    { task: 'newline' }
];
