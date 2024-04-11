import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import Widget from '@js/ui/widget/ui.widget';

const GRID_CORE_ROW_SELECTOR = '.dx-row';

export default class GridCoreWidget<TProperties> extends Widget<TProperties> {
  private readonly _activeStateUnit = GRID_CORE_ROW_SELECTOR;

  private readonly _controllers: any;

  private readonly _views: any;

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
    this.callModuleItemsMethod('optionChanged', [args]);
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

    this.callModuleItemsMethod('dispose');
  }

  private isReady() {
    return this.getController('data').isReady();
  }

  protected getController(name) {
    return this._controllers[name];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callModuleItemsMethod(methodName: string, args?: any[]) {

  }

  protected getView(name) {
    return this._views[name];
  }

  public beginUpdate() {
    super.beginUpdate();
    this.callModuleItemsMethod('beginUpdate');
  }

  public endUpdate() {
    this.callModuleItemsMethod('endUpdate');
    super.endUpdate();
  }
}
