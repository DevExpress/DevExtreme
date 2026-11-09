import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';
import Widget from '@js/ui/widget/ui.widget';
import type {
  Controllers,
  GridCoreHelper,
  InternalGridOptions,
  Module,
  OptionChanged,
  Views,
} from '@ts/grids/grid_core/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';

export default abstract class GridCoreWidget<TProperties> extends Widget<TProperties> {
  public readonly _controllers!: Controllers;

  public readonly _views!: Views;

  protected _activeStateUnit(): string {
    return `.${VIEW_CLASSES.row}`;
  }

  private _getDefaultOptions(): InternalGridOptions {
    // @ts-expect-error
    const result: InternalGridOptions = super._getDefaultOptions();

    each(this.getGridCoreHelper().modules, function extendDefaultOptions(this: Module) {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });

    return result;
  }

  protected _init(): void {
    // @ts-expect-error
    super._init();
  }

  private _clean(): void {

  }

  private _optionChanged(args: OptionChanged): void {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }

  private _dimensionChanged(): void {
    // @ts-expect-error
    this.updateDimensions(true);
  }

  private _visibilityChanged(visible: boolean): void {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  }

  private _renderContentImpl(): void {
    this.getView('gridView').update();
  }

  private _renderContent(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget render
    deferRender(() => {
      this._renderContentImpl();
    });
  }

  private _dispose(): void {
    // @ts-expect-error
    super._dispose();

    this.getGridCoreHelper().callModuleItemsMethod(this, 'dispose');
  }

  private isReady(): boolean {
    return this.getController('data').isReady();
  }

  public getController<T extends keyof Controllers>(name: T): Controllers[T] {
    return this._controllers[name];
  }

  public getView<T extends keyof Views>(name: T): Views[T] {
    return this._views[name];
  }

  protected abstract getGridCoreHelper(): GridCoreHelper;

  public beginUpdate(): void {
    super.beginUpdate();
    this.getGridCoreHelper().callModuleItemsMethod(this, 'beginUpdate');
  }

  public endUpdate(): void {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'endUpdate');
    super.endUpdate();
  }
}
