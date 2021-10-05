import $ from '../../core/renderer';

const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

class TextEditorLabel {
    constructor(...args) {
        this.init(...args);
    }

    init({
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

        this._isVisible = text && mode !== 'hidden';

        if(this._isVisible) {
            this._renderEditorClasses();
            this._render();
            this._updateWidth();
        }
    }

    $element() {
        return this._$root;
    }

    _renderEditorClasses() {
        const labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;
        const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

        this._props.$editor
            .addClass(labelClass)
            .addClass(beforeButtonsClass);
    }

    _render() {
        this._$before = $('<div>').addClass('dx-label-before');
        this._$label = $('<div>')
            .addClass('dx-label')
            .html(`
                <span data-mark="${this._props.mark}">
                    ${this._props.text}
                </span>
            `);
        this._$after = $('<div>').addClass('dx-label-after');

        this._$root = $('<div>')
            .addClass(TEXTEDITOR_LABEL_CLASS)
            .append(this._$before)
            .append(this._$label)
            .append(this._$after);

        this._$root.appendTo(this._props.$editor);
    }

    _updateWidth() {
        this._$before.css({ width: this._props.beforeWidth });
        this._$label.css({ maxWidth: this._props.containerWidth });
    }
}

export {
    TextEditorLabel
};
