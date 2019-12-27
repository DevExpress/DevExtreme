const EditDecoratorMenuHelperMixin = {

    _menuEnabled: function() {
        return !!this._menuItems().length;
    },

    _menuItems: function() {
        return this._list.option('menuItems');
    },

    _deleteEnabled: function() {
        return this._list.option('allowItemDeleting');
    },

    _fireMenuAction: function($itemElement, action) {
        this._list._itemEventHandlerByHandler($itemElement, action, {}, { excludeValidators: ['disabled', 'readOnly'] });
    }

};

module.exports = EditDecoratorMenuHelperMixin;
