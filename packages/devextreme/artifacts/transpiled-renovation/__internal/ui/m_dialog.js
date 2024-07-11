"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.custom = exports.confirm = exports.alert = void 0;
var _action = _interopRequireDefault(require("../../core/action"));
var _config = _interopRequireDefault(require("../../core/config"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _dom = require("../../core/utils/dom");
var _extend = require("../../core/utils/extend");
var _size = require("../../core/utils/size");
var _type = require("../../core/utils/type");
var _view_port = require("../../core/utils/view_port");
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../../ui/popup/ui.popup"));
var _themes = require("../../ui/themes");
var _ui2 = _interopRequireDefault(require("../../ui/widget/ui.errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const window = (0, _window.getWindow)();
const DEFAULT_BUTTON = {
  text: 'OK',
  onClick() {
    return true;
  }
};
const DX_DIALOG_CLASSNAME = 'dx-dialog';
const DX_DIALOG_WRAPPER_CLASSNAME = `${DX_DIALOG_CLASSNAME}-wrapper`;
const DX_DIALOG_ROOT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-root`;
const DX_DIALOG_CONTENT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-content`;
const DX_DIALOG_MESSAGE_CLASSNAME = `${DX_DIALOG_CLASSNAME}-message`;
const DX_DIALOG_BUTTONS_CLASSNAME = `${DX_DIALOG_CLASSNAME}-buttons`;
const DX_DIALOG_BUTTON_CLASSNAME = `${DX_DIALOG_CLASSNAME}-button`;
const DX_BUTTON_CLASSNAME = 'dx-button';
const getApplyButtonConfig = () => {
  // @ts-expect-error
  if ((0, _themes.isFluent)()) {
    return {
      stylingMode: 'contained',
      type: 'default'
    };
  }
  return {};
};
const getCancelButtonConfig = () => {
  // @ts-expect-error
  if ((0, _themes.isFluent)()) {
    return {
      stylingMode: 'outlined',
      type: 'default'
    };
  }
  return {};
};
const custom = function (options) {
  const deferred = (0, _deferred.Deferred)();
  options = options || {};
  const $element = (0, _renderer.default)('<div>').addClass(DX_DIALOG_CLASSNAME).appendTo((0, _view_port.value)());
  const isMessageDefined = ('message' in options);
  const isMessageHtmlDefined = ('messageHtml' in options);
  if (isMessageDefined) {
    _ui2.default.log('W1013');
  }
  const messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);
  const messageId = options.title ? null : new _guid.default();
  const $message = (0, _renderer.default)('<div>').addClass(DX_DIALOG_MESSAGE_CLASSNAME).html(messageHtml)
  // @ts-expect-error
  .attr('id', messageId);
  const popupToolbarItems = [];
  const popupInstance = new _ui.default($element, (0, _extend.extend)({
    title: options.title ?? '',
    showTitle: (0, _common.ensureDefined)(options.showTitle, true),
    dragEnabled: (0, _common.ensureDefined)(options.dragEnabled, true),
    height: 'auto',
    width: options.width,
    showCloseButton: options.showCloseButton || false,
    ignoreChildEvents: false,
    container: $element,
    visualContainer: window,
    dragAndResizeArea: window,
    onContentReady(args) {
      args.component.$content().addClass(DX_DIALOG_CONTENT_CLASSNAME).append($message);
      if (messageId) {
        args.component.$overlayContent().attr('aria-labelledby', messageId);
      }
    },
    onShowing(e) {
      e.component.bottomToolbar().addClass(DX_DIALOG_BUTTONS_CLASSNAME).find(`.${DX_BUTTON_CLASSNAME}`).addClass(DX_DIALOG_BUTTON_CLASSNAME);
      (0, _dom.resetActiveElement)();
    },
    onShown(e) {
      const $firstButton = e.component.bottomToolbar().find(`.${DX_BUTTON_CLASSNAME}`).first();
      // @ts-expect-error
      _events_engine.default.trigger($firstButton, 'focus');
    },
    onHiding() {
      deferred.reject();
    },
    onHidden(_ref) {
      let {
        element
      } = _ref;
      (0, _renderer.default)(element).remove();
    },
    animation: {
      show: {
        type: 'pop',
        duration: 400
      },
      hide: {
        type: 'pop',
        duration: 400,
        to: {
          opacity: 0,
          scale: 0
        },
        from: {
          opacity: 1,
          scale: 1
        }
      }
    },
    rtlEnabled: (0, _config.default)().rtlEnabled,
    position: {
      boundaryOffset: {
        h: 10,
        v: 0
      }
    }
  }, options.popupOptions));
  const buttonOptions = options.buttons || [DEFAULT_BUTTON];
  buttonOptions.forEach(options => {
    const action = new _action.default(options.onClick, {
      context: popupInstance
    });
    // @ts-expect-error
    popupToolbarItems.push({
      toolbar: 'bottom',
      location: _devices.default.current().android ? 'after' : 'center',
      widget: 'dxButton',
      options: _extends({}, options, {
        onClick() {
          const result = action.execute(...arguments);
          hide(result);
        }
      })
    });
  });
  popupInstance.option('toolbarItems', popupToolbarItems);
  popupInstance.$wrapper().addClass(DX_DIALOG_WRAPPER_CLASSNAME);
  if (options.position) {
    popupInstance.option('position', options.position);
  }
  popupInstance.$wrapper().addClass(DX_DIALOG_ROOT_CLASSNAME);
  function show() {
    if (_devices.default.real().deviceType === 'phone') {
      const isPortrait = (0, _size.getHeight)(window) > (0, _size.getWidth)(window);
      const width = isPortrait ? '90%' : '60%';
      popupInstance.option({
        width
      });
    }
    popupInstance.show();
    return deferred.promise();
  }
  function hide(value) {
    deferred.resolve(value);
    popupInstance.hide();
  }
  return {
    show,
    hide
  };
};
// eslint-disable-next-line @typescript-eslint/default-param-last
exports.custom = custom;
const alert = function (messageHtml) {
  let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let showTitle = arguments.length > 2 ? arguments[2] : undefined;
  const options = (0, _type.isPlainObject)(messageHtml) ? messageHtml : {
    title,
    messageHtml,
    showTitle,
    buttons: [_extends({}, DEFAULT_BUTTON, getApplyButtonConfig())],
    dragEnabled: showTitle
  };
  return custom(options).show();
};
// eslint-disable-next-line @typescript-eslint/default-param-last
exports.alert = alert;
const confirm = function (messageHtml) {
  let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let showTitle = arguments.length > 2 ? arguments[2] : undefined;
  const options = (0, _type.isPlainObject)(messageHtml) ? messageHtml : {
    title,
    messageHtml,
    showTitle,
    buttons: [_extends({
      text: _message.default.format('Yes'),
      onClick() {
        return true;
      }
    }, getApplyButtonConfig()), _extends({
      text: _message.default.format('No'),
      onClick() {
        return false;
      }
    }, getCancelButtonConfig())],
    dragEnabled: showTitle
  };
  return custom(options).show();
};
exports.confirm = confirm;