import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';

const COLUMN_INDICATORS_CLASS = 'dx-column-indicators';
const GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';

export interface ColumnStateMixinRequirements {
  option: any;

  component: any;

  setAria: any;
}

export const ColumnStateMixin = <T extends new(...args: any[]) => ColumnStateMixinRequirements>(Base: T) => class extends Base {
  _applyColumnState(options) {
    const that = this;
    const rtlEnabled = this.option('rtlEnabled');
    const columnAlignment = that._getColumnAlignment(options.column.alignment, rtlEnabled);
    const parameters = extend(true, { columnAlignment }, options);
    const isGroupPanelItem = parameters.rootElement.hasClass(GROUP_PANEL_ITEM_CLASS);
    const $indicatorsContainer = that._createIndicatorContainer(parameters, isGroupPanelItem);
    const $span = $('<span>').addClass(that._getIndicatorClassName(options.name));
    const columnsController = that.component?.getController('columns');
    const indicatorAlignment = columnsController?.getHeaderContentAlignment(columnAlignment) || columnAlignment;

    parameters.container = $indicatorsContainer;
    parameters.indicator = $span;
    that._renderIndicator(parameters);

    $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && indicatorAlignment === 'left' ? 'appendTo' : 'prependTo'](options.rootElement);

    return $span;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getIndicatorClassName(name: string): string {

  }

  _getColumnAlignment(alignment, rtlEnabled) {
    rtlEnabled = rtlEnabled || this.option('rtlEnabled');

    return alignment && alignment !== 'center' ? alignment : getDefaultAlignment(rtlEnabled);
  }

  _createIndicatorContainer(options, ignoreIndicatorAlignment) {
    let $indicatorsContainer = this._getIndicatorContainer(options.rootElement);
    const indicatorAlignment = options.columnAlignment === 'left' ? 'right' : 'left';

    if (!$indicatorsContainer.length) {
      $indicatorsContainer = $('<div>').addClass(COLUMN_INDICATORS_CLASS);
    }

    this.setAria('role', 'presentation', $indicatorsContainer);

    return $indicatorsContainer.css('float', options.showColumnLines && !ignoreIndicatorAlignment ? indicatorAlignment : null);
  }

  _getIndicatorContainer($cell) {
    return $cell && $cell.find(`.${COLUMN_INDICATORS_CLASS}`);
  }

  _getIndicatorElements($cell) {
    const $indicatorContainer = this._getIndicatorContainer($cell);

    return $indicatorContainer && $indicatorContainer.children();
  }

  _renderIndicator(options) {
    const $container = options.container;
    const $indicator = options.indicator;

    $container && $indicator && $container.append($indicator);
  }

  _updateIndicators(indicatorName) {
    const that = this;
    // @ts-expect-error
    const columns = that.getColumns();
    // @ts-expect-error
    const $cells = that.getColumnElements();
    let $cell;

    if (!$cells || columns.length !== $cells.length) return;

    for (let i = 0; i < columns.length; i++) {
      $cell = $cells.eq(i);
      that._updateIndicator($cell, columns[i], indicatorName);

      const rowOptions = $cell.parent().data('options');

      if (rowOptions && rowOptions.cells) {
        rowOptions.cells[$cell.index()].column = columns[i];
      }
    }
  }

  _updateIndicator($cell, column, indicatorName) {
    if (!column.command) {
      return this._applyColumnState({
        name: indicatorName,
        rootElement: $cell,
        column,
        showColumnLines: this.option('showColumnLines'),
      });
    }
  }
};

export default ColumnStateMixin;
