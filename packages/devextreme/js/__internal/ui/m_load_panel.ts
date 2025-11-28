import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import LoadIndicator from '@js/ui/load_indicator';
import type { Properties } from '@js/ui/load_panel';
import { isFluent, isMaterial } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import Overlay from '@ts/ui/overlay/m_overlay';

// STYLE loadPanel

const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
const LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';

export interface LoadPanelProperties extends Properties {}

class LoadPanel extends Overlay<LoadPanelProperties> {
  _$indicator?: dxElementWrapper;

  _$loadPanelContentWrapper?: dxElementWrapper;

  _showTimeout?: ReturnType<typeof setTimeout>;

  _supportedKeys(): Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void> {
    return {
      ...super._supportedKeys(),
      escape: noop,
    };
  }

  _getDefaultOptions(): LoadPanelProperties {
    return {
      ...super._getDefaultOptions(),
      message: messageLocalization.format('Loading'),
      width: 222,
      height: 90,
      // @ts-expect-error ts-error
      animation: null,
      showIndicator: true,
      indicatorSrc: '',
      showPane: true,
      delay: 0,
      templatesRenderAsynchronously: false,
      hideTopOverlayHandler: null,
      focusStateEnabled: false,
      propagateOutsideClick: true,
      preventScrollEvents: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<LoadPanelProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device: { platform: 'generic' },
        options: {
          shadingColor: 'transparent',
        },
      },
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isMaterial();
        },
        options: {
          message: '',
          width: 60,
          height: 60,
          maxHeight: 60,
          maxWidth: 60,
        },
      },
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isFluent();
        },
        options: {
          width: 'auto',
          height: 'auto',
        },
      },
    ]);
  }

  _init(): void {
    // @ts-expect-error ts-error
    super._init.apply(this, arguments);
  }

  _render(): void {
    super._render();

    this.$element().addClass(LOADPANEL_CLASS);
    this.$wrapper()?.addClass(LOADPANEL_WRAPPER_CLASS);
    this._updateWrapperAria();
  }

  _updateWrapperAria(): void {
    this.$wrapper()
      ?.removeAttr('aria-label')
      .removeAttr('role');

    const showIndicator = this.option('showIndicator');
    if (!showIndicator) {
      const aria = this._getAriaAttributes();
      // @ts-expect-error ts-error
      this.$wrapper().attr(aria);
    }
  }

  _getAriaAttributes() {
    const { message } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const label = message || messageLocalization.format('Loading');

    const aria = {
      role: 'alert',
      'aria-label': label,
    };

    return aria;
  }

  // @ts-expect-error ts-error
  _renderContentImpl(): void {
    super._renderContentImpl();

    const $content = this.$content();

    if (!$content) {
      return;
    }

    this.$content()?.addClass(LOADPANEL_CONTENT_CLASS);

    this._$loadPanelContentWrapper = $('<div>').addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);
    this._$loadPanelContentWrapper.appendTo($content);

    this._togglePaneVisible();

    this._cleanPreviousContent();
    this._renderLoadIndicator();
    this._renderMessage();
  }

  _show() {
    const { delay } = this.option();

    if (!delay) {
      return super._show();
    }

    const deferred = Deferred();
    const callBase = super._show.bind(this);

    this._clearShowTimeout();
    this._showTimeout = setTimeout(() => {
      // @ts-expect-error ts-error
      callBase().done(() => {
        deferred.resolve();
      });
    }, delay);

    return deferred.promise();
  }

  _hide() {
    this._clearShowTimeout();
    return super._hide();
  }

  _clearShowTimeout(): void {
    clearTimeout(this._showTimeout);
  }

  _renderMessage(): void {
    if (!this._$loadPanelContentWrapper) {
      return;
    }

    const { message } = this.option();

    if (!message) return;

    const $message = $('<div>').addClass(LOADPANEL_MESSAGE_CLASS)
      .text(message);

    this._$loadPanelContentWrapper.append($message);
  }

  _renderLoadIndicator(): void {
    if (!this._$loadPanelContentWrapper || !this.option('showIndicator')) {
      return;
    }

    if (!this._$indicator) {
      this._$indicator = $('<div>')
        .addClass(LOADPANEL_INDICATOR_CLASS)
        .appendTo(this._$loadPanelContentWrapper);
    }

    this._createComponent(this._$indicator, LoadIndicator, {
      elementAttr: this._getAriaAttributes(),
      indicatorSrc: this.option('indicatorSrc'),
    });
  }

  _cleanPreviousContent(): void {
    this.$content()?.find(`.${LOADPANEL_MESSAGE_CLASS}`).remove();
    this.$content()?.find(`.${LOADPANEL_INDICATOR_CLASS}`).remove();
    delete this._$indicator;
  }

  _togglePaneVisible(): void {
    this.$content()?.toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option('showPane'));
  }

  _optionChanged(args: OptionChanged<LoadPanelProperties>): void {
    switch (args.name) {
      case 'delay':
        break;
      case 'message':
      case 'showIndicator':
        this._cleanPreviousContent();
        this._renderLoadIndicator();
        this._renderMessage();
        this._updateWrapperAria();
        break;
      case 'showPane':
        this._togglePaneVisible();
        break;
      case 'indicatorSrc':
        this._renderLoadIndicator();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    this._clearShowTimeout();
    super._dispose();
  }
}

registerComponent('dxLoadPanel', LoadPanel);

export default LoadPanel;
