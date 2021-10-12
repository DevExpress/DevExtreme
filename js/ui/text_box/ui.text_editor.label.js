import $ from '../../core/renderer';

const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

class TextEditorLabel {
    constructor({
        $editor,
        text, mode, mark,
        containerWidth,
        beforeWidth,
        containsButtonsBefore
    }) {
        this._props = {
            $editor,
            text, mode, mark,
            containerWidth,
            beforeWidth,
            containsButtonsBefore
        };

        if(this._isVisible()) {
            this.addEditorClasses();
            this._addEditorSubClass();
            this._render();
            this.updateBeforeWidth(beforeWidth);
            this.updateLabelWidth(containerWidth);
        }
    }

    $element() {
        return this._$root;
    }

    addEditorClasses() {
        this._props.$editor
            .removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS)
            .removeClass(TEXTEDITOR_WITH_LABEL_CLASS);

        if(this._isVisible()) {
            const labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;

            this._props.$editor
                .addClass(labelClass);
        }
    }

    _isVisible() {
        return this._props.text && this._props.mode !== 'hidden';
    }

    _addEditorSubClass() {
        this._props.$editor
            .removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

        if(this._isVisible()) {
            const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

            this._props.$editor
                .addClass(beforeButtonsClass);
        }
    }

    _render() {
        this._$before = $('<div>').addClass('dx-label-before');

        this._$labelSpan = $('<span>')
            .attr('data-mark', this._props.mark)
            .text(this._props.text);

        this._$label = $('<div>')
            .addClass('dx-label')
            .append(this._$labelSpan);

        this._$after = $('<div>').addClass('dx-label-after');

        this._$root = $('<div>')
            .addClass(TEXTEDITOR_LABEL_CLASS)
            .append(this._$before)
            .append(this._$label)
            .append(this._$after);

        this._$root.appendTo(this._props.$editor);
    }

    updateLabelText(labelText) {
        if(this._isVisible()) {
            this._$labelSpan.text(labelText);
        }
    }

    updateLabelMark(labelMark) {
        if(this._isVisible()) {
            this._$labelSpan.attr('data-mark', labelMark);
        }
    }

    updateBeforeWidth(beforeWidth) {
        if(this._isVisible()) {
            this._$before.css({ width: beforeWidth });
        }
    }

    updateLabelWidth(containerWidth) {
        if(this._isVisible()) {
            this._$label.css({ maxWidth: containerWidth });
        }
    }
}

export {
    TextEditorLabel
};
