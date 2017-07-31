"use strict";

/* global DevExpress, jQuery */

var $ = jQuery,
    eventsEngine = require("./events/core/events_engine"),
    iteratorUtils = require("./core/utils/iterator"),
    BaseWidget = DevExpress.viz.BaseWidget,
    registerComponent = DevExpress.registerComponent,
    DOMComponent = DevExpress.DOMComponent;

var FILE = "file",
    ICON_TO = "exportTo",
    ICON_PRINT = "print",
    FORMATS_EXPORT = ["PDF", "PNG", "SVG"],
    FORMATS_SUPPORTS = ["JPEG", "GIF"].concat(FORMATS_EXPORT);

function normalizeHtml(html) {
    var re = /xmlns="[\s\S]*?"/gi,
        first = true;

    html = html.replace(re, function(match) {
        if(!first) return "";
        first = false;
        return match;
    });

    return html.replace(/xmlns:NS1="[\s\S]*?"/gi, "")
        .replace(/NS1:xmlns:xlink="([\s\S]*?)"/gi, 'xmlns:xlink="$1"');
}

var Exporter = DOMComponent.inherit({

    _killTracker: BaseWidget.prototype._killTracker,

    _getSvgElements: function() {
        var that = this,
            svgArray = [];

        $(that.getSourceContainer()).find("svg").each(function(i) {
            svgArray[i] = normalizeHtml($(this).clone().wrap("<div></div>").parent().html());
        });

        return JSON.stringify(svgArray);
    },

    _appendTextArea: function(name, value, rootElement) {
        $("<textarea/>", {
            id: name,
            name: name,
            val: value
        }).appendTo(rootElement);
    },

    _formSubmit: function($form) {
        eventsEngine.trigger($form, "submit");
        $form.remove();

        ///#DEBUG
        return eventsEngine.trigger($form, "submit");
        ///#ENDDEBUG
    },

    _getDefaultOptions: function() {
        return $.extend(this.callBase(), {
            redrawOnResize: false,
            menuAlign: 'right',
            exportFormat: FORMATS_EXPORT,
            printingEnabled: true,
            fileName: FILE,
            showMenu: true
        });
    },

    _createWindow: function() {
        return window.open('', 'printDiv', '');
    },

    _createExportItems: function(exportFormat) {
        var that = this;

        return iteratorUtils.map(exportFormat, function(value) {
            value = value.toUpperCase();
            if(that.getSourceContainer().find("svg").length > 1 && value === "SVG") {
                return null;
            }
            if($.inArray(value.toUpperCase(), FORMATS_SUPPORTS) === -1) {
                return null;
            }
            return { name: value, text: value + ' ' + FILE };
        });
    },

    _render: function() {
        var that = this,
            fileName = that.option('fileName'),
            exportItems = that._createExportItems(that.option('exportFormat')),
            container = $('<div />'),
            rootItems = [{
                name: 'export',
                icon: ICON_TO,
                items: exportItems
            }],
            options = {
                items: rootItems,
                onItemClick: function(properties) {
                    switch(properties.itemData.name) {
                        case 'print':
                            that.print();
                            break;
                        case 'export':
                            break;
                        default:
                            that.exportTo(fileName, properties.itemData.name);
                    }
                }
            };
        if(that.option('showMenu')) {
            that.option('printingEnabled') && rootItems.push({
                icon: ICON_PRINT,
                name: 'print', click: function() {
                    that.print();
                }
            });
            container.dxMenu(options);
            that._$element.empty();
            that._$element.append(container);
            ///#DEBUG
            return options;
            ///#ENDDEBUG
        }
    },

    _exportSVG: function(fileName, format, $sourceContainer) {
        var form = $("<form/>", {
                method: "POST",
                action: this.option('serverUrl'),
                enctype: "application/x-www-form-urlencoded",
                target: "_self",
                css: {
                    "display": "none",
                    "visibility": "hidden"
                }
            }),
            svgElements = this._getSvgElements();

        this._appendTextArea("exportContent", $sourceContainer.clone().wrap("<div></div>").parent().html(), form);
        this._appendTextArea("svgElements", svgElements, form);
        this._appendTextArea("fileName", fileName, form);
        this._appendTextArea("format", format.toLowerCase(), form);
        this._appendTextArea("width", $sourceContainer.width(), form);
        this._appendTextArea("height", $sourceContainer.height(), form);
        this._appendTextArea("url", window.location.host, form);

        $(document.body).append(form);

        ///#DEBUG
        this._testForm = form;
        ///#ENDDEBUG

        this._formSubmit(form);
    },

    getSourceContainer: function() {
        return $(this.option('sourceContainer'));
    },

    print: function() {
        var $sourceContainer = this.getSourceContainer().html(),
            printWindow = this._createWindow();

        if(!printWindow) return;

        $(printWindow.document.body).html($sourceContainer);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    },

    exportTo: function(fileName, format) {
        var that = this,
            $sourceContainer = that.getSourceContainer();

        if($sourceContainer.find("svg").length) {
            that._exportSVG(fileName, format, $sourceContainer);
        }
    }
});

registerComponent("dxExporter", Exporter);
DevExpress.exporter = {
    dxExporter: Exporter
};
