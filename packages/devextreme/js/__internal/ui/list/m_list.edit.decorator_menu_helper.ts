const EditDecoratorMenuHelperMixin = {

  _menuEnabled() {
    return !!this._menuItems().length;
  },

  _menuItems() {
    return this._list.option('menuItems');
  },

  _deleteEnabled() {
    return this._list.option('allowItemDeleting');
  },

  _fireMenuAction($itemElement, action) {
    this._list._itemEventHandlerByHandler($itemElement, action, {}, { excludeValidators: ['disabled', 'readOnly'] });
  },

};

export default EditDecoratorMenuHelperMixin;
