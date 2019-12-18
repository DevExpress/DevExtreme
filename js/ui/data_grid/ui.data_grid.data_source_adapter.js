import DataSourceAdapter from '../grid_core/ui.grid_core.data_source_adapter';

var dataSourceAdapterType = DataSourceAdapter;

module.exports = {
    extend: function(extender) {
        dataSourceAdapterType = dataSourceAdapterType.inherit(extender);
    },
    create: function(component) {
        return new dataSourceAdapterType(component);
    }
};
