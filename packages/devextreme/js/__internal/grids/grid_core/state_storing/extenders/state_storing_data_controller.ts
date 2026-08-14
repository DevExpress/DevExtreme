import type { Callback } from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { StateStoringController } from '../m_state_storing_controller';

export interface StateStoringDataControllerExtension {
  stateLoaded: Callback<[]>;
}

export const stateStoringDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & StateStoringDataControllerExtension
> => class StateStoringDataExtender extends Base {
  public stateLoaded!: Callback<[]>;

  protected _stateStoringController!: StateStoringController;

  private _restoreStateTimeoutID?: ReturnType<typeof setTimeout> | null;

  public init(): void {
    this._stateStoringController = this.getController('stateStoring');
    super.init();
  }

  public dispose(): void {
    clearTimeout(this._restoreStateTimeoutID ?? undefined);
    super.dispose();
  }

  protected callbackNames(): string[] {
    return super.callbackNames().concat(['stateLoaded']);
  }

  protected _refreshDataSource(): DeferredObj<unknown> | undefined {
    if (this._stateStoringController.isEnabled() && !this._stateStoringController.isLoaded()) {
      clearTimeout(this._restoreStateTimeoutID ?? undefined);

      const deferred = Deferred();
      // eslint-disable-next-line no-restricted-globals
      this._restoreStateTimeoutID = setTimeout(() => {
        this._stateStoringController.load()
          .always(() => {
            this._restoreStateTimeoutID = null;
          })
          .done(() => {
            super._refreshDataSource();

            this.stateLoaded.fire();
            deferred.resolve();
          })
          .fail((error: Error) => {
            this.stateLoaded.fire();
            this.loadErrorHandler(error ?? 'Unknown error');
            deferred.reject();
          });
      });

      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.promise();
    }

    if (!this.isStateLoading()) {
      super._refreshDataSource();
    }

    return undefined;
  }

  public isLoading(): boolean {
    return super.isLoading() || this._stateStoringController.isLoading();
  }

  private isStateLoading(): boolean {
    return isDefined(this._restoreStateTimeoutID);
  }

  public isLoaded(): boolean {
    return super.isLoaded() && !this.isStateLoading();
  }
};
