import { extend } from "../../core/utils/extend";
import { getWindow } from "../../core/utils/window";
import { patchFontOptions } from "./utils";
import clientExporter from "../../exporter";
import messageLocalization from "../../localization/message";
import { isDefined } from "../../core/utils/type";
import themeModule from "../themes";
import hoverEvent from "../../events/hover";
import pointerEvents from "../../events/pointer";

const imageExporter = clientExporter.image;
const svgExporter = clientExporter.svg;
const pdfExporter = clientExporter.pdf;

const pointerActions = [pointerEvents.down, pointerEvents.move].join(" ");

const BUTTON_SIZE = 35;
const ICON_COORDS = [[9, 12, 26, 12, 26, 14, 9, 14], [9, 17, 26, 17, 26, 19, 9, 19], [9, 22, 26, 22, 26, 24, 9, 24]];

const LIST_PADDING_TOP = 4;
const LIST_WIDTH = 120;
const VERTICAL_TEXT_MARGIN = 8;
const HORIZONTAL_TEXT_MARGIN = 15;
const MENU_ITEM_HEIGHT = 30;
const LIST_STROKE_WIDTH = 1;
const MARGIN = 10;
const SHADOW_OFFSET = 2;
const SHADOW_BLUR = 3;

const DEFAULT_EXPORT_FORMAT = "PNG";
const ALLOWED_IMAGE_FORMATS = [DEFAULT_EXPORT_FORMAT, "JPEG", "GIF"];
const ALLOWED_EXTRA_FORMATS = ["PDF", "SVG"];
const EXPORT_CSS_CLASS = "dx-export-menu";

const EXPORT_DATA_KEY = "export-element-type";
const FORMAT_DATA_KEY = "export-element-format";

const GET_COLOR_REGEX = /data-backgroundcolor="([^"]*)"/;

function getValidFormats() {
    const imageFormats = imageExporter.testFormats(ALLOWED_IMAGE_FORMATS);
    return {
        unsupported: imageFormats.unsupported,
        supported: imageFormats.supported.concat(ALLOWED_EXTRA_FORMATS)
    };
}

function validateFormat(format, incidentOccurred, validFormats) {
    validFormats = validFormats || getValidFormats();
    format = String(format).toUpperCase();

    if(validFormats.supported.indexOf(format) !== -1) {
        return format;
    }
    if(validFormats.unsupported.indexOf(format) !== -1) {
        incidentOccurred && incidentOccurred("W2108", [format]);
    }
}

function getCreatorFunc(format) {
    if(format === "SVG") {
        return svgExporter.getData;
    } else if(format === "PDF") {
        return pdfExporter.getData;
    } else {
        return imageExporter.getData;
    }
}

function print(imageSrc, options) {
    const document = getWindow().document;
    const iFrame = document.createElement("iframe");
    iFrame.onload = setPrint(imageSrc, options);
    iFrame.style.visibility = "hidden";
    iFrame.style.position = "fixed";
    iFrame.style.right = "0";
    iFrame.style.bottom = "0";
    document.body.appendChild(iFrame);
}

function setPrint(imageSrc, options) {
    return function() {
        let window = this.contentWindow;
        const img = window.document.createElement("img");
        window.document.body.appendChild(img);

        ///#DEBUG
        const origImageSrc = imageSrc;
        if(options.__test) {
            imageSrc = options.__test.imageSrc;
            window = options.__test.mockWindow;
        }
        ///#ENDDEBUG

        const removeFrame = () => {
            ///#DEBUG
            options.__test && options.__test.checkAssertions();
            ///#ENDDEBUG
            this.parentElement.removeChild(this);
            ///#DEBUG
            options.__test && options.__test.deferred.resolve(origImageSrc);
            ///#ENDDEBUG
        };

        img.addEventListener("load", () => {
            window.focus();
            window.print();
            removeFrame();
        });
        img.addEventListener("error", removeFrame);

        img.src = imageSrc;
    };
}

function getItemAttributes(options, type, itemIndex) {
    const x = BUTTON_SIZE - LIST_WIDTH;
    const y = BUTTON_SIZE + LIST_PADDING_TOP + LIST_STROKE_WIDTH + itemIndex * MENU_ITEM_HEIGHT;

    const attr = {
        rect: {
            width: LIST_WIDTH - LIST_STROKE_WIDTH * 2,
            height: MENU_ITEM_HEIGHT,
            x: x + LIST_STROKE_WIDTH,
            y: y
        },
        text: {
            x: x + (options.rtl ? LIST_WIDTH - HORIZONTAL_TEXT_MARGIN : HORIZONTAL_TEXT_MARGIN),
            y: y + MENU_ITEM_HEIGHT - VERTICAL_TEXT_MARGIN
        }
    };

    if(type === "printing") {
        attr.separator = {
            stroke: options.button.default.borderColor,
            "stroke-width": LIST_STROKE_WIDTH,
            cursor: "pointer",
            sharp: "v",
            d: "M " + x + " " + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH) + " " +
                "L " + (x + LIST_WIDTH) + " " + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH)
        };
    }

    return attr;
}

function createMenuItem(renderer, options, settings) {
    const itemData = {};
    const type = settings.type;
    const format = settings.format;
    const attr = getItemAttributes(options, type, settings.itemIndex);
    const fontStyle = patchFontOptions(options.font);
    fontStyle["pointer-events"] = "none";

    const menuItem = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-list-item" });

    itemData[EXPORT_DATA_KEY] = type;
    if(format) {
        itemData[FORMAT_DATA_KEY] = format;
    }

    const rect = renderer.rect();
    rect.attr(attr.rect).
        css({
            cursor: "pointer",
            "pointer-events": "all"
        }).
        data(itemData);

    rect.on(hoverEvent.start + ".export", () => rect.attr({ fill: options.button.hover.backgroundColor }))
        .on(hoverEvent.end + ".export", () => rect.attr({ fill: null }));

    rect.append(menuItem);

    const text = renderer.text(settings.text).css(fontStyle).
        attr(attr.text).
        append(menuItem);

    if(type === "printing") {
        renderer.path(null, "line").
            attr(attr.separator).
            append(menuItem);
    }

    return {
        g: menuItem,
        rect: rect,
        resetState: () => rect.attr({ fill: null }),
        fixPosition: () => {
            const textBBox = text.getBBox();
            text.move(attr.text.x - textBBox.x - (options.rtl ? textBBox.width : 0));
        }
    };
}

function createMenuItems(renderer, options) {
    let items = [];

    if(options.printingEnabled) {
        items.push(createMenuItem(renderer, options, {
            type: "printing",
            text: messageLocalization.format("vizExport-printingButtonText"),
            itemIndex: items.length
        }));
    }
    items = options.formats.reduce((r, format) => {
        r.push(createMenuItem(renderer, options, {
            type: "exporting",
            text: messageLocalization.getFormatter("vizExport-exportButtonText")(format),
            format: format,
            itemIndex: r.length
        }));
        return r;
    }, items);

    return items;
}

function getBackgroundColorFromMarkup(markup) {
    const parsedMarkup = GET_COLOR_REGEX.exec(markup);

    return parsedMarkup ? parsedMarkup[1] : undefined;
}

export const exportFromMarkup = function(markup, options) {
    options.format = validateFormat(options.format) || DEFAULT_EXPORT_FORMAT;
    options.fileName = options.fileName || "file";

    options.exportingAction = options.onExporting;
    options.exportedAction = options.onExported;
    options.fileSavingAction = options.onFileSaving;
    options.margin = isDefined(options.margin) ? options.margin : MARGIN;
    options.backgroundColor = isDefined(options.backgroundColor) ? options.backgroundColor : getBackgroundColorFromMarkup(markup);
    clientExporter.export(markup, options, getCreatorFunc(options.format));
};

export const getMarkup = function(widgets) {
    const svgArr = [];
    let height = 0;
    let width = 0;
    const backgroundColors = [];
    let backgroundColorStr = "";

    widgets.forEach(widget => {
        const size = widget.getSize(),
            backgroundColor = widget.option("backgroundColor") || themeModule.getTheme(widget.option("theme")).backgroundColor;

        backgroundColor && backgroundColors.indexOf(backgroundColor) === -1 && backgroundColors.push(backgroundColor);
        svgArr.push(widget.svg().replace('<svg', '<g transform="translate(0,' + height + ')" ').replace('</svg>', '</g>'));
        height += size.height;
        width = Math.max(width, size.width);
    });

    if(backgroundColors.length === 1) {
        backgroundColorStr = 'data-backgroundcolor="' + backgroundColors[0] + '" ';
    }
    return '<svg ' + backgroundColorStr + 'height="' + height + '" width="' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>';
};

export const ExportMenu = function(params) {
    const renderer = this._renderer = params.renderer;
    this._incidentOccurred = params.incidentOccurred;
    this._exportTo = params.exportTo;
    this._print = params.print;

    this._shadow = renderer.shadowFilter("-50%", "-50%", "200%", "200%", SHADOW_OFFSET, 6, SHADOW_BLUR);
    this._shadow.attr({ opacity: 0.8 });
    this._group = renderer.g().attr({
        "class": EXPORT_CSS_CLASS,
        "hidden-for-export": true
    }).linkOn(renderer.root, { name: "export-menu", after: "peripheral" });
    this._buttonGroup = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-button" }).append(this._group);
    this._listGroup = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-list" }).append(this._group);

    this._overlay = renderer.rect(-LIST_WIDTH + BUTTON_SIZE, BUTTON_SIZE + LIST_PADDING_TOP, LIST_WIDTH, 0);
    this._overlay.attr({
        "stroke-width": LIST_STROKE_WIDTH,
        cursor: "pointer",
        rx: 4,
        ry: 4,
        filter: this._shadow.id
    });
    this._overlay.data({ "export-element-type": "list" });
    this.validFormats = getValidFormats();

    this._subscribeEvents();
};

extend(ExportMenu.prototype, {
    getLayoutOptions() {
        if(this._hiddenDueToLayout) {
            return { width: 0, height: 0, cutSide: "vertical", cutLayoutSide: "top" };
        }
        const bBox = this._buttonGroup.getBBox();

        bBox.cutSide = "vertical";
        bBox.cutLayoutSide = "top";
        bBox.height += MARGIN;
        bBox.position = {
            vertical: "top",
            horizontal: "right"
        };

        bBox.verticalAlignment = "top";
        bBox.horizontalAlignment = "right";

        return bBox;
    },

    probeDraw() {
        this._fillSpace();
        this.show();
    },

    shift(_, y) {
        this._group.attr({ translateY: this._group.attr("translateY") + y });
    },

    draw(width, height, canvas) {
        this._group.move(width - BUTTON_SIZE - SHADOW_OFFSET - SHADOW_BLUR + canvas.left, Math.floor(height / 2 - BUTTON_SIZE / 2));

        const layoutOptions = this.getLayoutOptions();
        if(layoutOptions.width > width || layoutOptions.height > height) {
            this.freeSpace();
        }

        return this;
    },

    show() {
        this._group.linkAppend();
    },

    hide() {
        this._group.linkRemove();
    },

    setOptions(options) {
        this._options = options;

        if(options.formats) {
            options.formats = options.formats.reduce((r, format) => {
                format = validateFormat(format, this._incidentOccurred, this.validFormats);
                format && r.push(format);
                return r;
            }, []);
        } else {
            options.formats = this.validFormats.supported.slice();
        }

        options.printingEnabled = options.printingEnabled === undefined ? true : options.printingEnabled;

        if(options.enabled && (options.formats.length || options.printingEnabled)) {
            this.show();
            this._updateButton();
            this._updateList();
            this._hideList();
        } else {
            this.hide();
        }
    },

    dispose() {
        this._unsubscribeEvents();

        this._group.linkRemove().linkOff();
        this._group.dispose();
        this._shadow.dispose();
    },

    // BaseWidget_layout_implementation
    layoutOptions() {
        return this._options.enabled && { horizontalAlignment: "right", verticalAlignment: "top", weak: true };
    },

    measure() {
        this._fillSpace();
        return [BUTTON_SIZE + SHADOW_OFFSET, BUTTON_SIZE];
    },

    move(rect) {
        this._group.attr({ translateX: Math.round(rect[0]), translateY: Math.round(rect[1]) });
    },

    _fillSpace() {
        this._hiddenDueToLayout = false;
        this.show();
    },

    freeSpace() {
        this._incidentOccurred("W2107");
        this._hiddenDueToLayout = true;
        this.hide();
    },
    // BaseWidget_layout_implementation

    _hideList() {
        this._listGroup.remove();
        this._listShown = false;
        this._setButtonState("default");
        this._menuItems.forEach(item => item.resetState());
    },

    _showList() {
        this._listGroup.append(this._group);
        this._listShown = true;
        this._menuItems.forEach(item => item.fixPosition());
    },

    _setButtonState(state) {
        const style = this._options.button[state];

        this._button.attr({
            stroke: style.borderColor,
            fill: style.backgroundColor
        });

        this._icon.attr({ fill: style.color });
    },

    _subscribeEvents() {
        this._renderer.root.on(pointerEvents.up + ".export", e => {
            var elementType = e.target[EXPORT_DATA_KEY];

            if(!elementType) {
                if(this._button) {
                    this._hideList();
                }
                return;
            }

            if(elementType === "button") {
                if(this._listShown) {
                    this._setButtonState("default");
                    this._hideList();
                } else {
                    this._setButtonState("focus");
                    this._showList();
                }
            } else if(elementType === "printing") {
                this._print();
                this._hideList();
            } else if(elementType === "exporting") {
                this._exportTo(e.target[FORMAT_DATA_KEY]);
                this._hideList();
            }
        });


        this._listGroup.on(pointerActions, e => e.stopPropagation());

        this._buttonGroup.on(pointerEvents.enter, () => this._setButtonState("hover"));
        this._buttonGroup.on(pointerEvents.leave, () => this._setButtonState(this._listShown ? "focus" : "default"));
        this._buttonGroup.on(pointerEvents.down + ".export", () => this._setButtonState("active"));
    },

    _unsubscribeEvents() {
        this._renderer.root.off(".export");
        this._listGroup.off();
        this._buttonGroup.off();
    },

    _updateButton() {
        const renderer = this._renderer;
        const options = this._options;
        const exportData = { "export-element-type": "button" };

        if(!this._button) {
            this._button = renderer.rect(0, 0, BUTTON_SIZE, BUTTON_SIZE).append(this._buttonGroup);
            this._button.attr({
                rx: 4,
                ry: 4,
                fill: options.button.default.backgroundColor,
                stroke: options.button.default.borderColor,
                "stroke-width": 1,
                cursor: "pointer"
            });
            this._button.data(exportData);

            this._icon = renderer.path(ICON_COORDS).append(this._buttonGroup);
            this._icon.attr({
                fill: options.button.default.color,
                cursor: "pointer"
            });
            this._icon.data(exportData);

            this._buttonGroup.setTitle(messageLocalization.format("vizExport-titleMenuText"));
        }
    },

    _updateList() {
        const options = this._options;
        const buttonDefault = options.button.default;
        const listGroup = this._listGroup;
        const items = createMenuItems(this._renderer, options);

        this._shadow.attr({
            color: options.shadowColor
        });

        this._overlay.attr({
            height: items.length * MENU_ITEM_HEIGHT + LIST_STROKE_WIDTH * 2,
            fill: buttonDefault.backgroundColor,
            stroke: buttonDefault.borderColor
        });

        listGroup.clear();
        this._overlay.append(listGroup);
        items.forEach(item => item.g.append(listGroup));

        this._menuItems = items;
    }
});

// BaseWidget.js
function getExportOptions(widget, exportOptions, fileName, format) {
    if(format || exportOptions.format) {
        format = validateFormat(format || exportOptions.format, widget._incidentOccurred);
    }
    return {
        format: format || DEFAULT_EXPORT_FORMAT,
        fileName: fileName || exportOptions.fileName || "file",
        proxyUrl: exportOptions.proxyUrl,
        backgroundColor: exportOptions.backgroundColor,
        width: widget._canvas.width,
        height: widget._canvas.height,
        margin: exportOptions.margin,
        forceProxy: exportOptions.forceProxy,
        exportingAction: widget._createActionByOption("onExporting"),
        exportedAction: widget._createActionByOption("onExported"),
        fileSavingAction: widget._createActionByOption("onFileSaving")
    };
}

export const plugin = {
    name: "export",
    init() {
        this._exportMenu = new exports.ExportMenu({
            renderer: this._renderer,
            incidentOccurred: this._incidentOccurred,
            print: () => this.print(),
            exportTo: format => this.exportTo(undefined, format)
        });
        this._layout.add(this._exportMenu);
    },
    dispose() {
        this._exportMenu.dispose();
    },

    members: {
        _getExportMenuOptions() {
            return extend({}, this._getOption("export"), { rtl: this._getOption("rtlEnabled", true) });
        },
        exportTo(fileName, format) {
            const menu = this._exportMenu;
            const options = getExportOptions(this, this._getOption("export") || {}, fileName, format);

            menu && menu.hide();
            clientExporter.export(this._renderer.root.element, options, getCreatorFunc(options.format));
            menu && menu.show();
        },
        print() {
            const menu = this._exportMenu;
            const options = getExportOptions(this, this._getOption("export") || {});

            ///#DEBUG
            options.__test = this._getOption("export").__test;
            ///#ENDDEBUG

            options.exportingAction = null;
            options.exportedAction = null;
            options.margin = 0;
            options.format = "PNG";
            options.forceProxy = true;
            options.fileSavingAction = eventArgs => {
                print(`data:image/png;base64,${eventArgs.data}`, { __test: options.__test });
                eventArgs.cancel = true;
            };

            menu && menu.hide();
            clientExporter.export(this._renderer.root.element, options, getCreatorFunc(options.format));
            menu && menu.show();
        }
    },
    customize(constructor) {
        const proto = constructor.prototype;

        constructor.addChange({
            code: "EXPORT",
            handler() {
                this._exportMenu.setOptions(this._getExportMenuOptions());
                this._change(["LAYOUT"]);
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "export"
        });

        // TODO: Event options change processing either should be done by the eventTrigger or shouldn't be done at all
        proto._optionChangesMap.onExporting = "EXPORT";
        proto._optionChangesMap.onExported = "EXPORT";
        proto._optionChangesMap.onFileSaving = "EXPORT";
    }
};
