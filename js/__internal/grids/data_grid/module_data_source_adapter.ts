import DataSourceAdapter from '../grid_core/data_source_adapter/module';

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
