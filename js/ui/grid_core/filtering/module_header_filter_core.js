import $ from '../../../core/renderer';
import modules from '../ui.grid_core.modules';
import gridCoreUtils from '../ui.grid_core.utils';
import { isDefined, isFunction } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';
import { extend } from '../../../core/utils/extend';
import Popup from '../../popup/ui.popup';
import TreeView from '../../tree_view';
import List from '../../list_light';
import '../../list/modules/search';
import '../../list/modules/selection';
import messageLocalization from '../../../localization/message';

const HEADER_FILTER_CLASS = 'dx-header-filter';
const HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';

const DEFAULT_SEARCH_EXPRESSION = 'text';

function resetChildrenItemSelection(items) {
    items = items || [];
    for(let i = 0; i < items.length; i++) {
        items[i].selected = false;
        resetChildrenItemSelection(items[i].items);
    }
}

function updateSelectAllState(e, filterValues) {
    if(e.component.option('searchValue')) {
        return;
    }
    const selectAllCheckBox = $(e.element).find('.dx-list-select-all-checkbox').data('dxCheckBox');

    if(selectAllCheckBox && filterValues && filterValues.length) {
        selectAllCheckBox.option('value', undefined);
    }
}

function isSearchEnabled(that, options) {
    const headerFilter = options.headerFilter;

    if(headerFilter && isDefined(headerFilter.allowSearch)) {
        return headerFilter.allowSearch;
    }

    return that.option('headerFilter.allowSearch');
}

export function updateHeaderFilterItemSelectionState(item, filterValuesMatch, isExcludeFilter) {
    if(filterValuesMatch ^ isExcludeFilter) {
        item.selected = true;

        if(isExcludeFilter && item.items) {
            for(let j = 0; j < item.items.length; j++) {
                if(!item.items[j].selected) {
                    item.selected = undefined;
                    break;
                }
            }
        }
    } else if(isExcludeFilter || item.selected) {
        item.selected = false;
        resetChildrenItemSelection(item.items);
    }
}

export const HeaderFilterView = modules.View.inherit({
    getPopupContainer: function() {
        return this._popupContainer;
    },

    getListContainer: function() {
        return this._listContainer;
    },

    applyHeaderFilter: function(options) {
        const that = this;
        const list = that.getListContainer();
        const searchValue = list.option('searchValue');
        const isSelectAll = !searchValue && !options.isFilterBuilder && list.$element().find('.dx-checkbox').eq(0).hasClass('dx-checkbox-checked');
        const filterValues = [];

        const fillSelectedItemKeys = function(filterValues, items, isExclude) {
            each(items, function(_, item) {
                if(item.selected !== undefined && (!!item.selected) ^ isExclude) {
                    const node = list._getNode(item);
                    const hasChildren = list._hasChildren(node);
                    const hasChildrenWithSelection = hasChildren && item.items && item.items.some((item) => item.selected);

                    if(!searchValue || !hasChildrenWithSelection) {
                        filterValues.push(item.value);
                        return;
                    }
                }

                if(item.items && item.items.length) {
                    fillSelectedItemKeys(filterValues, item.items, isExclude);
                }
            });
        };

        if(!isSelectAll) {
            if(options.type === 'tree') {
                if(options.filterType) {
                    options.filterType = 'include';
                }

                fillSelectedItemKeys(filterValues, list.option('items'), false);
                options.filterValues = filterValues;
            }
        } else {
            if(options.type === 'tree') {
                options.filterType = 'exclude';
            }

            if(Array.isArray(options.filterValues)) {
                options.filterValues = [];
            }
        }

        if(options.filterValues && !options.filterValues.length) {
            options.filterValues = null; // T500956
        }

        options.apply();

        that.hideHeaderFilterMenu();
    },

    showHeaderFilterMenu: function($columnElement, options) {
        const that = this;

        if(options) {
            that._initializePopupContainer(options);

            const popupContainer = that.getPopupContainer();

            that.hideHeaderFilterMenu();
            that.updatePopup($columnElement, options);

            popupContainer.show();
        }
    },

    hideHeaderFilterMenu: function() {
        const headerFilterMenu = this.getPopupContainer();

        headerFilterMenu && headerFilterMenu.hide();
    },

    updatePopup: function($element, options) {
        const that = this;
        const showColumnLines = this.option('showColumnLines');
        const alignment = ((options.alignment === 'right') ^ !showColumnLines) ? 'left' : 'right';

        that._popupContainer.setAria({
            role: 'dialog',
            label: messageLocalization.format('dxDataGrid-headerFilterLabel')
        });

        if(that._popupContainer) {
            that._cleanPopupContent();
            that._popupContainer.option('position', {
                my: alignment + ' top',
                at: alignment + ' bottom',
                of: $element,
                collision: 'flip fit' // T291384
            });
        }
    },

    _getSearchExpr: function(options) {
        const lookup = options.lookup;
        const useDefaultSearchExpr = options.useDefaultSearchExpr;
        const headerFilterDataSource = options.headerFilter && options.headerFilter.dataSource;

        if(useDefaultSearchExpr || isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
            return DEFAULT_SEARCH_EXPRESSION;
        }

        if(lookup) {
            return lookup.displayExpr || 'this';
        }

        if(options.dataSource) {
            const group = options.dataSource.group;
            if(Array.isArray(group) && group.length > 0) {
                return group[0].selector;
            } else if(isFunction(group) && !options.remoteFiltering) {
                return group;
            }
        }

        return (options.dataField || options.selector);
    },

    _cleanPopupContent: function() {
        this._popupContainer && this._popupContainer.$content().empty();
    },

    _initializePopupContainer: function(options) {
        const that = this;
        const $element = that.element();
        const headerFilterOptions = that.option('headerFilter');
        const width = options.headerFilter && options.headerFilter.width || headerFilterOptions && headerFilterOptions.width;
        const height = options.headerFilter && options.headerFilter.height || headerFilterOptions && headerFilterOptions.height;
        const dxPopupOptions = {
            width: width,
            height: height,
            visible: false,
            shading: false,
            showTitle: false,
            showCloseButton: false,
            hideOnParentScroll: false, // T756320
            dragEnabled: false,
            hideOnOutsideClick: true,
            focusStateEnabled: false,
            copyRootClassesToWrapper: true,
            _ignoreCopyRootClassesToWrapperDeprecation: true,
            toolbarItems: [
                {
                    toolbar: 'bottom', location: 'after', widget: 'dxButton', options: {
                        text: headerFilterOptions.texts.ok, onClick: function() {
                            that.applyHeaderFilter(options);
                        }
                    }
                },
                {
                    toolbar: 'bottom', location: 'after', widget: 'dxButton', options: {
                        text: headerFilterOptions.texts.cancel, onClick: function() {
                            that.hideHeaderFilterMenu();
                        }
                    }
                }
            ],
            resizeEnabled: true,
            onShowing: function(e) {
                e.component.$content().parent().addClass('dx-dropdowneditor-overlay');
                that._initializeListContainer(options);
                options.onShowing && options.onShowing(e);
            },
            onShown: function() {
                that.getListContainer().focus();
            },
            onHidden: options.onHidden,
            onInitialized: function(e) {
                const component = e.component;
                // T321243
                component.option('animation', component._getDefaultOptions().animation);
            }
        };

        if(!isDefined(that._popupContainer)) {
            that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);
        } else {
            that._popupContainer.option(dxPopupOptions);
        }
    },

    _initializeListContainer: function(options) {
        const that = this;
        const $content = that._popupContainer.$content();
        const widgetOptions = {
            searchEnabled: isSearchEnabled(that, options),
            searchTimeout: that.option('headerFilter.searchTimeout'),
            searchMode: options.headerFilter && options.headerFilter.searchMode || '',
            dataSource: options.dataSource,
            onContentReady: function() {
                that.renderCompleted.fire();
            },
            itemTemplate: function(data, _, element) {
                const $element = $(element);
                if(options.encodeHtml) {
                    return $element.text(data.text);
                }

                return $element.html(data.text);
            }
        };

        function onOptionChanged(e) {
            // T835492, T833015
            if(e.fullName === 'searchValue' && !options.isFilterBuilder && that.option('headerFilter.hideSelectAllOnSearch') !== false) {
                if(options.type === 'tree') {
                    e.component.option('showCheckBoxesMode', e.value ? 'normal' : 'selectAll');
                } else {
                    e.component.option('selectionMode', e.value ? 'multiple' : 'all');
                }
            }
        }

        if(options.type === 'tree') {
            that._listContainer = that._createComponent($('<div>').appendTo($content),
                TreeView, extend(widgetOptions, {
                    showCheckBoxesMode: options.isFilterBuilder ? 'normal' : 'selectAll',
                    onOptionChanged: onOptionChanged,
                    keyExpr: 'id'
                }));
        } else {
            that._listContainer = that._createComponent($('<div>').appendTo($content),
                List, extend(widgetOptions, {
                    searchExpr: that._getSearchExpr(options),
                    pageLoadMode: 'scrollBottom',
                    showSelectionControls: true,
                    selectionMode: options.isFilterBuilder ? 'multiple' : 'all',
                    onOptionChanged: onOptionChanged,
                    onSelectionChanged: function(e) {
                        const items = e.component.option('items');
                        const selectedItems = e.component.option('selectedItems');

                        if(!e.component._selectedItemsUpdating && !e.component.option('searchValue') && !options.isFilterBuilder) {
                            const filterValues = options.filterValues || [];
                            const isExclude = options.filterType === 'exclude';
                            if(selectedItems.length === 0 && items.length && (filterValues.length <= 1 || isExclude && filterValues.length === items.length - 1)) {
                                options.filterType = 'include';
                                options.filterValues = [];
                            } else if(selectedItems.length === items.length) {
                                options.filterType = 'exclude';
                                options.filterValues = [];
                            }
                        }

                        each(items, function(index, item) {
                            const selected = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0;
                            const oldSelected = !!item.selected;

                            if(oldSelected !== selected) {
                                item.selected = selected;
                                options.filterValues = options.filterValues || [];
                                const filterValueIndex = gridCoreUtils.getIndexByKey(item.value, options.filterValues, null);

                                if(filterValueIndex >= 0) {
                                    options.filterValues.splice(filterValueIndex, 1);
                                }

                                if(selected ^ options.filterType === 'exclude') {
                                    options.filterValues.push(item.value);
                                }
                            }
                        });

                        updateSelectAllState(e, options.filterValues);
                    },
                    onContentReady: function(e) {
                        const component = e.component;
                        const items = component.option('items');
                        const selectedItems = [];

                        each(items, function() {
                            if(this.selected) {
                                selectedItems.push(this);
                            }
                        });
                        component._selectedItemsUpdating = true;
                        component.option('selectedItems', selectedItems);
                        component._selectedItemsUpdating = false;

                        updateSelectAllState(e, options.filterValues);
                    }
                }));
        }
    },

    _renderCore: function() {
        this.element().addClass(HEADER_FILTER_MENU_CLASS);
    }
});

export const allowHeaderFiltering = function(column) {
    return isDefined(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering;
};


export const headerFilterMixin = {
    _applyColumnState: function(options) {
        let $headerFilterIndicator;
        const rootElement = options.rootElement;
        const column = options.column;

        if(options.name === 'headerFilter') {
            rootElement.find('.' + HEADER_FILTER_CLASS).remove();

            if(allowHeaderFiltering(column)) {
                $headerFilterIndicator = this.callBase(options).toggleClass('dx-header-filter-empty', this._isHeaderFilterEmpty(column));
                if(!this.option('useLegacyKeyboardNavigation')) {
                    $headerFilterIndicator.attr('tabindex', this.option('tabindex') || 0);
                }

                const indicatorLabel = messageLocalization.format('dxDataGrid-headerFilterIndicatorLabel', column.caption);

                $headerFilterIndicator.attr('aria-label', indicatorLabel);
                $headerFilterIndicator.attr('aria-haspopup', 'dialog');
                $headerFilterIndicator.attr('role', 'button');
            }

            return $headerFilterIndicator;
        }

        return this.callBase(options);
    },

    _isHeaderFilterEmpty: function(column) {
        return !column.filterValues || !column.filterValues.length;
    },

    _getIndicatorClassName: function(name) {
        if(name === 'headerFilter') {
            return HEADER_FILTER_CLASS;
        }
        return this.callBase(name);
    },

    _renderIndicator: function(options) {
        const $container = options.container;
        const $indicator = options.indicator;

        if(options.name === 'headerFilter') {
            const rtlEnabled = this.option('rtlEnabled');
            if($container.children().length && (!rtlEnabled && options.columnAlignment === 'right' || rtlEnabled && options.columnAlignment === 'left')) {
                $container.prepend($indicator);
                return;
            }
        }

        this.callBase(options);
    },

    optionChanged: function(args) {
        if(args.name === 'headerFilter') {
            const requireReady = this.name === 'columnHeadersView';
            this._invalidate(requireReady, requireReady);
            args.handled = true;
        } else {
            this.callBase(args);
        }
    }
};
