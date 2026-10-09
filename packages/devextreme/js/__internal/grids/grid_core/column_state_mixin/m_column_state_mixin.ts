import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type {
  ColumnStateMixinBase,
  ColumnStateOptions,
  IndicatorColumnsSource,
  IndicatorOptions,
  IndicatorRowOptions,
} from './types';

const COLUMN_INDICATORS_CLASS = 'dx-column-indicators';
const GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const ColumnStateMixin = <T extends ColumnStateMixinBase>(Base: T) => class extends Base {
  /**
   * @extended header_filter_core
   */
  protected _applyColumnState(options: ColumnStateOptions): dxElementWrapper | undefined {
    const rtlEnabled = this.option('rtlEnabled');
    const columnAlignment = this._getColumnAlignment(options.column.alignment, rtlEnabled);
    const parameters: IndicatorOptions = extend(true, { columnAlignment }, options);
    const isGroupPanelItem = parameters.rootElement.hasClass(GROUP_PANEL_ITEM_CLASS);
    const $indicatorsContainer = this._createIndicatorContainer(parameters, isGroupPanelItem);
    const $span = $('<span>').addClass(this._getIndicatorClassName(options.name) ?? '');
    // TODO getController
    const columnsController = this.component?.getController('columns');
    const indicatorAlignment = columnsController?.getHeaderContentAlignment(columnAlignment)
      ?? columnAlignment;

    parameters.container = $indicatorsContainer;
    parameters.indicator = $span;
    this._renderIndicator(parameters);

    $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && indicatorAlignment === 'left' ? 'appendTo' : 'prependTo'](options.rootElement);

    return $span;
  }

  /**
   * @extended header_filter_core
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _getIndicatorClassName(name: string): string | undefined {
    return undefined;
  }

  protected _getColumnAlignment(
    alignment: string | undefined,
    rtl = false,
  ): string {
    const rtlEnabled = rtl || this.option('rtlEnabled');

    return alignment && alignment !== 'center' ? alignment : getDefaultAlignment(rtlEnabled);
  }

  private _createIndicatorContainer(
    options: IndicatorOptions,
    ignoreIndicatorAlignment: boolean,
  ): dxElementWrapper {
    let $indicatorsContainer = this._getIndicatorContainer(options.rootElement);
    const indicatorAlignment = options.columnAlignment === 'left' ? 'right' : 'left';
    const containerFloat = options.showColumnLines && !ignoreIndicatorAlignment
      ? indicatorAlignment
      : null;

    if (!$indicatorsContainer.length) {
      $indicatorsContainer = $('<div>').addClass(COLUMN_INDICATORS_CLASS);
    }

    this.setAria('role', 'presentation', $indicatorsContainer);

    // @ts-expect-error css() is typed without null
    return $indicatorsContainer.css('float', containerFloat);
  }

  protected _getIndicatorContainer($cell: dxElementWrapper): dxElementWrapper {
    return $cell && $cell.find(`.${COLUMN_INDICATORS_CLASS}`);
  }

  protected _getIndicatorElements(
    $cell: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnAll = false,
  ): dxElementWrapper {
    const $indicatorContainer = this._getIndicatorContainer($cell);

    return $indicatorContainer?.children();
  }

  /**
   * @extended header_filter_core
   */
  protected _renderIndicator(options: IndicatorOptions): void {
    const $container = options.container;
    const $indicator = options.indicator;

    if ($container && $indicator) {
      $container.append($indicator);
    }
  }

  protected _updateIndicators(this: this & IndicatorColumnsSource, indicatorName: string): void {
    const columns = this.getColumns();
    const $cells = this.getColumnElements();

    if (!$cells || columns.length !== $cells.length) {
      return;
    }

    for (let i = 0; i < columns.length; i += 1) {
      const $cell = $cells.eq(i);
      this._updateIndicator($cell, columns[i], indicatorName);

      // @ts-expect-error data(key) is typed as returning the wrapper
      const rowOptions: IndicatorRowOptions | undefined = $cell.parent().data('options');

      if (rowOptions?.cells) {
        rowOptions.cells[$cell.index()].column = columns[i];
      }
    }
  }

  protected _updateIndicator(
    $cell: dxElementWrapper,
    column: Column,
    indicatorName: string,
  ): dxElementWrapper | undefined {
    if (!column.command) {
      return this._applyColumnState({
        name: indicatorName,
        rootElement: $cell,
        column,
        showColumnLines: this.option('showColumnLines'),
      });
    }

    return undefined;
  }
};

export default ColumnStateMixin;
