import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import messageLocalization from '../../localization/message';
import TextEditorButton from '../text_box/texteditor_button_collection/button';
import Button from '../button';

const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = 'dx-dropdowneditor-button-visible';

const BUTTON_MESSAGE = 'dxDropDownEditor-selectLabel';

export default class ClearButton extends TextEditorButton {
    constructor(name, editor, options) {
        super(name, editor, options);

        this.currentTemplate = null;
    }

    _attachEvents(instance) {
        const { editor } = this;

        instance.option('onClick', (e) => {
            !editor.option('openOnFieldClick') && editor._openHandler(e);
        });

        eventsEngine.on(instance.$element(), 'mousedown', (e) => {
            if(editor.$element().is('.dx-state-focused')) {
                e.preventDefault();
            }
        });
    }

    _create() {
        const { editor } = this;
        const $element = $('<div>');
        const options = this._getOptions();

        this._addToContainer($element);

        this.updateCurrentTemplate();
        const instance = editor._createComponent($element, Button, extend({}, options, { elementAttr: { 'aria-label': messageLocalization.format(BUTTON_MESSAGE) } }));

        this._legacyRender(editor.$element(), $element, options.visible);

        return {
            $element,
            instance
        };
    }

    _getOptions() {
        const { editor } = this;
        const visible = this._isVisible();
        const isReadOnly = editor.option('readOnly');
        const template = editor._getTemplateByOption('dropDownButtonTemplate');

        return {
            focusStateEnabled: false,
            hoverStateEnabled: false,
            activeStateEnabled: false,
            useInkRipple: false,
            disabled: isReadOnly,
            visible,
            template
        };
    }

    _isVisible() {
        const { editor } = this;

        return super._isVisible() && editor.option('showDropDownButton');
    }

    // TODO: get rid of it
    _legacyRender($editor, $element, isVisible) {
        $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);

        if($element) {
            $element
                .removeClass('dx-button')
                .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
        }
    }

    isSameTemplate() {
        return this.editor.option('dropDownButtonTemplate') === this.currentTemplate;
    }

    updateCurrentTemplate() {
        this.currentTemplate = this.editor.option('dropDownButtonTemplate');
    }

    update() {
        const shouldUpdate = super.update();

        if(shouldUpdate) {
            const { editor, instance } = this;
            const $editor = editor.$element();
            const options = this._getOptions();

            this.isSameTemplate() ? delete options.template : this.updateCurrentTemplate();
            instance?.option(options);
            this._legacyRender($editor, instance?.$element(), options.visible);
        }
    }
}
