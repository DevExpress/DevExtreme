"use strict";

exports.default = void 0;
var _diagram = require("./diagram.importer");
var _file_saver = require("../../exporter/file_saver");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SEPARATOR = 'separator';
const SEPARATOR_COMMAND = {
  widget: SEPARATOR
};
const CSS_CLASSES = {
  SMALL_EDITOR_ITEM: 'dx-diagram-sm-edit-item',
  MEDIUM_EDITOR_ITEM: 'dx-diagram-md-edit-item',
  LARGE_EDITOR_ITEM: 'dx-diagram-lg-edit-item',
  IMAGE_DROPDOWN_ITEM: 'dx-diagram-image-dropdown-item',
  COLOR_EDITOR_ITEM: 'dx-diagram-color-edit-item',
  LARGE_ICON_ITEM: 'dx-diagram-lg-icon-item'
};
const DiagramCommandsManager = {
  SHOW_TOOLBOX_COMMAND_NAME: 'toolbox',
  SHOW_PROPERTIES_PANEL_COMMAND_NAME: 'propertiesPanel',
  getAllCommands: function () {
    const {
      DiagramCommand
    } = (0, _diagram.getDiagram)();
    return this._allCommands || (this._allCommands = {
      separator: SEPARATOR_COMMAND,
      exportSvg: {
        command: DiagramCommand.ExportSvg,
        // eslint-disable-line spellcheck/spell-checker
        text: _message.default.format('dxDiagram-commandExportToSvg'),
        getParameter: widget => {
          return dataURI => this._exportTo(widget, dataURI, 'SVG', 'image/svg+xml');
        }
      },
      exportPng: {
        command: DiagramCommand.ExportPng,
        // eslint-disable-line spellcheck/spell-checker
        text: _message.default.format('dxDiagram-commandExportToPng'),
        getParameter: widget => {
          return dataURI => this._exportTo(widget, dataURI, 'PNG', 'image/png');
        }
      },
      exportJpg: {
        command: DiagramCommand.ExportJpg,
        // eslint-disable-line spellcheck/spell-checker
        text: _message.default.format('dxDiagram-commandExportToJpg'),
        getParameter: widget => {
          return dataURI => this._exportTo(widget, dataURI, 'JPEG', 'image/jpeg');
        }
      },
      undo: {
        command: DiagramCommand.Undo,
        hint: _message.default.format('dxDiagram-commandUndo'),
        text: _message.default.format('dxDiagram-commandUndo'),
        icon: 'undo',
        menuIcon: 'undo'
      },
      redo: {
        command: DiagramCommand.Redo,
        hint: _message.default.format('dxDiagram-commandRedo'),
        text: _message.default.format('dxDiagram-commandRedo'),
        icon: 'redo',
        menuIcon: 'redo'
      },
      cut: {
        command: DiagramCommand.Cut,
        hint: _message.default.format('dxDiagram-commandCut'),
        text: _message.default.format('dxDiagram-commandCut'),
        icon: 'cut',
        menuIcon: 'cut'
      },
      copy: {
        command: DiagramCommand.Copy,
        hint: _message.default.format('dxDiagram-commandCopy'),
        text: _message.default.format('dxDiagram-commandCopy'),
        icon: 'copy',
        menuIcon: 'copy'
      },
      paste: {
        command: DiagramCommand.PasteInPosition,
        hint: _message.default.format('dxDiagram-commandPaste'),
        text: _message.default.format('dxDiagram-commandPaste'),
        icon: 'paste',
        menuIcon: 'paste'
      },
      selectAll: {
        command: DiagramCommand.SelectAll,
        hint: _message.default.format('dxDiagram-commandSelectAll'),
        text: _message.default.format('dxDiagram-commandSelectAll'),
        icon: 'dx-diagram-i-button-select-all dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-select-all dx-diagram-i'
      },
      delete: {
        command: DiagramCommand.Delete,
        hint: _message.default.format('dxDiagram-commandDelete'),
        text: _message.default.format('dxDiagram-commandDelete'),
        icon: 'remove',
        menuIcon: 'remove'
      },
      fontName: {
        command: DiagramCommand.FontName,
        hint: _message.default.format('dxDiagram-commandFontName'),
        text: _message.default.format('dxDiagram-commandFontName'),
        widget: 'dxSelectBox',
        items: ['Arial', 'Arial Black', 'Helvetica', 'Times New Roman', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Comic Sans MS', 'Trebuchet MS'].map(item => {
          return {
            text: item,
            value: item
          };
        }),
        cssClass: CSS_CLASSES.MEDIUM_EDITOR_ITEM
      },
      fontSize: {
        command: DiagramCommand.FontSize,
        hint: _message.default.format('dxDiagram-commandFontSize'),
        text: _message.default.format('dxDiagram-commandFontSize'),
        widget: 'dxSelectBox',
        items: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(item => {
          return {
            text: item + 'pt',
            value: item + 'pt'
          };
        }),
        cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
      },
      bold: {
        command: DiagramCommand.Bold,
        hint: _message.default.format('dxDiagram-commandBold'),
        text: _message.default.format('dxDiagram-commandBold'),
        icon: 'bold',
        menuIcon: 'bold'
      },
      italic: {
        command: DiagramCommand.Italic,
        hint: _message.default.format('dxDiagram-commandItalic'),
        text: _message.default.format('dxDiagram-commandItalic'),
        icon: 'italic',
        menuIcon: 'italic'
      },
      underline: {
        command: DiagramCommand.Underline,
        hint: _message.default.format('dxDiagram-commandUnderline'),
        text: _message.default.format('dxDiagram-commandUnderline'),
        icon: 'underline',
        menuIcon: 'underline'
      },
      fontColor: {
        command: DiagramCommand.FontColor,
        text: _message.default.format('dxDiagram-commandTextColor'),
        hint: _message.default.format('dxDiagram-commandTextColor'),
        widget: 'dxColorBox',
        icon: 'dx-icon dx-icon-color',
        menuIcon: 'dx-icon dx-icon-color',
        cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
      },
      lineColor: {
        command: DiagramCommand.StrokeColor,
        text: _message.default.format('dxDiagram-commandLineColor'),
        hint: _message.default.format('dxDiagram-commandLineColor'),
        widget: 'dxColorBox',
        icon: 'dx-icon dx-icon-background',
        menuIcon: 'dx-icon dx-icon-background',
        cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
      },
      lineWidth: {
        command: DiagramCommand.StrokeWidth,
        text: _message.default.format('dxDiagram-commandLineWidth'),
        hint: _message.default.format('dxDiagram-commandLineWidth'),
        widget: 'dxSelectBox',
        items: [1, 2, 3, 4, 5, 6, 7, 8].map(item => {
          return {
            text: item + 'px',
            value: item.toString()
          };
        }),
        cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
      },
      lineStyle: {
        command: DiagramCommand.StrokeStyle,
        text: _message.default.format('dxDiagram-commandLineStyle'),
        hint: _message.default.format('dxDiagram-commandLineStyle'),
        widget: 'dxSelectBox',
        items: [{
          value: '',
          menuIcon: 'dx-diagram-i-line-solid dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandLineStyleSolid')
        }, {
          value: '2,2',
          menuIcon: 'dx-diagram-i-line-dotted dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandLineStyleDotted')
        }, {
          value: '6,2',
          menuIcon: 'dx-diagram-i-line-dashed dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandLineStyleDashed')
        }],
        cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
      },
      fillColor: {
        command: DiagramCommand.FillColor,
        text: _message.default.format('dxDiagram-commandFillColor'),
        hint: _message.default.format('dxDiagram-commandFillColor'),
        widget: 'dxColorBox',
        icon: 'dx-diagram-i dx-diagram-i-button-fill',
        menuIcon: 'dx-diagram-i dx-diagram-i-menu-fill',
        cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
      },
      textAlignLeft: {
        command: DiagramCommand.TextLeftAlign,
        hint: _message.default.format('dxDiagram-commandAlignLeft'),
        text: _message.default.format('dxDiagram-commandAlignLeft'),
        icon: 'alignleft',
        menuIcon: 'alignleft'
      },
      textAlignCenter: {
        command: DiagramCommand.TextCenterAlign,
        hint: _message.default.format('dxDiagram-commandAlignCenter'),
        text: _message.default.format('dxDiagram-commandAlignCenter'),
        icon: 'aligncenter',
        menuIcon: 'aligncenter'
      },
      textAlignRight: {
        command: DiagramCommand.TextRightAlign,
        hint: _message.default.format('dxDiagram-commandAlignRight'),
        text: _message.default.format('dxDiagram-commandAlignRight'),
        icon: 'alignright',
        menuIcon: 'alignright'
      },
      lock: {
        command: DiagramCommand.Lock,
        hint: _message.default.format('dxDiagram-commandLock'),
        text: _message.default.format('dxDiagram-commandLock'),
        icon: 'dx-diagram-i-button-lock dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-lock dx-diagram-i'
      },
      unlock: {
        command: DiagramCommand.Unlock,
        hint: _message.default.format('dxDiagram-commandUnlock'),
        text: _message.default.format('dxDiagram-commandUnlock'),
        icon: 'dx-diagram-i-button-unlock dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-unlock dx-diagram-i'
      },
      bringToFront: {
        command: DiagramCommand.BringToFront,
        hint: _message.default.format('dxDiagram-commandBringToFront'),
        text: _message.default.format('dxDiagram-commandBringToFront'),
        icon: 'dx-diagram-i-button-bring-to-front dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-bring-to-front dx-diagram-i'
      },
      sendToBack: {
        command: DiagramCommand.SendToBack,
        hint: _message.default.format('dxDiagram-commandSendToBack'),
        text: _message.default.format('dxDiagram-commandSendToBack'),
        icon: 'dx-diagram-i-button-send-to-back dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-send-to-back dx-diagram-i'
      },
      insertShapeImage: {
        command: DiagramCommand.InsertShapeImage,
        text: _message.default.format('dxDiagram-commandInsertShapeImage'),
        icon: 'dx-diagram-i-button-image-insert dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-image-insert dx-diagram-i'
      },
      editShapeImage: {
        command: DiagramCommand.EditShapeImage,
        text: _message.default.format('dxDiagram-commandEditShapeImage'),
        icon: 'dx-diagram-i-button-image-edit dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-image-edit dx-diagram-i'
      },
      deleteShapeImage: {
        command: DiagramCommand.DeleteShapeImage,
        text: _message.default.format('dxDiagram-commandDeleteShapeImage'),
        icon: 'dx-diagram-i-button-image-delete dx-diagram-i',
        menuIcon: 'dx-diagram-i-menu-image-delete dx-diagram-i'
      },
      connectorLineType: {
        command: DiagramCommand.ConnectorLineOption,
        widget: 'dxSelectBox',
        hint: _message.default.format('dxDiagram-commandConnectorLineType'),
        text: _message.default.format('dxDiagram-commandConnectorLineType'),
        items: [{
          value: 0,
          menuIcon: 'dx-diagram-i-connector-straight dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineStraight'),
          text: _message.default.format('dxDiagram-commandConnectorLineStraight')
        }, {
          value: 1,
          menuIcon: 'dx-diagram-i-connector-orthogonal dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineOrthogonal'),
          text: _message.default.format('dxDiagram-commandConnectorLineOrthogonal')
        }],
        cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
      },
      connectorLineStart: {
        command: DiagramCommand.ConnectorStartLineEnding,
        widget: 'dxSelectBox',
        items: [{
          value: 0,
          menuIcon: 'dx-diagram-i-connector-begin-none dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineNone'),
          text: _message.default.format('dxDiagram-commandConnectorLineNone')
        }, {
          value: 1,
          menuIcon: 'dx-diagram-i-connector-begin-arrow dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }, {
          value: 2,
          menuIcon: 'dx-diagram-i-connector-begin-outlined-triangle dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }, {
          value: 3,
          menuIcon: 'dx-diagram-i-connector-begin-filled-triangle dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }],
        hint: _message.default.format('dxDiagram-commandConnectorLineStart'),
        text: _message.default.format('dxDiagram-commandConnectorLineStart'),
        cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
      },
      connectorLineEnd: {
        command: DiagramCommand.ConnectorEndLineEnding,
        widget: 'dxSelectBox',
        items: [{
          value: 0,
          menuIcon: 'dx-diagram-i-connector-end-none dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineNone'),
          text: _message.default.format('dxDiagram-commandConnectorLineNone')
        }, {
          value: 1,
          menuIcon: 'dx-diagram-i-connector-end-arrow dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }, {
          value: 2,
          menuIcon: 'dx-diagram-i-connector-end-outlined-triangle dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }, {
          value: 3,
          menuIcon: 'dx-diagram-i-connector-end-filled-triangle dx-diagram-i',
          hint: _message.default.format('dxDiagram-commandConnectorLineArrow'),
          text: _message.default.format('dxDiagram-commandConnectorLineArrow')
        }],
        hint: _message.default.format('dxDiagram-commandConnectorLineEnd'),
        text: _message.default.format('dxDiagram-commandConnectorLineEnd'),
        cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
      },
      layoutTreeTopToBottom: {
        command: DiagramCommand.AutoLayoutTreeVertical,
        text: _message.default.format('dxDiagram-commandLayoutTopToBottom'),
        hint: _message.default.format('dxDiagram-commandLayoutTopToBottom'),
        icon: 'dx-diagram-i-button-layout-tree-tb dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutTreeBottomToTop: {
        command: DiagramCommand.AutoLayoutTreeVerticalBottomToTop,
        text: _message.default.format('dxDiagram-commandLayoutBottomToTop'),
        hint: _message.default.format('dxDiagram-commandLayoutBottomToTop'),
        icon: 'dx-diagram-i-button-layout-tree-bt dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutTreeLeftToRight: {
        command: DiagramCommand.AutoLayoutTreeHorizontal,
        text: _message.default.format('dxDiagram-commandLayoutLeftToRight'),
        hint: _message.default.format('dxDiagram-commandLayoutLeftToRight'),
        icon: 'dx-diagram-i-button-layout-tree-lr dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutTreeRightToLeft: {
        command: DiagramCommand.AutoLayoutTreeHorizontalRightToLeft,
        text: _message.default.format('dxDiagram-commandLayoutRightToLeft'),
        hint: _message.default.format('dxDiagram-commandLayoutRightToLeft'),
        icon: 'dx-diagram-i-button-layout-tree-rl dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutLayeredTopToBottom: {
        command: DiagramCommand.AutoLayoutLayeredVertical,
        text: _message.default.format('dxDiagram-commandLayoutTopToBottom'),
        hint: _message.default.format('dxDiagram-commandLayoutTopToBottom'),
        icon: 'dx-diagram-i-button-layout-layered-tb dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutLayeredBottomToTop: {
        command: DiagramCommand.AutoLayoutLayeredVerticalBottomToTop,
        text: _message.default.format('dxDiagram-commandLayoutBottomToTop'),
        hint: _message.default.format('dxDiagram-commandLayoutBottomToTop'),
        icon: 'dx-diagram-i-button-layout-layered-bt dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutLayeredLeftToRight: {
        command: DiagramCommand.AutoLayoutLayeredHorizontal,
        text: _message.default.format('dxDiagram-commandLayoutLeftToRight'),
        hint: _message.default.format('dxDiagram-commandLayoutLeftToRight'),
        icon: 'dx-diagram-i-button-layout-layered-lr dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      layoutLayeredRightToLeft: {
        command: DiagramCommand.AutoLayoutLayeredHorizontalRightToLeft,
        text: _message.default.format('dxDiagram-commandLayoutRightToLeft'),
        hint: _message.default.format('dxDiagram-commandLayoutRightToLeft'),
        icon: 'dx-diagram-i-button-layout-layered-rl dx-diagram-i',
        cssClass: CSS_CLASSES.LARGE_ICON_ITEM
      },
      fullScreen: {
        command: DiagramCommand.Fullscreen,
        hint: _message.default.format('dxDiagram-commandFullscreen'),
        text: _message.default.format('dxDiagram-commandFullscreen'),
        icon: 'dx-diagram-i dx-diagram-i-button-fullscreen',
        menuIcon: 'dx-diagram-i dx-diagram-i-menu-fullscreen',
        cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
      },
      units: {
        command: DiagramCommand.ViewUnits,
        hint: _message.default.format('dxDiagram-commandUnits'),
        text: _message.default.format('dxDiagram-commandUnits'),
        widget: 'dxSelectBox'
      },
      simpleView: {
        command: DiagramCommand.ToggleSimpleView,
        hint: _message.default.format('dxDiagram-commandSimpleView'),
        text: _message.default.format('dxDiagram-commandSimpleView'),
        widget: 'dxCheckBox'
      },
      showGrid: {
        command: DiagramCommand.ShowGrid,
        hint: _message.default.format('dxDiagram-commandShowGrid'),
        text: _message.default.format('dxDiagram-commandShowGrid'),
        widget: 'dxCheckBox'
      },
      snapToGrid: {
        command: DiagramCommand.SnapToGrid,
        hint: _message.default.format('dxDiagram-commandSnapToGrid'),
        text: _message.default.format('dxDiagram-commandSnapToGrid'),
        widget: 'dxCheckBox'
      },
      gridSize: {
        command: DiagramCommand.GridSize,
        hint: _message.default.format('dxDiagram-commandGridSize'),
        text: _message.default.format('dxDiagram-commandGridSize'),
        widget: 'dxSelectBox'
      },
      pageSize: {
        command: DiagramCommand.PageSize,
        hint: _message.default.format('dxDiagram-commandPageSize'),
        text: _message.default.format('dxDiagram-commandPageSize'),
        widget: 'dxSelectBox',
        cssClass: CSS_CLASSES.LARGE_EDITOR_ITEM,
        getCommandValue: v => JSON.parse(v),
        getEditorValue: v => JSON.stringify(v)
      },
      pageOrientation: {
        command: DiagramCommand.PageLandscape,
        hint: _message.default.format('dxDiagram-commandPageOrientation'),
        text: _message.default.format('dxDiagram-commandPageOrientation'),
        widget: 'dxSelectBox',
        items: [{
          value: true,
          text: _message.default.format('dxDiagram-commandPageOrientationLandscape')
        }, {
          value: false,
          text: _message.default.format('dxDiagram-commandPageOrientationPortrait')
        }],
        cssClass: CSS_CLASSES.MEDIUM_EDITOR_ITEM
      },
      pageColor: {
        command: DiagramCommand.PageColor,
        hint: _message.default.format('dxDiagram-commandPageColor'),
        text: _message.default.format('dxDiagram-commandPageColor'),
        widget: 'dxColorBox',
        icon: 'dx-diagram-i dx-diagram-i-button-fill',
        menuIcon: 'dx-diagram-i dx-diagram-i-menu-fill',
        cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
      },
      zoomLevel: {
        command: DiagramCommand.ZoomLevel,
        hint: _message.default.format('dxDiagram-commandZoomLevel'),
        text: _message.default.format('dxDiagram-commandZoomLevel'),
        widget: 'dxTextBox',
        items: [SEPARATOR_COMMAND, {
          command: DiagramCommand.FitToScreen,
          hint: _message.default.format('dxDiagram-commandFitToContent'),
          text: _message.default.format('dxDiagram-commandFitToContent')
        }, {
          command: DiagramCommand.FitToWidth,
          hint: _message.default.format('dxDiagram-commandFitToWidth'),
          text: _message.default.format('dxDiagram-commandFitToWidth')
        }, SEPARATOR_COMMAND, {
          command: DiagramCommand.AutoZoomToContent,
          hint: _message.default.format('dxDiagram-commandAutoZoomByContent'),
          text: _message.default.format('dxDiagram-commandAutoZoomByContent')
        }, {
          command: DiagramCommand.AutoZoomToWidth,
          hint: _message.default.format('dxDiagram-commandAutoZoomByWidth'),
          text: _message.default.format('dxDiagram-commandAutoZoomByWidth')
        }],
        getEditorDisplayValue: v => {
          return Math.round(v * 100) + '%';
        },
        cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
      },
      // Custom commands
      toolbox: {
        command: this.SHOW_TOOLBOX_COMMAND_NAME,
        iconChecked: 'dx-diagram-i dx-diagram-i-button-toolbox-close',
        iconUnchecked: 'dx-diagram-i dx-diagram-i-button-toolbox-open',
        hint: _message.default.format('dxDiagram-uiShowToolbox'),
        text: _message.default.format('dxDiagram-uiShowToolbox')
      },
      propertiesPanel: {
        command: this.SHOW_PROPERTIES_PANEL_COMMAND_NAME,
        iconChecked: 'close',
        iconUnchecked: 'dx-diagram-i dx-diagram-i-button-properties-panel-open',
        hint: _message.default.format('dxDiagram-uiProperties'),
        text: _message.default.format('dxDiagram-uiProperties')
      }
    });
  },
  getMainToolbarCommands: function (commands, excludeCommands) {
    const allCommands = this.getAllCommands();
    const mainToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) : this._getDefaultMainToolbarCommands(allCommands);
    return this._prepareToolbarCommands(mainToolbarCommands, excludeCommands);
  },
  _getDefaultMainToolbarCommands: function (allCommands) {
    return this._defaultMainToolbarCommands || (this._defaultMainToolbarCommands = [allCommands['undo'], allCommands['redo'], allCommands['separator'], allCommands['fontName'], allCommands['fontSize'], allCommands['bold'], allCommands['italic'], allCommands['underline'], allCommands['separator'], allCommands['lineWidth'], allCommands['lineStyle'], allCommands['separator'], allCommands['fontColor'], allCommands['lineColor'], allCommands['fillColor'], allCommands['separator'], allCommands['textAlignLeft'], allCommands['textAlignCenter'], allCommands['textAlignRight'], allCommands['separator'], allCommands['connectorLineType'], allCommands['connectorLineStart'], allCommands['connectorLineEnd'], allCommands['separator'], {
      text: _message.default.format('dxDiagram-uiLayout'),
      showText: 'always',
      items: [{
        text: _message.default.format('dxDiagram-uiLayoutTree'),
        items: [allCommands['layoutTreeTopToBottom'], allCommands['layoutTreeBottomToTop'], allCommands['layoutTreeLeftToRight'], allCommands['layoutTreeRightToLeft']]
      }, {
        text: _message.default.format('dxDiagram-uiLayoutLayered'),
        items: [allCommands['layoutLayeredTopToBottom'], allCommands['layoutLayeredBottomToTop'], allCommands['layoutLayeredLeftToRight'], allCommands['layoutLayeredRightToLeft']]
      }]
    }]);
  },
  getHistoryToolbarCommands: function (commands, excludeCommands) {
    const allCommands = this.getAllCommands();
    const historyToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) : this._getDefaultHistoryToolbarCommands(allCommands);
    return this._prepareToolbarCommands(historyToolbarCommands, excludeCommands);
  },
  _getDefaultHistoryToolbarCommands: function (allCommands) {
    return this._defaultHistoryToolbarCommands || (this._defaultHistoryToolbarCommands = [allCommands['undo'], allCommands['redo'], allCommands['separator'], allCommands['toolbox']]);
  },
  getViewToolbarCommands: function (commands, excludeCommands) {
    const allCommands = this.getAllCommands();
    const viewToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) : this._getDefaultViewToolbarCommands(allCommands);
    return this._prepareToolbarCommands(viewToolbarCommands, excludeCommands);
  },
  _getDefaultViewToolbarCommands: function (allCommands) {
    return this._defaultViewToolbarCommands || (this._defaultViewToolbarCommands = [allCommands['zoomLevel'], allCommands['separator'], allCommands['fullScreen'], allCommands['separator'], {
      widget: 'dxButton',
      icon: 'export',
      text: _message.default.format('dxDiagram-uiExport'),
      hint: _message.default.format('dxDiagram-uiExport'),
      items: [allCommands['exportSvg'], allCommands['exportPng'], allCommands['exportJpg']]
    }, {
      icon: 'preferences',
      hint: _message.default.format('dxDiagram-uiSettings'),
      text: _message.default.format('dxDiagram-uiSettings'),
      items: [allCommands['units'], allCommands['separator'], allCommands['showGrid'], allCommands['snapToGrid'], allCommands['gridSize'], allCommands['separator'], allCommands['simpleView'], allCommands['toolbox']]
    }]);
  },
  getPropertiesToolbarCommands: function (commands, excludeCommands) {
    const allCommands = this.getAllCommands();
    const propertiesCommands = commands ? this._getPreparedCommands(allCommands, commands) : this._getDefaultPropertiesToolbarCommands(allCommands);
    return this._prepareToolbarCommands(propertiesCommands, excludeCommands);
  },
  _getDefaultPropertiesToolbarCommands: function (allCommands) {
    return this._defaultPropertiesToolbarCommands || (this._defaultPropertiesToolbarCommands = [allCommands['propertiesPanel']]);
  },
  _getDefaultPropertyPanelCommandGroups: function () {
    return this._defaultPropertyPanelCommandGroups || (this._defaultPropertyPanelCommandGroups = [{
      title: _message.default.format('dxDiagram-uiStyle'),
      groups: [{
        title: _message.default.format('dxDiagram-uiText'),
        commands: ['fontName', 'fontSize', 'bold', 'italic', 'underline', 'textAlignLeft', 'textAlignCenter', 'textAlignRight', 'fontColor']
      }, {
        title: _message.default.format('dxDiagram-uiObject'),
        commands: ['lineStyle', 'lineWidth', 'lineColor', 'fillColor']
      }, {
        title: _message.default.format('dxDiagram-uiConnector'),
        commands: ['connectorLineType', 'connectorLineStart', 'connectorLineEnd']
      }]
    }, {
      title: _message.default.format('dxDiagram-uiLayout'),
      groups: [{
        title: _message.default.format('dxDiagram-uiLayoutLayered'),
        commands: ['layoutLayeredTopToBottom', 'layoutLayeredBottomToTop', 'layoutLayeredLeftToRight', 'layoutLayeredRightToLeft']
      }, {
        title: _message.default.format('dxDiagram-uiLayoutTree'),
        commands: ['layoutTreeTopToBottom', 'layoutTreeBottomToTop', 'layoutTreeLeftToRight', 'layoutTreeRightToLeft']
      }]
    }, {
      title: _message.default.format('dxDiagram-uiDiagram'),
      groups: [{
        title: _message.default.format('dxDiagram-uiPage'),
        commands: ['pageSize', 'pageOrientation', 'pageColor']
      }]
    }]);
  },
  _preparePropertyPanelGroups: function (groups) {
    const allCommands = this.getAllCommands();
    const result = [];
    groups.forEach(g => {
      let commands = g.commands;
      if (commands) {
        commands = this._getPreparedCommands(allCommands, commands);
        commands = this._prepareToolbarCommands(commands);
      }
      let subGroups;
      if (g.groups) {
        subGroups = [];
        g.groups.forEach(sg => {
          let subCommands = sg.commands;
          if (subCommands) {
            subCommands = this._getPreparedCommands(allCommands, subCommands);
            subCommands = this._prepareToolbarCommands(subCommands);
          }
          subGroups.push({
            title: sg.title,
            commands: subCommands
          });
        });
      }
      result.push({
        title: g.title,
        commands: commands,
        groups: subGroups
      });
    });
    return result;
  },
  getPropertyPanelCommandTabs: function (commandGroups) {
    commandGroups = commandGroups || this._getDefaultPropertyPanelCommandGroups();
    return this._preparePropertyPanelGroups(commandGroups);
  },
  getContextMenuCommands: function (commands) {
    const allCommands = this.getAllCommands();
    const contextMenuCommands = commands ? this._getPreparedCommands(allCommands, commands) : this._getDefaultContextMenuCommands(allCommands);
    return this._prepareContextMenuCommands(contextMenuCommands);
  },
  _getDefaultContextMenuCommands: function (allCommands) {
    return this._defaultContextMenuCommands || (this._defaultContextMenuCommands = [allCommands['cut'], allCommands['copy'], allCommands['paste'], allCommands['delete'], allCommands['separator'], allCommands['selectAll'], allCommands['separator'], allCommands['bringToFront'], allCommands['sendToBack'], allCommands['separator'], allCommands['lock'], allCommands['unlock'], allCommands['separator'], allCommands['insertShapeImage'], allCommands['editShapeImage'], allCommands['deleteShapeImage']]);
  },
  _getPreparedCommands(allCommands, commands) {
    return commands.map(c => {
      if (c.widget && c.widget === SEPARATOR) {
        const command = {
          command: c,
          location: c.location
        };
        return command;
      } else if (allCommands[c]) {
        return allCommands[c];
      } else if (c.text || c.icon || c.name) {
        const internalCommand = c.name && allCommands[c.name];
        const command = {
          command: internalCommand && internalCommand.command,
          name: c.name,
          location: c.location,
          text: c.text || internalCommand && internalCommand.text,
          hint: c.text || internalCommand && internalCommand.hint,
          icon: c.icon || internalCommand && internalCommand.icon,
          menuIcon: c.icon || internalCommand && internalCommand.menuIcon,
          widget: internalCommand && internalCommand.widget,
          cssClass: internalCommand && internalCommand.cssClass,
          getParameter: internalCommand && internalCommand.getParameter,
          getCommandValue: internalCommand && internalCommand.getCommandValue,
          getEditorValue: internalCommand && internalCommand.getEditorValue,
          getEditorDisplayValue: internalCommand && internalCommand.getEditorDisplayValue,
          iconChecked: internalCommand && internalCommand.iconChecked,
          iconUnchecked: internalCommand && internalCommand.iconUnchecked
        };
        if (Array.isArray(c.items)) {
          command.items = this._getPreparedCommands(allCommands, c.items);
        } else {
          command.items = internalCommand && internalCommand.items;
        }
        return command;
      }
    }).filter(c => c);
  },
  _prepareContextMenuCommands(commands, excludeCommands, rootCommand) {
    let beginGroup = false;
    return commands.map(c => {
      if (!this._isValidCommand(c, excludeCommands)) return;
      if (c.widget && c.widget === SEPARATOR) {
        beginGroup = true;
      } else {
        const command = this._cloneCommand(c, excludeCommands);
        command.icon = command.menuIcon;
        command.beginGroup = beginGroup;
        command.rootCommand = !command.command ? rootCommand && rootCommand.command : undefined;
        beginGroup = false;
        return command;
      }
    }).filter(c => c);
  },
  _prepareToolbarCommands(commands, excludeCommands) {
    return commands.map(c => {
      if (this._isValidCommand(c, excludeCommands)) {
        return this._cloneCommand(c, excludeCommands);
      }
    }).filter(c => c).filter((c, index, arr) => {
      if (c.widget === SEPARATOR && index === arr.length - 1) {
        return false;
      }
      return c;
    });
  },
  _cloneCommand(c, excludeCommands) {
    const command = (0, _extend.extend)({}, c);
    if (Array.isArray(c.items)) {
      command.items = this._prepareContextMenuCommands(c.items, excludeCommands, command);
    }
    return command;
  },
  _isValidCommand(c, excludeCommands) {
    excludeCommands = excludeCommands || [];
    return excludeCommands.indexOf(c.command) === -1;
  },
  _exportTo(widget, dataURI, format, mimeString) {
    const window = (0, _window.getWindow)();
    if (window && window.atob && (0, _type.isFunction)(window.Blob)) {
      const blob = this._getBlobByDataURI(window, dataURI, mimeString);
      const options = widget.option('export');
      _file_saver.fileSaver.saveAs(options.fileName || 'foo', format, blob);
    }
  },
  _getBlobByDataURI(window, dataURI, mimeString) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new window.Blob([ia.buffer], {
      type: mimeString
    });
  }
};
var _default = exports.default = DiagramCommandsManager;
module.exports = exports.default;
module.exports.default = exports.default;