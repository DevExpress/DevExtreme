import DataSourceAdapter from '../grid_core/ui.grid_core.data_source_adapter';

let dataSourceAdapterType = DataSourceAdapter;

export default {
    extend: function(extender) {
        dataSourceAdapterType = dataSourceAdapterType.inherit(extender);
    },
    create: function(component) {
        return new dataSourceAdapterType(component);
    }
};
