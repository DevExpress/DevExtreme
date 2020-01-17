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
    // fieldset

    { content: 'public widgets', task: 'comment' },
    // { task: 'widget', content: 'box' },
    { task: 'newline' }
];
