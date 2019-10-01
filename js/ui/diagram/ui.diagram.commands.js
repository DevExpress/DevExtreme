import { getDiagram } from "./diagram_importer";
import { fileSaver } from "../../exporter/file_saver";
import { isFunction } from "../../core/utils/type";
import { getWindow } from "../../core/utils/window";

const DiagramCommands = {
    getToolbar: function() {
        const { DiagramCommand } = getDiagram();
        return [
            {
                command: DiagramCommand.Undo,
                hint: 'Undo',
                icon: "undo",
                text: "Undo",
            },
            {
                command: DiagramCommand.Redo,
                hint: "Redo",
                icon: "redo",
                text: "Redo",
            },
            {
                command: DiagramCommand.FontName,
                beginGroup: true,
                widget: "dxSelectBox",
                items: ["Arial", "Arial Black", "Helvetica", "Times New Roman", "Courier New", "Courier", "Verdana", "Georgia", "Comic Sans MS", "Trebuchet MS"]
            },
            {
                command: DiagramCommand.FontSize,
                widget: "dxSelectBox",
                items: ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt", "26pt", "28pt", "36pt", "48pt", "72pt"]
            },
            {
                command: DiagramCommand.Bold,
                hint: "Bold",
                text: "Bold",
                icon: "bold"
            },
            {
                command: DiagramCommand.Italic,
                hint: "Italic",
                text: "Italic",
                icon: "italic"
            },
            {
                command: DiagramCommand.Underline,
                hint: "Underline",
                text: "Underline",
                icon: "underline"
            },
            {
                command: DiagramCommand.FontColor,
                text: "Text Color",
                widget: "dxColorBox"
            },
            {
                command: DiagramCommand.StrokeColor,
                text: "Line Color",
                widget: "dxColorBox"
            },
            {
                command: DiagramCommand.FillColor,
                text: "Fill Color",
                widget: "dxColorBox"
            },
            {
                command: DiagramCommand.TextLeftAlign,
                hint: "Align Left",
                text: "Align Left",
                icon: "alignleft",
                beginGroup: true
            },
            {
                command: DiagramCommand.TextCenterAlign,
                hint: "Align Center",
                text: "Center",
                icon: "aligncenter"
            },
            {
                command: DiagramCommand.TextRightAlign,
                hint: "Align Right",
                text: "Align Right",
                icon: "alignright"
            },
            {
                command: DiagramCommand.ConnectorLineOption,
                widget: "dxSelectBox",
                text: "Line Option",
                items: [
                    { name: "Straight", value: 0 },
                    { name: "Orthogonal", value: 1 }
                ],
                displayExpr: "name",
                valueExpr: "value"
            },
            {
                command: DiagramCommand.ConnectorStartLineEnding,
                widget: "dxSelectBox",
                text: "Start Line Ending",
                items: [
                    { name: "None", value: 0 },
                    { name: "Arrow", value: 1 }
                ],
                displayExpr: "name",
                valueExpr: "value"
            },
            {
                command: DiagramCommand.ConnectorEndLineEnding,
                widget: "dxSelectBox",
                text: "End Line Ending",
                items: [
                    { name: "None", value: 0 },
                    { name: "Arrow", value: 1 }
                ],
                displayExpr: "name",
                valueExpr: "value"
            },
            {
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
            {
                widget: "dxButton",
                text: "Auto Layout",
                showText: "always",
                items: [
                    { command: DiagramCommand.AutoLayoutTreeVertical, text: "Tree (vertical)" },
                    { command: DiagramCommand.AutoLayoutLayeredVertical, text: "Layered (vertical)" },
                    { command: DiagramCommand.AutoLayoutLayeredHorizontal, text: "Layered (horizontal)" }
                ]
            }
        ];
    },
    getOptions: function() {
        const { DiagramCommand } = getDiagram();
        return [
            {
                command: DiagramCommand.PageSize,
                text: "Page Size",
                widget: "dxSelectBox",
                getValue: (v) => {
                    const vParts = v.split("|");
                    return {
                        width: parseInt(vParts[0]),
                        height: parseInt(vParts[1])
                    };
                },
                setValue: (v) => `${v.width}|${v.height}`,
                items: [
                    {
                        value: "12240|15840",
                        title: "US-Letter (8,5\" x 11\")"
                    },
                    {
                        value: "15817|24491",
                        title: "US-Tabloid (27.9 cm x 43.2 cm)"
                    },
                    {
                        value: "47679|67408",
                        title: "A0 (84.1 cm x 118.9 cm)"
                    },
                    {
                        value: "33676|47679",
                        title: "A1 (59.4 cm x 84.1 cm)"
                    },
                    {
                        value: "23811|33676",
                        title: "A2 (42.0 cm x 59.4 cm)"
                    },
                    {
                        value: "16838|23811",
                        title: "A3 (29.7 cm x 42.0 cm)"
                    },
                    {
                        value: "11906|16838",
                        title: "A4 (21.0 cm x 29.7 cm)"
                    },
                    {
                        value: "8391|11906",
                        title: "A5 (14.8 cm x 21.0 cm)"
                    },
                    {
                        value: "5953|8391",
                        title: "A6 (10.5 cm x 14.8 cm)"
                    },
                    {
                        value: "4195|5953",
                        title: "A7 (7.4 cm x 10.5 cm)"
                    }
                ]
            },
            {
                command: DiagramCommand.PageLandscape,
                text: "Page Landscape",
                widget: "dxCheckBox"
            },
            {
                command: DiagramCommand.GridSize,
                text: "Grid Size",
                widget: "dxSelectBox",
                items: [
                    {
                        value: 90,
                        title: "0.16 cm"
                    },
                    {
                        value: 180,
                        title: "0.32 cm"
                    },
                    {
                        value: 360,
                        title: "0.64 cm"
                    },
                    {
                        value: 720,
                        title: "1.28 cm"
                    }
                ]
            },
            {
                command: DiagramCommand.SnapToGrid,
                text: "Snap to Grid",
                widget: "dxCheckBox"
            }
        ];
    },
    getContextMenu: function() {
        const { DiagramCommand } = getDiagram();
        return [
            {
                command: DiagramCommand.Cut,
                text: "Cut"
            },
            {
                command: DiagramCommand.Copy,
                text: "Copy"
            },
            {
                command: DiagramCommand.Paste,
                text: "Paste"
            },
            {
                command: DiagramCommand.SelectAll,
                text: "Select All"
            },
            {
                command: DiagramCommand.Delete,
                text: "Delete"
            },
            {
                command: DiagramCommand.BringToFront,
                text: "Bring to Front"
            },
            {
                command: DiagramCommand.SendToBack,
                text: "Send to Back"
            }
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
