"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    Popup = require("../popup"),
    TreeView = require("../tree_view"),
    List = require("../list");

var HEADER_FILTER_CLASS = "dx-header-filter",
    HEADER_FILTER_MENU_CLASS = "dx-header-filter-menu";

function resetChildrenItemSelection(items) {
    items = items || [];
    for(var i = 0; i < items.length; i++) {
        items[i].selected = false;
        resetChildrenItemSelection(items[i].items);
    }
}

function updateSelectAllState($listContainer, filterValues) {
    var selectAllCheckBox = $listContainer.find(".dx-list-select-all-checkbox").data("dxCheckBox");

    if(selectAllCheckBox && filterValues && filterValues.length) {
        selectAllCheckBox.option("value", undefined);
    }
}

exports.updateHeaderFilterItemSelectionState = function(item, filterValuesMatch, isExcludeFilter) {
    if(filterValuesMatch ^ isExcludeFilter) {
        item.selected = true;

        if(isExcludeFilter && item.items) {
            for(var j = 0; j < item.items.length; j++) {
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
};

exports.HeaderFilterView = modules.View.inherit({
    getPopupContainer: function() {
        return this._popupContainer;
    },

    getListContainer: function() {
        return this._listContainer;
    },

    applyHeaderFilter: function(options) {
        var that = this,
            list = that.getListContainer(),
            isSelectAll = list.element().find(".dx-checkbox").eq(0).hasClass("dx-checkbox-checked"),
            filterValues = [];

        var fillSelectedItemKeys = function(filterValues, items, isExclude) {
            $.each(items, function(_, item) {
                if(item.selected !== undefined && (!!item.selected) ^ isExclude) {
                    filterValues.push(item.value);

                } else if(item.items && item.items.length) {
                    fillSelectedItemKeys(filterValues, item.items, isExclude);
                }
            });
        };

        if(!isSelectAll) {
            if(options.type === "tree") {
                fillSelectedItemKeys(filterValues, list.option("items"), options.filterType === "exclude");
                options.filterValues = filterValues;
            }
        } else if(Array.isArray(options.filterValues)) {
            options.filterValues = [];
        }

        if(options.filterValues && !options.filterValues.length) {
            options.filterValues = null; //T500956
        }

        options.apply();

        that.hideHeaderFilterMenu();
    },

    showHeaderFilterMenu: function($columnElement, options) {
        var that = this,
            popupContainer;

        if(options) {
            that._initializePopupContainer(options);

            popupContainer = that.getPopupContainer();

            that.hideHeaderFilterMenu();
            that.updatePopup($columnElement, options);

            popupContainer.show();
        }
    },

    hideHeaderFilterMenu: function() {
        var headerFilterMenu = this.getPopupContainer();

        headerFilterMenu && headerFilterMenu.hide();
    },

    updatePopup: function($element, options) {
        var that = this,
            alignment = options.alignment === "right" ? "left" : "right";

        if(that._popupContainer) {
            that._cleanPopupContent();
            that._popupContainer.option("position", {
                my: alignment + " top",
                at: alignment + " bottom",
                of: $element,
                collision: "flip fit"  //T291384
            });
        }
    },

    _cleanPopupContent: function() {
        this._popupContainer && this._popupContainer.content().empty();
    },

    _initializePopupContainer: function(options) {
        var that = this,
            $element = that.element(),
            headerFilterOptions = that.option("headerFilter"),
            width = options.headerFilter && options.headerFilter.width || headerFilterOptions && headerFilterOptions.width,
            height = options.headerFilter && options.headerFilter.height || headerFilterOptions && headerFilterOptions.height,
            dxPopupOptions = {
                width: width,
                height: height,
                visible: false,
                shading: false,
                showTitle: false,
                showCloseButton: false,
                closeOnTargetScroll: true,
                dragEnabled: false,
                closeOnOutsideClick: true,
                toolbarItems: [
                    {
                        toolbar: "bottom", location: "after", widget: "dxButton", options: {
                            text: headerFilterOptions.texts.ok, onClick: function() {
                                that.applyHeaderFilter(options);
                            }
                        }
                    },
                    {
                        toolbar: "bottom", location: "after", widget: "dxButton", options: {
                            text: headerFilterOptions.texts.cancel, onClick: function() {
                                that.hideHeaderFilterMenu();
                            }
                        }
                    }
                ],
                resizeEnabled: true,
                onShowing: function(e) {
                    that._initializeListContainer(options);
                    options.onShowing && options.onShowing(e);
                },
                onInitialized: function(e) {
                    var component = e.component;
                    //T321243
                    component.option("animation", component._getDefaultOptions().animation);
                }
            };

        if(!commonUtils.isDefined(that._popupContainer)) {
            that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);
        } else {
            that._popupContainer.option(dxPopupOptions);
        }
    },

    _initializeListContainer: function(options) {
        var that = this,
            $content = that._popupContainer.content(),
            widgetOptions = {
                dataSource: options.dataSource,
                onContentReady: function() {
                    that.renderCompleted.fire();
                },
                itemTemplate: function(data, _, $element) {
                    if(options.encodeHtml) {
                        return $element.text(data.text);
                    }

                    return $element.html(data.text);
                }
            };

        if(options.type === "tree") {
            that._listContainer = that._createComponent($("<div>").appendTo($content),
                TreeView, extend(widgetOptions, {
                    showCheckBoxesMode: 'selectAll',
                    keyExpr: "id"
                }));
        } else {
            that._listContainer = that._createComponent($("<div>").appendTo($content),
                List, extend(widgetOptions, {
                    pageLoadMode: "scrollBottom",
                    showSelectionControls: true,
                    selectionMode: "all",
                    onSelectionChanged: function(e) {
                        var items = e.component.option("items"),
                            selectedItems = e.component.option("selectedItems");

                        if(!e.component._selectedItemsUpdating) {
                            if(selectedItems.length === 0 && items.length && (!options.filterValues || options.filterValues.length <= 1)) {
                                options.filterType = "include";
                                options.filterValues = [];
                            } else if(selectedItems.length === items.length) {
                                options.filterType = "exclude";
                                options.filterValues = [];
                            }
                        }

                        $.each(items, function(index, item) {
                            var selected = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0,
                                oldSelected = !!item.selected,
                                filterValueIndex;

                            if(oldSelected !== selected) {
                                item.selected = selected;
                                options.filterValues = options.filterValues || [];
                                filterValueIndex = gridCoreUtils.getIndexByKey(item.value, options.filterValues, null);

                                if(filterValueIndex >= 0) {
                                    options.filterValues.splice(filterValueIndex, 1);
                                }

                                if(selected ^ options.filterType === "exclude") {
                                    options.filterValues.push(item.value);
                                }
                            }
                        });

                        updateSelectAllState(e.element, options.filterValues);
                    },
                    onContentReady: function(e) {
                        var component = e.component,
                            items = component.option("items"),
                            selectedItems = [];

                        $.each(items, function() {
                            if(this.selected) {
                                selectedItems.push(this);
                            }
                        });
                        component._selectedItemsUpdating = true;
                        component.option("selectedItems", selectedItems);
                        component._selectedItemsUpdating = false;

                        updateSelectAllState(e.element, options.filterValues);
                    }
                }));
        }
    },

    _renderCore: function() {
        this.element().addClass(HEADER_FILTER_MENU_CLASS);
    }
});

var allowHeaderFiltering = exports.allowHeaderFiltering = function(column) {
    return commonUtils.isDefined(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering;
};


exports.headerFilterMixin = {
    _applyColumnState: function(options) {
        var $headerFilterIndicator,
            rootElement = options.rootElement,
            column = options.column;

        if(options.name === "headerFilter") {
            rootElement.find("." + HEADER_FILTER_CLASS).remove();

            if(allowHeaderFiltering(column)) {
                $headerFilterIndicator = this.callBase(options).toggleClass("dx-header-filter-empty", !column.filterValues || !column.filterValues.length);
            }

            return $headerFilterIndicator;
        }

        return this.callBase(options);
    },
    _getIndicatorClassName: function(name) {
        if(name === "headerFilter") {
            return HEADER_FILTER_CLASS;
        }
        return this.callBase(name);
    },

    _renderIndicator: function(options) {
        var rtlEnabled,
            $container = options.container,
            $indicator = options.indicator;

        if(options.name === "headerFilter") {
            rtlEnabled = this.option("rtlEnabled");
            if($container.children().length && (!rtlEnabled && options.columnAlignment === "right" || rtlEnabled && options.columnAlignment === "left")) {
                $container.prepend($indicator);
                return;
            }
        }

        this.callBase(options);
    },

    optionChanged: function(args) {
        if(args.name === "headerFilter") {
            this._invalidate();
            args.handled = true;
        } else {
            this.callBase(args);
        }
    }
};
