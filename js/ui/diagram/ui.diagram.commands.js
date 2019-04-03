import { getDiagram } from "./diagram_importer";

const DiagramCommands = {
    load: function() {
        const DiagramCommand = getDiagram().DiagramCommand;
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
                items: ["Straight", "Orthogonal"]
            },
            {
                name: DiagramCommand.ConnectorStartLineEnding,
                widget: "dxSelectBox",
                text: "Start Line Ending",
                items: ["None", "Arrow"]
            },
            {
                name: DiagramCommand.ConnectorEndLineEnding,
                widget: "dxSelectBox",
                text: "End Line Ending",
                items: ["None", "Arrow"]
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
    }
};

module.exports = DiagramCommands;
