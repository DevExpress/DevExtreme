import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';
import Widget from '@js/ui/widget/ui.widget';

export default class GridCoreWidget<TProperties> extends Widget<TProperties> {
  public _activeStateUnit;

  private readonly _controllers: any;

  private readonly _views: any;

  private _getDefaultOptions() {
    // @ts-expect-error
    const result = super._getDefaultOptions();

    each(this.getGridCoreHelper().modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });

    return result;
  }

  protected _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();

    // @ts-expect-error
    extend(this._deprecatedOptions, {
      'columnChooser.allowSearch': { since: '23.1', message: 'Use the "columnChooser.search.enabled" option instead' },
      'columnChooser.searchTimeout': { since: '23.1', message: 'Use the "columnChooser.search.timeout" option instead' },
    });
  }

  private _clean() {

  }

  private _optionChanged(args) {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }

  private _dimensionChanged() {
    // @ts-expect-error
    this.updateDimensions(true);
  }

  private _visibilityChanged(visible) {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  }

  private _renderContentImpl() {
    this.getView('gridView').update();
  }

  private _renderContent() {
    const that = this;

    deferRender(() => {
      that._renderContentImpl();
    });
  }

  private _dispose() {
    // @ts-expect-error
    super._dispose();

    this.getGridCoreHelper().callModuleItemsMethod(this, 'dispose');
  }

  private isReady() {
    return this.getController('data').isReady();
  }

  protected getController(name) {
    return this._controllers[name];
  }

  protected getView(name) {
    return this._views[name];
  }

  protected getGridCoreHelper(): any {
  }

  public beginUpdate() {
    super.beginUpdate();
    this.getGridCoreHelper().callModuleItemsMethod(this, 'beginUpdate');
  }

  public endUpdate() {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'endUpdate');
    super.endUpdate();
  }
}
