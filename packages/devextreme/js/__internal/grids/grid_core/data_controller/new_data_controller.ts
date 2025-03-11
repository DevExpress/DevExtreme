/* eslint-disable spellcheck/spell-checker */
import type { DataSource } from '@js/common/data';
import type { SubsGets, SubsGetsUpd } from '@ts/core/reactive';
import { state } from '@ts/core/reactive/index';
import { DataController as DataControllerClass } from '@ts/grids/new/grid_core/data_controller/index';
import type { DataObject, Key } from '@ts/grids/new/grid_core/data_controller/types';

import type { DataController as OldDataController } from './m_data_controller';

type DataController = { [P in keyof DataControllerClass]: DataControllerClass[P] };

export class NewDataController implements DataController {
  public static dependencies = [] as const;

  private oldDataController!: OldDataController;

  public dataSource!: SubsGets<DataSource<unknown, unknown>>;

  public pageCount!: SubsGets<number>;

  public pageIndex!: SubsGetsUpd<number>;

  public pageSize!: SubsGetsUpd<number>;

  public items!: SubsGets<DataObject[]>;

  public totalCount!: SubsGets<number>;

  public isLoading!: SubsGetsUpd<boolean>;

  public filter!: SubsGetsUpd<unknown>;

  public displayFilter!: SubsGetsUpd<unknown>;

  public filterEnabled!: SubsGetsUpd<boolean>;

  public init(oldDataController: OldDataController): void {
    this.oldDataController = oldDataController;

    const dataSource = state(this.oldDataController.getDataSource());
    this.oldDataController.dataSourceChanged.add(() => {
      dataSource.update(this.oldDataController.getDataSource());
    });
    this.dataSource = dataSource;

    const pageCount = state(this.oldDataController.pageCount());
    this.pageCount = pageCount;

    const pageSize = state(this.oldDataController.pageSize());
    this.pageSize = pageSize;
    this.pageSize.subscribe((value) => {
      if (this.oldDataController.pageSize() !== value) {
        this.oldDataController.pageSize(value);
      }
    });

    const pageIndex = state(this.oldDataController.pageIndex());
    this.pageIndex = pageIndex;
    this.pageIndex.subscribe((value) => {
      if (this.oldDataController.pageIndex() !== value) {
        this.oldDataController.pageIndex(value);
      }
    });

    const totalCount = state(this.oldDataController.totalCount());
    this.totalCount = totalCount;

    const isLoading = state(this.oldDataController.isLoading());
    this.isLoading = isLoading;

    const items = state(this.oldDataController.items());
    // @ts-expect-error
    this.items = items;

    this.oldDataController.loadingChanged.add(() => {
      isLoading.update(this.oldDataController.isLoading());
    });

    this.oldDataController.changed.add(() => {
      pageCount.update(this.oldDataController.pageCount());
      pageSize.update(this.oldDataController.pageSize());
      pageCount.update(this.oldDataController.pageCount());
      pageIndex.update(this.oldDataController.pageIndex());
      items.update(this.oldDataController.items());
      totalCount.update(this.oldDataController.totalCount());
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDataKey(data: DataObject): Key {
    throw new Error('should be overwritten below');
  }

  public async waitLoaded(): Promise<void> {
    await this.oldDataController.waitReady();
  }
}

NewDataController.prototype.getDataKey = DataControllerClass.prototype.getDataKey;
