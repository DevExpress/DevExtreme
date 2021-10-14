import $ from '../../core/renderer';


const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';

const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

class TextEditorLabel {
    constructor({
        $editor,
        text, mode, mark,
        containsButtonsBefore,
        containerWidth,
        beforeWidth
    }) {
        this._props = {
            $editor,
            text, mode, mark,
            containsButtonsBefore,
            containerWidth,
            beforeWidth
        };

        this._render();
        this._toggleMarkupVisibility();
    }

    $element() {
        return this._$root;
    }

    _isVisible() {
        return this._props.text && this._props.mode !== 'hidden';
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
    }

    _toggleMarkupVisibility() {
        const visible = this._isVisible();

        this._updateBeforeButtonsClass(visible);
        this._updateLabelClass(visible);

        if(visible) {
            this._$root.appendTo(this._props.$editor);
            this.updateBeforeWidth(this._props.beforeWidth);
            this.updateWidth(this._props.containerWidth);
        } else {
            this._$root.detach();
        }
    }


    _updateLabelClass(visible) {
        this._props.$editor
            .removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS)
            .removeClass(TEXTEDITOR_WITH_LABEL_CLASS);

        if(visible) {
            const labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;

            this._props.$editor
                .addClass(labelClass);
        }
    }

    _updateBeforeButtonsClass(visible) {
        this._props.$editor
            .removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

        if(visible) {
            const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

            this._props.$editor
                .addClass(beforeButtonsClass);
        }
    }

    updateMode(mode) {
        this._props.mode = mode;
        this._toggleMarkupVisibility();
    }

    updateText(text) {
        this._props.text = text;
        this._$labelSpan.text(text);
        this._toggleMarkupVisibility();
    }

    updateMark(mark) {
        this._$labelSpan.attr('data-mark', mark);
    }

    getContainsButtonsBefore(containsButtonsBefore) {
        this._props.containsButtonsBefore = containsButtonsBefore;
        this._toggleMarkupVisibility();
    }

    updateBeforeWidth(beforeWidth) {
        this._$before.css({ width: beforeWidth });
    }

    updateWidth(containerWidth) {
        this._$label.css({ maxWidth: containerWidth });
    }
}

export {
    TextEditorLabel
};
