import { Injectable } from '@angular/core';

export class SimpleObject {
    value: number | string;
    name: string;
    icon?: string;
    badge?: string;
}

let colors = [null, "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff", "#ff3466"];
let profileSettings: SimpleObject[] = [
    { value: 1, name: "Profile", icon: "user" },
    { value: 4, name: "Messages", icon: "email", badge: "5" },
    { value: 2, name: "Friends", icon: "group" },
    { value: 3, name: "Exit", icon: "runner" }
];
let downloads = ["Download Trial For Visual Studio", "Download Trial For All Platforms", "Package Managers"];
let alignments: SimpleObject[] = [
    { value: "left", name: "Left", icon: "alignleft" },
    { value: "right", name: "Right", icon: "alignright" },
    { value: "center", name: "Center", icon: "aligncenter" },
    { value: "justify", name: "Justify", icon: "alignjustify" }
];
let fontSizes: SimpleObject[] = [
    { value: 10, name: "10px" },
    { value: 12, name: "12px" },
    { value: 14, name: "14px" },
    { value: 16, name: "16px" },
    { value: 18, name: "18px" }
];
let lineHeights: SimpleObject[] = [
    { value: 1, name: "1" },
    { value: 1.35, name: "1.35" },
    { value: 1.5, name: "1.5" },
    { value: 2, name: "2" }
];

@Injectable()
export class Service {
    getColors(): string[] {
        return colors;
    }
	getDownloads(): string[] {
        return downloads;
    }
	getAlignments(): SimpleObject[] {
        return alignments;
    }
	getProfileSettings(): SimpleObject[] {
        return profileSettings;
    }
	getFontSizes(): SimpleObject[] {
        return fontSizes;
    }
	getLineHeights(): SimpleObject[] {
        return lineHeights;
    }
}
