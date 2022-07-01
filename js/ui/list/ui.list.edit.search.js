import ListEdit from './ui.list.edit';
import searchBoxMixin from '../widget/ui.search_box_mixin';

const ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return 'dx-list-' + className;
    },

    _getCombinedFilter: function() {
        const dataController = this._dataController;
        const storeLoadOptions = { filter: dataController.filter() };
        dataController.addSearchFilter(storeLoadOptions);
        const filter = storeLoadOptions.filter;

        return filter;
    },

    _initDataSource: function() {
        const value = this.option('searchValue');
        const expr = this.option('searchExpr');
        const mode = this.option('searchMode');

        this.callBase();

        value && value.length && this._dataController.searchValue(value);
        mode.length && this._dataController.searchOperation(searchBoxMixin.getOperationBySearchMode(mode));
        expr && this._dataController.searchExpr(expr);
    }
});

export default ListSearch;
