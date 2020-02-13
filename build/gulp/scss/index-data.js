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
    { content: 'box', task: 'widget' },
    { content: 'responsiveBox', task: 'widget' },
    { content: 'button', task: 'widget' },
    { content: 'buttonGroup', task: 'widget' },
    { content: 'scrollable', task: 'widget', private: true },
    { content: 'scrollView', task: 'widget' },
    { content: 'checkBox', task: 'widget' },
    { content: 'switch', task: 'widget' },
    { content: 'badge', task: 'widget', private: true },
    { content: 'tabs', task: 'widget' },
    { content: 'navBar', task: 'widget' },
    { content: 'validation', task: 'widget', private: true },
    { content: 'textEditor', task: 'widget', private: true },
    { content: 'textBox', task: 'widget', private: true },
    { content: 'dropDownEditor', task: 'widget', private: true },
    { content: 'dropDownBox', task: 'widget' },
    { content: 'list', task: 'widget' },
    { content: 'textArea', task: 'widget' },
    { content: 'numberBox', task: 'widget' },
    { content: 'dateView', task: 'widget', private: true },
    { content: 'timeView', task: 'widget', private: true },
    { content: 'calendar', task: 'widget' },
    { content: 'dateBox', task: 'widget' },
    { content: 'dropDownList', task: 'widget', private: true },
    { content: 'autocomplete', task: 'widget' },
    { content: 'loadIndicator', task: 'widget' },
    { content: 'treeView', task: 'widget' },
    { content: 'overlay', task: 'widget', private: true },
    { content: 'menu', task: 'widget' },
    { content: 'selectBox', task: 'widget' },
    { content: 'dropDownMenu', task: 'widget', private: true },
    { content: 'toolbar', task: 'widget' },
    { content: 'popup', task: 'widget' },
    { content: 'dropDownButton', task: 'widget' },
    { content: 'actionSheet', task: 'widget' },
    { content: 'tileView', task: 'widget' },
    { content: 'toast', task: 'widget' },
    { content: 'popover', task: 'widget' },
    { content: 'progressBar', task: 'widget' },
    { content: 'tooltip', task: 'widget' },
    { content: 'slider', task: 'widget' },
    { content: 'rangeSlider', task: 'widget' },
    { content: 'gallery', task: 'widget' },
    { content: 'lookup', task: 'widget' },
    { content: 'loadPanel', task: 'widget' },
    { content: 'tagBox', task: 'widget' },
    { content: 'radioGroup', task: 'widget' },
    { content: 'accordion', task: 'widget' },
    { content: 'slideOutView', task: 'widget' },
    { content: 'slideOut', task: 'widget' },
    { content: 'colorView', task: 'widget', private: true },
    { content: 'colorBox', task: 'widget' },
    { task: 'newline' }
];
