"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _context_menu = _interopRequireDefault(require("../context_menu"));
var _diagram = _interopRequireDefault(require("./diagram.commands_manager"));
var _uiDiagram = _interopRequireDefault(require("./ui.diagram.menu_helper"));
var _diagram2 = _interopRequireDefault(require("./diagram.bar"));
var _diagram3 = require("./diagram.importer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DIAGRAM_TOUCHBAR_CLASS = 'dx-diagram-touchbar';
const DIAGRAM_TOUCHBAR_OVERLAY_CLASS = 'dx-diagram-touchbar-overlay';
const DIAGRAM_TOUCHBAR_TARGET_CLASS = 'dx-diagram-touchbar-target';
const DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
const DIAGRAM_TOUCHBAR_Y_OFFSET = 32;
class DiagramContextMenuWrapper extends _ui.default {
  _init() {
    super._init();
    this._createOnVisibilityChangingAction();
    this._createOnInternalCommand();
    this._createOnCustomCommand();
    this._createOnItemClickAction();
    this._tempState = undefined;
    this._commands = [];
    this._commandToIndexMap = {};
    this.bar = new DiagramContextMenuBar(this);
  }
  _initMarkup() {
    super._initMarkup();
    this._commands = this._getCommands();
    this._commandToIndexMap = {};
    this._fillCommandToIndexMap(this._commands, []);
    this._$contextMenuTargetElement = (0, _renderer.default)('<div>').addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS).appendTo(this.$element());
    const $contextMenu = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._contextMenuInstance = this._createComponent($contextMenu, DiagramContextMenu, {
      isTouchBarMode: this._isTouchBarMode(),
      cssClass: this._isTouchBarMode() ? DIAGRAM_TOUCHBAR_CLASS : _uiDiagram.default.getContextMenuCssClass(),
      hideOnOutsideClick: false,
      showEvent: '',
      focusStateEnabled: false,
      items: this._commands,
      position: this._isTouchBarMode() ? {
        my: {
          x: 'center',
          y: 'bottom'
        },
        at: {
          x: 'center',
          y: 'top'
        },
        of: this._$contextMenuTargetElement
      } : {},
      itemTemplate: function (itemData, itemIndex, itemElement) {
        _uiDiagram.default.getContextMenuItemTemplate(this, itemData, itemIndex, itemElement);
      },
      onItemClick: _ref => {
        let {
          itemData
        } = _ref;
        return this._onItemClick(itemData);
      },
      onShowing: e => {
        if (this._inOnShowing === true) return;
        this._inOnShowing = true;
        this._onVisibilityChangingAction({
          visible: true,
          component: this
        });
        e.component.option('items', e.component.option('items'));
        delete this._inOnShowing;
      }
    });
  }
  _show(x, y, selection) {
    this._contextMenuInstance.hide();
    if (this._isTouchBarMode()) {
      this._$contextMenuTargetElement.show();
      if (!selection) {
        selection = {
          x,
          y,
          width: 0,
          height: 0
        };
      }
      const widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH ? 0 : (DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH - selection.width) / 2;
      this._$contextMenuTargetElement.css({
        left: selection.x - widthCorrection,
        top: selection.y - DIAGRAM_TOUCHBAR_Y_OFFSET,
        width: selection.width + 2 * widthCorrection,
        height: selection.height + 2 * DIAGRAM_TOUCHBAR_Y_OFFSET
      });
      this._contextMenuInstance.show();
    } else {
      this._contextMenuInstance.option('position', {
        offset: x + ' ' + y
      });
      this._contextMenuInstance.show();
    }
  }
  _hide() {
    this._$contextMenuTargetElement.hide();
    this._contextMenuInstance.hide();
  }
  _isTouchBarMode() {
    const {
      Browser
    } = (0, _diagram3.getDiagram)();
    return Browser.TouchUI;
  }
  _onItemClick(itemData) {
    let processed = false;
    if (this._onItemClickAction) {
      processed = this._onItemClickAction(itemData);
    }
    if (!processed) {
      _uiDiagram.default.onContextMenuItemClick(this, itemData, this._executeCommand.bind(this));
      this._contextMenuInstance.hide();
    }
  }
  _executeCommand(command, name, value) {
    if (typeof command === 'number') {
      this.bar.raiseBarCommandExecuted(command, value);
    } else if (typeof command === 'string') {
      this._onInternalCommandAction({
        command
      });
    }
    if (name !== undefined) {
      this._onCustomCommandAction({
        name
      });
    }
  }
  _createOnInternalCommand() {
    this._onInternalCommandAction = this._createActionByOption('onInternalCommand');
  }
  _createOnCustomCommand() {
    this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
  }
  _getCommands() {
    return _diagram.default.getContextMenuCommands(this.option('commands'));
  }
  _fillCommandToIndexMap(commands, indexPath) {
    commands.forEach((command, index) => {
      const commandIndexPath = indexPath.concat([index]);
      if (command.command !== undefined) {
        this._commandToIndexMap[command.command] = commandIndexPath;
      }
      if (Array.isArray(command.items)) {
        this._fillCommandToIndexMap(command.items, commandIndexPath);
      }
    });
  }
  _setItemEnabled(key, enabled) {
    this._setItemVisible(key, enabled);
  }
  _setItemVisible(key, visible) {
    const itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
    _uiDiagram.default.updateContextMenuItemVisible(this._contextMenuInstance, itemOptionText, visible);
  }
  _setItemValue(key, value) {
    const itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
    _uiDiagram.default.updateContextMenuItemValue(this._contextMenuInstance, itemOptionText, key, value);
  }
  _setItemSubItems(key, items) {
    const itemOptionText = _uiDiagram.default.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
    _uiDiagram.default.updateContextMenuItems(this._contextMenuInstance, itemOptionText, key, items);
  }
  _setEnabled(enabled) {
    this._contextMenuInstance.option('disabled', !enabled);
  }
  isVisible() {
    return this._inOnShowing;
  }
  _createOnVisibilityChangingAction() {
    this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
  }
  _createOnItemClickAction() {
    this._onItemClickAction = this._createActionByOption('onItemClick');
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'onVisibilityChanging':
        this._createOnVisibilityChangingAction();
        break;
      case 'onInternalCommand':
        this._createOnInternalCommand();
        break;
      case 'onCustomCommand':
        this._createOnCustomCommand();
        break;
      case 'onItemClick':
        this._createOnItemClickAction();
        break;
      case 'commands':
        this._invalidate();
        break;
      case 'export':
        break;
      default:
        super._optionChanged(args);
    }
  }
}
class DiagramContextMenu extends _context_menu.default {
  _renderContextMenuOverlay() {
    super._renderContextMenuOverlay();
    if (this._overlay && this.option('isTouchBarMode')) {
      this._overlay && this._overlay.option('onShown', () => {
        const $content = (0, _renderer.default)(this._overlay.$content());
        $content.parent().addClass(DIAGRAM_TOUCHBAR_OVERLAY_CLASS);
      });
    }
  }
}
class DiagramContextMenuBar extends _diagram2.default {
  constructor(owner) {
    super(owner);
  }
  getCommandKeys() {
    return this._getKeys(this._owner._commands);
  }
  setItemValue(key, value) {
    this._owner._setItemValue(key, value);
  }
  setItemEnabled(key, enabled) {
    this._owner._setItemEnabled(key, enabled);
  }
  setItemVisible(key, visible) {
    this._owner._setItemVisible(key, visible);
  }
  setItemSubItems(key, items) {
    this._owner._setItemSubItems(key, items);
  }
  setEnabled(enabled) {
    this._owner._setEnabled(enabled);
  }
  isVisible() {
    return this._owner.isVisible();
  }
}
var _default = exports.default = {
  DiagramContextMenuWrapper,
  DiagramContextMenu
};
module.exports = exports.default;
module.exports.default = exports.default;