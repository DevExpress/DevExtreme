/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DataHelperMixin } from '__internal/data/m_data_helper';
import { Component } from '@js/core/component';
import type { OptionChanged } from '@ts/core/widget/types';

interface DataOptionProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource?: any;
}

class DataOption extends Component<DataOptionProperties> {
  _optionName: string;

  _getLoadPanel: () => { show: () => void; hide: () => void } | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataSourceChangedCallback: (optionName: string, newItems: any[]) => void;

  constructor(
    optionName: string,
    getLoadPanel: () => { show: () => void; hide: () => void } | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSourceChangedCallback: (optionName: string, newItems: any[]) => void,
  ) {
    super();
    this._optionName = optionName;
    this._getLoadPanel = getLoadPanel;
    this._dataSourceChangedCallback = dataSourceChangedCallback;
  }

  insert(data, callback, errorCallback): void {
    this._showLoadPanel();
    this._getStore()
      .insert(data)
      .done((response) => {
        if (callback) {
          callback(response);
        }
        this._hideLoadPanel();
      })
      .fail((error) => {
        if (errorCallback) {
          errorCallback(error);
        }
        this._hideLoadPanel();
      });
  }

  update(key, data, callback, errorCallback): void {
    this._showLoadPanel();
    this._getStore()
      .update(key, data)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .done((data, key): void => {
        if (callback) {
          callback(data, key);
        }
        this._hideLoadPanel();
      })
      .fail((error): void => {
        if (errorCallback) {
          errorCallback(error);
        }
        this._hideLoadPanel();
      });
  }

  remove(key, callback, errorCallback): void {
    this._showLoadPanel();
    this._getStore()
      .remove(key)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .done((key): void => {
        if (callback) {
          callback(key);
        }
        this._hideLoadPanel();
      })
      .fail((error): void => {
        if (errorCallback) {
          errorCallback(error);
        }
        this._hideLoadPanel();
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dataSourceChangedHandler(newItems, e): void {
    this._dataSourceChangedCallback(this._optionName, newItems);
  }

  _dataSourceOptions(): { paginate: boolean } {
    return {
      paginate: false,
    };
  }

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    // @ts-expect-error ts-error
    if (isLoading && !this._dataSource.isLoaded()) {
      this._showLoadPanel();
    } else {
      this._hideLoadPanel();
    }
  }

  _showLoadPanel(): void {
    this._getLoadPanel()?.show();
  }

  _hideLoadPanel(): void {
    this._getLoadPanel()?.hide();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getStore() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataSource.store();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItems() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getStore()._array || this._dataSource.items();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _reloadDataSource() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataSource.load();
  }

  dispose(): void {
    // @ts-expect-error ts-error
    this._disposeDataSource();
  }

  _optionChanged(args: OptionChanged<DataOptionProperties>): void {
    const { name } = args;

    switch (name) {
      case 'dataSource':
        break;
      default:
        break;
    }
  }
}

// @ts-expect-error ts-error
DataOption.include(DataHelperMixin);

export default DataOption;
