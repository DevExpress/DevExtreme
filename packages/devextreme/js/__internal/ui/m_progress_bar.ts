import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isFunction } from '@js/core/utils/type';
import type { Properties } from '@js/ui/progress_bar';
import type { OptionChanged } from '@ts/core/widget/types';
import TrackBar from '@ts/ui/m_track_bar';

const PROGRESSBAR_CLASS = 'dx-progressbar';
const PROGRESSBAR_CONTAINER_CLASS = 'dx-progressbar-container';
const PROGRESSBAR_RANGE_CONTAINER_CLASS = 'dx-progressbar-range-container';
const PROGRESSBAR_RANGE_CLASS = 'dx-progressbar-range';
const PROGRESSBAR_WRAPPER_CLASS = 'dx-progressbar-wrapper';
const PROGRESSBAR_STATUS_CLASS = 'dx-progressbar-status';
const PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = 'dx-progressbar-animating-container';
const PROGRESSBAR_INDETERMINATE_SEGMENT = 'dx-progressbar-animating-segment';

export interface ProgressBarProperties extends Omit<Properties,
 'onValueChanged' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'
> {
  _animatingSegmentCount: number;

  statusPosition: string;

  statusFormat?: (ratio: number) => string;

  showStatus: boolean;
}

class ProgressBar extends TrackBar<ProgressBarProperties> {
  _completeAction!: (event?: Record<string, unknown>) => void;

  _$status!: dxElementWrapper;

  _$segmentContainer?: dxElementWrapper;

  _getDefaultOptions(): ProgressBarProperties {
    return {
      ...super._getDefaultOptions(),
      value: 0,
      statusFormat(ratio): string {
        return `Progress: ${Math.round(ratio * 100)}%`;
      },
      showStatus: true,
      // @ts-expect-error ts-error
      onComplete: null,
      activeStateEnabled: false,
      statusPosition: 'bottom left',
      _animatingSegmentCount: 0,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<ProgressBarProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(device): boolean {
          return device.platform === 'android';
        },
        options: {
          _animatingSegmentCount: 2,
        },
      },
    ]);
  }

  _toggleReadOnlyState(): void {
    this.setAria('readonly', undefined);
  }

  _initMarkup(): void {
    this._renderStatus();
    this._createCompleteAction();

    super._initMarkup();

    this.$element().addClass(PROGRESSBAR_CLASS);
    this._$wrapper.addClass(PROGRESSBAR_WRAPPER_CLASS);
    this._$bar.addClass(PROGRESSBAR_CONTAINER_CLASS);

    this.setAria('role', 'progressbar');

    $('<div>').addClass(PROGRESSBAR_RANGE_CONTAINER_CLASS).appendTo(this._$wrapper).append(this._$bar);
    this._$range.addClass(PROGRESSBAR_RANGE_CLASS);

    const { showStatus } = this.option();

    this._toggleStatus(showStatus);
  }

  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _createCompleteAction(): void {
    this._completeAction = this._createActionByOption('onComplete');
  }

  _renderStatus(): void {
    this._$status = $('<div>')
      .addClass(PROGRESSBAR_STATUS_CLASS);
  }

  _renderIndeterminateState(): void {
    this._$segmentContainer = $('<div>')
      .addClass(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER);

    const { _animatingSegmentCount: segments } = this.option();

    for (let i = 0; i < segments; i += 1) {
      $('<div>')
        .addClass(PROGRESSBAR_INDETERMINATE_SEGMENT)
        .addClass(`${PROGRESSBAR_INDETERMINATE_SEGMENT}-${i + 1}`)
        .appendTo(this._$segmentContainer);
    }

    this._$segmentContainer.appendTo(this._$wrapper);
  }

  _toggleStatus(value: boolean): void {
    const { statusPosition } = this.option();
    const splitPosition = statusPosition.split(' ');

    if (value) {
      if (splitPosition[0] === 'top' || splitPosition[0] === 'left') {
        this._$status.prependTo(this._$wrapper);
      } else {
        this._$status.appendTo(this._$wrapper);
      }
    } else {
      this._$status.detach();
    }

    this._togglePositionClass();
  }

  _togglePositionClass(): void {
    const { statusPosition } = this.option();
    const splitPosition = statusPosition.split(' ');

    this._$wrapper.removeClass('dx-position-top-left dx-position-top-right dx-position-bottom-left dx-position-bottom-right dx-position-left dx-position-right');

    let positionClass = `dx-position-${splitPosition[0]}`;

    if (splitPosition[1]) {
      positionClass += `-${splitPosition[1]}`;
    }

    this._$wrapper.addClass(positionClass);
  }

  _toggleIndeterminateState(value: boolean): void {
    if (value) {
      this._renderIndeterminateState();
      this._$bar.toggle(false);
    } else {
      this._$bar.toggle(true);
      this._$segmentContainer?.remove();
      delete this._$segmentContainer;
    }
  }

  _renderValue(): void {
    const { value, max } = this.option();

    if (!value && value !== 0) {
      this._toggleIndeterminateState(true);
      return;
    }

    if (this._$segmentContainer) {
      this._toggleIndeterminateState(false);
    }

    if (value === max) {
      this._completeAction();
    }

    super._renderValue();

    this._setStatus();
  }

  _setStatus(): void {
    const { statusFormat } = this.option();

    let format = statusFormat;

    if (isFunction(format)) {
      format = format.bind(this);
    } else {
      // @ts-expect-error ts-error
      format = function (value) {
        return value;
      };
    }
    // @ts-expect-error ts-error
    const statusText = format(this._currentRatio, this.option('value'));
    this._$status.text(statusText);
  }

  _dispose(): void {
    this._$status.remove();
    super._dispose();
  }

  _optionChanged(args: OptionChanged<ProgressBarProperties>): void {
    const { name, value } = args;
    switch (name) {
      case 'statusFormat':
        this._setStatus();
        break;
      case 'showStatus':
        this._toggleStatus(value as ProgressBarProperties[typeof name]);
        break;
      case 'statusPosition': {
        const { showStatus } = this.option();

        this._toggleStatus(showStatus);
        break;
      }
      case 'onComplete':
        this._createCompleteAction();
        break;
      case '_animatingSegmentCount':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxProgressBar', ProgressBar);

export default ProgressBar;
