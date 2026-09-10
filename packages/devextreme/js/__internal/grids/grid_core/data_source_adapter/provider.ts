import type { ModuleType } from '../m_types';
import type DataSourceAdapter from './m_data_source_adapter';
import type { DataSourceAdapterProvider } from './types';

export function createDataSourceAdapterProvider<TAdapter extends DataSourceAdapter>(
  BaseType: ModuleType<TAdapter>,
): DataSourceAdapterProvider<TAdapter> {
  let AdapterType = BaseType;

  return {
    extend(extender): void {
      AdapterType = extender(AdapterType) as ModuleType<TAdapter>;
    },
    create(component): TAdapter {
      return new AdapterType(component);
    },
  };
}
