"use strict";

var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    isDefined = require("../../core/utils/type").isDefined,
    compileGetter = require("../../core/utils/data").compileGetter,
    each = require("../../core/utils/iterator").each,
    gridCoreUtils = require("./ui.grid_core.utils"),
    messageLocalization = require("../../localization/message"),
    dataQuery = require("../../data/query");

var SEARCH_PANEL_CLASS = "search-panel",
    SEARCH_TEXT_CLASS = "search-text",
    FILTERING_TIMEOUT = 700;


function allowSearch(column) {
    return isDefined(column.allowSearch) ? column.allowSearch : column.allowFiltering;
}

function parseValue(column, text) {
    var lookup = column.lookup;
    if(lookup) {
        return column.parseValue.call(lookup, text);
    } else {
        return column.parseValue ? column.parseValue(text) : text;
    }
}


module.exports = {
    defaultOptions: function() {
        return {
         /**
         * @name GridBaseOptions.searchPanel
         * @type object
         */
            searchPanel: {
                /**
                 * @name GridBaseOptions.searchPanel.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name GridBaseOptions.searchPanel.width
                 * @type number
                 * @default 160
                 */
                width: 160,
                /**
                 * @name GridBaseOptions.searchPanel.placeholder
                 * @type string
                 * @default "Search..."
                 */
                placeholder: messageLocalization.format("dxDataGrid-searchPanelPlaceholder"),
                /**
                 * @name GridBaseOptions.searchPanel.highlightSearchText
                 * @type boolean
                 * @default true
                 */
                highlightSearchText: true,
                /**
                 * @name GridBaseOptions.searchPanel.highlightCaseSensitive
                 * @type boolean
                 * @default false
                 */
                highlightCaseSensitive: false,
                /**
                 * @name GridBaseOptions.searchPanel.text
                 * @type string
                 * @default ""
                 * @fires GridBaseOptions.onOptionChanged
                 */
                text: "",
                /**
                 * @name GridBaseOptions.searchPanel.searchVisibleColumnsOnly
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

                    return gridCoreUtils.combineFilters(filters, "or");
                };

                return {
                    publicMethods: function() {
                        return this.callBase().concat(["searchByText"]);
                    },
                    _calculateAdditionalFilter: function() {
                        var that = this,
                            filter = that.callBase(),
                            searchFilter = calculateSearchFilter(that, that.option("searchPanel.text"));

                        return gridCoreUtils.combineFilters([filter, searchFilter]);
                    },

                    /**
                     * @name GridBaseMethods.searchByText
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
                                template: function(data, index, container) {
                                    var $search = $("<div>")
                                            .addClass(that.addWidgetPrefix(SEARCH_PANEL_CLASS))
                                            .appendTo(container);

                                    that.getController("editorFactory").createEditor($search, {
                                        width: searchPanelOptions.width,
                                        placeholder: searchPanelOptions.placeholder,
                                        parentType: "searchPanel",
                                        value: that.option("searchPanel.text"),
                                        updateValueTimeout: FILTERING_TIMEOUT,
                                        setValue: function(value) {
                                            dataController.searchByText(value);
                                        },
                                        editorOptions: {
                                            inputAttr: {
                                                "aria-label": messageLocalization.format("dxDataGrid-ariaSearchInGrid")
                                            }
                                        }
                                    });

                                    that.resize();
                                },
                                name: "searchPanel",
                                location: "after",
                                locateInMenu: "never",
                                sortIndex: 40
                            };

                            items.push(toolbarItem);
                        }

                        return items;
                    },

                    _getSearchTextEditor: function() {
                        var $searchPanel = this.element().find("." + this.addWidgetPrefix(SEARCH_PANEL_CLASS));

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
                init: function() {
                    this.callBase.apply(this, arguments);
                    this._searchParams = [];
                },

                _getFormattedSearchText: function(column, searchText) {
                    var value = parseValue(column, searchText),
                        formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, "search");
                    return gridCoreUtils.formatValue(value, formatOptions);
                },

                _getStringNormalizer: function() {
                    var isCaseSensitive = this.option("searchPanel.highlightCaseSensitive");
                    return function(str) {
                        return isCaseSensitive ? str : str.toLowerCase();
                    };
                },

                _findHighlightingTextNodes: function(column, cellElement, searchText) {
                    var that = this,
                        $parent = cellElement.parent(),
                        $items,
                        columnIndex,
                        stringNormalizer = this._getStringNormalizer(),
                        normalizedSearchText = stringNormalizer(searchText);

                    if(!$parent.length) {
                        $parent = $("<div>").append(cellElement);
                    } else if(column) {
                        columnIndex = that._columnsController.getVisibleIndex(column.index);
                        $items = $parent.children("td").eq(columnIndex).find("*");
                    }
                    $items = $items || $parent.find("*");

                    $items = $items.filter(function(_, element) {
                        var $contents = $(element).contents();
                        for(var i = 0; i < $contents.length; i++) {
                            var node = $contents.get(i);
                            if(node.nodeType === 3) {
                                return stringNormalizer(node.textContent || node.nodeValue).indexOf(normalizedSearchText) > -1;
                            }
                            return false;
                        }
                    });

                    return $items;
                },

                _highlightSearchTextCore: function($textNode, searchText) {
                    var that = this,
                        $searchTextSpan = $("<span>").addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)),
                        text = $textNode.text(),
                        firstContentElement = $textNode[0],
                        stringNormalizer = this._getStringNormalizer(),
                        index = stringNormalizer(text).indexOf(stringNormalizer(searchText));

                    if(index >= 0) {
                        if(firstContentElement.textContent) {
                            firstContentElement.textContent = text.substr(0, index);
                        } else {
                            firstContentElement.nodeValue = text.substr(0, index);
                        }
                        $textNode.after($searchTextSpan.text(text.substr(index, searchText.length)));

                        $textNode = $(domAdapter.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);

                        return that._highlightSearchTextCore($textNode, searchText);
                    }
                },

                _highlightSearchText: function(cellElement, isEquals, column) {
                    var that = this,
                        stringNormalizer = this._getStringNormalizer(),
                        searchText = that.option("searchPanel.text");

                    if(isEquals && column) {
                        searchText = searchText && that._getFormattedSearchText(column, searchText);
                    }

                    if(searchText && that.option("searchPanel.highlightSearchText")) {
                        var textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);
                        each(textNodes, function(_, element) {
                            each($(element).contents(), function(_, textNode) {
                                if(isEquals) {
                                    if(stringNormalizer($(textNode).text()) === stringNormalizer(searchText)) {
                                        $(this).replaceWith($("<span>").addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text($(textNode).text()));
                                    }
                                } else {
                                    that._highlightSearchTextCore($(textNode), searchText);
                                }
                            });
                        });
                    }
                },

                _renderCore: function() {
                    this.callBase.apply(this, arguments);

                    // T103538
                    if(this.option("rowTemplate")) {
                        if(this.option("templatesRenderAsynchronously")) {
                            clearTimeout(this._highlightTimer);

                            this._highlightTimer = setTimeout(function() {
                                this._highlightSearchText(this._getTableElement());
                            }.bind(this));
                        } else {
                            this._highlightSearchText(this._getTableElement());
                        }
                    }
                },

                _updateCell: function($cell, parameters) {
                    var column = parameters.column,
                        dataType = column.lookup && column.lookup.dataType || column.dataType,
                        isEquals = dataType !== "string";

                    if(allowSearch(column)) {
                        if(this.option("templatesRenderAsynchronously")) {
                            if(!this._searchParams.length) {
                                clearTimeout(this._highlightTimer);

                                this._highlightTimer = setTimeout(function() {
                                    this._searchParams.forEach(function(params) {
                                        this._highlightSearchText.apply(this, params);
                                    }.bind(this));

                                    this._searchParams = [];
                                }.bind(this));
                            }
                            this._searchParams.push([$cell, isEquals, column]);
                        } else {
                            this._highlightSearchText($cell, isEquals, column);
                        }
                    }

                    this.callBase($cell, parameters);
                },

                dispose: function() {
                    clearTimeout(this._highlightTimer);
                    this.callBase();
                }
            }
        }
    }
};
