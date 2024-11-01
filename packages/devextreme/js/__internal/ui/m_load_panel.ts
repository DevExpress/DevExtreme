import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import LoadIndicator from '@js/ui/load_indicator';
import Overlay from '@js/ui/overlay/ui.overlay';
import { isFluent, isMaterial } from '@js/ui/themes';

const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
const LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';
// @ts-expect-error
const LoadPanel = Overlay.inherit({
  _supportedKeys() {
    return extend(this.callBase(), {
      escape: noop,
    });
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      message: messageLocalization.format('Loading'),
      width: 222,
      height: 90,
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
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device: { platform: 'generic' },
        options: {
          shadingColor: 'transparent',
        },
      },
      {
        device() {
          // @ts-expect-error
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
        device() {
          // @ts-expect-error
          return isFluent();
        },
        options: {
          width: 'auto',
          height: 'auto',
        },
      },
    ]);
  },

  _init() {
    this.callBase.apply(this, arguments);
  },

  _render() {
    this.callBase();

    this.$element().addClass(LOADPANEL_CLASS);
    this.$wrapper().addClass(LOADPANEL_WRAPPER_CLASS);
    this._updateWrapperAria();
  },

  _updateWrapperAria() {
    this.$wrapper()
      .removeAttr('aria-label')
      .removeAttr('role');

    const showIndicator = this.option('showIndicator');
    if (!showIndicator) {
      const aria = this._getAriaAttributes();
      this.$wrapper().attr(aria);
    }
  },

  _getAriaAttributes() {
    const { message } = this.option();
    const label = message || messageLocalization.format('Loading');

    const aria = {
      role: 'alert',
      'aria-label': label,
    };

    return aria;
  },

  _renderContentImpl() {
    this.callBase();

    this.$content().addClass(LOADPANEL_CONTENT_CLASS);

    this._$loadPanelContentWrapper = $('<div>').addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);
    this._$loadPanelContentWrapper.appendTo(this.$content());

    this._togglePaneVisible();

    this._cleanPreviousContent();
    this._renderLoadIndicator();
    this._renderMessage();
  },

  _show() {
    const delay = this.option('delay');

    if (!delay) {
      return this.callBase();
    }

    const deferred = Deferred();
    const callBase = this.callBase.bind(this);

    this._clearShowTimeout();
    this._showTimeout = setTimeout(() => {
      callBase().done(() => {
        deferred.resolve();
      });
    }, delay);

    return deferred.promise();
  },

  _hide() {
    this._clearShowTimeout();
    return this.callBase();
  },

  _clearShowTimeout() {
    clearTimeout(this._showTimeout);
  },

  _renderMessage() {
    if (!this._$loadPanelContentWrapper) {
      return;
    }

    const message = this.option('message');

    if (!message) return;

    const $message = $('<div>').addClass(LOADPANEL_MESSAGE_CLASS)
      .text(message);

    this._$loadPanelContentWrapper.append($message);
  },

  _renderLoadIndicator() {
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
  },

  _cleanPreviousContent() {
    this.$content().find(`.${LOADPANEL_MESSAGE_CLASS}`).remove();
    this.$content().find(`.${LOADPANEL_INDICATOR_CLASS}`).remove();
    delete this._$indicator;
  },

  _togglePaneVisible() {
    this.$content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option('showPane'));
  },

  _optionChanged(args) {
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
        this.callBase(args);
    }
  },

  _dispose() {
    this._clearShowTimeout();
    this.callBase();
  },
});

registerComponent('dxLoadPanel', LoadPanel);

export default LoadPanel;
