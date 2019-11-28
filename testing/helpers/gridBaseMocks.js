module.exports = function($, gridCore, columnResizingReordering, domUtils, commonUtils, typeUtils, ArrayStore, nameWidget) {
    var exports = {};

    exports.MockDataController = function(options) {

        if(!typeUtils.isDefined(options.itemsCount)) {
            options.itemsCount = 100;
        }

        if(!typeUtils.isDefined(options.selectionMode)) {
            options.selectionMode = 'single';
        }

        if(options.items) {
            for(var i = 0; i < options.items.length; i++) {
                if(options.items[i].rowIndex === undefined) {
                    options.items[i].rowIndex = i;
                }
            }
        }

        return {
            _applyFilter: function() {
                this._isFilterApplied = true;
            },

            changedArgs: [],

            dataSource: function() {
                return {
                    beginLoading: function() {
                    },
                    endLoading: function() {
                    },
                    remoteOperations: function() {
                        return {};
                    },
                    loadOptions: function() {
                        return {};
                    },
                    store: function() {
                        return new ArrayStore(options.items);
                    },
                    load: function(options) {
                        return this.store().load(options);
                    }
                };
            },

            pageSize: function(value) {
                if(value === undefined) {
                    return options.pageSize;
                } else {
                    options.pageSize = value;
                }
                this.updatePagesCount(1);
            },

            getPageSizes: function() {
                return typeUtils.isDefined(options.pageSizes) ? options.pageSizes : [];
            },

            hasKnownLastPage: function() {
                return typeUtils.isDefined(options.hasKnownLastPage) ? options.hasKnownLastPage : true;
            },

            updatePagesCount: function(count) {
                options.pageCount = count;
                this.changed.fire();
            },

            pageCount: function() {
                return options.pageCount;
            },

            totalCount: function() {
                return options.totalCount || 0;
            },

            pageIndex: function(index) {
                if(typeUtils.isDefined(index)) {
                    options.pageIndex = index;
                    this.changed.fire({});
                } else {
                    return options.pageIndex || 0;
                }
            },

            getRowIndexOffset: function() {
                return 0;
            },

            getRowIndexDelta: function() {
                return 0;
            },

            items: function() {
                return options.items;
            },

            getVisibleRows: function() {
                return options.items;
            },

            isEmpty: function() {
                return !options.items || !options.items.length;
            },

            updateItems: function() {
                options.itemsUpdated = true;
                this.changed.fire({
                    changeType: 'refresh',
                    items: options.items
                });
            },

            store: function() {
                return options.store;
            },

            insertItems: function(insertingItems) {
                $.each(insertingItems, function() {
                    options.items.push(this);
                    options.itemsCount++;
                });
                this.changed.fire({
                    changeType: 'refresh',
                    items: options.items
                });
            },

            virtualItemsCount: function() {
                return options.virtualItemsCount;
            },

            viewportSize: function(size) {
                if(size !== undefined) {
                    options.viewportSize = size;
                }
                return options.viewportSize;
            },

            viewportItemSize: function() {},

            setContentSize: function() {},

            setViewportItemIndex: function(index) {
                options.viewportItemIndex = index;
            },

            setViewportPosition: function() {},

            getVirtualContentSize: function() { return 0; },

            getContentOffset: function(type) { return options.virtualItemsCount ? options.virtualItemsCount[type || "begin"] * 20 : 0; },

            itemsCount: function() {
                return options.itemsCount;
            },

            totalItemsCount: function() {
                return options.totalItemsCount;
            },

            isLoading: function() {
                return false;
            },

            isStateLoading: function() {
                return false;
            },

            isLoaded: function() {
                return options.isLoaded !== undefined ? options.isLoaded : true;
            },

            isLocalStore: function() {
                return false;
            },

            searchByText: function(text) {
                options.component.option("searchPanel.text", text);
            },

            changeRowExpand: function(path) {
                options.groupExpandPath = path;
            },

            getKeyByRowIndex: function(rowIndex) { },

            refresh: function() {
                this.refreshed = true;
                this.changed.fire({
                    changeType: 'refresh',
                    rows: options.rows
                });
            },

            reset: function() {},

            footerItems: function() {
                var result = [];
                options.totalItem && result.push(options.totalItem);
                return result;
            },

            getUserState: function() {
                return {
                    pageIndex: this.pageIndex(),
                    pageSize: this.pageSize()
                };
            },

            getCombinedFilter: commonUtils.noop,

            getRowIndexByKey: function() {
                return -1;
            },

            loadingOperationTypes: function() {
                return {};
            },

            skipProcessingPagingChange: commonUtils.noop,
            changed: $.Callbacks(),
            loadingChanged: $.Callbacks(),
            pageChanged: $.Callbacks(),
            dataSourceChanged: $.Callbacks(),
            fireError: function() { },
        };
    };

    exports.MockEditingController = function() {
        return {
            addRowCallCount: 0,
            deleteRowCallCount: 0,
            editRowCallCount: 0,
            saveEditRowCallCount: 0,
            cancelEditRowCallCount: 0,
            _isEditing: false,
            addRow: function() {
                this.addRowCallCount++;
            },
            getFirstEditableCellInRow: function() {
                return $([]);
            },
            deleteRow: function(rowIndex) {
                this.rowIndex = rowIndex;
                this.deleteRowCallCount++;
            },
            editRow: function(rowIndex) {
                this.rowIndex = rowIndex;
                this.editRowCallCount++;
            },
            saveEditRow: function() {
                this.saveEditRowCallCount++;
            },
            cancelEditRow: function() {
                this.cancelEditRowCallCount++;
            },
            isEditing: function() {
                return this._isEditing;
            },
            isEditRow: function(visibleIndex) {
                return this._isEditing;
            },
            getEditMode: commonUtils.noop,
            allowUpdating: commonUtils.noop
        };
    };

    exports.MockSelectionController = function(options) {
        return {
            startSelectionWithCheckboxes: function() {
                options.isSelectionWithCheckboxes = true;
            },
            stopSelectionWithCheckboxes: function() {
                options.isSelectionWithCheckboxes = false;
            },
            isSelectionWithCheckboxes: function() {
                return !!options.isSelectionWithCheckboxes;
            },
            isSelectColumnVisible: function() {
                return options.selectionMode === 'multiple';
            },
            changeItemSelection: function(index, additionalKeys) {
                options.changeItemSelectionCallsCount = options.changeItemSelectionCallsCount || 0;
                options.changeItemSelectionCallsCount++;
                options.changeItemSelectionArgs = [index];
                options.additionalKeys = additionalKeys;
                return options.changeItemSelectionResult;
            },
            selectAll: function() {
                options.isSelectAllCalled = true;
            },
            selectionChanged: $.Callbacks()
        };
    };

    exports.MockColumnsController = function(columns, commonColumnSettings) {
        for(var key in columns) {
            if(Array.isArray(columns[key])) {
                break;
            }
            columns[key] = $.extend({}, commonColumnSettings, columns[key]);
            columns[key].index = parseInt(key);
        }

        return {
            updateOptions: [],

            moveColumn: function(sourceColumnIndex, targetColumnIndex, sourceLocation, targetLocation) {
            },

            allowMoveColumn: function() {
                return true;
            },

            getCommonSettings: function() {
                return commonColumnSettings || {};
            },

            isColumnOptionUsed: function(optionName) {
                return this.getCommonSettings()[optionName];
            },

            columnsChanged: $.Callbacks(),

            getColumns: function() {
                return columns;
            },

            isBandColumnsUsed: function() {
                return this.getColumns().some(function(column) {
                    return column.isBand;
                });
            },

            getVisibleIndex: function(index, rowIndex) {
                var visibleColumn = this.getRowCount() > 1 && typeUtils.isDefined(rowIndex) ? columns[rowIndex] : columns;

                for(var i = 0; i < visibleColumn.length; i++) {
                    if(visibleColumn[i].index === index) {
                        return i;
                    }
                }
                return -1;
            },

            getVisibleColumns: function(rowIndex) {
                if(this.getRowCount() > 1) {
                    return typeUtils.isDefined(rowIndex) ? columns[rowIndex] : columns[columns.length - 1];
                }

                return columns;
            },

            // TODO: set fixed columns option
            getFixedColumns: function(rowIndex) {
                var visibleColumns = this.getVisibleColumns(rowIndex),
                    result = [],
                    rowCount = this.getRowCount(),
                    indexTransparentColumn,
                    colspan = 0;

                if(this._isColumnFixing()) {
                    $.each(visibleColumns, function(index, column) {
                        if(column.fixed || column.command) {
                            result.push(column);
                        } else {
                            if(!typeUtils.isDefined(indexTransparentColumn)) {
                                indexTransparentColumn = index;
                            }
                            colspan += column.colspan || 1;
                        }
                    });

                    result.splice(indexTransparentColumn, 0, { command: "transparent", colspan: colspan, rowspan: rowCount });
                }

                return result;
            },

            _isColumnFixing: function() {
                var i,
                    columnsByRowIndex,
                    isColumnFixing,
                    rowCount = this.getRowCount();

                function processColumn() {
                    if(this.fixed) {
                        isColumnFixing = true;
                        return false;
                    }
                }

                for(i = 0; i < rowCount; i++) {
                    columnsByRowIndex = rowCount > 1 ? columns[i] : columns;
                    $.each(columnsByRowIndex, processColumn);
                }

                return isColumnFixing;
            },
            getInvisibleColumns: function() {
                var hiddenColumns = [];

                $.each(columns, function(_, column) {
                    if(!column.visible) {
                        hiddenColumns.push(column);
                    }
                });

                return hiddenColumns;
            },
            getHiddenColumns: function() {
                return [];
            },
            getHidingColumnsQueue: function() {
                return [];
            },

            updateHidingQueue: commonUtils.noop,

            getChooserColumns: function(getAllColumns) {
                var chooserColumns = [];

                $.each(columns, function(_, column) {
                    var canShownInColumnChooser = column.showInColumnChooser !== false;

                    if(!column.visible && canShownInColumnChooser || getAllColumns && canShownInColumnChooser) {
                        chooserColumns.push(column);
                    }
                });

                return chooserColumns;
            },

            hasFilter: function() {
                return false;
            },

            getRowCount: function() {
                return columns && Array.isArray(columns[0]) ? columns.length - 1 : 1;
            },

            getRowIndex: function(columnIndex) {
                if(this.getRowCount() > 1) {
                    for(var i = 0; i < columns[columns.length - 1].length; i++) {
                        if(columns[columns.length - 1][i].index === columnIndex) {
                            return columns[columns.length - 1][i].rowIndex;
                        }
                    }
                }

                return 0;
            },

            isParentBandColumn: function() {
                return true;
            },

            beginUpdate: function() { },

            endUpdate: function() { },

            columnOption: function(columnIndex, optionName, optionValue, notFireEvent) {
                var i;

                if(columnIndex !== undefined) {
                    if(arguments.length === 1) {
                        return columns[columnIndex];
                    }
                    if(typeUtils.isString(columnIndex)) {
                        if(columnIndex.indexOf("command:") === 0) {
                            var commandName = columnIndex.substr("command:".length);
                            for(i = 0; i < columns.length; i++) {
                                if(columns[i].command === commandName) {
                                    columns[i][optionName] = optionValue;
                                }
                            }
                        } else {
                            for(i = 0; i < columns.length; i++) {
                                if(columns[i].name === columnIndex || columns[i].dataField === columnIndex || columns[i].caption === columnIndex) {
                                    columns[i][optionName] = optionValue;
                                }
                            }
                        }
                    } else if(typeUtils.isString(optionName)) {
                        columns[columnIndex][optionName] = optionValue;
                    } else if(typeUtils.isObject(optionName)) {
                        $.each(optionName, function(name, value) {
                            columns[columnIndex][name] = value;
                        });
                    }

                    var updateOption = {
                        columnIndex: columnIndex,
                        optionName: optionName,
                        optionValue: optionValue
                    };

                    if(notFireEvent) {
                        updateOption.notFireEvent = notFireEvent;
                    }
                    this.updateOptions.push(updateOption);
                }
            },

            addCommandColumn: function(commandColumn) {
                columns && columns.forEach(function(column, index) {
                    if(column.command === commandColumn.command) {
                        columns[index] = commandColumn;
                    }
                });
            },

            changeSortOrder: function(columnIndex, sortOrder) {
                var column,
                    nextSorting = function(column) {
                        switch(column.sortOrder) {
                            case 'asc': return 'desc';
                            case 'desc': return column.groupIndex !== undefined ? 'asc' : null;
                        }
                        return 'asc';
                    };

                $.each(columns, function() {
                    if(this.index === columnIndex) {
                        column = this;
                        return true;
                    }
                });

                if(column) {
                    if(sortOrder === 'asc' || sortOrder === 'desc') {
                        if(column.sortOrder !== sortOrder) {
                            column.sortOrder = sortOrder;
                        }
                    } else if(sortOrder === 'none') {
                        if(column.sortOrder) {
                            delete column.sortOrder;
                        }
                    } else {
                        column.sortOrder = nextSorting(column);
                    }

                    this.columnsChanged.fire({
                        changeTypes: { sorting: true, length: 1 },
                        optionNames: { length: 0 }
                    });
                }
            },

            startSelectionWithCheckboxes: function(checkBoxColumn) {
                columns.splice(0, 0, checkBoxColumn);
                this.columnsChanged.fire({ changeTypes: { columns: true, length: 1 }, optionNames: { length: 0 } });
            },

            getGroupColumns: function() {
                var visibleGroupColumns = [];

                $.each(columns, function(index, column) {
                    if(typeUtils.isDefined(column.groupIndex)) {
                        visibleGroupColumns.push(column);
                    }
                });

                return visibleGroupColumns;
            },

            isDataSourceApplied: function() {
                return true;
            },

            isParentColumnVisible: function() {
                return true;
            },

            getFirstDataColumnIndex: function() {
                var visibleColumns = this.getVisibleColumns(),
                    visibleColumnsLength = visibleColumns.length,
                    firstDataColumnIndex = 0;

                for(var i = 0; i <= visibleColumnsLength - 1; i++) {
                    if(!typeUtils.isDefined(visibleColumns[i].command)) {
                        firstDataColumnIndex = visibleColumns[i].index;
                        break;
                    }
                }

                return firstDataColumnIndex;
            },

            refresh: function() {
                return $.Deferred().resolve();
            },

            isAllDataTypesDefined: function() {
            },

            getColumnId: function(column) {
                return column.command ? "command:" + column.command : column.index;
            }
        };
    };

    exports.MockTablePositionViewController = function() {
        return {
            positionChanged: $.Callbacks(),
            update: function() {
                this.positionChanged.fire({});
            }
        };
    };

    exports.MockGridDataSource = function(options) {
        return {
            // TODO remove
            options: function() {
                return options;
            },
            _createStoreLoadOptions: function() {
                return {};
            },
            isLastPage: function() {
                return options.isLastPage;
            },
            pageSize: function(value) {
                if(value === undefined) {
                    return options.pageSize || 20;
                }

                options.pageSize = value || 20;
                options.pageIndex = 0;
            },
            paginate: function() {
                return !!options.pageSize;
            },
            itemsCount: function() {
                return options.itemsCount || options.items ? options.items.length : 0;
            },
            totalItemsCount: function() {
                return options.totalItemsCount || 0;
            },
            totalCount: function() {
                return options.itemsCount || 0;
            },
            load: function() {
                options.loaded = true;
                this.changed.fire();
                return $.Deferred().resolve();
            },
            reload: function() {
                options.reloaded = true;
                this.changed.fire();
                return $.Deferred().resolve();
            },
            isLoading: function() {
                return options.isLoading;
            },
            isLoaded: function() {
                return options.isLoaded !== undefined ? options.isLoaded : true;
            },
            filter: function() {
                return options.filter;
            },
            group: function() {
                return options.group;
            },
            sort: function() {
                return options.sort;
            },
            requireTotalCount: function() {
                return true;
            },
            items: function() {
                return options.items;
            },
            pageIndex: function(index) {
                if(index === undefined) {
                    return options.pageIndex || 0;
                }

                options.pageIndex = index;
            },
            changeRowExpand: function(path) {
                options.groupExpandPath = path;
                this.changed.fire();
            },
            collapseAll: function(groupIndex) {
                options.collapseAllComplete = true;
                options.collapseAllGroupIndex = groupIndex;
                return true;
            },
            expandAll: function(groupIndex) {
                options.expandAllComplete = true;
                options.expandAllGroupIndex = groupIndex;
                return true;
            },
            hasKnownLastPage: function() {
                return options.hasKnownLastPage !== undefined ? options.hasKnownLastPage : true;
            },
            store: function() {
                return {
                    keyOf: function(data) {
                        return data;
                    },
                    on: commonUtils.noop,
                    off: commonUtils.noop,
                    key: commonUtils.noop
                };
            },
            dispose: function() {
                options.disposed = true;
            },
            changed: $.Callbacks(),
            loadingChanged: $.Callbacks(),
            loadError: $.Callbacks(),
            customizeStoreLoadOptions: $.Callbacks(),
            customizeLoadResult: $.Callbacks(),
            changing: $.Callbacks(),

            cancelAll: commonUtils.noop,

            on: function(eventName, eventHandler) {
                this[eventName].add(eventHandler);
            },
            off: function(eventName, eventHandler) {
                this[eventName].remove(eventHandler);
            }
        };
    };

    exports.getCells = function(rootElement, additionalCssSelector) {
        if(typeUtils.isDefined(additionalCssSelector)) {
            return rootElement.find(additionalCssSelector + ' td');
        } else {
            return rootElement.find('td');
        }
    };

    exports.MockColumnsSeparatorView = function(rootElement, isTransparent, customOffset) {
        var getElement = function() {
            return {
                _offset: customOffset || {
                    top: 0,
                    left: 0
                },
                offset: function(parameters) {
                    if(typeUtils.isDefined(parameters)) {
                        this._offset = parameters;
                    } else {
                        return this._offset;
                    }
                },
                off: commonUtils.noop,
                on: commonUtils.noop,
                length: 0
            };
        };
        return {
            _width: 3,

            element: getElement,

            component: {
                $element: getElement
            },

            init: commonUtils.noop,

            renderCompleted: $.Callbacks(),

            tracker: getElement,

            show: function() {
                this.isShown = true;
            },

            hide: function() {
                this.isShown = false;
            },

            height: function(value) {
                if(typeUtils.isDefined(value)) {
                    this._height = value;
                } else {
                    return this._height;
                }
            },

            width: function(value) {
                if(typeUtils.isDefined(value)) {
                    this._width = value;
                } else {
                    return this._width;
                }
            },

            moveByX: function(x) {
                this.posX = x;
            },

            changeCursor: function(cursorName) {
                this.cursorName = typeUtils.isDefined(cursorName) ? cursorName : '';
            },

            render: function($container) {
                this.renderCompleted.fire();
            }
        };
    };

    exports.MockTrackerView = function() {
        return {
            init: commonUtils.noop,

            show: function() {
                this.isShown = true;
            },

            hide: function() {
                this.isShown = false;
            },

            render: function($container) { }
        };
    };

    exports.MockDraggingPanel = function(options) {
        return {
            element: function() {
                return options.$element;
            },
            getColumnElements: function() {
                return options.columnElements;
            },

            getColumns: function() {
                return options.columns;
            },

            getBoundingRect: function() {
                var offset = options.offset;

                return {
                    right: offset.right,
                    left: offset.left,
                    top: offset.top,
                    bottom: offset.bottom
                };
            },

            getName: function() {
                return options.location;
            },

            getScrollTop: function() {
                return options.scrollTop;
            }

        };
    };

    exports.TestDraggingHeader = columnResizingReordering && columnResizingReordering.DraggingHeaderView.inherit({
        _subscribeToEvents: function(rootElement) { }
    });

    exports["setup" + nameWidget + "Modules"] = function(that, moduleNames, options) {
        var modules = [];

        $.each(gridCore.modules, function() {
            if($.inArray(this.name, moduleNames) !== -1) {
                modules.push(this);
            }
        });

        that.NAME = "dx" + nameWidget;

        that.focus = commonUtils.noop;

        that.setAria = function(name, value, $target) {
            var setAttribute = function(option) {
                var attrName = ($.inArray(option.name, ["role", "id"]) + 1) ? option.name : "aria-" + option.name,
                    attrValue = option.value;

                if(attrValue === null || attrValue === undefined) {
                    attrValue = undefined;
                } else {
                    attrValue = attrValue.toString();
                }

                option.target.attr(attrName, attrValue);
            };

            if(!$.isPlainObject(arguments[0])) {
                setAttribute({
                    name: arguments[0],
                    value: arguments[1],
                    target: arguments[2] || this._getAriaTarget()
                });
            } else {
                $target = arguments[1] || this._getAriaTarget();

                $.each(arguments[0], function(key, value) {
                    setAttribute({
                        name: key,
                        value: value,
                        target: $target
                    });
                });
            }
        };

        that.options = that.options || {};

        that.options.rtlEnabled = !!that.options.rtlEnabled;

        if(that.options.legacyRendering === undefined) {
            that.options.legacyRendering = false;
        }

        that.optionCalled = $.Callbacks();

        that.option = function(options, value) {
            var result = that.options,
                path,
                changed;

            if(typeUtils.isString(options)) {
                path = options.split('.');
                while(result && path.length) {
                    if(arguments.length > 1 && path.length === 1) {
                        if(result[path[0]] !== value) {
                            changed = true;
                            result[path[0]] = value;
                        }
                    }
                    result = result[path[0]];
                    path.shift();
                }
                changed && that.optionCalled.fire(options, value);
                return result;
            }

            if(typeUtils.isObject(options)) {
                $.extend(true, that.options, options);
            }
        };

        if(options) {
            if(options.initDefaultOptions) {
                $.each(modules, function() {
                    if($.isFunction(this.defaultOptions)) {
                        that.option(this.defaultOptions());
                    }
                });
            }

            if(options.options) {
                that.option(options.options);
            }
        }

        that._createComponent = function(element, component, config) {
            config = config || {};

            $.each(["disabled", "rtlEnabled"], function(_, optionName) {
                if(!(optionName in config)) {
                    config[optionName] = that.option(optionName);
                }
            });

            var instance;
            if(typeUtils.isString(component)) {
                var $element = $(element)[component](config);
                instance = $element[component]("instance");
            } else if(element.length) {
                instance = component.getInstance(element);
                if(!instance) {
                    instance = new component(element, config);
                } else {
                    instance.option(config);
                }
            }
            return instance;
        };

        that._notifyOptionChanged = function() {};

        that._createActionByOption = function(optionName, config) {
            this.__actionConfigs = this.__actionConfigs || {};
            this.__actionConfigs[optionName] = config;

            return this.option(optionName);
        };

        that._createAction = function(handler) {
            return handler;
        };

        that.$element = that.$element || function() { };

        that.on = commonUtils.noop;

        that.off = commonUtils.noop;

        that._suppressDeprecatedWarnings = commonUtils.noop;

        that._resumeDeprecatedWarnings = commonUtils.noop;

        that._optionsByReference = {};

        that.dispose = function() {
            $.each(that._controllers, function() {
                this.dispose && this.dispose();
            });
            $.each(that._views, function() {
                this.dispose && this.dispose();
            });
        };

        that._fireContentReadyAction = function() {
        };
        that.beginUpdate = function() { };
        that.endUpdate = function() { };

        gridCore.processModules(that, { modules: modules, modulesOrder: gridCore.modulesOrder });

        that.getController = function(name) {
            return this._controllers[name];
        };

        that.getView = function(name) {
            return this._views[name];
        };

        that.resize = that.resize || function() {
            $.each(that._views, function() {
                this.resize && this.resize();
            });
        };


        options && options.controllers && $.extend(that._controllers, options.controllers);
        options && options.views && $.extend(that._views, options.views);

        $.each(that._controllers, function(name) {
            that[name + 'Controller'] = this;
            this.init && this.init();
        });

        if(options && options.initViews) {
            $.each(that._views, function(name) {
                that[name] = this;
                this.init && this.init();
            });
        }
    };

    exports.generateItems = function(itemCount) {
        var items = [];

        for(var i = 1; i <= itemCount; i++) {
            items.push({ id: i, field1: "test1" + i, field2: "test2" + i, field3: "test3" + i, field4: "test4" + i });
        }

        return items;
    };

    return exports;
};
