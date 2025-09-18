import { noop } from '@js/core/utils/common';
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';

import { loadResource, normalizeDataSource } from './utils';

interface BaseConfig<T> {
  dataSource?: DataSourceLike<T, unknown> | null;
}

// TODO(9): implement appointmentLoader extends Loader for the mane dataSource of the scheduler
export abstract class Loader<T, Data, Config extends BaseConfig<T> = BaseConfig<T>> {
  public readonly dataSource: DataSource<T, unknown> | undefined;

  public items: Data[] = [];

  protected readonly isSharedDataSource: boolean;

  protected loadingStatePromise?: Promise<T[]>;

  protected unsubscribe = noop;

  protected constructor(
    config: Config,
    dataSourceOptions: object,
  ) {
    this.dataSource = normalizeDataSource<T>(
      config.dataSource,
      dataSourceOptions,
    );
    this.isSharedDataSource = config.dataSource instanceof DataSource;
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
    }

    await this.loadingStatePromise;
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
    if (items) {
      this.items = this.onLoadTransform(items);
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
      this.items = [];
    }
  }
}
