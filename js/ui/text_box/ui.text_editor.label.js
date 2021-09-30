import { getWidth, getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';

const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_LABEL_SELECTOR = '.' + TEXTEDITOR_LABEL_CLASS;
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

export function renderLabel({ editor, container, icon = null }) {
    const labelElement = editor.$element().find(TEXTEDITOR_LABEL_SELECTOR);
    const labelText = editor.option('label');
    const labelMark = editor.option('labelMark');
    const labelMode = editor.option('labelMode');

    if(!editor.label && labelElement.length === 1 || labelElement.length === 2) {
        labelElement.first().remove();
    }

    if(editor._$label) {
        editor._$label.remove();
        editor._$label = null;
    }

    editor.$element()
        .removeClass(TEXTEDITOR_WITH_LABEL_CLASS)
        .removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS)
        .removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

    if(!labelText || labelMode === 'hidden') return;

    editor.$element().addClass(labelMode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS);

    const $label = editor._$label = $('<div>')
        .addClass(TEXTEDITOR_LABEL_CLASS)
        .html(`<div class="dx-label-before"></div><div class="dx-label"><span data-mark="${labelMark}">${labelText}</span></div><div class="dx-label-after"></div>`);

    $label.appendTo(editor.$element());

    setLabelWidth({ editor, container, icon });
}


function setLabelWidth({ editor, container, icon = null }) {
    const labelBeforeElement = editor._$label.find('.dx-label-before');

    if(editor._$beforeButtonsContainer) {
        editor.$element().addClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);
        labelBeforeElement.css('width', getWidth(editor._$beforeButtonsContainer));
    }

    if(icon) {
        const labelBeforeWidth = getWidth(labelBeforeElement) + getOuterWidth(icon);

        labelBeforeElement.css('width', labelBeforeWidth);

        editor._$label.find('.dx-label').css('maxWidth', getWidth(container.parent()) - labelBeforeWidth);
    } else {
        editor._$label.find('.dx-label').css('maxWidth', getWidth(container));
    }
}
