import { getDiagram } from './diagram.importer';
import { fileSaver } from '../../exporter/file_saver';
import { isFunction } from '../../core/utils/type';
import { getWindow } from '../../core/utils/window';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../common/core/localization/message';

const SEPARATOR = 'separator';
const SEPARATOR_COMMAND = { widget: SEPARATOR };
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

    getAllCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this._allCommands ||
            (this._allCommands = {
                separator: SEPARATOR_COMMAND,

                exportSvg: {
                    command: DiagramCommand.ExportSvg, // eslint-disable-line spellcheck/spell-checker
                    text: messageLocalization.format('dxDiagram-commandExportToSvg'),
                    getParameter: (widget) => {
                        return (dataURI) => this._exportTo(widget, dataURI, 'SVG', 'image/svg+xml');
                    }
                },
                exportPng: {
                    command: DiagramCommand.ExportPng, // eslint-disable-line spellcheck/spell-checker
                    text: messageLocalization.format('dxDiagram-commandExportToPng'),
                    getParameter: (widget) => {
                        return (dataURI) => this._exportTo(widget, dataURI, 'PNG', 'image/png');
                    }
                },
                exportJpg: {
                    command: DiagramCommand.ExportJpg, // eslint-disable-line spellcheck/spell-checker
                    text: messageLocalization.format('dxDiagram-commandExportToJpg'),
                    getParameter: (widget) => {
                        return (dataURI) => this._exportTo(widget, dataURI, 'JPEG', 'image/jpeg');
                    }
                },
                undo: {
                    command: DiagramCommand.Undo,
                    hint: messageLocalization.format('dxDiagram-commandUndo'),
                    text: messageLocalization.format('dxDiagram-commandUndo'),
                    icon: 'undo',
                    menuIcon: 'undo'
                },
                redo: {
                    command: DiagramCommand.Redo,
                    hint: messageLocalization.format('dxDiagram-commandRedo'),
                    text: messageLocalization.format('dxDiagram-commandRedo'),
                    icon: 'redo',
                    menuIcon: 'redo'
                },
                cut: {
                    command: DiagramCommand.Cut,
                    hint: messageLocalization.format('dxDiagram-commandCut'),
                    text: messageLocalization.format('dxDiagram-commandCut'),
                    icon: 'cut',
                    menuIcon: 'cut'
                },
                copy: {
                    command: DiagramCommand.Copy,
                    hint: messageLocalization.format('dxDiagram-commandCopy'),
                    text: messageLocalization.format('dxDiagram-commandCopy'),
                    icon: 'copy',
                    menuIcon: 'copy'
                },
                paste: {
                    command: DiagramCommand.PasteInPosition,
                    hint: messageLocalization.format('dxDiagram-commandPaste'),
                    text: messageLocalization.format('dxDiagram-commandPaste'),
                    icon: 'paste',
                    menuIcon: 'paste'
                },
                selectAll: {
                    command: DiagramCommand.SelectAll,
                    hint: messageLocalization.format('dxDiagram-commandSelectAll'),
                    text: messageLocalization.format('dxDiagram-commandSelectAll'),
                    icon: 'dx-diagram-i-button-select-all dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-select-all dx-diagram-i'
                },
                delete: {
                    command: DiagramCommand.Delete,
                    hint: messageLocalization.format('dxDiagram-commandDelete'),
                    text: messageLocalization.format('dxDiagram-commandDelete'),
                    icon: 'remove',
                    menuIcon: 'remove'
                },
                fontName: {
                    command: DiagramCommand.FontName,
                    hint: messageLocalization.format('dxDiagram-commandFontName'),
                    text: messageLocalization.format('dxDiagram-commandFontName'),
                    widget: 'dxSelectBox',
                    items: [
                        'Arial',
                        'Arial Black',
                        'Helvetica',
                        'Times New Roman',
                        'Courier New',
                        'Courier',
                        'Verdana',
                        'Georgia',
                        'Comic Sans MS',
                        'Trebuchet MS'
                    ].map(item => {
                        return { text: item, value: item };
                    }),
                    cssClass: CSS_CLASSES.MEDIUM_EDITOR_ITEM
                },
                fontSize: {
                    command: DiagramCommand.FontSize,
                    hint: messageLocalization.format('dxDiagram-commandFontSize'),
                    text: messageLocalization.format('dxDiagram-commandFontSize'),
                    widget: 'dxSelectBox',
                    items: [
                        8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
                    ].map(item => {
                        return { text: item + 'pt', value: item + 'pt' };
                    }),
                    cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
                },
                bold: {
                    command: DiagramCommand.Bold,
                    hint: messageLocalization.format('dxDiagram-commandBold'),
                    text: messageLocalization.format('dxDiagram-commandBold'),
                    icon: 'bold',
                    menuIcon: 'bold',
                },
                italic: {
                    command: DiagramCommand.Italic,
                    hint: messageLocalization.format('dxDiagram-commandItalic'),
                    text: messageLocalization.format('dxDiagram-commandItalic'),
                    icon: 'italic',
                    menuIcon: 'italic'
                },
                underline: {
                    command: DiagramCommand.Underline,
                    hint: messageLocalization.format('dxDiagram-commandUnderline'),
                    text: messageLocalization.format('dxDiagram-commandUnderline'),
                    icon: 'underline',
                    menuIcon: 'underline'
                },
                fontColor: {
                    command: DiagramCommand.FontColor,
                    text: messageLocalization.format('dxDiagram-commandTextColor'),
                    hint: messageLocalization.format('dxDiagram-commandTextColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-icon dx-icon-color',
                    menuIcon: 'dx-icon dx-icon-color',
                    cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
                },
                lineColor: {
                    command: DiagramCommand.StrokeColor,
                    text: messageLocalization.format('dxDiagram-commandLineColor'),
                    hint: messageLocalization.format('dxDiagram-commandLineColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-icon dx-icon-background',
                    menuIcon: 'dx-icon dx-icon-background',
                    cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
                },
                lineWidth: {
                    command: DiagramCommand.StrokeWidth,
                    text: messageLocalization.format('dxDiagram-commandLineWidth'),
                    hint: messageLocalization.format('dxDiagram-commandLineWidth'),
                    widget: 'dxSelectBox',
                    items: [
                        1, 2, 3, 4, 5, 6, 7, 8
                    ].map(item => {
                        return { text: item + 'px', value: item.toString() };
                    }),
                    cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
                },
                lineStyle: {
                    command: DiagramCommand.StrokeStyle,
                    text: messageLocalization.format('dxDiagram-commandLineStyle'),
                    hint: messageLocalization.format('dxDiagram-commandLineStyle'),
                    widget: 'dxSelectBox',
                    items: [
                        {
                            value: '',
                            menuIcon: 'dx-diagram-i-line-solid dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandLineStyleSolid')
                        },
                        {
                            value: '2,2',
                            menuIcon: 'dx-diagram-i-line-dotted dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandLineStyleDotted')
                        },
                        {
                            value: '6,2',
                            menuIcon: 'dx-diagram-i-line-dashed dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandLineStyleDashed')
                        }
                    ],
                    cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
                },
                fillColor: {
                    command: DiagramCommand.FillColor,
                    text: messageLocalization.format('dxDiagram-commandFillColor'),
                    hint: messageLocalization.format('dxDiagram-commandFillColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-diagram-i dx-diagram-i-button-fill',
                    menuIcon: 'dx-diagram-i dx-diagram-i-menu-fill',
                    cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
                },
                textAlignLeft: {
                    command: DiagramCommand.TextLeftAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignLeft'),
                    text: messageLocalization.format('dxDiagram-commandAlignLeft'),
                    icon: 'alignleft',
                    menuIcon: 'alignleft'
                },
                textAlignCenter: {
                    command: DiagramCommand.TextCenterAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignCenter'),
                    text: messageLocalization.format('dxDiagram-commandAlignCenter'),
                    icon: 'aligncenter',
                    menuIcon: 'aligncenter'
                },
                textAlignRight: {
                    command: DiagramCommand.TextRightAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignRight'),
                    text: messageLocalization.format('dxDiagram-commandAlignRight'),
                    icon: 'alignright',
                    menuIcon: 'alignright'
                },
                lock: {
                    command: DiagramCommand.Lock,
                    hint: messageLocalization.format('dxDiagram-commandLock'),
                    text: messageLocalization.format('dxDiagram-commandLock'),
                    icon: 'dx-diagram-i-button-lock dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-lock dx-diagram-i'
                },
                unlock: {
                    command: DiagramCommand.Unlock,
                    hint: messageLocalization.format('dxDiagram-commandUnlock'),
                    text: messageLocalization.format('dxDiagram-commandUnlock'),
                    icon: 'dx-diagram-i-button-unlock dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-unlock dx-diagram-i'
                },
                bringToFront: {
                    command: DiagramCommand.BringToFront,
                    hint: messageLocalization.format('dxDiagram-commandBringToFront'),
                    text: messageLocalization.format('dxDiagram-commandBringToFront'),
                    icon: 'dx-diagram-i-button-bring-to-front dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-bring-to-front dx-diagram-i'
                },
                sendToBack: {
                    command: DiagramCommand.SendToBack,
                    hint: messageLocalization.format('dxDiagram-commandSendToBack'),
                    text: messageLocalization.format('dxDiagram-commandSendToBack'),
                    icon: 'dx-diagram-i-button-send-to-back dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-send-to-back dx-diagram-i'
                },
                insertShapeImage: {
                    command: DiagramCommand.InsertShapeImage,
                    text: messageLocalization.format('dxDiagram-commandInsertShapeImage'),
                    icon: 'dx-diagram-i-button-image-insert dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-image-insert dx-diagram-i'
                },
                editShapeImage: {
                    command: DiagramCommand.EditShapeImage,
                    text: messageLocalization.format('dxDiagram-commandEditShapeImage'),
                    icon: 'dx-diagram-i-button-image-edit dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-image-edit dx-diagram-i'
                },
                deleteShapeImage: {
                    command: DiagramCommand.DeleteShapeImage,
                    text: messageLocalization.format('dxDiagram-commandDeleteShapeImage'),
                    icon: 'dx-diagram-i-button-image-delete dx-diagram-i',
                    menuIcon: 'dx-diagram-i-menu-image-delete dx-diagram-i'
                },
                connectorLineType: {
                    command: DiagramCommand.ConnectorLineOption,
                    widget: 'dxSelectBox',
                    hint: messageLocalization.format('dxDiagram-commandConnectorLineType'),
                    text: messageLocalization.format('dxDiagram-commandConnectorLineType'),
                    items: [
                        {
                            value: 0,
                            menuIcon: 'dx-diagram-i-connector-straight dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineStraight'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineStraight')
                        },
                        {
                            value: 1,
                            menuIcon: 'dx-diagram-i-connector-orthogonal dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineOrthogonal'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineOrthogonal')
                        }
                    ],
                    cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
                },
                connectorLineStart: {
                    command: DiagramCommand.ConnectorStartLineEnding,
                    widget: 'dxSelectBox',
                    items: [
                        {
                            value: 0,
                            menuIcon: 'dx-diagram-i-connector-begin-none dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineNone'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineNone')
                        },
                        {
                            value: 1,
                            menuIcon: 'dx-diagram-i-connector-begin-arrow dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        },
                        {
                            value: 2,
                            menuIcon: 'dx-diagram-i-connector-begin-outlined-triangle dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        },
                        {
                            value: 3,
                            menuIcon: 'dx-diagram-i-connector-begin-filled-triangle dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        }
                    ],
                    hint: messageLocalization.format('dxDiagram-commandConnectorLineStart'),
                    text: messageLocalization.format('dxDiagram-commandConnectorLineStart'),
                    cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
                },
                connectorLineEnd: {
                    command: DiagramCommand.ConnectorEndLineEnding,
                    widget: 'dxSelectBox',
                    items: [
                        {
                            value: 0,
                            menuIcon: 'dx-diagram-i-connector-end-none dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineNone'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineNone')
                        },
                        {
                            value: 1,
                            menuIcon: 'dx-diagram-i-connector-end-arrow dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        },
                        {
                            value: 2,
                            menuIcon: 'dx-diagram-i-connector-end-outlined-triangle dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        },
                        {
                            value: 3,
                            menuIcon: 'dx-diagram-i-connector-end-filled-triangle dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow'),
                            text: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        }
                    ],
                    hint: messageLocalization.format('dxDiagram-commandConnectorLineEnd'),
                    text: messageLocalization.format('dxDiagram-commandConnectorLineEnd'),
                    cssClass: CSS_CLASSES.IMAGE_DROPDOWN_ITEM
                },
                layoutTreeTopToBottom: {
                    command: DiagramCommand.AutoLayoutTreeVertical,
                    text: messageLocalization.format('dxDiagram-commandLayoutTopToBottom'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutTopToBottom'),
                    icon: 'dx-diagram-i-button-layout-tree-tb dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutTreeBottomToTop: {
                    command: DiagramCommand.AutoLayoutTreeVerticalBottomToTop,
                    text: messageLocalization.format('dxDiagram-commandLayoutBottomToTop'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutBottomToTop'),
                    icon: 'dx-diagram-i-button-layout-tree-bt dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutTreeLeftToRight: {
                    command: DiagramCommand.AutoLayoutTreeHorizontal,
                    text: messageLocalization.format('dxDiagram-commandLayoutLeftToRight'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutLeftToRight'),
                    icon: 'dx-diagram-i-button-layout-tree-lr dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutTreeRightToLeft: {
                    command: DiagramCommand.AutoLayoutTreeHorizontalRightToLeft,
                    text: messageLocalization.format('dxDiagram-commandLayoutRightToLeft'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutRightToLeft'),
                    icon: 'dx-diagram-i-button-layout-tree-rl dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutLayeredTopToBottom: {
                    command: DiagramCommand.AutoLayoutLayeredVertical,
                    text: messageLocalization.format('dxDiagram-commandLayoutTopToBottom'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutTopToBottom'),
                    icon: 'dx-diagram-i-button-layout-layered-tb dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutLayeredBottomToTop: {
                    command: DiagramCommand.AutoLayoutLayeredVerticalBottomToTop,
                    text: messageLocalization.format('dxDiagram-commandLayoutBottomToTop'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutBottomToTop'),
                    icon: 'dx-diagram-i-button-layout-layered-bt dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutLayeredLeftToRight: {
                    command: DiagramCommand.AutoLayoutLayeredHorizontal,
                    text: messageLocalization.format('dxDiagram-commandLayoutLeftToRight'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutLeftToRight'),
                    icon: 'dx-diagram-i-button-layout-layered-lr dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                layoutLayeredRightToLeft: {
                    command: DiagramCommand.AutoLayoutLayeredHorizontalRightToLeft,
                    text: messageLocalization.format('dxDiagram-commandLayoutRightToLeft'),
                    hint: messageLocalization.format('dxDiagram-commandLayoutRightToLeft'),
                    icon: 'dx-diagram-i-button-layout-layered-rl dx-diagram-i',
                    cssClass: CSS_CLASSES.LARGE_ICON_ITEM
                },
                fullScreen: {
                    command: DiagramCommand.Fullscreen,
                    hint: messageLocalization.format('dxDiagram-commandFullscreen'),
                    text: messageLocalization.format('dxDiagram-commandFullscreen'),
                    icon: 'dx-diagram-i dx-diagram-i-button-fullscreen',
                    menuIcon: 'dx-diagram-i dx-diagram-i-menu-fullscreen',
                    cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
                },

                units: {
                    command: DiagramCommand.ViewUnits,
                    hint: messageLocalization.format('dxDiagram-commandUnits'),
                    text: messageLocalization.format('dxDiagram-commandUnits'),
                    widget: 'dxSelectBox'
                },
                simpleView: {
                    command: DiagramCommand.ToggleSimpleView,
                    hint: messageLocalization.format('dxDiagram-commandSimpleView'),
                    text: messageLocalization.format('dxDiagram-commandSimpleView'),
                    widget: 'dxCheckBox'
                },
                showGrid: {
                    command: DiagramCommand.ShowGrid,
                    hint: messageLocalization.format('dxDiagram-commandShowGrid'),
                    text: messageLocalization.format('dxDiagram-commandShowGrid'),
                    widget: 'dxCheckBox'
                },
                snapToGrid: {
                    command: DiagramCommand.SnapToGrid,
                    hint: messageLocalization.format('dxDiagram-commandSnapToGrid'),
                    text: messageLocalization.format('dxDiagram-commandSnapToGrid'),
                    widget: 'dxCheckBox'
                },
                gridSize: {
                    command: DiagramCommand.GridSize,
                    hint: messageLocalization.format('dxDiagram-commandGridSize'),
                    text: messageLocalization.format('dxDiagram-commandGridSize'),
                    widget: 'dxSelectBox'
                },

                pageSize: {
                    command: DiagramCommand.PageSize,
                    hint: messageLocalization.format('dxDiagram-commandPageSize'),
                    text: messageLocalization.format('dxDiagram-commandPageSize'),
                    widget: 'dxSelectBox',
                    cssClass: CSS_CLASSES.LARGE_EDITOR_ITEM,
                    getCommandValue: (v) => JSON.parse(v),
                    getEditorValue: (v) => JSON.stringify(v)
                },
                pageOrientation: {
                    command: DiagramCommand.PageLandscape,
                    hint: messageLocalization.format('dxDiagram-commandPageOrientation'),
                    text: messageLocalization.format('dxDiagram-commandPageOrientation'),
                    widget: 'dxSelectBox',
                    items: [
                        { value: true, text: messageLocalization.format('dxDiagram-commandPageOrientationLandscape') },
                        { value: false, text: messageLocalization.format('dxDiagram-commandPageOrientationPortrait') }
                    ],
                    cssClass: CSS_CLASSES.MEDIUM_EDITOR_ITEM
                },
                pageColor: {
                    command: DiagramCommand.PageColor,
                    hint: messageLocalization.format('dxDiagram-commandPageColor'),
                    text: messageLocalization.format('dxDiagram-commandPageColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-diagram-i dx-diagram-i-button-fill',
                    menuIcon: 'dx-diagram-i dx-diagram-i-menu-fill',
                    cssClass: CSS_CLASSES.COLOR_EDITOR_ITEM
                },
                zoomLevel: {
                    command: DiagramCommand.ZoomLevel,
                    hint: messageLocalization.format('dxDiagram-commandZoomLevel'),
                    text: messageLocalization.format('dxDiagram-commandZoomLevel'),
                    widget: 'dxTextBox',
                    items: [
                        SEPARATOR_COMMAND,
                        {
                            command: DiagramCommand.FitToScreen,
                            hint: messageLocalization.format('dxDiagram-commandFitToContent'),
                            text: messageLocalization.format('dxDiagram-commandFitToContent'),
                        },
                        {
                            command: DiagramCommand.FitToWidth,
                            hint: messageLocalization.format('dxDiagram-commandFitToWidth'),
                            text: messageLocalization.format('dxDiagram-commandFitToWidth'),
                        },
                        SEPARATOR_COMMAND,
                        {
                            command: DiagramCommand.AutoZoomToContent,
                            hint: messageLocalization.format('dxDiagram-commandAutoZoomByContent'),
                            text: messageLocalization.format('dxDiagram-commandAutoZoomByContent'),
                        },
                        {
                            command: DiagramCommand.AutoZoomToWidth,
                            hint: messageLocalization.format('dxDiagram-commandAutoZoomByWidth'),
                            text: messageLocalization.format('dxDiagram-commandAutoZoomByWidth'),
                        }
                    ],
                    getEditorDisplayValue: (v) => {
                        return Math.round(v * 100) + '%';
                    },
                    cssClass: CSS_CLASSES.SMALL_EDITOR_ITEM
                },
                // Custom commands
                toolbox: {
                    command: this.SHOW_TOOLBOX_COMMAND_NAME,
                    iconChecked: 'dx-diagram-i dx-diagram-i-button-toolbox-close',
                    iconUnchecked: 'dx-diagram-i dx-diagram-i-button-toolbox-open',
                    hint: messageLocalization.format('dxDiagram-uiShowToolbox'),
                    text: messageLocalization.format('dxDiagram-uiShowToolbox')
                },
                propertiesPanel: {
                    command: this.SHOW_PROPERTIES_PANEL_COMMAND_NAME,
                    iconChecked: 'close',
                    iconUnchecked: 'dx-diagram-i dx-diagram-i-button-properties-panel-open',
                    hint: messageLocalization.format('dxDiagram-uiProperties'),
                    text: messageLocalization.format('dxDiagram-uiProperties')
                }
            });
    },
    getMainToolbarCommands: function(commands, excludeCommands) {
        const allCommands = this.getAllCommands();
        const mainToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) :
            this._getDefaultMainToolbarCommands(allCommands);
        return this._prepareToolbarCommands(mainToolbarCommands, excludeCommands);
    },
    _getDefaultMainToolbarCommands: function(allCommands) {
        return this._defaultMainToolbarCommands ||
            (this._defaultMainToolbarCommands = [
                allCommands['undo'],
                allCommands['redo'],
                allCommands['separator'],
                allCommands['fontName'],
                allCommands['fontSize'],
                allCommands['bold'],
                allCommands['italic'],
                allCommands['underline'],
                allCommands['separator'],
                allCommands['lineWidth'],
                allCommands['lineStyle'],
                allCommands['separator'],
                allCommands['fontColor'],
                allCommands['lineColor'],
                allCommands['fillColor'],
                allCommands['separator'],
                allCommands['textAlignLeft'],
                allCommands['textAlignCenter'],
                allCommands['textAlignRight'],
                allCommands['separator'],
                allCommands['connectorLineType'],
                allCommands['connectorLineStart'],
                allCommands['connectorLineEnd'],
                allCommands['separator'],
                {
                    text: messageLocalization.format('dxDiagram-uiLayout'),
                    showText: 'always',
                    items: [
                        {
                            text: messageLocalization.format('dxDiagram-uiLayoutTree'),
                            items: [
                                allCommands['layoutTreeTopToBottom'],
                                allCommands['layoutTreeBottomToTop'],
                                allCommands['layoutTreeLeftToRight'],
                                allCommands['layoutTreeRightToLeft']
                            ]
                        },
                        {
                            text: messageLocalization.format('dxDiagram-uiLayoutLayered'),
                            items: [
                                allCommands['layoutLayeredTopToBottom'],
                                allCommands['layoutLayeredBottomToTop'],
                                allCommands['layoutLayeredLeftToRight'],
                                allCommands['layoutLayeredRightToLeft']
                            ]
                        }
                    ]
                }
            ]);
    },
    getHistoryToolbarCommands: function(commands, excludeCommands) {
        const allCommands = this.getAllCommands();
        const historyToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) :
            this._getDefaultHistoryToolbarCommands(allCommands);
        return this._prepareToolbarCommands(historyToolbarCommands, excludeCommands);
    },
    _getDefaultHistoryToolbarCommands: function(allCommands) {
        return this._defaultHistoryToolbarCommands ||
            (this._defaultHistoryToolbarCommands = [
                allCommands['undo'],
                allCommands['redo'],
                allCommands['separator'],
                allCommands['toolbox']
            ]);
    },
    getViewToolbarCommands: function(commands, excludeCommands) {
        const allCommands = this.getAllCommands();
        const viewToolbarCommands = commands ? this._getPreparedCommands(allCommands, commands) :
            this._getDefaultViewToolbarCommands(allCommands);
        return this._prepareToolbarCommands(viewToolbarCommands, excludeCommands);
    },
    _getDefaultViewToolbarCommands: function(allCommands) {
        return this._defaultViewToolbarCommands ||
            (this._defaultViewToolbarCommands = [
                allCommands['zoomLevel'],
                allCommands['separator'],
                allCommands['fullScreen'],
                allCommands['separator'],
                {
                    widget: 'dxButton',
                    icon: 'export',
                    text: messageLocalization.format('dxDiagram-uiExport'),
                    hint: messageLocalization.format('dxDiagram-uiExport'),
                    items: [
                        allCommands['exportSvg'],
                        allCommands['exportPng'],
                        allCommands['exportJpg']
                    ]
                },
                {
                    icon: 'preferences',
                    hint: messageLocalization.format('dxDiagram-uiSettings'),
                    text: messageLocalization.format('dxDiagram-uiSettings'),
                    items: [
                        allCommands['units'],
                        allCommands['separator'],
                        allCommands['showGrid'],
                        allCommands['snapToGrid'],
                        allCommands['gridSize'],
                        allCommands['separator'],
                        allCommands['simpleView'],
                        allCommands['toolbox']
                    ]
                }
            ]);
    },
    getPropertiesToolbarCommands: function(commands, excludeCommands) {
        const allCommands = this.getAllCommands();
        const propertiesCommands = commands ? this._getPreparedCommands(allCommands, commands) :
            this._getDefaultPropertiesToolbarCommands(allCommands);
        return this._prepareToolbarCommands(propertiesCommands, excludeCommands);
    },
    _getDefaultPropertiesToolbarCommands: function(allCommands) {
        return this._defaultPropertiesToolbarCommands ||
            (this._defaultPropertiesToolbarCommands = [
                allCommands['propertiesPanel']
            ]);
    },

    _getDefaultPropertyPanelCommandGroups: function() {
        return this._defaultPropertyPanelCommandGroups ||
            (this._defaultPropertyPanelCommandGroups = [
                {
                    title: messageLocalization.format('dxDiagram-uiStyle'),
                    groups: [
                        {
                            title: messageLocalization.format('dxDiagram-uiText'),
                            commands: ['fontName', 'fontSize', 'bold', 'italic', 'underline', 'textAlignLeft', 'textAlignCenter', 'textAlignRight', 'fontColor']
                        },
                        {
                            title: messageLocalization.format('dxDiagram-uiObject'),
                            commands: ['lineStyle', 'lineWidth', 'lineColor', 'fillColor']
                        },
                        {
                            title: messageLocalization.format('dxDiagram-uiConnector'),
                            commands: ['connectorLineType', 'connectorLineStart', 'connectorLineEnd']
                        }
                    ]
                },
                {
                    title: messageLocalization.format('dxDiagram-uiLayout'),
                    groups: [
                        {
                            title: messageLocalization.format('dxDiagram-uiLayoutLayered'),
                            commands: [ 'layoutLayeredTopToBottom', 'layoutLayeredBottomToTop', 'layoutLayeredLeftToRight', 'layoutLayeredRightToLeft']
                        },
                        {
                            title: messageLocalization.format('dxDiagram-uiLayoutTree'),
                            commands: [ 'layoutTreeTopToBottom', 'layoutTreeBottomToTop', 'layoutTreeLeftToRight', 'layoutTreeRightToLeft']
                        }
                    ]
                },
                {
                    title: messageLocalization.format('dxDiagram-uiDiagram'),
                    groups: [
                        {
                            title: messageLocalization.format('dxDiagram-uiPage'),
                            commands: ['pageSize', 'pageOrientation', 'pageColor']
                        }
                    ]
                }
            ]);
    },
    _preparePropertyPanelGroups: function(groups) {
        const allCommands = this.getAllCommands();
        const result = [];
        groups.forEach(g => {
            let commands = g.commands;
            if(commands) {
                commands = this._getPreparedCommands(allCommands, commands);
                commands = this._prepareToolbarCommands(commands);
            }

            let subGroups;
            if(g.groups) {
                subGroups = [];
                g.groups.forEach(sg => {
                    let subCommands = sg.commands;
                    if(subCommands) {
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
    getPropertyPanelCommandTabs: function(commandGroups) {
        commandGroups = commandGroups || this._getDefaultPropertyPanelCommandGroups();
        return this._preparePropertyPanelGroups(commandGroups);
    },

    getContextMenuCommands: function(commands) {
        const allCommands = this.getAllCommands();
        const contextMenuCommands = commands ? this._getPreparedCommands(allCommands, commands) :
            this._getDefaultContextMenuCommands(allCommands);
        return this._prepareContextMenuCommands(contextMenuCommands);
    },
    _getDefaultContextMenuCommands: function(allCommands) {
        return this._defaultContextMenuCommands ||
            (this._defaultContextMenuCommands = [
                allCommands['cut'],
                allCommands['copy'],
                allCommands['paste'],
                allCommands['delete'],
                allCommands['separator'],
                allCommands['selectAll'],
                allCommands['separator'],
                allCommands['bringToFront'],
                allCommands['sendToBack'],
                allCommands['separator'],
                allCommands['lock'],
                allCommands['unlock'],
                allCommands['separator'],
                allCommands['insertShapeImage'],
                allCommands['editShapeImage'],
                allCommands['deleteShapeImage']
            ]);
    },

    _getPreparedCommands(allCommands, commands) {
        return commands.map(c => {
            if(c.widget && c.widget === SEPARATOR) {
                const command = {
                    command: c,
                    location: c.location
                };
                return command;
            } else if(allCommands[c]) {
                return allCommands[c];
            } else if(c.text || c.icon || c.name) {
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
                if(Array.isArray(c.items)) {
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
            if(!this._isValidCommand(c, excludeCommands)) return;

            if(c.widget && c.widget === SEPARATOR) {
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
        return commands
            .map(c => {
                if(this._isValidCommand(c, excludeCommands)) {
                    return this._cloneCommand(c, excludeCommands);
                }
            })
            .filter(c => c)
            .filter((c, index, arr) => {
                if(c.widget === SEPARATOR && index === arr.length - 1) {
                    return false;
                }
                return c;
            });
    },
    _cloneCommand(c, excludeCommands) {
        const command = extend({}, c);
        if(Array.isArray(c.items)) {
            command.items = this._prepareContextMenuCommands(c.items, excludeCommands, command);
        }
        return command;
    },
    _isValidCommand(c, excludeCommands) {
        excludeCommands = excludeCommands || [];
        return excludeCommands.indexOf(c.command) === -1;
    },

    _exportTo(widget, dataURI, format, mimeString) {
        const window = getWindow();
        if(window && window.atob && isFunction(window.Blob)) {
            const blob = this._getBlobByDataURI(window, dataURI, mimeString);
            const options = widget.option('export');
            fileSaver.saveAs(options.fileName || 'foo', format, blob);
        }
    },
    _getBlobByDataURI(window, dataURI, mimeString) {
        const byteString = window.atob(dataURI.split(',')[1]);
        const ia = new Uint8Array(byteString.length);
        for(let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new window.Blob([ia.buffer], { type: mimeString });
    }
};

export default DiagramCommandsManager;
