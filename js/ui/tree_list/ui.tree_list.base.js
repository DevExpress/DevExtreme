import registerComponent from '../../core/component_registrator';
import { noop, deferRender } from '../../core/utils/common';
import { isFunction, isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import Widget from '../widget/ui.widget';
import treeListCore from './ui.tree_list.core';
import { isMaterial } from '../themes';
const callModuleItemsMethod = treeListCore.callModuleItemsMethod;

const DATAGRID_ROW_SELECTOR = '.dx-row';
const TREELIST_CLASS = 'dx-treelist';

import './ui.tree_list.column_headers';
import './ui.tree_list.columns_controller';
import './ui.tree_list.data_controller';
import './ui.tree_list.sorting';
import './ui.tree_list.rows';
import './ui.tree_list.context_menu';
import './ui.tree_list.error_handling';
import './ui.tree_list.grid_view';
import './ui.tree_list.header_panel';

// STYLE treeList

treeListCore.registerModulesOrder([
    'stateStoring',
    'columns',
    'selection',
    'editorFactory',
    'columnChooser',
    'editingFormBased',
    'editingCellBased',
    'editing',
    'grouping',
    'masterDetail',
    'validating',
    'adaptivity',
    'data',
    'virtualScrolling',
    'columnHeaders',
    'filterRow',
    'headerPanel',
    'headerFilter',
    'sorting',
    'search',
    'rows',
    'pager',
    'columnsResizingReordering',
    'contextMenu',
    'keyboardNavigation',
    'errorHandling',
    'summary',
    'columnFixing',
    'export',
    'gridView']);

const TreeList = Widget.inherit({
    _activeStateUnit: DATAGRID_ROW_SELECTOR,

    _getDefaultOptions: function() {
        const that = this;
        const result = that.callBase();

        each(treeListCore.modules, function() {
            if(isFunction(this.defaultOptions)) {
                extend(true, result, this.defaultOptions());
            }
        });
        return result;
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    showRowLines: true,
                    showColumnLines: false,
                    headerFilter: {
                        height: 315
                    },
                    editing: {
                        useIcons: true
                    }
                }
            }
        ]);
    },

    _init: function() {
        const that = this;

        that.callBase();

        treeListCore.processModules(that, treeListCore);

        callModuleItemsMethod(that, 'init');
    },

    _clean: noop,

    _optionChanged: function(args) {
        const that = this;

        callModuleItemsMethod(that, 'optionChanged', [args]);
        if(!args.handled) {
            that.callBase(args);
        }
    },

    _dimensionChanged: function() {
        this.updateDimensions(true);
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this.updateDimensions();
        }
    },

    _initMarkup: function() {
        this.callBase.apply(this, arguments);
        this.$element().addClass(TREELIST_CLASS);
        this.getView('gridView').render(this.$element());
    },

    _renderContentImpl: function() {
        this.getView('gridView').update();
    },

    _renderContent: function() {
        const that = this;

        deferRender(function() {
            that._renderContentImpl();
        });
    },

    _dispose: function() {
        const that = this;
        that.callBase();

        callModuleItemsMethod(that, 'dispose');
    },

    isReady: function() {
        return this.getController('data').isReady();
    },

    beginUpdate: function() {
        const that = this;

        that.callBase();
        callModuleItemsMethod(that, 'beginUpdate');
    },

    endUpdate: function() {
        const that = this;

        callModuleItemsMethod(that, 'endUpdate');
        that.callBase();
    },

    getController: function(name) {
        return this._controllers[name];
    },

    getView: function(name) {
        return this._views[name];
    },

    focus: function(element) {
        this.callBase();

        if(isDefined(element)) {
            this.getController('keyboardNavigation').focus(element);
        }
    }
});

TreeList.registerModule = treeListCore.registerModule.bind(treeListCore);

registerComponent('dxTreeList', TreeList);

export default TreeList;
