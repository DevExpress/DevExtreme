import treeListCore from '@ts/grids/tree_list/core';

import { TreeListDataSourceController } from './data_source_controller';

treeListCore.registerModule('dataSource', {
  controllers: {
    dataSource: TreeListDataSourceController,
  },
});
