import type { ModuleType } from '../m_types';
import type DataSourceAdapter from './m_data_source_adapter';
import type { DataSourceAdapterProvider } from './types';

export function createDataSourceAdapterProvider(
  BaseType: ModuleType<DataSourceAdapter>,
): DataSourceAdapterProvider {
  let AdapterType = BaseType;

  return {
    extend(extender): void {
      AdapterType = extender(AdapterType);
    },
    create(component): DataSourceAdapter {
      return new AdapterType(component);
    },
  };
}
