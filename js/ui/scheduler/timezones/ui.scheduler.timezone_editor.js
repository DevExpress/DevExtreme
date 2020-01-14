const $ = require('../../../core/renderer');
const registerComponent = require('../../../core/component_registrator');
const extend = require('../../../core/utils/extend').extend;
const publisherMixin = require('../ui.scheduler.publisher_mixin');
const messageLocalization = require('../../../localization/message');
const Editor = require('../../editor/editor');
const SelectBox = require('../../select_box');

const TIMEZONE_EDITOR_CLASS = 'dx-timezone-editor';
const TIMEZONE_DISPLAY_NAME_SELECTBOX_CLASS = 'dx-timezone-display-name';
const TIMEZONE_IANA_ID_SELECTBOX_CLASS = 'dx-timezone-iana-id';

const SchedulerTimezoneEditor = Editor.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: null
        });
    },

    _createComponent: function(element, name, config) {
        config = config || {};
        this._extendConfig(config, {
            readOnly: this.option('readOnly')
        });
        return this.callBase(element, name, config);
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(TIMEZONE_EDITOR_CLASS);
    },

    _render: function() {
        this._renderDisplayNameEditor();
        this._renderIanaIdEditor();
        this.callBase();
    },

    _renderDisplayNameEditor: function() {
        const noTzTitle = messageLocalization.format('dxScheduler-noTimezoneTitle');
        const value = this.invoke('getTimezoneDisplayNameById', this.option('value')) || noTzTitle;

        this._displayNameEditor = this._renderSelectBox(TIMEZONE_DISPLAY_NAME_SELECTBOX_CLASS, {
            items: [noTzTitle].concat(this.invoke('getTimezonesDisplayName')),
            value: value,
            onOptionChanged: function(e) {
                if(e.name === 'value') {
                    this._processDisplayNameChanging(e.value);
                }
            }.bind(this)
        });
    },

    _renderIanaIdEditor: function() {
        this._ianaIdEditor = this._renderSelectBox(TIMEZONE_IANA_ID_SELECTBOX_CLASS, {
            items: this._idsDataSource(),
            value: this.option('value'),
            onOptionChanged: function(e) {
                if(e.name === 'value') {
                    this.option('value', e.value);
                }
            }.bind(this),
            valueExpr: 'id',
            displayExpr: 'displayName',
            disabled: this._calculateIanaIdEditorDisabledState()
        });
    },

    _renderSelectBox: function(cssClass, options) {
        options = options || {};
        const $element = $('<div>').addClass(cssClass);
        const selectBox = this._createComponent($element, SelectBox, options);

        this.$element().append($element);

        return selectBox;
    },

    _idsDataSource: function() {
        return this.invoke('getSimilarTimezones', this.option('value'));
    },

    _calculateIanaIdEditorDisabledState: function() {
        return !this.option('value');
    },

    _processDisplayNameChanging: function(displayName) {
        const tzIds = this.invoke('getTimezonesIdsByDisplayName', displayName);
        const tzId = tzIds.length ? tzIds[0].id : null;

        this.option('value', tzId);

        this._ianaIdEditor.option({
            'value': tzId,
            'items': this._idsDataSource(tzIds),
            'disabled': this._calculateIanaIdEditorDisabledState()
        });
    },

    _optionChanged: function(args) {
        const value = args.value;
        switch(args.name) {
            case 'value':
                this._ianaIdEditor.option({
                    value: value,
                    items: this._idsDataSource()
                });

                if(value) {
                    this._displayNameEditor.option('value', this.invoke('getTimezoneDisplayNameById', value));
                } else {
                    this._displayNameEditor.option('value', messageLocalization.format('dxScheduler-noTimezoneTitle'));
                }

                this.callBase(args);
                break;
            case 'readOnly':
                this._displayNameEditor && this._displayNameEditor.option('readOnly', value);
                this._ianaIdEditor && this._ianaIdEditor.option('readOnly', value);
                break;
            default:
                this.callBase(args);
        }
    }
}).include(publisherMixin);

registerComponent('dxSchedulerTimezoneEditor', {}, SchedulerTimezoneEditor);

module.exports = SchedulerTimezoneEditor;
