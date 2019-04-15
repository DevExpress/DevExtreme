import { getDiagram } from "./diagram_importer";

const DiagramCommands = {
    getToolbar: function() {
        const { DiagramCommand } = getDiagram();
        return [
            {
                name: DiagramCommand.Undo,
                hint: 'Undo',
                icon: "undo"
            },
            {
                name: DiagramCommand.Redo,
                hint: "Redo",
                icon: "redo"
            },
            {
                name: DiagramCommand.FontName,
                beginGroup: true,
                widget: "dxSelectBox",
                items: ["Arial", "Arial Black", "Helvetica", "Times New Roman", "Courier New", "Courier", "Verdana", "Georgia", "Comic Sans MS", "Trebuchet MS"]
            },
            {
                name: DiagramCommand.FontSize,
                widget: "dxSelectBox",
                items: ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt", "26pt", "28pt", "36pt", "48pt", "72pt"]
            },
            {
                name: DiagramCommand.Bold,
                hint: "Bold",
                icon: "bold"
            },
            {
                name: DiagramCommand.Italic,
                hint: "Italic",
                icon: "italic"
            },
            {
                name: DiagramCommand.Underline,
                hint: "Underline",
                icon: "underline"
            },
            {
                name: DiagramCommand.FontColor,
                text: "Text Color",
                widget: "dxColorBox"
            },
            {
                name: DiagramCommand.StrokeColor,
                text: "Line Color",
                widget: "dxColorBox"
            },
            {
                name: DiagramCommand.TextLeftAlign,
                hint: "Align Left",
                icon: "alignleft",
                beginGroup: true
            },
            {
                name: DiagramCommand.TextCenterAlign,
                hint: "Center",
                icon: "aligncenter"
            },
            {
                name: DiagramCommand.TextRightAlign,
                hint: "Align Right",
                icon: "alignright"
            },
            {
                name: DiagramCommand.ConnectorLineOption,
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
                name: DiagramCommand.ConnectorStartLineEnding,
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
                name: DiagramCommand.ConnectorEndLineEnding,
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
                name: DiagramCommand.AutoLayoutTree,
                text: "Tree Auto Layout"
            },
            {
                name: DiagramCommand.AutoLayoutTree,
                text: "Layered Auto Layout"
            }
        ];
    },
    getOptions: function() {
        const { DiagramCommand } = getDiagram();
        return [
            {
                name: DiagramCommand.PageSize,
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
                name: DiagramCommand.PageLandscape,
                text: "Page Landscape",
                widget: "dxCheckBox"
            },
            {
                name: DiagramCommand.GridSize,
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
                name: DiagramCommand.SnapToGrid,
                text: "Snap to Grid",
                widget: "dxCheckBox"
            }
        ];
    }
};

module.exports = DiagramCommands;
