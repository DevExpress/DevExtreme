import $ from '../../core/renderer';
import { getImageContainer } from '../../core/utils/icon';
import { hasWindow as hasWindowFn } from '../../core/utils/window';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import localizationMessage from '../../localization/message';
import registerComponent from '../../core/component_registrator';
import { getCompareFunction, foreachDataLevel } from './ui.pivot_grid.utils';
import TreeView from '../tree_view';
import ContextMenu from '../context_menu';
import BaseFieldChooser from './ui.pivot_grid.field_chooser_base';

const DIV = '<div>';
const hasWindow = hasWindowFn();

import './data_source';

const FIELDCHOOSER_CLASS = 'dx-pivotgridfieldchooser';
const FIELDCHOOSER_CONTAINER_CLASS = 'dx-pivotgridfieldchooser-container';
const FIELDS_CONTAINER_CLASS = 'dx-pivotgrid-fields-container';
const AREA_DRAG_CLASS = 'dx-pivotgrid-drag-action';

function getDimensionFields(item, fields) {
    const result = [];

    if(item.items) {
        for(let i = 0; i < item.items.length; i++) {
            result.push.apply(result, getDimensionFields(item.items[i], fields));
        }
    } else {
        if(isDefined(item.index)) {
            result.push(fields[item.index]);
        }
    }
    return result;
}

function getFirstItem(item, condition) {
    if(item.items) {
        for(let i = 0; i < item.items.length; i++) {
            const childrenItem = getFirstItem(item.items[i], condition);
            if(childrenItem) {
                return childrenItem;
            }
        }
    }

    if(condition(item)) {
        return item;
    }
}

const compareOrder = [
    function(a, b) {
        const aValue = -(!!(a.isMeasure));
        const bValue = +(!!(b.isMeasure));

        return aValue + bValue;
    },

    function(a, b) {
        const aValue = -(!!(a.items && a.items.length));
        const bValue = +(!!(b.items && b.items.length));

        return aValue + bValue;
    },

    function(a, b) {
        const aValue = +(!!(a.isMeasure === false && a.field && a.field.levels && a.field.levels.length));
        const bValue = -(!!(b.isMeasure === false && b.field && b.field.levels && b.field.levels.length));

        return aValue + bValue;
    },
    getCompareFunction(function(item) { return item.text; })
];

function compareItems(a, b) {
    let result = 0;
    let i = 0;

    while(!result && compareOrder[i]) {
        result = compareOrder[i++](a, b);
    }

    return result;
}

function getScrollable(container) {
    return container.find('.dx-scrollable').dxScrollable('instance');
}

const FieldChooser = BaseFieldChooser.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            height: 400,
            layout: 0,
            dataSource: null,
            onContextMenuPreparing: null,
            allowSearch: false,
            searchTimeout: 500,
            texts: {
                /**
                 * @name dxPivotGridFieldChooserOptions.texts.columnFields
                 * @type string
                 * @default 'Column Fields'
                 */
                columnFields: localizationMessage.format('dxPivotGrid-columnFields'),
                /**
                 * @name dxPivotGridFieldChooserOptions.texts.rowFields
                 * @type string
                 * @default 'Row Fields'
                 */
                rowFields: localizationMessage.format('dxPivotGrid-rowFields'),
                /**
                 * @name dxPivotGridFieldChooserOptions.texts.dataFields
                 * @type string
                 * @default 'Data Fields'
                 */
                dataFields: localizationMessage.format('dxPivotGrid-dataFields'),
                /**
                 * @name dxPivotGridFieldChooserOptions.texts.filterFields
                 * @type string
                 * @default 'Filter Fields'
                 */
                filterFields: localizationMessage.format('dxPivotGrid-filterFields'),
                /**
                 * @name dxPivotGridFieldChooserOptions.texts.allFields
                 * @type string
                 * @default 'All Fields'
                 */
                allFields: localizationMessage.format('dxPivotGrid-allFields')
            },
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.width
             * @type number
             * @default 252
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.height
             * @type number
             * @default 325
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.allowSearch
             * @type boolean
             * @default undefined
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.showRelevantValues
             * @type boolean
             * @default false
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.searchTimeout
             * @type number
             * @default 500
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.texts
             * @type object
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.texts.emptyValue
             * @type string
             * @default "(Blanks)"
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.texts.ok
             * @type string
             * @default "Ok"
             */
            /**
             * @name dxPivotGridFieldChooserOptions.headerFilter.texts.cancel
             * @type string
             * @default "Cancel"
             */
        });
    },

    _refreshDataSource: function() {
        const that = this;
        that._expandedPaths = [];
        that._changedHandler = that._changedHandler || function() {
            each(that._dataChangedHandlers, function(_, func) {
                func();
            });
            that._fireContentReadyAction();
            that._options.silent('state', that._dataSource.state());
        };

        that._disposeDataSource();

        that.callBase();

        that._dataSource && that._dataSource.on('changed', that._changedHandler);
    },

    _disposeDataSource: function() {
        const that = this;
        const dataSource = that._dataSource;

        if(dataSource) {
            dataSource.off('changed', that._changedHandler);
            that._dataSource = undefined;
        }
    },

    _dispose: function() {
        this._disposeDataSource();
        this.callBase.apply(this, arguments);
    },

    _init: function() {
        this.callBase();
        this._refreshDataSource();
        this._dataChangedHandlers = [];
        this._initActions();
    },

    _initActions: function() {
        this._actions = {
            onContextMenuPreparing: this._createActionByOption('onContextMenuPreparing')
        };
    },

    _trigger: function(eventName, eventArg) {
        this._actions[eventName](eventArg);
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            dataSource: true
        });
    },

    _optionChanged: function(args) {
        const that = this;
        switch(args.name) {
            case 'dataSource':
                that._refreshDataSource();
                that._invalidate();
                break;
            case 'layout':
            case 'texts':
            case 'allowSearch':
            case 'searchTimeout':
                that._invalidate();
                break;
            case 'onContextMenuPreparing':
                that._actions[args.name] = that._createActionByOption(args.name);
                break;
            default:
                that.callBase(args);
        }
    },

    _clean: function(skipStateSetting) {
        !skipStateSetting && this._dataSource && this.option('state', this._dataSource.state());
        this.$element().children('.' + FIELDCHOOSER_CONTAINER_CLASS).remove();
    },

    _renderLayout0: function($container) {
        const that = this;

        $container.addClass('dx-layout-0');

        const $row1 = $(DIV).addClass('dx-row').appendTo($container);
        const $row2 = $(DIV).addClass('dx-row').appendTo($container);

        const $col1 = $(DIV).addClass('dx-col').appendTo($row1);
        const $col2 = $(DIV).addClass('dx-col').appendTo($row1);

        const $col3 = $(DIV).addClass('dx-col').appendTo($row2);
        const $col4 = $(DIV).addClass('dx-col').appendTo($row2);

        that._renderArea($col1, 'all');
        that._renderArea($col2, 'row');
        that._renderArea($col2, 'column');
        that._renderArea($col3, 'filter');
        that._renderArea($col4, 'data');
    },

    _renderLayout1: function($container) {
        const that = this;

        const $col1 = $(DIV).addClass('dx-col').appendTo($container);
        const $col2 = $(DIV).addClass('dx-col').appendTo($container);

        that._renderArea($col1, 'all');
        that._renderArea($col2, 'filter');
        that._renderArea($col2, 'row');
        that._renderArea($col2, 'column');
        that._renderArea($col2, 'data');
    },

    _renderLayout2: function($container) {
        const that = this;

        $container.addClass('dx-layout-2');

        const $row1 = $(DIV).addClass('dx-row').appendTo($container);
        that._renderArea($row1, 'all');

        const $row2 = $(DIV).addClass('dx-row').appendTo($container);
        const $col1 = $(DIV).addClass('dx-col').appendTo($row2);
        const $col2 = $(DIV).addClass('dx-col').appendTo($row2);

        that._renderArea($col1, 'filter');
        that._renderArea($col1, 'row');
        that._renderArea($col2, 'column');
        that._renderArea($col2, 'data');
    },

    _initMarkup: function() {
        const that = this;
        const $element = this.$element();
        const $container = $(DIV).addClass(FIELDCHOOSER_CONTAINER_CLASS).appendTo($element);
        const layout = that.option('layout');

        that.callBase();

        $element
            .addClass(FIELDCHOOSER_CLASS)
            .addClass(FIELDS_CONTAINER_CLASS);

        that._dataChangedHandlers = [];

        const dataSource = this._dataSource;
        const currentState = that.option('applyChangesMode') !== 'instantly' && dataSource && dataSource.state();

        currentState && that.option('state') && dataSource.state(that.option('state'), true);

        if(layout === 0) {
            that._renderLayout0($container);
        } else if(layout === 1) {
            that._renderLayout1($container);
        } else {
            that._renderLayout2($container);
        }

        currentState && dataSource.state(currentState, true);
    },

    _renderContentImpl: function() {
        this.callBase();

        this.renderSortable();
        this._renderContextMenu();
        this.updateDimensions();
    },

    _fireContentReadyAction: function() {
        if(!this._dataSource || !this._dataSource.isLoading()) {
            this.callBase();
        }
    },

    _getContextMenuArgs: function(dxEvent) {
        const targetFieldElement = $(dxEvent.target).closest('.dx-area-field');
        const targetGroupElement = $(dxEvent.target).closest('.dx-area-fields');
        let field;
        let area;

        if(targetFieldElement.length) {
            const fieldCopy = targetFieldElement.data('field');
            if(fieldCopy) {
                field = this.getDataSource().field(fieldCopy.index) || fieldCopy;
            }
        }

        if(targetGroupElement.length) {
            area = targetGroupElement.attr('group');
        }

        return {
            event: dxEvent,
            field: field,
            area: area,
            items: []
        };
    },

    _renderContextMenu: function() {
        const that = this;
        const $container = that.$element();

        if(that._contextMenu) {
            that._contextMenu.$element().remove();
        }

        that._contextMenu = that._createComponent($(DIV).appendTo($container), ContextMenu, {
            onPositioning: function(actionArgs) {
                const event = actionArgs.event;

                if(!event) {
                    return;
                }

                const args = that._getContextMenuArgs(event);

                that._trigger('onContextMenuPreparing', args);

                if(args.items && args.items.length) {
                    actionArgs.component.option('items', args.items);
                } else {
                    actionArgs.cancel = true;
                }
            },
            target: $container,
            onItemClick: function(params) {
                params.itemData.onItemClick && params.itemData.onItemClick(params);
            },
            cssClass: 'dx-pivotgridfieldchooser-context-menu'
        });
    },

    _createTreeItems: function(fields, groupFieldNames, path) {
        const that = this;
        let isMeasure;
        let resultItems = [];
        const groupedItems = [];
        const groupFieldName = groupFieldNames[0];
        const fieldsByGroup = {};

        if(!groupFieldName) {
            each(fields, function(index, field) {
                let icon;

                if(field.isMeasure === true) {
                    icon = 'measure';
                }

                if(field.isMeasure === false) {
                    icon = field.groupName ? 'hierarchy' : 'dimension';
                }

                resultItems.push({
                    index: field.index,
                    field: field,
                    key: field.dataField,
                    selected: isDefined(field.area),
                    text: field.caption || field.dataField,
                    icon: icon,
                    isMeasure: field.isMeasure,
                    isDefault: field.isDefault
                });
            });
        } else {
            each(fields, function(index, field) {
                const groupName = field[groupFieldName] || '';
                fieldsByGroup[groupName] = fieldsByGroup[groupName] || [];
                fieldsByGroup[groupName].push(field);

                if(isMeasure === undefined) {
                    isMeasure = true;
                }
                isMeasure = isMeasure && field.isMeasure === true;
            });

            each(fieldsByGroup, function(groupName, fields) {
                const currentPath = path ? path + '.' + groupName : groupName;
                const items = that._createTreeItems(fields, groupFieldNames.slice(1), currentPath);
                if(groupName) {
                    groupedItems.push({
                        key: groupName,
                        text: groupName,
                        path: currentPath,
                        isMeasure: items.isMeasure,
                        expanded: inArray(currentPath, that._expandedPaths) >= 0,
                        items: items
                    });
                } else {
                    resultItems = items;
                }
            });

            resultItems = groupedItems.concat(resultItems);
            resultItems.isMeasure = isMeasure;
        }

        return resultItems;
    },

    _createFieldsDataSource: function(dataSource) {
        let fields = dataSource && dataSource.fields() || [];

        fields = fields.filter(field => {
            return field.visible !== false && !isDefined(field.groupIndex);
        });

        const treeItems = this._createTreeItems(fields, ['dimension', 'displayFolder']);

        foreachDataLevel(treeItems, function(items) {
            items.sort(compareItems);
        }, 0, 'items');

        return treeItems;
    },

    _renderFieldsTreeView: function(container) {
        const that = this;
        const dataSource = that._dataSource;
        const treeView = that._createComponent(container, TreeView, {
            dataSource: that._createFieldsDataSource(dataSource),
            showCheckBoxesMode: 'normal',
            expandNodesRecursive: false,
            searchEnabled: that.option('allowSearch'),
            searchTimeout: that.option('searchTimeout'),
            itemTemplate: function(itemData, itemIndex, itemElement) {
                if(itemData.icon) {
                    getImageContainer(itemData.icon).appendTo(itemElement);
                }

                $('<span>')
                    .toggleClass('dx-area-field', !itemData.items)
                    .data('field', itemData.field)
                    .text(itemData.text)
                    .appendTo(itemElement);
            },
            onItemCollapsed: function(e) {
                const index = inArray(e.itemData.path, that._expandedPaths);
                if(index >= 0) {
                    that._expandedPaths.splice(index, 1);
                }
            },
            onItemExpanded: function(e) {
                const index = inArray(e.itemData.path, that._expandedPaths);
                if(index < 0) {
                    that._expandedPaths.push(e.itemData.path);
                }
            },
            onItemSelectionChanged: function(e) {
                const data = e.itemData;
                let field;
                let fields;
                let needSelectDefaultItem = true;
                let area;

                if(data.items) {
                    if(data.selected) {
                        treeView.unselectItem(data);
                        return;
                    }

                    that._processDemandState(() => {
                        fields = getDimensionFields(data, dataSource.fields());

                        for(let i = 0; i < fields.length; i++) {
                            if(fields[i].area) {
                                needSelectDefaultItem = false;
                                break;
                            }
                        }
                    });

                    if(needSelectDefaultItem) {
                        const item = getFirstItem(data, function(item) { return item.isDefault; }) || getFirstItem(data, function(item) { return isDefined(item.index); });
                        item && treeView.selectItem(item);
                        return;
                    }
                } else {
                    field = dataSource.fields()[data.index];
                    if(data.selected) {
                        area = (field.isMeasure ? 'data' : 'column');
                    }
                    if(field) {
                        fields = [field];
                    }
                }

                that._applyChanges(fields, {
                    area: area,
                    areaIndex: undefined
                });
            }
        });

        const dataChanged = function() {
            let scrollable = getScrollable(container);
            const scrollTop = scrollable ? scrollable.scrollTop() : 0;

            treeView.option({ dataSource: that._createFieldsDataSource(dataSource) });
            scrollable = getScrollable(container);
            if(scrollable) {
                scrollable.scrollTo({ y: scrollTop });
                scrollable.update();
            }
        };

        that._dataChangedHandlers.push(dataChanged);
    },

    _renderAreaFields: function($container, area) {
        const that = this;
        const dataSource = that._dataSource;
        const fields = dataSource ? extend(true, [], dataSource.getAreaFields(area, true)) : [];

        $container.empty();
        each(fields, function(_, field) {
            if(field.visible !== false) {
                that.renderField(field, true).appendTo($container);
            }
        });
    },

    _renderArea: function(container, area) {
        const that = this;
        const $areaContainer = $(DIV).addClass('dx-area').appendTo(container);
        const $fieldsHeaderContainer = $(DIV).addClass('dx-area-fields-header').appendTo($areaContainer);
        const caption = that.option('texts.' + area + 'Fields');
        let $fieldsContent;
        let render;

        $('<span>').addClass('dx-area-icon')
            .addClass('dx-area-icon-' + area)
            .appendTo($fieldsHeaderContainer);

        $('<span>')
            .html('&nbsp;')
            .appendTo($fieldsHeaderContainer);

        $('<span>').addClass('dx-area-caption')
            .text(caption)
            .appendTo($fieldsHeaderContainer);

        const $fieldsContainer = $(DIV).addClass('dx-area-fields')
            .addClass(AREA_DRAG_CLASS)
            .appendTo($areaContainer);

        if(area !== 'all') {
            $fieldsContainer.attr('group', area).attr('allow-scrolling', true);
            $fieldsContent = $(DIV).addClass('dx-area-field-container').appendTo($fieldsContainer);
            render = function() {
                that._renderAreaFields($fieldsContent, area);
            };
            that._dataChangedHandlers.push(render);
            render();
            $fieldsContainer.dxScrollable();
        } else {
            $areaContainer.addClass('dx-all-fields');
            $fieldsContainer.addClass('dx-treeview-border-visible');
            that._renderFieldsTreeView($fieldsContainer);
        }
    },

    _getSortableOptions: function() {
        // TODO
        return {

        };
    },

    _adjustSortableOnChangedArgs: function() {
    },

    resetTreeView: function() {
        const treeView = this.$element().find('.dx-treeview').dxTreeView('instance');

        if(treeView) {
            treeView.option('searchValue', '');
            treeView.collapseAll();
        }
    },

    applyChanges: function() {
        const state = this.option('state');

        if(isDefined(state)) {
            this._dataSource.state(state);
        }
    },

    cancelChanges: function() {
        const dataSource = this._dataSource;

        if(!dataSource.isLoading()) {
            this.option('state', dataSource.state());
            return true;
        }
        return false;
    },

    getDataSource: function() {
        return this._dataSource;
    },

    updateDimensions: function() {
        const $scrollableElements = this.$element().find('.dx-area .dx-scrollable');
        $scrollableElements.dxScrollable('update');
    },

    _visibilityChanged: function(visible) {
        if(visible && hasWindow) {
            this.updateDimensions();
        }
    }
});

registerComponent('dxPivotGridFieldChooser', FieldChooser);

export default FieldChooser;
