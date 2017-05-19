"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    compileGetter = require("../../core/utils/data").compileGetter,
    gridCore = require("./ui.data_grid.core"),
    selectors = require("../widget/jquery.selectors"),
    messageLocalization = require("../../localization/message"),
    dataQuery = require("../../data/query");

require("./ui.data_grid.editor_factory");

var DATAGRID_SEARCH_PANEL_CLASS = "dx-datagrid-search-panel",
    DATAGRID_SEARCH_TEXT_CLASS = "dx-datagrid-search-text",
    FILTERING_TIMEOUT = 700;


function allowSearch(column) {
    return commonUtils.isDefined(column.allowSearch) ? column.allowSearch : column.allowFiltering;
}

function parseValue(column, text) {
    var lookup = column.lookup;
    if(lookup) {
        return column.parseValue.call(lookup, text);
    } else {
        return column.parseValue ? column.parseValue(text) : text;
    }
}


gridCore.registerModule("search", {
    defaultOptions: function() {
        return {
            /**
         * @name dxDataGridOptions_searchPanel
         * @publicName searchPanel
         * @type object
         */
            searchPanel: {
                /**
                 * @name dxDataGridOptions_searchPanel_visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxDataGridOptions_searchPanel_width
                 * @publicName width
                 * @type number
                 * @default 160
                 */
                width: 160,
                /**
                 * @name dxDataGridOptions_searchPanel_placeholder
                 * @publicName placeholder
                 * @type string
                 * @default "Search..."
                 */
                placeholder: messageLocalization.format("dxDataGrid-searchPanelPlaceholder"),
                /**
                 * @name dxDataGridOptions_searchPanel_highlightSearchText
                 * @publicName highlightSearchText
                 * @type boolean
                 * @default true
                 */
                highlightSearchText: true,
                /**
                 * @name dxDataGridOptions_searchPanel_highlightCaseSensitive
                 * @publicName highlightCaseSensitive
                 * @type boolean
                 * @default false
                 */
                highlightCaseSensitive: false,
                /**
                 * @name dxDataGridOptions_searchPanel_text
                 * @publicName text
                 * @type string
                 * @default ""
                 */
                text: "",
                /**
                 * @name dxDataGridOptions_searchPanel_searchVisibleColumnsOnly
                 * @publicName searchVisibleColumnsOnly
                 * @type boolean
                 * @default false
                 */
                searchVisibleColumnsOnly: false
            }
        };
    },
    extenders: {
        controllers: {
            data: (function() {
                var calculateSearchFilter = function(that, text) {
                    var i,
                        column,
                        columns = that._columnsController.getColumns(),
                        searchVisibleColumnsOnly = that.option("searchPanel.searchVisibleColumnsOnly"),
                        filterValue,
                        lookup,
                        filters = [];

                    if(!text) return null;

                    function onQueryDone(items) {
                        var i,
                            valueGetter = compileGetter(lookup.valueExpr),
                            value;

                        for(i = 0; i < items.length; i++) {
                            value = valueGetter(items[i]);
                            filters.push(column.createFilterExpression(value, null, "search"));
                        }
                    }

                    for(i = 0; i < columns.length; i++) {
                        column = columns[i];

                        if(searchVisibleColumnsOnly && !column.visible) continue;

                        if(allowSearch(column) && column.calculateFilterExpression) {
                            lookup = column.lookup;
                            filterValue = parseValue(column, text);
                            if(lookup && lookup.items) {
                                dataQuery(lookup.items).filter(column.createFilterExpression.call({ dataField: lookup.displayExpr, dataType: lookup.dataType, calculateFilterExpression: column.calculateFilterExpression }, filterValue, null, "search")).enumerate().done(onQueryDone);
                            } else {
                                if(filterValue !== undefined) {
                                    filters.push(column.createFilterExpression(filterValue, null, "search"));
                                }
                            }
                        }
                    }

                    return gridCore.combineFilters(filters, "or");
                };

                return {
                    publicMethods: function() {
                        return this.callBase().concat(["searchByText"]);
                    },
                    _calculateAdditionalFilter: function() {
                        var that = this,
                            filter = that.callBase(),
                            searchFilter = calculateSearchFilter(that, that.option("searchPanel.text"));

                        return gridCore.combineFilters([filter, searchFilter]);
                    },
                    /**
                     * @name dxDataGridMethods_searchByText
                     * @publicName searchByText(text)
                     * @param1 text:string
                     */
                    searchByText: function(text) {
                        this.option("searchPanel.text", text);
                    },

                    optionChanged: function(args) {
                        var that = this;

                        switch(args.fullName) {
                            case "searchPanel.text":
                            case "searchPanel":
                                that._applyFilter();
                                args.handled = true;
                                break;
                            default:
                                that.callBase(args);
                        }
                    }
                };
            })()
        },
        views: {
            headerPanel: (function() {
                var getSearchPanelOptions = function(that) {
                    return that.option("searchPanel");
                };

                return {
                    _getToolbarItems: function() {
                        var items = this.callBase();

                        return this._prepareSearchItem(items);
                    },

                    _prepareSearchItem: function(items) {
                        var that = this,
                            dataController = that.getController("data"),
                            searchPanelOptions = getSearchPanelOptions(that);

                        if(searchPanelOptions && searchPanelOptions.visible) {
                            var toolbarItem = {
                                template: function(data, index, $container) {
                                    var $search = $("<div>")
                                            .addClass(DATAGRID_SEARCH_PANEL_CLASS)
                                            .appendTo($container);

                                    that.setAria("label", messageLocalization.format("dxDataGrid-ariaSearchInGrid"), $search);

                                    that.getController("editorFactory").createEditor($search, {
                                        width: searchPanelOptions.width,
                                        placeholder: searchPanelOptions.placeholder,
                                        parentType: "searchPanel",
                                        value: that.option("searchPanel.text"),
                                        updateValueTimeout: FILTERING_TIMEOUT,
                                        setValue: function(value) {
                                            dataController.searchByText(value);
                                        }
                                    });

                                    that.resize();
                                },
                                name: "searchPanel",
                                location: "after",
                                locateInMenu: "never",
                                sortIndex: 50
                            };

                            items.push(toolbarItem);
                        }

                        return items;
                    },

                    _getSearchTextEditor: function() {
                        var $searchPanel = this.element().find("." + DATAGRID_SEARCH_PANEL_CLASS);

                        if($searchPanel.length) {
                            return $searchPanel.dxTextBox("instance");
                        }
                        return null;
                    },

                    isVisible: function() {
                        var searchPanelOptions = getSearchPanelOptions(this);
                        return this.callBase() || (searchPanelOptions && searchPanelOptions.visible);

                    },

                    optionChanged: function(args) {
                        if(args.name === "searchPanel") {

                            if(args.fullName === "searchPanel.text") {
                                var editor = this._getSearchTextEditor();
                                if(editor) {
                                    editor.option("value", args.value);
                                }
                            } else {
                                this._invalidate();
                            }

                            args.handled = true;
                        } else {
                            this.callBase(args);
                        }
                    }
                };
            })(),
            rowsView: {
                _highlightSearchText: function(cellElement, isEquals, column) {
                    var that = this,
                        $parent,
                        searchText = that.option("searchPanel.text");

                    if(searchText && that.option("searchPanel.highlightSearchText")) {
                        var normalizeString = that.option("searchPanel.highlightCaseSensitive") ? function(str) { return str; } : function(str) { return str.toLowerCase(); };

                        if(isEquals && column) {
                            var value = parseValue(column, searchText),
                                formatOptions = gridCore.getFormatOptionsByColumn(column, "search");

                            searchText = gridCore.formatValue(value, formatOptions);
                            if(!searchText) return;
                        }

                        $parent = cellElement.parent();
                        if(!$parent.length) {
                            $parent = $("<div>").append(cellElement);
                        }

                        $.each($parent.find(selectors.icontains + "('" + searchText + "')"), function(index, element) {
                            $.each($(element).contents(), function(index, content) {
                                if(content.nodeType !== 3) return;

                                var highlightSearchTextInTextNode = function($content, searchText) {
                                    var $searchTextSpan = $("<span />").addClass(DATAGRID_SEARCH_TEXT_CLASS),
                                        text = $content.text(),
                                        index = normalizeString(text).indexOf(normalizeString(searchText));

                                    if(index >= 0) {
                                        if($content[0].textContent) {
                                            $content[0].textContent = text.substr(0, index);
                                        } else {
                                            $content[0].nodeValue = text.substr(0, index);
                                        }
                                        $content.after($searchTextSpan.text(text.substr(index, searchText.length)));

                                        $content = $(document.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);
                                        return highlightSearchTextInTextNode($content, searchText);
                                    }
                                };

                                if(isEquals) {
                                    if(normalizeString($(content).text()) === normalizeString(searchText)) {
                                        $(this).replaceWith($("<span />").addClass(DATAGRID_SEARCH_TEXT_CLASS).text($(content).text()));
                                    }
                                } else {
                                    highlightSearchTextInTextNode($(content), searchText);
                                }
                            });
                        });
                    }
                },

                _renderCore: function() {
                    this.callBase.apply(this, arguments);

                    if(this.option("rowTemplate")) {
                        //T103538
                        this._highlightSearchText(this._getTableElement());
                    }
                },

                _updateCell: function($cell, parameters) {
                    var that = this,
                        column = parameters.column,
                        dataType = column.lookup && column.lookup.dataType || column.dataType,
                        isEquals = dataType !== "string";

                    if(allowSearch(column)) {
                        that._highlightSearchText($cell, isEquals, column);
                    }

                    that.callBase($cell, parameters);
                }
            }
        }
    }
});
