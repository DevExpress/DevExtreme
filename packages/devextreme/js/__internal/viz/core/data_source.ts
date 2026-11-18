/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@ts/core/utils/common';
import { DataHelperMixin } from '@ts/data/m_data_helper';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

export interface DataSourcePluginMembers {
  _dataIsLoaded: () => boolean;
  _dataSourceItems: () => ThemeValue;
  _updateDataSource: () => void;
}
const { postCtor } = DataHelperMixin;
let name;
const members = {
  _dataSourceLoadErrorHandler(): void {
    this._dataSourceChangedHandler();
  },

  _dataSourceOptions(): { paginate: boolean } {
    return { paginate: false };
  },

  _updateDataSource(): void {
    this._refreshDataSource();
    if (!this.option('dataSource')) {
      this._dataSourceChangedHandler();
    }
  },

  _dataIsLoaded() {
    return !this._dataSource || this._dataSource.isLoaded();
  },

  _dataSourceItems() {
    return this._dataSource?.items();
  },
};

for (name in DataHelperMixin) {
  if (name === 'postCtor') {
    continue;
  }

  members[name] = DataHelperMixin[name];
}

export const plugin = {
  name: 'data_source',
  init(): void {
    postCtor.call(this);
  },
  dispose: noop,
  members,
};
