import { Injectable } from '@angular/core';

export class Alignment {
    icon: string;
    alignment: string;
    hint: string;
}

export class FontStyle {
    icon: string;
    style: string;
    hint: string;
}

let alignments: Alignment[] = [
    {
        icon: "alignleft",
        alignment: "left",
        hint: "Align left"
    },
    {
        icon: "aligncenter",
        alignment: "center",
        hint: "Center"
    },
    {
        icon: "alignright",
        alignment: "right",
        hint: "Align right"
    },
    {
        icon: "alignjustify",
        alignment: "justify",
        hint: "Justify"
    }
];

let fontStyle: FontStyle[] = [
    {
        icon: "bold",
        style: "bold",
        hint: "Bold"
    },
    {
        icon: "italic",
        style: "italic",
        hint: "Italic"
    },
    {
        icon: "underline",
        style: "underline",
        hint: "Underlined"
    },
    {
        icon: "strike",
        style: "strike",
        hint: "Strikethrough"
    }
];

@Injectable()
export class Service {
    getAlignments() : Alignment[] {
        return alignments;
    }

    getFontStyles() : FontStyle[] {
        return fontStyle;
    }
}
