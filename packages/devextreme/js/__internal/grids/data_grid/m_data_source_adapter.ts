import DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';

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
