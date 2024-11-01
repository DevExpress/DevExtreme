import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../common/core/localization/message';
import errors from '../widget/ui.errors';
import { Deferred } from '../../core/utils/deferred';
import { stubComponent } from '../../core/utils/stubs';

let EditorClass = stubComponent('TextBox');

export default {
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            searchMode: '',

            searchExpr: null,

            searchValue: '',

            searchEnabled: false,

            searchEditorOptions: {},

        });
    },

    _initMarkup: function() {
        this._renderSearch();
        this.callBase();
    },

    _renderSearch: function() {
        const $element = this.$element();
        const searchEnabled = this.option('searchEnabled');
        const searchBoxClassName = this._addWidgetPrefix('search');
        const rootElementClassName = this._addWidgetPrefix('with-search');

        if(!searchEnabled) {
            $element.removeClass(rootElementClassName);
            this._removeSearchBox();
            return;
        }

        const editorOptions = this._getSearchEditorOptions();

        if(this._searchEditor) {
            this._searchEditor.option(editorOptions);
        } else {
            $element.addClass(rootElementClassName);
            this._$searchEditorElement = $('<div>').addClass(searchBoxClassName).prependTo($element);
            this._searchEditor = this._createComponent(this._$searchEditorElement, EditorClass, editorOptions);
        }
    },

    _removeSearchBox: function() {
        this._$searchEditorElement && this._$searchEditorElement.remove();
        delete this._$searchEditorElement;
        delete this._searchEditor;
    },

    _getSearchEditorOptions: function() {
        const that = this;
        const userEditorOptions = that.option('searchEditorOptions');
        const searchText = messageLocalization.format('Search');

        return extend({
            mode: 'search',
            placeholder: searchText,
            tabIndex: that.option('tabIndex'),
            value: that.option('searchValue'),
            valueChangeEvent: 'input',
            inputAttr: {
                'aria-label': searchText
            },
            onValueChanged: function(e) {
                const searchTimeout = that.option('searchTimeout');
                that._valueChangeDeferred = new Deferred();
                clearTimeout(that._valueChangeTimeout);

                that._valueChangeDeferred.done(function() {
                    this.option('searchValue', e.value);
                }.bind(that));

                if(e.event && e.event.type === 'input' && searchTimeout) {
                    that._valueChangeTimeout = setTimeout(function() {
                        that._valueChangeDeferred.resolve();
                    }, searchTimeout);
                } else {
                    that._valueChangeDeferred.resolve();
                }
            }
        }, userEditorOptions);
    },

    _getAriaTarget: function() {
        if(this.option('searchEnabled')) {
            return this._itemContainer(true);
        }
        return this.callBase();
    },

    _focusTarget: function() {
        if(this.option('searchEnabled')) {
            return this._itemContainer(true);
        }

        return this.callBase();
    },

    _updateFocusState: function(e, isFocused) {
        if(this.option('searchEnabled')) {
            this._toggleFocusClass(isFocused, this.$element());
        }
        this.callBase(e, isFocused);
    },

    getOperationBySearchMode: function(searchMode) {
        return searchMode === 'equals' ? '=' : searchMode;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'searchEnabled':
            case 'searchEditorOptions':
                this._invalidate();
                break;
            case 'searchExpr':
            case 'searchMode':
            case 'searchValue':
                if(!this._dataSource) {
                    errors.log('W1009');
                    return;
                }
                if(args.name === 'searchMode') {
                    this._dataSource.searchOperation(this.getOperationBySearchMode(args.value));
                } else {
                    this._dataSource[args.name](args.value);
                }
                this._dataSource.load();
                break;
            case 'searchTimeout':
                break;
            default:
                this.callBase(args);
        }
    },

    focus: function() {
        if(!this.option('focusedElement') && this.option('searchEnabled')) {
            this._searchEditor && this._searchEditor.focus();
            return;
        }

        this.callBase();
    },

    _cleanAria: function() {
        const $element = this.$element();

        this.setAria({
            'role': null,
            'activedescendant': null
        }, $element);

        $element.attr('tabIndex', null);
    },

    _clean() {
        this.callBase();
        this._cleanAria();
    },

    _refresh: function() {
        if(this._valueChangeDeferred) {
            this._valueChangeDeferred.resolve();
        }

        this.callBase();
    },

    setEditorClass: function(value) {
        EditorClass = value;
    }
};
