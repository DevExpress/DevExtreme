import { getDiagram } from "./diagram_importer";
import { extend } from "../../core/utils/extend";
import { fileSaver } from "../../exporter/file_saver";
import { isFunction } from "../../core/utils/type";
import { getWindow } from "../../core/utils/window";
import messageLocalization from "../../localization/message";

const SEPARATOR = { widget: "separator" };
const CSS_CLASSES = {
    SMALL_SELECT: "dx-diagram-select-sm",
    BUTTON_SELECT: "dx-diagram-select-b",
    BUTTON_COLOR: "dx-diagram-color-b",
};

const DiagramCommands = {
    getAllToolbarCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this.toolbarCommands ||
            (this.toolbarCommands = {
                separator: SEPARATOR,

                export: {
                    widget: "dxButton",
                    icon: "export",
                    text: messageLocalization.format("dxDiagram-commandExport"),
                    hint: messageLocalization.format("dxDiagram-commandExport"),
                    items: [
                        {
                            command: DiagramCommand.ExportSvg, // eslint-disable-line spellcheck/spell-checker
                            text: messageLocalization.format("dxDiagram-commandExportToSvg"),
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "SVG", "image/svg+xml");
                            }
                        },
                        {
                            command: DiagramCommand.ExportPng, // eslint-disable-line spellcheck/spell-checker
                            text: messageLocalization.format("dxDiagram-commandExportToPng"),
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "PNG", "image/png");
                            }
                        },
                        {
                            command: DiagramCommand.ExportJpg, // eslint-disable-line spellcheck/spell-checker
                            text: messageLocalization.format("dxDiagram-commandExportToJpg"),
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "JPEG", "image/jpeg");
                            }
                        }
                    ]
                },
                undo: {
                    command: DiagramCommand.Undo,
                    hint: messageLocalization.format("dxDiagram-commandUndo"),
                    text: messageLocalization.format("dxDiagram-commandUndo"),
                    icon: "undo",
                },
                redo: {
                    command: DiagramCommand.Redo,
                    hint: messageLocalization.format("dxDiagram-commandRedo"),
                    text: messageLocalization.format("dxDiagram-commandRedo"),
                    icon: "redo",
                },
                cut: {
                    command: DiagramCommand.Cut,
                    hint: messageLocalization.format("dxDiagram-commandCut"),
                    text: messageLocalization.format("dxDiagram-commandCut"),
                    icon: "cut",
                },
                copy: {
                    command: DiagramCommand.Copy,
                    hint: messageLocalization.format("dxDiagram-commandCopy"),
                    text: messageLocalization.format("dxDiagram-commandCopy"),
                    icon: "copy"
                },
                paste: {
                    command: DiagramCommand.PasteInPosition,
                    hint: messageLocalization.format("dxDiagram-commandPaste"),
                    text: messageLocalization.format("dxDiagram-commandPaste"),
                    icon: "paste",
                    getParameter: (diagramContextMenu) => {
                        return diagramContextMenu.clickPosition;
                    }
                },
                selectAll: {
                    command: DiagramCommand.SelectAll,
                    hint: messageLocalization.format("dxDiagram-commandSelectAll"),
                    text: messageLocalization.format("dxDiagram-commandSelectAll"),
                    icon: "selectall"
                },
                delete: {
                    command: DiagramCommand.Delete,
                    hint: messageLocalization.format("dxDiagram-commandDelete"),
                    text: messageLocalization.format("dxDiagram-commandDelete"),
                    icon: "remove"
                },
                fontName: {
                    command: DiagramCommand.FontName,
                    hint: messageLocalization.format("dxDiagram-commandFontName"),
                    widget: "dxSelectBox",
                    items: ["Arial", "Arial Black", "Helvetica", "Times New Roman", "Courier New", "Courier", "Verdana", "Georgia", "Comic Sans MS", "Trebuchet MS"]
                },
                fontSize: {
                    command: DiagramCommand.FontSize,
                    hint: messageLocalization.format("dxDiagram-commandFontSize"),
                    widget: "dxSelectBox",
                    items: ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt", "26pt", "28pt", "36pt", "48pt", "72pt"],
                    cssClass: CSS_CLASSES.SMALL_SELECT
                },
                bold: {
                    command: DiagramCommand.Bold,
                    hint: messageLocalization.format("dxDiagram-commandBold"),
                    text: messageLocalization.format("dxDiagram-commandBold"),
                    icon: "bold"
                },
                italic: {
                    command: DiagramCommand.Italic,
                    hint: messageLocalization.format("dxDiagram-commandItalic"),
                    text: messageLocalization.format("dxDiagram-commandItalic"),
                    icon: "italic"
                },
                underline: {
                    command: DiagramCommand.Underline,
                    hint: messageLocalization.format("dxDiagram-commandUnderline"),
                    text: messageLocalization.format("dxDiagram-commandUnderline"),
                    icon: "underline"
                },
                fontColor: {
                    command: DiagramCommand.FontColor,
                    text: messageLocalization.format("dxDiagram-commandTextColor"),
                    hint: messageLocalization.format("dxDiagram-commandTextColor"),
                    widget: "dxColorBox",
                    icon: "dx-icon dx-icon-color",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                lineColor: {
                    command: DiagramCommand.StrokeColor,
                    text: messageLocalization.format("dxDiagram-commandLineColor"),
                    hint: messageLocalization.format("dxDiagram-commandLineColor"),
                    widget: "dxColorBox",
                    icon: "dx-icon dx-icon-background",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                fillColor: {
                    command: DiagramCommand.FillColor,
                    text: messageLocalization.format("dxDiagram-commandFillColor"),
                    hint: messageLocalization.format("dxDiagram-commandFillColor"),
                    widget: "dxColorBox",
                    icon: "dx-diagram-i dx-diagram-i-button-fill",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                textAlignLeft: {
                    command: DiagramCommand.TextLeftAlign,
                    hint: messageLocalization.format("dxDiagram-commandAlignLeft"),
                    text: messageLocalization.format("dxDiagram-commandAlignLeft"),
                    icon: "alignleft",
                },
                textAlignCenter: {
                    command: DiagramCommand.TextCenterAlign,
                    hint: messageLocalization.format("dxDiagram-commandAlignCenter"),
                    text: messageLocalization.format("dxDiagram-commandAlignCenter"),
                    icon: "aligncenter"
                },
                textAlignRight: {
                    command: DiagramCommand.TextRightAlign,
                    hint: messageLocalization.format("dxDiagram-commandAlignRight"),
                    text: messageLocalization.format("dxDiagram-commandAlignRight"),
                    icon: "alignright"
                },
                lock: {
                    command: DiagramCommand.Lock,
                    hint: messageLocalization.format("dxDiagram-commandLock"),
                    text: messageLocalization.format("dxDiagram-commandLock"),
                    icon: "dx-diagram-i-button-lock dx-diagram-i"
                },
                unlock: {
                    command: DiagramCommand.Unlock,
                    hint: messageLocalization.format("dxDiagram-commandUnlock"),
                    text: messageLocalization.format("dxDiagram-commandUnlock"),
                    icon: "dx-diagram-i-button-unlock dx-diagram-i"
                },
                bringToFront: {
                    command: DiagramCommand.BringToFront,
                    hint: messageLocalization.format("dxDiagram-commandBringToFront"),
                    text: messageLocalization.format("dxDiagram-commandBringToFront"),
                    icon: "dx-diagram-i-button-bring-to-front dx-diagram-i"
                },
                sendToBack: {
                    command: DiagramCommand.SendToBack,
                    hint: messageLocalization.format("dxDiagram-commandSendToBack"),
                    text: messageLocalization.format("dxDiagram-commandSendToBack"),
                    icon: "dx-diagram-i-button-send-to-back dx-diagram-i"
                },
                connectorLineType: {
                    command: DiagramCommand.ConnectorLineOption,
                    widget: "dxSelectBox",
                    hint: messageLocalization.format("dxDiagram-commandConnectorLineType"),
                    items: [
                        {
                            value: 0,
                            icon: "dx-diagram-i-connector-straight dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineStraight")
                        },
                        {
                            value: 1,
                            icon: "dx-diagram-i-connector-orthogonal dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineOrthogonal")
                        }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineStart: {
                    command: DiagramCommand.ConnectorStartLineEnding,
                    widget: "dxSelectBox",
                    items: [
                        {
                            value: 0,
                            icon: "dx-diagram-i-connector-begin-none dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineNone")
                        },
                        {
                            value: 1,
                            icon: "dx-diagram-i-connector-begin-arrow dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineArrow")
                        }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    hint: messageLocalization.format("dxDiagram-commandConnectorLineStart"),
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineEnd: {
                    command: DiagramCommand.ConnectorEndLineEnding,
                    widget: "dxSelectBox",
                    items: [
                        {
                            value: 0,
                            icon: "dx-diagram-i-connector-begin-none dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineNone")
                        },
                        {
                            value: 1,
                            icon: "dx-diagram-i-connector-begin-arrow dx-diagram-i",
                            hint: messageLocalization.format("dxDiagram-commandConnectorLineArrow")
                        }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    hint: messageLocalization.format("dxDiagram-commandConnectorLineEnd"),
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                autoLayout: {
                    widget: "dxButton",
                    text: messageLocalization.format("dxDiagram-commandAutoLayout"),
                    showText: "always",
                    items: [
                        {
                            text: messageLocalization.format("dxDiagram-commandAutoLayoutTree"),
                            items: [
                                {
                                    command: DiagramCommand.AutoLayoutTreeVertical,
                                    text: messageLocalization.format("dxDiagram-commandAutoLayoutVertical")
                                },
                                {
                                    command: DiagramCommand.AutoLayoutTreeHorizontal,
                                    text: messageLocalization.format("dxDiagram-commandAutoLayoutHorizontal")
                                }
                            ]
                        },
                        {
                            text: messageLocalization.format("dxDiagram-commandAutoLayoutLayered"),
                            items: [
                                {
                                    command: DiagramCommand.AutoLayoutLayeredVertical,
                                    text: messageLocalization.format("dxDiagram-commandAutoLayoutVertical")
                                },
                                {
                                    command: DiagramCommand.AutoLayoutLayeredHorizontal,
                                    text: messageLocalization.format("dxDiagram-commandAutoLayoutHorizontal")
                                }
                            ]
                        }
                    ]
                },
                fullScreen: {
                    command: DiagramCommand.Fullscreen,
                    hint: messageLocalization.format("dxDiagram-commandFullscreen"),
                    text: messageLocalization.format("dxDiagram-commandFullscreen"),
                    icon: "dx-diagram-i dx-diagram-i-button-fullscreen",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                }
            });
    },
    getToolbarCommands: function(commandNames) {
        var commands = this.getAllToolbarCommands();
        if(commandNames) {
            return commandNames.map(function(cn) { return commands[cn]; }).filter(function(c) { return c; });
        }
        return [
            commands["export"],
            commands["separator"],
            commands["undo"],
            commands["redo"],
            commands["separator"],
            commands["fontName"],
            commands["fontSize"],
            commands["separator"],
            commands["bold"],
            commands["italic"],
            commands["underline"],
            commands["separator"],
            commands["fontColor"],
            commands["lineColor"],
            commands["fillColor"],
            commands["separator"],
            commands["textAlignLeft"],
            commands["textAlignCenter"],
            commands["textAlignRight"],
            commands["separator"],
            commands["connectorLineType"],
            commands["connectorLineStart"],
            commands["connectorLineEnd"],
            commands["separator"],
            commands["autoLayout"],
            commands["separator"],
            commands["fullScreen"]
        ];
    },

    getAllPropertyPanelCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this.propertyPanelCommands ||
            (this.propertyPanelCommands = {
                units: {
                    command: DiagramCommand.ViewUnits,
                    text: messageLocalization.format("dxDiagram-commandUnits"),
                    widget: "dxSelectBox"
                },
                pageSize: {
                    command: DiagramCommand.PageSize,
                    text: messageLocalization.format("dxDiagram-commandPageSize"),
                    widget: "dxSelectBox",
                    getValue: (v) => JSON.parse(v),
                    setValue: (v) => JSON.stringify(v)
                },
                pageOrientation: {
                    command: DiagramCommand.PageLandscape,
                    text: messageLocalization.format("dxDiagram-commandPageOrientation"),
                    widget: "dxSelectBox",
                    items: [
                        { value: true, title: messageLocalization.format("dxDiagram-commandPageOrientationLandscape") },
                        { value: false, title: messageLocalization.format("dxDiagram-commandPageOrientationPortrait") }
                    ]
                },
                pageColor: {
                    command: DiagramCommand.PageColor,
                    text: messageLocalization.format("dxDiagram-commandPageColor"),
                    widget: "dxColorBox",
                },
                showGrid: {
                    command: DiagramCommand.ShowGrid,
                    text: messageLocalization.format("dxDiagram-commandShowGrid"),
                    widget: "dxCheckBox",
                },
                snapToGrid: {
                    command: DiagramCommand.SnapToGrid,
                    text: messageLocalization.format("dxDiagram-commandSnapToGrid"),
                    widget: "dxCheckBox"
                },
                gridSize: {
                    command: DiagramCommand.GridSize,
                    text: messageLocalization.format("dxDiagram-commandGridSize"),
                    widget: "dxSelectBox"
                },
                zoomLevel: {
                    command: DiagramCommand.ZoomLevel,
                    text: messageLocalization.format("dxDiagram-commandZoomLevel"),
                    widget: "dxSelectBox"
                },
                autoZoom: {
                    command: DiagramCommand.ToggleAutoZoom,
                    text: messageLocalization.format("dxDiagram-commandAutoZoom"),
                    widget: "dxCheckBox"
                },
                simpleView: {
                    command: DiagramCommand.ToggleSimpleView,
                    text: messageLocalization.format("dxDiagram-commandSimpleView"),
                    widget: "dxCheckBox"
                },
            });
    },
    getDefaultPropertyPanelCommandGroups: function() {
        return [
            { commands: ["units"] },
            { commands: ["pageSize", "pageOrientation", "pageColor"] },
            { commands: ["showGrid", "snapToGrid", "gridSize"] },
            { commands: ["zoomLevel", "autoZoom", "simpleView"] },
        ];
    },
    getPropertyPanelCommandsByGroups: function(groups) {
        var commands = DiagramCommands.getAllPropertyPanelCommands();
        var result = [];
        groups.forEach(function(g, gi) {
            g.commands.forEach(function(cn, ci) {
                result.push(extend(commands[cn], {
                    beginGroup: gi > 0 && ci === 0
                }));
            });
        });
        return result;
    },
    getPropertyPanelCommands: function(commandGroups) {
        commandGroups = commandGroups || DiagramCommands.getDefaultPropertyPanelCommandGroups();
        return DiagramCommands.getPropertyPanelCommandsByGroups(commandGroups);
    },

    getAllContextMenuCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this.contextMenuCommands ||
            (this.contextMenuCommands = {
                separator: SEPARATOR,

                cut: {
                    command: DiagramCommand.Cut,
                    text: messageLocalization.format("dxDiagram-commandCut")
                },
                copy: {
                    command: DiagramCommand.Copy,
                    text: messageLocalization.format("dxDiagram-commandCopy")
                },
                paste: {
                    command: DiagramCommand.PasteInPosition,
                    text: messageLocalization.format("dxDiagram-commandPaste"),
                    getParameter: (diagramContextMenu) => {
                        return diagramContextMenu.clickPosition;
                    }
                },
                selectAll: {
                    command: DiagramCommand.SelectAll,
                    text: messageLocalization.format("dxDiagram-commandSelectAll")
                },
                delete: {
                    command: DiagramCommand.Delete,
                    text: messageLocalization.format("dxDiagram-commandDelete")
                },
                bringToFront: {
                    command: DiagramCommand.BringToFront,
                    text: messageLocalization.format("dxDiagram-commandBringToFront")
                },
                sendToBack: {
                    command: DiagramCommand.SendToBack,
                    text: messageLocalization.format("dxDiagram-commandSendToBack")
                },
                lock: {
                    command: DiagramCommand.Lock,
                    text: messageLocalization.format("dxDiagram-commandLock")
                },
                unlock: {
                    command: DiagramCommand.Unlock,
                    text: messageLocalization.format("dxDiagram-commandUnlock")
                },
                insertShapeImage: {
                    command: DiagramCommand.InsertShapeImage,
                    text: messageLocalization.format("dxDiagram-commandInsertShapeImage")
                },
                editShapeImage: {
                    command: DiagramCommand.EditShapeImage,
                    text: messageLocalization.format("dxDiagram-commandEditShapeImage")
                },
                deleteShapeImage: {
                    command: DiagramCommand.DeleteShapeImage,
                    text: messageLocalization.format("dxDiagram-commandDeleteShapeImage")
                }
            });
    },
    getContextMenuCommands: function(commandNames) {
        var commands = this.getAllContextMenuCommands();
        if(commandNames) {
            return commandNames.map(function(cn) { return commands[cn]; }).filter(function(c) { return c; });
        }
        return [
            commands["cut"],
            commands["copy"],
            commands["paste"],
            commands["separator"],
            commands["selectAll"],
            commands["separator"],
            commands["delete"],
            commands["separator"],
            commands["bringToFront"],
            commands["sendToBack"],
            commands["separator"],
            commands["lock"],
            commands["unlock"],
            commands["insertShapeImage"],
            commands["editShapeImage"],
            commands["deleteShapeImage"]
        ];
    },

    _exportTo(widget, dataURI, format, mimeString) {
        const window = getWindow();
        if(window && window.atob && isFunction(window.Blob)) {
            const blob = this._getBlobByDataURI(window, dataURI, mimeString);
            const options = widget.option("export");
            fileSaver.saveAs(options.fileName || "foo", format, blob, options.proxyURL);
        }
    },
    _getBlobByDataURI(window, dataURI, mimeString) {
        var byteString = window.atob(dataURI.split(',')[1]);
        var ia = new Uint8Array(byteString.length);
        for(var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new window.Blob([ia.buffer], { type: mimeString });
    }
};

module.exports = DiagramCommands;
