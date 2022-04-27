import $ from '../../core/renderer';
import Toolbar from '../toolbar';
import { ColumnsView } from './ui.grid_core.columns_view';
import { noop } from '../../core/utils/common';
import { isDefined, isString } from '../../core/utils/type';
import messageLocalization from '../../localization/message';

import '../drop_down_menu';
import { extend } from '../../core/utils/extend';
import { getPathParts } from '../../core/utils/data';
const HEADER_PANEL_CLASS = 'header-panel';
const TOOLBAR_BUTTON_CLASS = 'toolbar-button';

const TOOLBAR_ARIA_LABEL = '-ariaToolbar';

const DEFAULT_TOOLBAR_ITEM_NAMES = ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel'];

const HeaderPanel = ColumnsView.inherit({
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
        const userToolbarOptions = this.option('toolbar');

        const options = {
            toolbarOptions: {
                items: this._getToolbarItems(),
                visible: userToolbarOptions?.visible,
                disabled: userToolbarOptions?.disabled,
                onItemRendered: function(e) {
                    const itemRenderedCallback = e.itemData.onItemRendered;

                    if(itemRenderedCallback) {
                        itemRenderedCallback(e);
                    }
                }
            }
        };

        const userItems = userToolbarOptions?.items;
        options.toolbarOptions.items = this._normalizeToolbarItems(options.toolbarOptions.items, userItems);

        this.executeAction('onToolbarPreparing', options);

        if(options.toolbarOptions && !isDefined(options.toolbarOptions.visible)) {
            const toolbarItems = options.toolbarOptions.items;
            options.toolbarOptions.visible = !!(toolbarItems?.length);
        }

        return options.toolbarOptions;
    },

    _normalizeToolbarItems(defaultItems, userItems) {
        defaultItems.forEach(button => {
            if(!DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
                throw new Error(`Default toolbar item '${button.name}' is not added to DEFAULT_TOOLBAR_ITEM_NAMES`);
            }
        });

        const defaultProps = {
            location: 'after',
        };

        const isArray = Array.isArray(userItems);

        if(!isDefined(userItems)) {
            return defaultItems;
        }

        if(!isArray) {
            userItems = [userItems];
        }

        const defaultButtonsByNames = {};
        defaultItems.forEach(button => {
            defaultButtonsByNames[button.name] = button;
        });

        const normalizedItems = userItems.map(button => {
            if(isString(button)) {
                button = { name: button };
            }

            if(isDefined(button.name)) {
                if(isDefined(defaultButtonsByNames[button.name])) {
                    button = extend(true, {}, defaultButtonsByNames[button.name], button);
                } else if(DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
                    button = { ...button, visible: false };
                }
            }

            return extend(true, {}, defaultProps, button);
        });

        return isArray ? normalizedItems : normalizedItems[0];
    },

    _renderCore: function() {
        if(!this._toolbar) {
            const $headerPanel = this.element();
            $headerPanel.addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
            const label = messageLocalization.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
            const $toolbar = $('<div>').attr('aria-label', label).appendTo($headerPanel);
            this._toolbar = this._createComponent($toolbar, Toolbar, this._toolbarOptions);
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
        this._toolbar?.updateDimensions();
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
        if(args.name === 'toolbar') {
            args.handled = true;
            if(this._toolbar) {
                const parts = getPathParts(args.fullName);
                const optionName = args.fullName.replace(/^toolbar\./, '');

                if(parts.length === 1) {
                    // `toolbar` case
                    const toolbarOptions = this._getToolbarOptions();
                    this._toolbar.option(toolbarOptions);
                } else if(parts[1] === 'items') {
                    if(parts.length === 2) {
                        // `toolbar.items` case
                        const toolbarOptions = this._getToolbarOptions();
                        this._toolbar.option('items', toolbarOptions.items);
                    } else if(parts.length === 3) {
                        // `toolbar.items[i]` case
                        const normalizedItem = this._normalizeToolbarItems(this._getToolbarItems(), args.value);
                        this._toolbar.option(optionName, normalizedItem);
                    } else if(parts.length >= 4) {
                        // `toolbar.items[i].prop` case
                        this._toolbar.option(optionName, args.value);
                    }
                } else {
                    // `toolbar.visible`, `toolbar.disabled` case
                    this._toolbar.option(optionName, args.value);
                }
            }
        }
        this.callBase(args);
    },

    isVisible: function() {
        return this._toolbarOptions && this._toolbarOptions.visible;
    },

    allowDragging: noop
});

export const headerPanelModule = {
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
