import $ from '../core/renderer';
import { noop } from '../core/utils/common';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import DropDownList from './drop_down_editor/ui.drop_down_list';
import { Deferred } from '../core/utils/deferred';
import { isCommandKeyPressed } from '../events/utils/index';

// STYLE autocomplete

const AUTOCOMPLETE_CLASS = 'dx-autocomplete';
const AUTOCOMPLETE_POPUP_WRAPPER_CLASS = 'dx-autocomplete-popup-wrapper';

const Autocomplete = DropDownList.inherit({

    _supportedKeys: function() {
        let item = this._list ? this._list.option('focusedElement') : null;
        const parent = this.callBase();

        item = item && $(item);

        return extend({}, parent, {
            upArrow: function(e) {
                if(!isCommandKeyPressed(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    if(item && !this._calcNextItem(-1)) {
                        this._clearFocusedItem();
                        return false;
                    }
                }
                return true;
            },
            downArrow: function(e) {
                if(!isCommandKeyPressed(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    if(item && !this._calcNextItem(1)) {
                        this._clearFocusedItem();
                        return false;
                    }
                }
                return true;
            },
            enter: function() {
                if(!item) {
                    this.close();
                }
                parent.enter.apply(this, arguments);
                return this.option('opened');
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            minSearchLength: 1,

            maxItemCount: 10,

            /**
            * @name dxAutocompleteOptions.noDataText
            * @type string
            * @default ""
            * @hidden
            */
            noDataText: '',

            showDropDownButton: false,

            searchEnabled: true

            /**
            * @name dxAutocompleteOptions.displayExpr
            * @hidden
            */

            /**
            * @name dxAutocompleteOptions.acceptCustomValue
            * @hidden
            */

            /**
            * @name dxAutocompleteOptions.searchEnabled
            * @hidden
            */

            /**
            * @name dxAutocompleteOptions.showDataBeforeSearch
            * @hidden
            */
        });
    },

    /**
    * @name dxAutocomplete.open
    * @publicName open()
    * @hidden
    */
    /**
    * @name dxAutocomplete.close
    * @publicName close()
    * @hidden
    */

    _initMarkup: function() {
        this.callBase();
        this.$element().addClass(AUTOCOMPLETE_CLASS);
        this.setAria('autocomplete', 'inline');
    },

    _displayGetterExpr: function() {
        return this.option('valueExpr');
    },

    _popupConfig: function() {
        return extend(this.callBase(), {
            closeOnOutsideClick: (function(e) {
                return !$(e.target).closest(this.$element()).length;
            }).bind(this)
        });
    },

    _renderDimensions: function() {
        this.callBase();
        this._dimensionChanged();
    },

    _popupWrapperClass: function() {
        return this.callBase() + ' ' + AUTOCOMPLETE_POPUP_WRAPPER_CLASS;
    },

    _listConfig: function() {
        return extend(this.callBase(), {
            pageLoadMode: 'none'
        });
    },

    _listItemClickHandler: function(e) {
        this._saveValueChangeEvent(e.event);
        const value = this._displayGetter(e.itemData);
        this.option('value', value);
        this.close();
    },

    _setListDataSource: function() {
        if(!this._list) {
            return;
        }

        this._list.option('selectedItems', []);
        this.callBase();
    },

    _refreshSelected: noop,

    _searchCanceled: function() {
        this.callBase();
        this.close();
    },

    _loadItem: function(value, cache) {
        const selectedItem = this._getItemFromPlain(value, cache);

        return new Deferred().resolve(selectedItem).promise();
    },

    _dataSourceOptions: function() {
        return {
            paginate: true,
            pageSize: this.option('maxItemCount')
        };
    },

    _searchDataSource: function() {
        this._dataSource.pageSize(this.option('maxItemCount'));
        this.callBase();
        this._clearFocusedItem();
    },

    _clearFocusedItem: function() {
        if(this._list) {
            this._list.option('focusedElement', null);
            this._list.option('selectedIndex', -1);
        }
    },

    _renderValueEventName: function() {
        return 'input keyup';
    },

    _valueChangeEventHandler: function(e) {
        const value = this._input().val() || null;
        return this.callBase(e, value);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'maxItemCount':
                this._searchDataSource();
                break;
            case 'valueExpr':
                this._compileDisplayGetter();
                this._setListOption('displayExpr', this._displayGetterExpr());
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    reset: function() {
        this.callBase();
        this.close();
    }
});

registerComponent('dxAutocomplete', Autocomplete);

export default Autocomplete;
