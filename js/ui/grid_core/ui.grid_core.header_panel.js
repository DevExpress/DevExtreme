import $ from '../../core/renderer';
import Toolbar from '../toolbar';
import columnsView from './ui.grid_core.columns_view';
import { noop } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { triggerResizeEvent } from '../../core/utils/dom';

require('../drop_down_menu');
const HEADER_PANEL_CLASS = 'header-panel';
const TOOLBAR_BUTTON_CLASS = 'toolbar-button';

const HeaderPanel = columnsView.ColumnsView.inherit({
    _getToolbarItems: function() {
        return [];
    },

    _getButtonContainer: function() {
        return $('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
    },

    _getToolbarButtonClass: function(specificClass) {
        const secondClass = specificClass ? ' ' + specificClass : '';

        return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
    },

    _getToolbarOptions: function() {
        let toolbarItems;
        const options = {
            toolbarOptions: {
                items: this._getToolbarItems(),
                onItemRendered: function(e) {
                    const itemRenderedCallback = e.itemData.onItemRendered;

                    if(itemRenderedCallback) {
                        itemRenderedCallback(e);
                    }
                }
            }
        };

        this.executeAction('onToolbarPreparing', options);

        if(options.toolbarOptions && !isDefined(options.toolbarOptions.visible)) {
            toolbarItems = options.toolbarOptions.items;
            options.toolbarOptions.visible = !!(toolbarItems && toolbarItems.length);
        }

        return options.toolbarOptions;
    },

    _renderCore: function() {
        if(!this._toolbar) {
            this.element().addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
            this._toolbar = this._createComponent($('<div>').appendTo(this.element()), Toolbar, this._toolbarOptions);
        } else {
            this._toolbar.option(this._toolbarOptions);
        }
    },

    _columnOptionChanged: noop,

    _handleDataChanged: function() {
        if(this._requireReady) {
            this.render();
        }
    },

    init: function() {
        this.callBase();
        this.createAction('onToolbarPreparing', { excludeValidators: ['disabled', 'readOnly'] });
    },

    render: function() {
        this._toolbarOptions = this._getToolbarOptions();
        this.callBase.apply(this, arguments);
    },

    setToolbarItemDisabled: function(name, optionValue) {
        const toolbarInstance = this._toolbar;

        if(toolbarInstance) {
            const items = toolbarInstance.option('items') || [];
            const itemIndex = items.indexOf(items.filter(function(item) {
                return item.name === name;
            })[0]);

            if(itemIndex >= 0) {
                const itemOptionPrefix = 'items[' + itemIndex + ']';
                if(toolbarInstance.option(itemOptionPrefix + '.options')) {
                    toolbarInstance.option(itemOptionPrefix + '.options.disabled', optionValue);
                } else {
                    toolbarInstance.option(itemOptionPrefix + '.disabled', optionValue);
                }
            }
        }
    },

    updateToolbarDimensions: function() {
        if(this._toolbar) {
            triggerResizeEvent(this.getHeaderPanel());
        }
    },

    getHeaderPanel: function() {
        return this.element();
    },

    getHeight: function() {
        return this.getElementHeight();
    },

    optionChanged: function(args) {
        if(args.name === 'onToolbarPreparing') {
            this._invalidate();
            args.handled = true;
        }
        this.callBase(args);
    },

    isVisible: function() {
        return this._toolbarOptions && this._toolbarOptions.visible;
    },

    allowDragging: noop
});

module.exports = {
    defaultOptions: function() {
        return {
        };
    },
    views: {
        headerPanel: HeaderPanel
    },
    extenders: {
        controllers: {
            resizing: {
                _updateDimensionsCore: function() {
                    this.callBase.apply(this, arguments);

                    this.getView('headerPanel').updateToolbarDimensions();
                }
            }
        }
    }
};
