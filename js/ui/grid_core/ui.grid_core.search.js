import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { isDefined } from '../../core/utils/type';
import { compileGetter } from '../../core/utils/data';
import { each } from '../../core/utils/iterator';
import gridCoreUtils from './ui.grid_core.utils';
import messageLocalization from '../../localization/message';
import dataQuery from '../../data/query';

const SEARCH_PANEL_CLASS = 'search-panel';
const SEARCH_TEXT_CLASS = 'search-text';
const HEADER_PANEL_CLASS = 'header-panel';
const FILTERING_TIMEOUT = 700;


function allowSearch(column) {
    return isDefined(column.allowSearch) ? column.allowSearch : column.allowFiltering;
}

function parseValue(column, text) {
    const lookup = column.lookup;

    if(!column.parseValue) {
        return text;
    }

    if(lookup) {
        return column.parseValue.call(lookup, text);
    }

    return column.parseValue(text);
}


export default {
    defaultOptions: function() {
        return {
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
                placeholder: messageLocalization.format('dxDataGrid-searchPanelPlaceholder'),
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
                text: '',
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
                const calculateSearchFilter = function(that, text) {
                    let i;
                    let column;
                    const columns = that._columnsController.getColumns();
                    const searchVisibleColumnsOnly = that.option('searchPanel.searchVisibleColumnsOnly');
                    let lookup;
                    const filters = [];

                    if(!text) return null;

                    function onQueryDone(items) {
                        const valueGetter = compileGetter(lookup.valueExpr);

                        for(let i = 0; i < items.length; i++) {
                            const value = valueGetter(items[i]);
                            filters.push(column.createFilterExpression(value, null, 'search'));
                        }
                    }

                    for(i = 0; i < columns.length; i++) {
                        column = columns[i];

                        if(searchVisibleColumnsOnly && !column.visible) continue;

                        if(allowSearch(column) && column.calculateFilterExpression) {
                            lookup = column.lookup;
                            const filterValue = parseValue(column, text);
                            if(lookup && lookup.items) {
                                dataQuery(lookup.items).filter(column.createFilterExpression.call({ dataField: lookup.displayExpr, dataType: lookup.dataType, calculateFilterExpression: column.calculateFilterExpression }, filterValue, null, 'search')).enumerate().done(onQueryDone);
                            } else {
                                if(filterValue !== undefined) {
                                    filters.push(column.createFilterExpression(filterValue, null, 'search'));
                                }
                            }
                        }
                    }

                    return gridCoreUtils.combineFilters(filters, 'or');
                };

                return {
                    publicMethods: function() {
                        return this.callBase().concat(['searchByText']);
                    },
                    _calculateAdditionalFilter: function() {
                        const that = this;
                        const filter = that.callBase();
                        const searchFilter = calculateSearchFilter(that, that.option('searchPanel.text'));

                        return gridCoreUtils.combineFilters([filter, searchFilter]);
                    },

                    searchByText: function(text) {
                        this.option('searchPanel.text', text);
                    },

                    optionChanged: function(args) {
                        const that = this;

                        switch(args.fullName) {
                            case 'searchPanel.text':
                            case 'searchPanel':
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
                const getSearchPanelOptions = function(that) {
                    return that.option('searchPanel');
                };

                return {
                    _getToolbarItems: function() {
                        const items = this.callBase();

                        return this._prepareSearchItem(items);
                    },

                    _prepareSearchItem: function(items) {
                        const that = this;
                        const dataController = that.getController('data');
                        const searchPanelOptions = getSearchPanelOptions(that);

                        if(searchPanelOptions && searchPanelOptions.visible) {
                            const toolbarItem = {
                                template: function(data, index, container) {
                                    const $search = $('<div>')
                                        .addClass(that.addWidgetPrefix(SEARCH_PANEL_CLASS))
                                        .appendTo(container);

                                    that.getController('editorFactory').createEditor($search, {
                                        width: searchPanelOptions.width,
                                        placeholder: searchPanelOptions.placeholder,
                                        parentType: 'searchPanel',
                                        value: that.option('searchPanel.text'),
                                        updateValueTimeout: FILTERING_TIMEOUT,
                                        setValue: function(value) {
                                            dataController.searchByText(value);
                                        },
                                        editorOptions: {
                                            inputAttr: {
                                                'aria-label': messageLocalization.format(`${that.component.NAME}-ariaSearchInGrid`)
                                            }
                                        }
                                    });

                                    that.resize();
                                },
                                name: 'searchPanel',
                                location: 'after',
                                locateInMenu: 'never',
                                sortIndex: 40
                            };

                            items.push(toolbarItem);
                        }

                        return items;
                    },

                    getSearchTextEditor: function() {
                        const that = this;
                        const $element = that.element();
                        const $searchPanel = $element.find('.' + that.addWidgetPrefix(SEARCH_PANEL_CLASS)).filter(function() {
                            return $(this).closest('.' + that.addWidgetPrefix(HEADER_PANEL_CLASS)).is($element);
                        });

                        if($searchPanel.length) {
                            return $searchPanel.dxTextBox('instance');
                        }
                        return null;
                    },

                    isVisible: function() {
                        const searchPanelOptions = getSearchPanelOptions(this);
                        return this.callBase() || (searchPanelOptions && searchPanelOptions.visible);

                    },

                    optionChanged: function(args) {
                        if(args.name === 'searchPanel') {

                            if(args.fullName === 'searchPanel.text') {
                                const editor = this.getSearchTextEditor();
                                if(editor) {
                                    editor.option('value', args.value);
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
                    const value = parseValue(column, searchText);
                    const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'search');
                    return gridCoreUtils.formatValue(value, formatOptions);
                },

                _getStringNormalizer: function() {
                    const isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
                    return function(str) {
                        return isCaseSensitive ? str : str.toLowerCase();
                    };
                },

                _findHighlightingTextNodes: function(column, cellElement, searchText) {
                    const that = this;
                    let $parent = cellElement.parent();
                    let $items;
                    const stringNormalizer = this._getStringNormalizer();
                    const normalizedSearchText = stringNormalizer(searchText);

                    if(!$parent.length) {
                        $parent = $('<div>').append(cellElement);
                    } else if(column) {
                        if(column.groupIndex >= 0 && !column.showWhenGrouped) {
                            $items = cellElement;
                        } else {
                            const columnIndex = that._columnsController.getVisibleIndex(column.index);
                            $items = $parent.children('td').eq(columnIndex).find('*');
                        }
                    }
                    $items = $items?.length ? $items : $parent.find('*');

                    $items = $items.filter(function(_, element) {
                        const $contents = $(element).contents();
                        for(let i = 0; i < $contents.length; i++) {
                            const node = $contents.get(i);
                            if(node.nodeType === 3) {
                                return stringNormalizer(node.textContent || node.nodeValue).indexOf(normalizedSearchText) > -1;
                            }
                            return false;
                        }
                    });

                    return $items;
                },

                _highlightSearchTextCore: function($textNode, searchText) {
                    const that = this;
                    const $searchTextSpan = $('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS));
                    const text = $textNode.text();
                    const firstContentElement = $textNode[0];
                    const stringNormalizer = this._getStringNormalizer();
                    const index = stringNormalizer(text).indexOf(stringNormalizer(searchText));

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
                    const that = this;
                    const stringNormalizer = this._getStringNormalizer();
                    let searchText = that.option('searchPanel.text');

                    if(isEquals && column) {
                        searchText = searchText && that._getFormattedSearchText(column, searchText);
                    }

                    if(searchText && that.option('searchPanel.highlightSearchText')) {
                        const textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);
                        each(textNodes, function(_, element) {
                            each($(element).contents(), function(_, textNode) {
                                if(isEquals) {
                                    if(stringNormalizer($(textNode).text()) === stringNormalizer(searchText)) {
                                        $(this).replaceWith($('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text($(textNode).text()));
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
                    if(this.option('rowTemplate')) {
                        if(this.option('templatesRenderAsynchronously')) {
                            clearTimeout(this._highlightTimer);

                            this._highlightTimer = setTimeout(function() {
                                this._highlightSearchText(this.getTableElement());
                            }.bind(this));
                        } else {
                            this._highlightSearchText(this.getTableElement());
                        }
                    }
                },

                _updateCell: function($cell, parameters) {
                    const column = parameters.column;
                    const dataType = column.lookup && column.lookup.dataType || column.dataType;
                    const isEquals = dataType !== 'string';

                    if(allowSearch(column) && !parameters.isOnForm) {
                        if(this.option('templatesRenderAsynchronously')) {
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
