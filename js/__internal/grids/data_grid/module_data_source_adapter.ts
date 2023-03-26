import DataSourceAdapter from '@js/ui/grid_core/ui.grid_core.data_source_adapter';

let dataSourceAdapterType: any = DataSourceAdapter;

export default {
  extend(extender) {
    dataSourceAdapterType = dataSourceAdapterType.inherit(extender);
  },
  create(component) {
    // eslint-disable-next-line new-cap
    return new dataSourceAdapterType(component);
  },
};
