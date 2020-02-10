import { getDiagram } from './diagram.importer';
import { extend } from '../../core/utils/extend';
import { fileSaver } from '../../exporter/file_saver';
import { isFunction } from '../../core/utils/type';
import { getWindow } from '../../core/utils/window';
import messageLocalization from '../../localization/message';

const SEPARATOR = { widget: 'separator' };
const CSS_CLASSES = {
    SMALL_SELECT: 'dx-diagram-select-sm',
    BUTTON_SELECT: 'dx-diagram-select-b',
    BUTTON_COLOR: 'dx-diagram-color-b',
};

const DiagramCommandsManager = {
    getAllCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this.allCommands ||
            (this.allCommands = {
                separator: SEPARATOR,

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
                },
                redo: {
                    command: DiagramCommand.Redo,
                    hint: messageLocalization.format('dxDiagram-commandRedo'),
                    text: messageLocalization.format('dxDiagram-commandRedo'),
                    icon: 'redo',
                },
                cut: {
                    command: DiagramCommand.Cut,
                    hint: messageLocalization.format('dxDiagram-commandCut'),
                    text: messageLocalization.format('dxDiagram-commandCut'),
                    icon: 'cut',
                },
                copy: {
                    command: DiagramCommand.Copy,
                    hint: messageLocalization.format('dxDiagram-commandCopy'),
                    text: messageLocalization.format('dxDiagram-commandCopy'),
                    icon: 'copy'
                },
                paste: {
                    command: DiagramCommand.PasteInPosition,
                    hint: messageLocalization.format('dxDiagram-commandPaste'),
                    text: messageLocalization.format('dxDiagram-commandPaste'),
                    icon: 'paste',
                    getParameter: (diagramContextMenu) => {
                        return diagramContextMenu.clickPosition;
                    }
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
                    icon: 'remove'
                },
                fontName: {
                    command: DiagramCommand.FontName,
                    hint: messageLocalization.format('dxDiagram-commandFontName'),
                    widget: 'dxSelectBox',
                    items: ['Arial', 'Arial Black', 'Helvetica', 'Times New Roman', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Comic Sans MS', 'Trebuchet MS']
                },
                fontSize: {
                    command: DiagramCommand.FontSize,
                    hint: messageLocalization.format('dxDiagram-commandFontSize'),
                    widget: 'dxSelectBox',
                    items: ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '22pt', '24pt', '26pt', '28pt', '36pt', '48pt', '72pt'],
                    cssClass: CSS_CLASSES.SMALL_SELECT
                },
                bold: {
                    command: DiagramCommand.Bold,
                    hint: messageLocalization.format('dxDiagram-commandBold'),
                    text: messageLocalization.format('dxDiagram-commandBold'),
                    icon: 'bold'
                },
                italic: {
                    command: DiagramCommand.Italic,
                    hint: messageLocalization.format('dxDiagram-commandItalic'),
                    text: messageLocalization.format('dxDiagram-commandItalic'),
                    icon: 'italic'
                },
                underline: {
                    command: DiagramCommand.Underline,
                    hint: messageLocalization.format('dxDiagram-commandUnderline'),
                    text: messageLocalization.format('dxDiagram-commandUnderline'),
                    icon: 'underline'
                },
                fontColor: {
                    command: DiagramCommand.FontColor,
                    text: messageLocalization.format('dxDiagram-commandTextColor'),
                    hint: messageLocalization.format('dxDiagram-commandTextColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-icon dx-icon-color',
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                lineColor: {
                    command: DiagramCommand.StrokeColor,
                    text: messageLocalization.format('dxDiagram-commandLineColor'),
                    hint: messageLocalization.format('dxDiagram-commandLineColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-icon dx-icon-background',
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                fillColor: {
                    command: DiagramCommand.FillColor,
                    text: messageLocalization.format('dxDiagram-commandFillColor'),
                    hint: messageLocalization.format('dxDiagram-commandFillColor'),
                    widget: 'dxColorBox',
                    icon: 'dx-diagram-i dx-diagram-i-button-fill',
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                textAlignLeft: {
                    command: DiagramCommand.TextLeftAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignLeft'),
                    text: messageLocalization.format('dxDiagram-commandAlignLeft'),
                    icon: 'alignleft',
                },
                textAlignCenter: {
                    command: DiagramCommand.TextCenterAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignCenter'),
                    text: messageLocalization.format('dxDiagram-commandAlignCenter'),
                    icon: 'aligncenter'
                },
                textAlignRight: {
                    command: DiagramCommand.TextRightAlign,
                    hint: messageLocalization.format('dxDiagram-commandAlignRight'),
                    text: messageLocalization.format('dxDiagram-commandAlignRight'),
                    icon: 'alignright'
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
                    items: [
                        {
                            value: 0,
                            icon: 'dx-diagram-i-connector-straight dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineStraight')
                        },
                        {
                            value: 1,
                            icon: 'dx-diagram-i-connector-orthogonal dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineOrthogonal')
                        }
                    ],
                    displayExpr: 'name',
                    valueExpr: 'value',
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineStart: {
                    command: DiagramCommand.ConnectorStartLineEnding,
                    widget: 'dxSelectBox',
                    items: [
                        {
                            value: 0,
                            icon: 'dx-diagram-i-connector-begin-none dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineNone')
                        },
                        {
                            value: 1,
                            icon: 'dx-diagram-i-connector-begin-arrow dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        }
                    ],
                    displayExpr: 'name',
                    valueExpr: 'value',
                    hint: messageLocalization.format('dxDiagram-commandConnectorLineStart'),
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineEnd: {
                    command: DiagramCommand.ConnectorEndLineEnding,
                    widget: 'dxSelectBox',
                    items: [
                        {
                            value: 0,
                            icon: 'dx-diagram-i-connector-begin-none dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineNone')
                        },
                        {
                            value: 1,
                            icon: 'dx-diagram-i-connector-begin-arrow dx-diagram-i',
                            hint: messageLocalization.format('dxDiagram-commandConnectorLineArrow')
                        }
                    ],
                    displayExpr: 'name',
                    valueExpr: 'value',
                    hint: messageLocalization.format('dxDiagram-commandConnectorLineEnd'),
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                autoLayout: {
                    widget: 'dxButton',
                    text: messageLocalization.format('dxDiagram-commandAutoLayout'),
                    showText: 'always',
                    items: [
                        {
                            text: messageLocalization.format('dxDiagram-commandAutoLayoutTree'),
                            items: [
                                {
                                    command: DiagramCommand.AutoLayoutTreeVertical,
                                    text: messageLocalization.format('dxDiagram-commandAutoLayoutVertical')
                                },
                                {
                                    command: DiagramCommand.AutoLayoutTreeHorizontal,
                                    text: messageLocalization.format('dxDiagram-commandAutoLayoutHorizontal')
                                }
                            ]
                        },
                        {
                            text: messageLocalization.format('dxDiagram-commandAutoLayoutLayered'),
                            items: [
                                {
                                    command: DiagramCommand.AutoLayoutLayeredVertical,
                                    text: messageLocalization.format('dxDiagram-commandAutoLayoutVertical')
                                },
                                {
                                    command: DiagramCommand.AutoLayoutLayeredHorizontal,
                                    text: messageLocalization.format('dxDiagram-commandAutoLayoutHorizontal')
                                }
                            ]
                        }
                    ]
                },
                fullScreen: {
                    command: DiagramCommand.Fullscreen,
                    hint: messageLocalization.format('dxDiagram-commandFullscreen'),
                    text: messageLocalization.format('dxDiagram-commandFullscreen'),
                    icon: 'dx-diagram-i dx-diagram-i-button-fullscreen',
                    cssClass: CSS_CLASSES.BUTTON_COLOR
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
                    getValue: (v) => JSON.parse(v),
                    setValue: (v) => JSON.stringify(v)
                },
                pageOrientation: {
                    command: DiagramCommand.PageLandscape,
                    hint: messageLocalization.format('dxDiagram-commandPageOrientation'),
                    text: messageLocalization.format('dxDiagram-commandPageOrientation'),
                    widget: 'dxSelectBox',
                    items: [
                        { value: true, title: messageLocalization.format('dxDiagram-commandPageOrientationLandscape') },
                        { value: false, title: messageLocalization.format('dxDiagram-commandPageOrientationPortrait') }
                    ]
                },
                pageColor: {
                    command: DiagramCommand.PageColor,
                    hint: messageLocalization.format('dxDiagram-commandPageColor'),
                    text: messageLocalization.format('dxDiagram-commandPageColor'),
                    widget: 'dxColorBox',
                },
                zoomLevel: {
                    command: DiagramCommand.ZoomLevel,
                    hint: messageLocalization.format('dxDiagram-commandZoomLevel'),
                    text: messageLocalization.format('dxDiagram-commandZoomLevel'),
                    widget: 'dxSelectBox'
                },
                autoZoom: {
                    command: DiagramCommand.ToggleAutoZoom,
                    hint: messageLocalization.format('dxDiagram-commandAutoZoom'),
                    text: messageLocalization.format('dxDiagram-commandAutoZoom'),
                    widget: 'dxCheckBox'
                }
            });
    },
    getMainToolbarCommands: function(commands) {
        const allCommands = this.getAllCommands();
        const mainToolbarCommands = commands ? this._getCustomCommands(allCommands, commands) :
            this._getDefaultMainToolbarCommands(allCommands);
        return this._prepareToolbarCommands(mainToolbarCommands);
    },
    _getDefaultMainToolbarCommands: function(allCommands) {
        return [
            allCommands['undo'],
            allCommands['redo'],
            allCommands['separator'],
            allCommands['fontName'],
            allCommands['fontSize'],
            allCommands['separator'],
            allCommands['bold'],
            allCommands['italic'],
            allCommands['underline'],
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
            allCommands['autoLayout'],
        ];
    },
    getHistoryToolbarCommands: function(commands) {
        const allCommands = this.getAllCommands();
        const historyToolbarCommands = commands ? this._getCustomCommands(allCommands, commands) :
            this._getDefaultHistoryToolbarCommands(allCommands);
        return this._prepareToolbarCommands(historyToolbarCommands);
    },
    _getDefaultHistoryToolbarCommands: function(allCommands) {
        return [
            allCommands['undo'],
            allCommands['separator'],
            allCommands['redo']
        ];
    },
    getViewToolbarCommands: function(commands) {
        const allCommands = this.getAllCommands();
        const viewToolbarCommands = commands ? this._getCustomCommands(allCommands, commands) :
            this._getDefaultViewToolbarCommands(allCommands);
        return this._prepareToolbarCommands(viewToolbarCommands);
    },
    _getDefaultViewToolbarCommands: function(allCommands) {
        return [
            allCommands['zoomLevel'],
            allCommands['separator'],
            allCommands['fullScreen'],
            allCommands['separator'],
            {
                widget: 'dxButton',
                icon: 'export',
                text: messageLocalization.format('dxDiagram-commandExport'),
                hint: messageLocalization.format('dxDiagram-commandExport'),
                items: [
                    allCommands['exportSvg'],
                    allCommands['exportPng'],
                    allCommands['exportJpg']
                ]
            },
            {
                icon: 'preferences',
                hint: messageLocalization.format('dxDiagram-commandProperties'),
                text: messageLocalization.format('dxDiagram-commandProperties'),
                items: [
                    allCommands['units'],
                    allCommands['separator'],
                    allCommands['showGrid'],
                    allCommands['snapToGrid'],
                    allCommands['gridSize'],
                    allCommands['separator'],
                    allCommands['simpleView']
                ]
            }
        ];
    },

    getDefaultPropertyPanelCommandGroups: function() {
        return [
            { commands: ['pageSize', 'pageOrientation', 'pageColor'] }
        ];
    },
    _getPropertyPanelCommandsByGroups: function(groups) {
        const allCommands = this.getAllCommands();
        const result = [];
        groups.forEach(function(g, gi) {
            g.commands.forEach(function(cn, ci) {
                result.push(extend({
                    beginGroup: gi > 0 && ci === 0
                }, allCommands[cn]));
            });
        });
        return result;
    },
    getPropertyPanelCommands: function(commandGroups) {
        commandGroups = commandGroups || this.getDefaultPropertyPanelCommandGroups();
        return this._getPropertyPanelCommandsByGroups(commandGroups);
    },

    getContextMenuCommands: function(commands) {
        const allCommands = this.getAllCommands();
        const contextMenuCommands = commands ? this._getCustomCommands(allCommands, commands) :
            this._getDefaultContextMenuCommands(allCommands);
        return this._prepareContextMenuCommands(contextMenuCommands);
    },
    _getDefaultContextMenuCommands: function(allCommands) {
        return [
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
        ];
    },

    _getCustomCommands(allCommands, customCommands) {
        return customCommands.map(c => {
            if(allCommands[c]) {
                return allCommands[c];
            } else if(c.text || c.icon) {
                const command = {
                    text: c.text,
                    icon: c.icon,
                    onExecuted: c.onClick
                };
                if(Array.isArray(c.items)) {
                    command.items = this._getCustomCommands(allCommands, c.items);
                }
                return command;
            }
        }).filter(c => c);
    },

    _prepareContextMenuCommands(commands) {
        const result = [];
        let beginGroup = false;
        commands.forEach(command => {
            if(command === SEPARATOR) {
                beginGroup = true;
            } else {
                if(typeof command === 'object') {
                    if(Array.isArray(command.items)) {
                        command.items = this._prepareContextMenuCommands(command.items);
                    }
                    result.push(extend(command, {
                        beginGroup: beginGroup
                    }));
                } else {
                    result.push(command);
                }
                beginGroup = false;
            }
        });
        return result;
    },
    _prepareToolbarCommands(commands) {
        const result = [];
        commands.forEach(command => {
            if(Array.isArray(command.items)) {
                command.items = this._prepareContextMenuCommands(command.items);
            }
            result.push(command);
        });
        return result;
    },

    _exportTo(widget, dataURI, format, mimeString) {
        const window = getWindow();
        if(window && window.atob && isFunction(window.Blob)) {
            const blob = this._getBlobByDataURI(window, dataURI, mimeString);
            const options = widget.option('export');
            fileSaver.saveAs(options.fileName || 'foo', format, blob, options.proxyURL);
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

module.exports = DiagramCommandsManager;
