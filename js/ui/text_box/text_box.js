import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
const window = getWindow();
import { inArray } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import registerComponent from '../../core/component_registrator';
import TextEditor from './ui.text_editor';
import { normalizeKeyName } from '../../events/utils/index';

// STYLE textBox

const ignoreKeys = ['backspace', 'tab', 'enter', 'pageUp', 'pageDown', 'end', 'home', 'leftArrow', 'rightArrow', 'downArrow', 'upArrow', 'del'];

const TEXTBOX_CLASS = 'dx-textbox';
const SEARCHBOX_CLASS = 'dx-searchbox';
const ICON_CLASS = 'dx-icon';
const SEARCH_ICON_CLASS = 'dx-icon-search';

const TextBox = TextEditor.inherit({

    ctor: function(element, options) {
        if(options) {
            this._showClearButton = options.showClearButton;
        }

        this.callBase.apply(this, arguments);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: '',
            mode: 'text',

            maxLength: null
        });
    },

    _initMarkup: function() {
        this.$element().addClass(TEXTBOX_CLASS);

        this.callBase();
        this.setAria('role', 'textbox');
    },

    _renderInputType: function() {
        this.callBase();

        this._renderSearchMode();
    },

    _useTemplates: function() {
        return false;
    },

    _renderProps: function() {
        this.callBase();
        this._toggleMaxLengthProp();
    },

    _toggleMaxLengthProp: function() {
        const maxLength = this._getMaxLength();
        if(maxLength && maxLength > 0) {
            this._input().attr('maxLength', maxLength);
        } else {
            this._input().removeAttr('maxLength');
        }
    },

    _renderSearchMode: function() {
        const $element = this._$element;

        if(this.option('mode') === 'search') {
            $element.addClass(SEARCHBOX_CLASS);
            this._renderSearchIcon();

            if(this._showClearButton === undefined) {
                this._showClearButton = this.option('showClearButton');
                this.option('showClearButton', true);
            }
        } else {
            $element.removeClass(SEARCHBOX_CLASS);
            this._$searchIcon && this._$searchIcon.remove();
            this.option('showClearButton', this._showClearButton === undefined ? this.option('showClearButton') : this._showClearButton);
            delete this._showClearButton;
        }
    },

    _renderSearchIcon: function() {
        const $searchIcon = $('<div>')
            .addClass(ICON_CLASS)
            .addClass(SEARCH_ICON_CLASS);

        $searchIcon.prependTo(this._input().parent());
        this._$searchIcon = $searchIcon;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'maxLength':
                this._toggleMaxLengthProp();
                break;
            case 'mask':
                this.callBase(args);
                this._toggleMaxLengthProp();
                break;
            default:
                this.callBase(args);
        }
    },

    _onKeyDownCutOffHandler: function(e) {
        const actualMaxLength = this._getMaxLength();

        if(actualMaxLength && !e.ctrlKey && !this._hasSelection()) {
            const $input = $(e.target);
            const key = normalizeKeyName(e);

            this._cutOffExtraChar($input);

            return ($input.val().length < actualMaxLength
                    || inArray(key, ignoreKeys) !== -1
                    || window.getSelection().toString() !== '');
        } else {
            return true;
        }
    },

    _onChangeCutOffHandler: function(e) {
        const $input = $(e.target);
        if(this.option('maxLength')) {
            this._cutOffExtraChar($input);
        }
    },

    _cutOffExtraChar: function($input) {
        const actualMaxLength = this._getMaxLength();
        const textInput = $input.val();
        if(actualMaxLength && textInput.length > actualMaxLength) {
            $input.val(textInput.substr(0, actualMaxLength));
        }
    },

    _getMaxLength: function() {
        const isMaskSpecified = !!this.option('mask');
        return isMaskSpecified ? null : this.option('maxLength');
    }
});

registerComponent('dxTextBox', TextBox);

export default TextBox;
