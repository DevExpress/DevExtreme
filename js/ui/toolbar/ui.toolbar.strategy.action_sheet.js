import ToolbarStrategy from './ui.toolbar.strategy';
import { extend } from '../../core/utils/extend';
import ActionSheet from '../action_sheet';

const ActionSheetStrategy = ToolbarStrategy.inherit({

    NAME: 'actionSheet',

    _getMenuItemTemplate: function() {
        return this._toolbar._getTemplate('actionSheetItem');
    },

    render: function() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this.callBase();
    },

    _menuWidgetClass: function() {
        return ActionSheet;
    },

    _menuContainer: function() {
        return this._toolbar.$element();
    },

    _widgetOptions: function() {
        return extend({}, this.callBase(), {
            target: this._$button,
            showTitle: false
        });
    },

    _menuButtonOptions: function() {
        return extend({}, this.callBase(), { icon: 'overflow' });
    },

    _toggleMenu: function() {
        this.callBase.apply(this, arguments);

        this._menu.toggle(this._menuShown);
        this._menuShown = false;
    }

});

export default ActionSheetStrategy;
