import { getDiagram } from "./diagram_importer";
import { extend } from "../../core/utils/extend";
import { fileSaver } from "../../exporter/file_saver";
import { isFunction } from "../../core/utils/type";
import { getWindow } from "../../core/utils/window";

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
                export: {
                    widget: "dxButton",
                    icon: "export",
                    text: "Export",
                    items: [
                        {
                            command: DiagramCommand.ExportSvg, // eslint-disable-line spellcheck/spell-checker
                            text: "Export to SVG",
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "SVG", "image/svg+xml");
                            }
                        },
                        {
                            command: DiagramCommand.ExportPng, // eslint-disable-line spellcheck/spell-checker
                            text: "Export to PNG",
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "PNG", "image/png");
                            }
                        },
                        {
                            command: DiagramCommand.ExportJpg, // eslint-disable-line spellcheck/spell-checker
                            text: "Export to JPEG",
                            getParameter: (widget) => {
                                return (dataURI) => this._exportTo(widget, dataURI, "JPEG", "image/jpeg");
                            }
                        }
                    ]
                },
                separator: SEPARATOR,
                undo: {
                    command: DiagramCommand.Undo,
                    hint: 'Undo',
                    icon: "undo",
                    text: "Undo",
                },
                redo: {
                    command: DiagramCommand.Redo,
                    hint: "Redo",
                    icon: "redo",
                    text: "Redo",
                },
                fontName: {
                    command: DiagramCommand.FontName,
                    beginGroup: true,
                    widget: "dxSelectBox",
                    items: ["Arial", "Arial Black", "Helvetica", "Times New Roman", "Courier New", "Courier", "Verdana", "Georgia", "Comic Sans MS", "Trebuchet MS"]
                },
                fontSize: {
                    command: DiagramCommand.FontSize,
                    widget: "dxSelectBox",
                    items: ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt", "26pt", "28pt", "36pt", "48pt", "72pt"],
                    cssClass: CSS_CLASSES.SMALL_SELECT
                },
                bold: {
                    command: DiagramCommand.Bold,
                    hint: "Bold",
                    text: "Bold",
                    icon: "bold"
                },
                italic: {
                    command: DiagramCommand.Italic,
                    hint: "Italic",
                    text: "Italic",
                    icon: "italic"
                },
                underline: {
                    command: DiagramCommand.Underline,
                    hint: "Underline",
                    text: "Underline",
                    icon: "underline"
                },
                fontColor: {
                    command: DiagramCommand.FontColor,
                    text: "Text Color",
                    widget: "dxColorBox",
                    icon: "dx-icon dx-icon-color",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                lineColor: {
                    command: DiagramCommand.StrokeColor,
                    text: "Line Color",
                    widget: "dxColorBox",
                    icon: "dx-icon dx-icon-background",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                fillColor: {
                    command: DiagramCommand.FillColor,
                    text: "Fill Color",
                    widget: "dxColorBox",
                    icon: "dx-diagram-i dx-diagram-i-button-fill",
                    cssClass: CSS_CLASSES.BUTTON_COLOR
                },
                textAlignLeft: {
                    command: DiagramCommand.TextLeftAlign,
                    hint: "Align Left",
                    text: "Align Left",
                    icon: "alignleft",
                    beginGroup: true
                },
                textAlignCenter: {
                    command: DiagramCommand.TextCenterAlign,
                    hint: "Align Center",
                    text: "Center",
                    icon: "aligncenter"
                },
                textAlignRight: {
                    command: DiagramCommand.TextRightAlign,
                    hint: "Align Right",
                    text: "Align Right",
                    icon: "alignright"
                },
                connectorLineType: {
                    command: DiagramCommand.ConnectorLineOption,
                    widget: "dxSelectBox",
                    hint: "Line Type",
                    items: [
                        { value: 0, icon: "dx-diagram-i-connector-straight dx-diagram-i", hint: "Straight" },
                        { value: 1, icon: "dx-diagram-i-connector-orthogonal dx-diagram-i", hint: "Orthogonal" }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineStart: {
                    command: DiagramCommand.ConnectorStartLineEnding,
                    widget: "dxSelectBox",
                    items: [
                        { value: 0, icon: "dx-diagram-i-connector-begin-none dx-diagram-i", hint: "None" },
                        { value: 1, icon: "dx-diagram-i-connector-begin-arrow dx-diagram-i", hint: "Arrow" }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    hint: "Line Start",
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                connectorLineEnd: {
                    command: DiagramCommand.ConnectorEndLineEnding,
                    widget: "dxSelectBox",
                    items: [
                        { value: 0, icon: "dx-diagram-i-connector-end-none dx-diagram-i", hint: "None" },
                        { value: 1, icon: "dx-diagram-i-connector-end-arrow dx-diagram-i", hint: "Arrow" }
                    ],
                    displayExpr: "name",
                    valueExpr: "value",
                    hint: "Line End",
                    cssClass: CSS_CLASSES.BUTTON_SELECT
                },
                autoLayout: {
                    widget: "dxButton",
                    text: "Auto Layout",
                    showText: "always",
                    items: [
                        {
                            text: "Tree",
                            items: [
                                { command: DiagramCommand.AutoLayoutTreeVertical, text: "Vertical" },
                                { command: DiagramCommand.AutoLayoutTreeHorizontal, text: "Horizontal" }
                            ]
                        },
                        {
                            text: "Layered",
                            items: [
                                { command: DiagramCommand.AutoLayoutLayeredVertical, text: "Vertical" },
                                { command: DiagramCommand.AutoLayoutLayeredHorizontal, text: "Horizontal" }
                            ]
                        }
                    ]
                },
                fullscreen: {
                    command: DiagramCommand.Fullscreen,
                    hint: "Fullscreen",
                    text: "Fullscreen",
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
            commands["fullscreen"]
        ];
    },

    getAllPropertyPanelCommands: function() {
        const { DiagramCommand } = getDiagram();
        return this.propertyPanelCommands ||
            (this.propertyPanelCommands = {
                units: {
                    command: DiagramCommand.ViewUnits,
                    text: "Units",
                    widget: "dxSelectBox"
                },
                pageSize: {
                    command: DiagramCommand.PageSize,
                    text: "Page Size",
                    widget: "dxSelectBox",
                    getValue: (v) => JSON.parse(v),
                    setValue: (v) => JSON.stringify(v)
                },
                pageLandscape: {
                    command: DiagramCommand.PageLandscape,
                    text: "Page Landscape",
                    widget: "dxCheckBox"
                },
                pageColor: {
                    command: DiagramCommand.PageColor,
                    text: "Page Color",
                    widget: "dxColorBox",
                },
                showGrid: {
                    command: DiagramCommand.ShowGrid,
                    text: "Show Grid",
                    widget: "dxCheckBox",
                },
                snapToGrid: {
                    command: DiagramCommand.SnapToGrid,
                    text: "Snap to Grid",
                    widget: "dxCheckBox"
                },
                gridSize: {
                    command: DiagramCommand.GridSize,
                    text: "Grid Size",
                    widget: "dxSelectBox"
                },
                zoomLevel: {
                    command: DiagramCommand.ZoomLevel,
                    widget: "dxSelectBox",
                    text: "Zoom Level"
                },
                autoZoom: {
                    command: DiagramCommand.ToggleAutoZoom,
                    text: "Auto Zoom",
                    widget: "dxCheckBox"
                },
            });
    },
    getDefaultPropertyPanelCommandGroups: function() {
        return [
            { commands: ["units"] },
            { commands: ["pageSize", "pageLandscape", "pageColor"] },
            { commands: ["showGrid", "snapToGrid", "gridSize"] },
            { commands: ["zoomLevel", "autoZoom"] },
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
                cut: {
                    command: DiagramCommand.Cut,
                    text: "Cut"
                },
                copy: {
                    command: DiagramCommand.Copy,
                    text: "Copy"
                },
                paste: {
                    command: DiagramCommand.PasteInPosition,
                    text: "Paste",
                    getParameter: (diagramContextMenu) => {
                        return diagramContextMenu.clickPosition;
                    }
                },
                selectAll: {
                    command: DiagramCommand.SelectAll,
                    text: "Select All",
                    beginGroup: true
                },
                delete: {
                    command: DiagramCommand.Delete,
                    text: "Delete",
                    beginGroup: true
                },
                bringToFront: {
                    command: DiagramCommand.BringToFront,
                    text: "Bring to Front",
                    beginGroup: true
                },
                sendToBack: {
                    command: DiagramCommand.SendToBack,
                    text: "Send to Back"
                },
                lock: {
                    command: DiagramCommand.Lock,
                    text: "Lock",
                    beginGroup: true
                },
                unlock: {
                    command: DiagramCommand.Unlock,
                    text: "Unlock"
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
            commands["selectAll"],
            commands["delete"],
            commands["bringToFront"],
            commands["sendToBack"],
            commands["lock"],
            commands["unlock"]
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
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(arrayBuffer);
        for(var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var dataView = new DataView(arrayBuffer);
        return new window.Blob([dataView], { type: mimeString });
    }
};

module.exports = DiagramCommands;
