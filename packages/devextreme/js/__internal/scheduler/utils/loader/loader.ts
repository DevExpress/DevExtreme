import { noop } from '@js/core/utils/common';
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';

import { loadResource, normalizeDataSource } from './utils';

interface BaseConfig<T> {
  dataSource?: DataSourceLike<T, unknown> | null;
}

export abstract class Loader<T, Data, Config extends BaseConfig<T> = BaseConfig<T>> {
  constructor(
    config: Config,
    dataSourceOptions: object,
    public readonly dataSource = normalizeDataSource<T>(
      config.dataSource,
      dataSourceOptions,
    ),
    public items: Data[] = [],
    public data: T[] = [], // TODO(9): probably we dont need it. Used in getGroupPanelData
    protected readonly isSharedDataSource = config.dataSource instanceof DataSource,
    protected loadingStatePromise?: Promise<T[]>,
    protected unsubscribe = noop,
  ) {
    this.addDataSourceHandlers();
  }

  protected onInit(): void {
    if (this.isLoaded()) {
      this.applyChanges(this.dataSource?.items() ?? []);
    }
  }

  public isLoaded(): boolean {
    return Boolean(this.dataSource?.isLoaded());
  }

  protected addDataSourceHandlers(): void {
    const onChange = this.onChange.bind(this);
    const onLoadingChanged = this.onLoadingChanged.bind(this);
    const onLoadError = this.onLoadError.bind(this);
    const { dataSource } = this;

    if (dataSource) {
      dataSource.on('changed', onChange);
      dataSource.on('loadingChanged', onLoadingChanged);
      dataSource.on('loadError', onLoadError);

      this.unsubscribe = (): void => {
        dataSource.off('changed', onChange);
        dataSource.off('loadingChanged', onLoadingChanged);
        dataSource.off('loadError', onLoadError);
      };
    }
  }

  async load(forceReload = false): Promise<void> {
    if (this.dataSource && (
      forceReload
      || (!this.dataSource.isLoaded() && !this.loadingStatePromise)
    )) {
      this.loadingStatePromise = this.loadingStatePromise && !forceReload
        ? this.loadingStatePromise
        : loadResource(this.dataSource, forceReload);
      await this.loadingStatePromise;
    }
  }

  protected abstract onLoadTransform(items: T[]): Data[];
  protected abstract onLoadError(): void;
  protected abstract onChange(changes: unknown): void;

  protected onLoadingChanged(isLoading?: boolean): void {
    if (!isLoading && this.isLoaded()) {
      this.applyChanges(this.dataSource?.items() ?? []);
    }
  }

  protected applyChanges(items: T[]): void {
    if (items && items !== this.data) {
      this.data = items;
      this.items = this.onLoadTransform(this.data);
    }
  }

  public dispose(): void {
    if (this.dataSource) {
      if (this.isSharedDataSource) {
        this.unsubscribe();
        this.unsubscribe = noop;
      } else {
        this.dataSource.dispose();
      }
      this.data = [];
      this.items = [];
    }
  }
}
