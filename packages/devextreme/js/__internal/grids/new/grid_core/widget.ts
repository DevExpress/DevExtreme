/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line max-classes-per-file
import Widget from '@js/ui/widget/ui.widget';
import { DIContext } from '@ts/core/di/index';
import type { Subscription } from '@ts/core/reactive/index';
import { render } from 'inferno';

import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import { MainView } from './main_view';
import { defaultOptions, defaultOptionsRules, type Options } from './options';

export class GridCoreNewBase<
  TProperties extends Options = Options,
> extends Widget<TProperties> {
  protected renderSubscription?: Subscription;

  protected diContext!: DIContext;

  protected dataController!: DataControllerModule.DataController;

  protected columnsController!: ColumnsControllerModule.ColumnsController;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    this.diContext.register(DataControllerModule.DataController);
    this.diContext.register(ColumnsControllerModule.ColumnsController);
  }

  protected _initDIContext(): void {
    this.dataController = this.diContext.get(DataControllerModule.DataController);
    this.columnsController = this.diContext.get(ColumnsControllerModule.ColumnsController);
  }

  protected _init(): void {
    // @ts-expect-error
    super._init();
    this._registerDIContext();
    this._initDIContext();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  protected _getDefaultOptions() {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions() as {},
      ...defaultOptions,
    };
  }

  protected _defaultOptionsRules() {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat(defaultOptionsRules);
  }

  protected _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    // @ts-expect-error
    this.renderSubscription = this.diContext.get(MainView).render(this.$element().get(0));
  }

  protected _clean(): void {
    this.renderSubscription?.unsubscribe();
    // @ts-expect-error
    render(null, this.$element().get(0));
    // @ts-expect-error
    super._clean();
  }
}

export class GridCoreNew extends ColumnsControllerModule.PublicMethods(
  DataControllerModule.PublicMethods(
    GridCoreNewBase,
  ),
) {}
