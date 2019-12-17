import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import commonUtils from '../../core/utils/common';
import typeUtils from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { logger } from '../../core/utils/console';
import browser from '../../core/utils/browser';
import Widget from '../widget/ui.widget';
import gridCore, { callModuleItemsMethod } from './ui.data_grid.core';
import themes from '../themes';

const DATAGRID_ROW_SELECTOR = '.dx-row';
const DATAGRID_DEPRECATED_TEMPLATE_WARNING = 'Specifying grid templates with the jQuery selector name is now deprecated. Use the DOM Node or the jQuery object that references this selector instead.';

import './ui.data_grid.column_headers';
import './ui.data_grid.columns_controller';
import './ui.data_grid.data_controller';
import './ui.data_grid.sorting';
import './ui.data_grid.rows';
import './ui.data_grid.context_menu';
import './ui.data_grid.error_handling';
import './ui.data_grid.grid_view';
import './ui.data_grid.header_panel';

gridCore.registerModulesOrder([
    'stateStoring',
    'columns',
    'selection',
    'editorFactory',
    'columnChooser',
    'grouping',
    'editing',
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

const DataGrid = Widget.inherit({
    _activeStateUnit: DATAGRID_ROW_SELECTOR,

    _getDefaultOptions: function() {
        const that = this;
        const result = that.callBase();

        each(gridCore.modules, function() {
            if(typeUtils.isFunction(this.defaultOptions)) {
                extend(true, result, this.defaultOptions());
            }
        });
        return result;
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            'useKeyboard': { since: '19.2', alias: 'keyboardNavigation.enabled' }
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: 'ios' },
                options: {
                    /**
                    * @name GridBaseOptions.showRowLines
                    * @type boolean
                    * @default true @for iOS
                    */
                    showRowLines: true
                }
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    /**
                    * @name GridBaseOptions.showRowLines
                    * @type boolean
                    * @default true @for Material
                    */
                    showRowLines: true,
                    /**
                    * @name GridBaseOptions.showColumnLines
                    * @type boolean
                    * @default false @for Material
                    */
                    showColumnLines: false,
                    /**
                     * @name GridBaseOptions.headerFilter.height
                     * @type number
                     * @default 315 @for Material
                     */
                    headerFilter: {
                        height: 315
                    },
                    /**
                     * @name GridBaseOptions.editing.useIcons
                     * @type boolean
                     * @default true @for Material
                     */
                    editing: {
                        useIcons: true
                    }
                }
            },
            {
                device: function() {
                    return browser.webkit;
                },
                options: {
                    loadingTimeout: 30, // T344031
                    loadPanel: {
                        animation: {
                            show: {
                                easing: 'cubic-bezier(1, 0, 1, 0)',
                                duration: 500,
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }
                    }
                }
            },
            {
                device: function(device) {
                    return device.deviceType !== 'desktop';
                },
                options: {
                    grouping: {
                        /**
                         * @name dxDataGridOptions.grouping.expandMode
                         * @default 'rowClick' @for mobile_devices
                         */
                        expandMode: 'rowClick'
                    }
                }
            }
        ]);
    },

    _init: function() {
        const that = this;

        that.callBase();

        gridCore.processModules(that, gridCore);

        callModuleItemsMethod(that, 'init');
    },

    _clean: commonUtils.noop,

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
        this.getView('gridView').render(this.$element());
    },

    _renderContentImpl: function() {
        this.getView('gridView').update();
    },

    _renderContent: function() {
        const that = this;

        commonUtils.deferRender(function() {
            that._renderContentImpl();
        });
    },

    _getTemplate: function(templateName) {
        let template = templateName;

        if(typeUtils.isString(template) && template[0] === '#') {
            template = $(templateName);
            logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);
        }

        return this.callBase(template);
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
        this.getController('keyboardNavigation').focus(element);
    }
});

DataGrid.registerModule = gridCore.registerModule.bind(gridCore);

registerComponent('dxDataGrid', DataGrid);

module.exports = DataGrid;
