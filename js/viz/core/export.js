"use strict";

var extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    patchFontOptions = require("./utils").patchFontOptions,
    _extend = extend,

    clientExporter = require("../../client_exporter"),
    messageLocalization = require("../../localization/message"),
    imageExporter = clientExporter.image,
    svgExporter = clientExporter.svg,
    pdfExporter = clientExporter.pdf,

    hoverEvent = require("../../events/hover"),
    pointerEvents = require("../../events/pointer"),
    pointerActions = [pointerEvents.down, pointerEvents.move].join(" "),

    BUTTON_SIZE = 35,
    ICON_COORDS = [[9, 12, 26, 12, 26, 14, 9, 14], [9, 17, 26, 17, 26, 19, 9, 19], [9, 22, 26, 22, 26, 24, 9, 24]],

    LIST_PADDING_TOP = 4,
    LIST_WIDTH = 120,
    VERTICAL_TEXT_MARGIN = 8,
    HORIZONTAL_TEXT_MARGIN = 15,
    MENU_ITEM_HEIGHT = 30,
    LIST_STROKE_WIDTH = 1,
    MARGIN = 10,
    SHADOW_OFFSET = 2,
    SHADOW_BLUR = 3,

    ALLOWED_EXPORT_FORMATS = ["PNG", "PDF", "JPEG", "SVG", "GIF"],
    EXPORT_CSS_CLASS = "dx-export-menu",

    EXPORT_DATA_KEY = "export-element-type",
    FORMAT_DATA_KEY = "export-element-format";

function validateFormat(format) {
    var validatedFormat = String(format).toUpperCase();

    if(inArray(validatedFormat, ALLOWED_EXPORT_FORMATS) !== -1) {
        return validatedFormat;
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

function doExport(menu, markup, options) {
    menu && menu.hide();
    clientExporter.export(markup(), options, getCreatorFunc(options.format));
    menu && menu.show();
}

function print(data, backgroundColor) {
    var vizWindow = window.open(),
        svg;

    if(!vizWindow) {
        return;
    }

    vizWindow.document.open();
    vizWindow.document.write(data);
    vizWindow.document.close();
    svg = vizWindow.document.body.getElementsByTagName("svg")[0];
    svg && (svg.style.backgroundColor = backgroundColor);
    vizWindow.print();

    vizWindow.close();
}

function getItemAttributes(options, type, itemIndex) {
    var path,
        attr = {},
        x = BUTTON_SIZE - LIST_WIDTH,
        y = BUTTON_SIZE + LIST_PADDING_TOP + itemIndex * MENU_ITEM_HEIGHT;

    attr.rect = {
        width: LIST_WIDTH - LIST_STROKE_WIDTH * 2,
        height: MENU_ITEM_HEIGHT,
        x: x + LIST_STROKE_WIDTH,
        y: y
    };
    attr.text = {
        x: x + HORIZONTAL_TEXT_MARGIN,
        y: y + MENU_ITEM_HEIGHT - VERTICAL_TEXT_MARGIN,
        align: "left"
    };

    if(type === "printing") {
        path = "M " + x + " " + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH) + " " +
                   "L " + (x + LIST_WIDTH) + " " + (y + MENU_ITEM_HEIGHT - LIST_STROKE_WIDTH);

        attr.separator = {
            stroke: options.button.default.borderColor,
            "stroke-width": LIST_STROKE_WIDTH,
            cursor: "pointer",
            sharp: "v",
            d: path
        };
    }

    return attr;
}

function createMenuItem(renderer, options, settings) {
    var itemData = {},
        menuItem,
        type = settings.type,
        format = settings.format,
        attr = getItemAttributes(options, type, settings.itemIndex),
        fontStyle = patchFontOptions(options.font),
        rect = renderer.rect(),
        text = renderer.text(settings.text);
    fontStyle["pointer-events"] = "none";

    menuItem = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-list-item" });

    itemData[EXPORT_DATA_KEY] = type;
    if(format) {
        itemData[FORMAT_DATA_KEY] = format;
    }

    rect.attr(attr.rect).
        css({
            cursor: "pointer",
            "pointer-events": "all"
        }).
        data(itemData);

    rect.on(hoverEvent.start + ".export", function() { rect.attr({ fill: options.button.hover.backgroundColor }); })
        .on(hoverEvent.end + ".export", function() { rect.attr({ fill: null }); });

    rect.append(menuItem);

    text.css(fontStyle).
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
        resetState: function() {
            rect.attr({ fill: null });
        }
    };
}

function createMenuItems(renderer, options) {
    var formats = options.formats,
        items = [];

    if(options.printingEnabled) {
        items.push(createMenuItem(renderer, options, {
            type: "printing",
            text: messageLocalization.format("vizExport-printingButtonText"),
            itemIndex: items.length
        }));
    }

    items = formats.reduce(function(r, format) {
        format = validateFormat(format);

        if(format) {
            r.push(createMenuItem(renderer, options, {
                type: "exporting",
                text: messageLocalization.getFormatter("vizExport-exportButtonText")(format),
                format: format,
                itemIndex: r.length
            }));
        }

        return r;
    }, items);

    return items;
}

exports.exportFromMarkup = function(markup, options) {
    options.format = validateFormat(options.format) || "PNG";
    options.fileName = options.fileName || "file";

    options.onExporting && (options.exportingAction = options.onExporting);
    options.onExported && (options.exportedAction = options.onExported);
    options.onFileSaving && (options.fileSavingAction = options.onFileSaving);

    clientExporter.export(markup, options, getCreatorFunc(options.format));
};

exports.getMarkup = function(widgets) {
    var svgArr = [],
        height = 0,
        width = 0;

    widgets.forEach(function(widget) {
        var size = widget.getSize();
        svgArr.push(widget.svg().replace('<svg', '<g transform="translate(0,' + height + ')" ').replace('</svg>', '</g>'));
        height += size.height;
        width = Math.max(width, size.width);
    });
    return '<svg height="' + height + '" width="' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>';
};

exports.ExportMenu = function(params) {
    var that = this,
        renderer = that._renderer = params.renderer;
    that._incidentOccurred = params.incidentOccurred;
    that._svgMethod = params.svgMethod;

    that._shadow = renderer.shadowFilter("-50%", "-50%", "200%", "200%", SHADOW_OFFSET, 6, SHADOW_BLUR);
    that._shadow.attr({ opacity: 0.8 });
    that._group = renderer.g().attr({ "class": EXPORT_CSS_CLASS }).linkOn(renderer.root, { name: "export-menu", after: "peripheral" });
    that._buttonGroup = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-button" }).append(that._group);
    that._listGroup = renderer.g().attr({ "class": EXPORT_CSS_CLASS + "-list" }).append(that._group);

    that._overlay = renderer.rect(-LIST_WIDTH + BUTTON_SIZE, BUTTON_SIZE + LIST_PADDING_TOP, LIST_WIDTH, 0);
    that._overlay.attr({
        "stroke-width": LIST_STROKE_WIDTH,
        cursor: "pointer",
        rx: 4,
        ry: 4,
        filter: that._shadow.id
    });
    that._overlay.data({ "export-element-type": "list" });

    that._subscribeEvents();
};

_extend(exports.ExportMenu.prototype, {

    getLayoutOptions: function() {
        if(this._hiddenDueToLayout) {
            return { width: 0, height: 0 };
        }
        var bBox = this._buttonGroup.getBBox();

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

    probeDraw: function() {
        this._hiddenDueToLayout = false;
        this.show();
    },

    shift: function(_, y) {
        this._group.attr({ translateY: this._group.attr("translateY") + y });
    },

    draw: function(width, height, canvas) {
        var layoutOptions;
        this._options.exportOptions.width = canvas.width;
        this._options.exportOptions.height = canvas.height;
        this._group.move(width - BUTTON_SIZE - SHADOW_OFFSET - SHADOW_BLUR + canvas.left, Math.floor(height / 2 - BUTTON_SIZE / 2));

        layoutOptions = this.getLayoutOptions();
        if(layoutOptions.width > width || layoutOptions.height > height) {
            this._incidentOccurred("W2107");
            this._hiddenDueToLayout = true;
            this.hide();
        }

        return this;
    },

    show: function() {
        !this._hiddenDueToLayout && this._group.linkAppend();
    },

    hide: function() {
        this._group.linkRemove();
    },

    setOptions: function(options) {
        this._options = options;

        options.formats = options.formats || ALLOWED_EXPORT_FORMATS;
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

    dispose: function() {
        var that = this;

        that._unsubscribeEvents();

        that._group.linkRemove().linkOff();
        that._group.dispose();
        that._shadow.dispose();

        that._shadow = that._group = that._listGroup = that._buttonGroup = that._button = null;
        that._options = null;
    },

    // BaseWidget_layout_implementation
    layoutOptions: function() {
        var options = this._options;
        return options.enabled && { horizontalAlignment: "right", verticalAlignment: "top", weak: true };
    },

    measure: function() {
        return [BUTTON_SIZE + SHADOW_OFFSET, BUTTON_SIZE];
    },

    move: function(rect) {
        this._group.attr({ translateX: Math.round(rect[0]), translateY: Math.round(rect[1]) });
    },
    // BaseWidget_layout_implementation

    _hideList: function() {
        this._listGroup.remove();
        this._listShown = false;
        this._setButtonState("default");
        this._menuItems.forEach(function(item) {
            item.resetState();
        });
    },

    _showList: function() {
        this._listGroup.append(this._group);
        this._listShown = true;
    },

    _setButtonState: function(state) {
        var that = this,
            style = that._options.button[state];

        this._button.attr({
            stroke: style.borderColor,
            fill: style.backgroundColor
        });

        this._icon.attr({ fill: style.color });
    },

    _subscribeEvents: function() {
        var that = this;

        that._renderer.root.on(pointerEvents.up + ".export", function(e) {
            var elementType = e.target[EXPORT_DATA_KEY],
                exportOptions,
                options = that._options;

            if(!elementType) {
                if(that._button) {
                    that._hideList();
                }
                return;
            }

            if(elementType === "button") {
                if(that._listShown) {
                    that._setButtonState("default");
                    that._hideList();
                } else {
                    that._setButtonState("focus");
                    that._showList();
                }
            } else if(elementType === "printing") {
                that.hide();

                print(that._svgMethod(), options.backgroundColor);

                that.show();
                that._hideList();
            } else if(elementType === "exporting") {
                exportOptions = _extend({}, options.exportOptions, { format: e.target[FORMAT_DATA_KEY] });
                doExport(that, function() { return that._svgMethod(); }, exportOptions);
                that._hideList();
            }
        });

        that._listGroup.on(pointerActions, function(e) { e.stopPropagation(); });

        that._buttonGroup.on(pointerEvents.enter, function() {
            that._setButtonState("hover");
        });
        that._buttonGroup.on(pointerEvents.leave, function() {
            that._setButtonState(that._listShown ? "focus" : "default");
        });
        that._buttonGroup.on(pointerEvents.down + ".export", function() {
            that._setButtonState("active");
        });
    },

    _unsubscribeEvents: function() {
        this._renderer.root.off(".export");
        this._listGroup.off();
        this._buttonGroup.off();
    },

    _updateButton: function() {
        var that = this,
            renderer = that._renderer,
            options = that._options,
            iconAttr = {
                fill: options.button.default.color,
                cursor: "pointer"
            },
            exportData = { "export-element-type": "button" };

        if(!that._button) {
            that._button = renderer.rect(0, 0, BUTTON_SIZE, BUTTON_SIZE).append(that._buttonGroup);
            that._button.attr({
                rx: 4,
                ry: 4,
                fill: options.button.default.backgroundColor,
                stroke: options.button.default.borderColor,
                "stroke-width": 1,
                cursor: "pointer"
            });
            that._button.data(exportData);

            that._icon = renderer.path(ICON_COORDS).append(that._buttonGroup);
            that._icon.attr(iconAttr);
            that._icon.data(exportData);

            that._buttonGroup.setTitle(messageLocalization.format("vizExport-titleMenuText"));
        }
    },

    _updateList: function() {
        var that = this,
            options = that._options,
            buttonDefault = options.button.default,
            listGroup = that._listGroup,
            items = createMenuItems(that._renderer, options);

        that._shadow.attr({
            color: options.shadowColor
        });

        that._overlay.attr({
            height: items.length * MENU_ITEM_HEIGHT,
            fill: buttonDefault.backgroundColor,
            stroke: buttonDefault.borderColor
        });

        listGroup.clear();
        that._overlay.append(listGroup);
        items.forEach(function(item) {
            item.g.append(listGroup);
        });

        that._menuItems = items;
    }
});

// BaseWidget.js
function getExportOptions(widget, exportOptions, fileName, format) {
    return {
        format: validateFormat(format || exportOptions.format) || "PNG",
        fileName: fileName || exportOptions.fileName || "file",
        proxyUrl: exportOptions.proxyUrl,
        backgroundColor: exportOptions.backgroundColor,
        width: widget._canvas.width,
        height: widget._canvas.height,
        exportingAction: widget._createActionByOption("onExporting"),
        exportedAction: widget._createActionByOption("onExported"),
        fileSavingAction: widget._createActionByOption("onFileSaving")
    };
}

exports.plugin = {
    name: "export",
    init: function() {
        var that = this;
        that._exportMenu = new exports.ExportMenu({
            renderer: that._renderer,
            svgMethod: function() { return that.svg(); },
            incidentOccurred: that._incidentOccurred
        });
        that._layout.add(that._exportMenu);
    },
    dispose: function() {
        this._exportMenu.dispose();
        this._exportMenu = null;
    },
    members: {
        _getExportMenuOptions: function() {
            var userOptions = this._getOption("export") || {},
                options = getExportOptions(this, userOptions);

            return _extend({}, userOptions, { exportOptions: options });
        },
        exportTo: function(fileName, format) {
            var that = this,
                exportOptions = getExportOptions(that, that._getOption("export") || {}, fileName, format);

            doExport(that._exportMenu, function() { return that.svg(); }, exportOptions);
        },
        print: function() {
            print(this.svg(), this._getOption("export").backgroundColor);
        }
    },
    customize: function(constructor) {
        var proto = constructor.prototype;

        constructor.addChange({
            code: "EXPORT",
            handler: function() {
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
