import $ from '../../core/renderer';
import ToolbarStrategy from './ui.toolbar.strategy';
import { extend } from '../../core/utils/extend';
import ActionSheet from '../action_sheet';
import Button from '../button';

const TOOLBAR_MENU_BUTTON_CLASS = 'dx-toolbar-menu-button';

const ActionSheetStrategy = ToolbarStrategy.inherit({

    NAME: 'actionSheet',

    _getMenuItemTemplate: function() {
        return this._toolbar._getTemplate('actionSheetItem');
    },

    render: function() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._renderMenuButton();
        this._renderWidget();
    },

    _renderMenuButton: function() {
        this._renderMenuButtonContainer();
        this._$button = $('<div>').appendTo(this._$menuButtonContainer)
            .addClass(TOOLBAR_MENU_BUTTON_CLASS);

        this._toolbar._createComponent(this._$button, Button, {
            icon: 'overflow',
            onClick: () => {
                this._toolbar.option('overflowMenuVisible', !this._toolbar.option('overflowMenuVisible'));
            }
        });
    },

    _menuWidget: function() {
        return ActionSheet;
    },

    _menuContainer: function() {
        return this._toolbar.$element();
    },

    _widgetOptions: function() {
        return extend(this.callBase(), {
            target: this._$button,
            showTitle: false,
            onOptionChanged: ({ name, value }) => {
                if(name === 'visible') {
                    this._toolbar.option('overflowMenuVisible', value);
                }
            }
        });
    },
});

export default ActionSheetStrategy;
