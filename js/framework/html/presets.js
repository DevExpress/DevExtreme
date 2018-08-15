/**
 * @const layoutSets
 * @type Array<string>
 * @namespace DevExpress.framework.html
 * @hidden
 */
exports.layoutSets = {};
/**
 * @const animationSets
 * @type Any
 * @namespace DevExpress.framework.html
 * @hidden
 */
exports.animationSets = {
    "native": {
        "view-content-change": [
            { animation: "slide" },
            { animation: "ios7-slide", device: { platform: "ios" } },
            { animation: "none", device: { deviceType: "desktop", platform: "generic" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-header-toolbar": [
            { animation: "ios7-toolbar" },
            { animation: "slide", device: { grade: "B" } },
            { animation: "none", device: { grade: "C" } }
        ]
    },
    "default": {
        "layout-change": [
            { animation: "none" },
            { animation: "ios7-slide", device: { platform: "ios" } },
            { animation: "pop", device: { platform: "android" } },
            { animation: "openDoor", device: { deviceType: "phone", platform: "win", version: [8] } },
            { animation: "win-pop", device: { deviceType: "phone", platform: "win" } }
        ],
        "view-content-change": [
            { animation: "slide" },
            { animation: "ios7-slide", device: { platform: "ios" } },
            { animation: "fade", device: { deviceType: "desktop", platform: "generic" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-content-rendered": [
            { animation: "fade" },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-header-toolbar": [
            { animation: "ios7-toolbar" },
            { animation: "slide", device: { grade: "B" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "command-rendered-top": [
            { animation: "stagger-fade-drop" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } },
            { animation: "none", device: { platform: "win", version: [10] } }
        ],
        "command-rendered-bottom": [
            { animation: "stagger-fade-rise" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } },
            { animation: "none", device: { platform: "win", version: [10] } }
        ],
        "list-item-rendered": [
            { animation: "stagger-3d-drop", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "detail-item-rendered": [
            { animation: "stagger-3d-drop", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "edit-item-rendered": [
            { animation: "stagger-3d-drop", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ]
    },
    "slide": {
        "view-content-change": [
            { animation: "slide" },
            { animation: "ios7-slide", device: { platform: "ios" } },
            { animation: "fade", device: { deviceType: "desktop", platform: "generic" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-content-rendered": [
            { animation: "fade" },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-header-toolbar": [
            { animation: "ios7-toolbar" },
            { animation: "slide", device: { grade: "B" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "command-rendered-top": [
            { animation: "stagger-fade-drop" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "command-rendered-bottom": [
            { animation: "stagger-fade-rise" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "list-item-rendered": [
            { animation: "stagger-fade-slide", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "detail-item-rendered": [
            { animation: "stagger-fade-slide", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "edit-item-rendered": [
            { animation: "stagger-fade-slide", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ]
    },
    "zoom": {
        "view-content-change": [
            { animation: "slide" },
            { animation: "ios7-slide", device: { platform: "ios" } },
            { animation: "fade", device: { deviceType: "desktop", platform: "generic" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-content-rendered": [
            { animation: "fade" },
            { animation: "none", device: { grade: "C" } }
        ],
        "view-header-toolbar": [
            { animation: "ios7-toolbar" },
            { animation: "slide", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "command-rendered-top": [
            { animation: "stagger-fade-zoom" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "command-rendered-bottom": [
            { animation: "stagger-fade-zoom" },
            { animation: "fade", device: { grade: "B" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "list-item-rendered": [
            { animation: "stagger-fade-zoom", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "detail-item-rendered": [
            { animation: "stagger-fade-zoom", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ],
        "edit-item-rendered": [
            { animation: "stagger-fade-zoom", device: { grade: "A" } },
            { animation: "fade", device: { deviceType: "desktop" } },
            { animation: "none", device: { grade: "C" } }
        ]
    }
};
