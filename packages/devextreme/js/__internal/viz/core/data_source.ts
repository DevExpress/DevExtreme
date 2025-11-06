/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@js/core/utils/common';
import DataHelperMixin from '@js/data_helper';
// @ts-expect-error
const { postCtor } = DataHelperMixin;
let name;
const members = {
  _dataSourceLoadErrorHandler() {
    this._dataSourceChangedHandler();
  },

  _dataSourceOptions() {
    return { paginate: false };
  },

  _updateDataSource() {
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
  init() {
    postCtor.call(this);
  },
  dispose: noop,
  members,
};
