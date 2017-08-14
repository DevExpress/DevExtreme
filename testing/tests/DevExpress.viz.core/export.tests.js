"use strict";

var vizMocks = require("../../helpers/vizMocks.js"),
    exportModule = require("viz/core/export"),
    clientExporter = require("client_exporter");

QUnit.module("Creation", {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ["JPEG"],
            backgroundColor: "#FFFFFF",
            font: {
                size: 16,
                color: "#707070",
                family: "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                cursor: "pointer",
                weight: 200
            },
            button: {
                "default": {
                    color: "#707070",
                    borderColor: "#b6b6b6",
                    backgroundColor: "#f5f5f5"
                },
                hover: {
                    color: "#333",
                    borderColor: "#bebebe",
                    backgroundColor: "#e6e6e6"
                },
                focus: {
                    color: "#000",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#e6e6e6"
                },
                active: {
                    color: "#333",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#d4d4d4"
                }
            },

            shadowColor: "#ababab"
        };
    },
    createExportMenu: function() {
        var exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            svgMethod: this.svgMethod,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test("Groups creation", function(assert) {
    //arrange
    this.createExportMenu();

    //assert
    assert.equal(this.renderer.g.callCount, 5, "Three groups");
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.attr.getCall(0).args[0], { "class": "dx-export-menu" }, "Group css-class");
    assert.deepEqual(this.renderer.g.getCall(1).returnValue.attr.getCall(0).args[0], { "class": "dx-export-menu-button" }, "Button css-class");
    assert.deepEqual(this.renderer.g.getCall(2).returnValue.attr.getCall(0).args[0], { "class": "dx-export-menu-list" }, "List css-class");
    assert.deepEqual(this.renderer.g.getCall(3).returnValue.attr.getCall(0).args[0], { "class": "dx-export-menu-list-item" }, "List item css-class");

    assert.equal(this.renderer.g.getCall(2).returnValue.append.getCall(0).args[0].element,
        this.renderer.g.getCall(0).returnValue.element, "Element list is added to correct Parent");

    assert.equal(this.renderer.g.getCall(3).returnValue.append.getCall(0).args[0],
        this.renderer.g.getCall(2).returnValue);
});

QUnit.test("Button creation", function(assert) {
    //arrange, act
    this.createExportMenu();

    //assert
    assert.deepEqual(this.renderer.rect.getCall(1).args, [0, 0, 35, 35], "Button rect");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], {
        rx: 4,
        ry: 4,
        fill: "#f5f5f5",
        stroke: "#b6b6b6",
        "stroke-width": 1,
        cursor: "pointer"
    }, "Button rect style");
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [[9, 12, 26, 12, 26, 14, 9, 14], [9, 17, 26, 17, 26, 19, 9, 19], [9, 22, 26, 22, 26, 24, 9, 24]], "button icon coords");
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], {
        fill: "#707070",
        cursor: "pointer"
    }, "Button arrow style");
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.data.getCall(0).args[0], {
        "export-element-type": "button"
    }, "Button events data");

    assert.deepEqual(this.renderer.g.getCall(1).returnValue.setTitle.getCall(0).args[0], "Exporting/Printing", "Hint for button");
});

QUnit.test("List creation", function(assert) {
    //arrange, act
    this.options.formats = ["JPEG", "PNG"];
    this.createExportMenu();

    //assert
    //rect
    assert.deepEqual(this.renderer.rect.getCall(0).args, [-85, 39, 120, 0], "List rect");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        "stroke-width": 1,
        cursor: "pointer",
        filter: "shadowFilter.id",
        rx: 4,
        ry: 4
    }, "List rect style");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0], {
        fill: "#f5f5f5",
        stroke: "#b6b6b6",
        height: 90
    }, "List rect style");

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.data.getCall(0).args[0], { "export-element-type": "list" }, "Rect data");
    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.append.lastCall.args[0], this.renderer.g.getCall(2).returnValue);
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).args, ["-50%", "-50%", "200%", "200%", 2, 6, 3], "Rect shadow creating");
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).returnValue.attr.getCall(0).args[0], { opacity: 0.8 }, "Rect shadow set opacity");
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).returnValue.attr.getCall(1).args[0], { color: "#ababab" }, "Rect shadow set Color");

    //separator

    assert.equal(this.renderer.path.getCall(1).args[1], "line", "List separator type");
    assert.deepEqual(this.renderer.path.getCall(1).returnValue.attr.getCall(0).args[0], {
        d: "M -85 68 L 35 68",
        stroke: "#b6b6b6",
        "stroke-width": 1,
        sharp: "v",
        cursor: "pointer"
    }, "List separator style");

    //texts
    assert.equal(this.renderer.text.callCount, 3, "Texts count");

    //printing text
    assert.deepEqual(this.renderer.text.getCall(0).args, ["Print"], "Printing text params");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "font-weight": 200,
        "pointer-events": "none",
        cursor: "pointer"
    }, "Printing text style");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        "x": -70,
        "y": 61,
        align: "left"
    }, "Printing text attributes");
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.data.getCall(0).args[0], {
        "export-element-type": "printing"
    }, "Printing rect events data");

    //JPEG group
    assert.deepEqual(this.renderer.text.getCall(1).args, ["JPEG file"], "JPEG text params");
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "pointer-events": "none",
        "font-weight": 200,
        cursor: "pointer"
    }, "JPEG text style");
    assert.deepEqual(this.renderer.rect.getCall(3).returnValue.data.getCall(0).args[0], {
        "export-element-type": "exporting",
        "export-element-format": "JPEG"
    }, "JPEG rect events data");
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 91,
        align: "left"
    }, "JPEG text attrs");

    //PNG group
    assert.deepEqual(this.renderer.text.getCall(2).args, ["PNG file"], "PNG text params");
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "pointer-events": "none",
        "font-weight": 200,
        cursor: "pointer"
    }, "PNG text style");
    assert.deepEqual(this.renderer.rect.getCall(4).returnValue.data.getCall(0).args[0], {
        "export-element-type": "exporting",
        "export-element-format": "PNG"
    }, "PNG rect events data");
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 121,
        align: "left"
    }, "PNG text attrs");
});

QUnit.test("List creation, without printing", function(assert) {
    //arrange, act
    this.options.printingEnabled = false;
    this.createExportMenu();

    //assert
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        "stroke-width": 1,
        cursor: "pointer",
        filter: "shadowFilter.id",
        rx: 4,
        ry: 4
    }, "list rect style");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0], {
        fill: "#f5f5f5",
        stroke: "#b6b6b6",
        height: 30
    }, "list rect style");

    assert.equal(this.renderer.path.callCount, 1, "paths count");
    assert.equal(this.renderer.text.callCount, 1, "texts count");

    assert.deepEqual(this.renderer.text.getCall(0).args, ["JPEG file"], "jpeg text params");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 61,
        align: "left"
    }, "JPEG text attrs");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "pointer-events": "none",
        "font-weight": 200,
        cursor: "pointer"
    }, "jpeg text style");
});

QUnit.test("List creation, without formats", function(assert) {
    //arrange, act
    this.options.formats = [];
    this.createExportMenu();

    //assert
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0].height, 30, "List rect");
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.css.getCall(0).args[0], {
        cursor: "pointer",
        "pointer-events": "all"
    }, "List rect style");

    assert.equal(this.renderer.path.callCount, 2, "Paths count");
    assert.equal(this.renderer.text.callCount, 1, "Texts count");

    assert.deepEqual(this.renderer.text.getCall(0).args, ["Print"], "Printing text params");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 61,
        align: "left"
    }, "Printing text attributes");

    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "pointer-events": "none",
        "font-weight": 200,
        cursor: "pointer"
    }, "Printing text style");
});

QUnit.test("Without printing and formats", function(assert) {
    //arrange, act
    this.options.formats = [];
    this.options.printingEnabled = false;
    this.createExportMenu();

    //assert
    assert.equal(this.renderer.stub("rect").callCount, 1, "List rect");
    assert.strictEqual(this.renderer.stub("rect").getCall(0).returnValue.stub("append").callCount, 0, "List rect");
    assert.equal(this.renderer.stub("path").callCount, 0, "No paths");
    assert.equal(this.renderer.stub("text").callCount, 0, "No texts");
});

QUnit.test("Enabled options is false", function(assert) {
    //arrange, act
    this.options.enabled = false;
    this.createExportMenu();

    //assert
    assert.equal(this.renderer.stub("rect").callCount, 1, "List rect");
    assert.strictEqual(this.renderer.stub("rect").getCall(0).returnValue.stub("append").callCount, 0, "List rect");
    assert.equal(this.renderer.stub("path").callCount, 0, "No paths");
    assert.equal(this.renderer.stub("text").callCount, 0, "No texts");
});

QUnit.module("API", {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        sinon.stub(clientExporter, "export");
        this.options = {
            printingEnabled: true,
            formats: ["JPEG"],
            enabled: true,
            font: {},

            button: {
                "default": {
                    color: "#707070",
                    borderColor: "#b6b6b6",
                    backgroundColor: "#f5f5f5"
                },
                hover: {
                    color: "#333",
                    borderColor: "#bebebe",
                    backgroundColor: "#e6e6e6"
                },
                focus: {
                    color: "#000",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#e6e6e6"
                },
                active: {
                    color: "#333",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#d4d4d4"
                }
            },
            exportOptions: {
                width: 100,
                height: 200
            }
        };
    },
    afterEach: function() {
        clientExporter.export.restore();
    },
    createExportMenu: function() {
        var exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            svgMethod: this.svgMethod,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test("exportFromMarkup method", function(assert) {
    //arrange
    var options = {
            format: "jpeg",
            proxyUrl: "testUrl",
            width: 600,
            height: 400,
            backgroundColor: "#00ff00",
            onFileSaving: "file saving callback",
            onExporting: "exporting callback",
            onExported: "exported callback"
        },
        markup = "testMarkup";

    //act
    exportModule.exportFromMarkup(markup, options);

    //assert
    assert.equal(clientExporter.export.callCount, 1, "Export was called");
    assert.deepEqual(clientExporter.export.getCall(0).args[0], "testMarkup", "Export data");
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: "JPEG",
        fileName: "file",
        proxyUrl: "testUrl",
        width: 600,
        height: 400,
        backgroundColor: "#00ff00",
        onFileSaving: "file saving callback",
        onExporting: "exporting callback",
        onExported: "exported callback",
        fileSavingAction: "file saving callback",
        exportingAction: "exporting callback",
        exportedAction: "exported callback"
    }, "Export options");
});

QUnit.test("combineWidgets method", function(assert) {
    var createWidget = function(size) {
        return {
            svg: sinon.stub().returns("<svg </svg>"),
            getSize: sinon.stub().returns(size)
        };
    };
    var widgets = exportModule.getMarkup([createWidget({ height: 25, width: 10 }), createWidget({ height: 15, width: 15 })]);

    assert.equal(widgets, "<svg height=\"40\" width=\"15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(0,0)\"  </g><g transform=\"translate(0,25)\"  </g></svg>");
});

QUnit.test("Get layout options", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu(),
        layout;

    //act
    layout = exportMenu.getLayoutOptions();

    //assert
    assert.deepEqual(layout, {
        cutLayoutSide: "top",
        cutSide: "vertical",
        height: 20,
        width: 20,
        x: 1,
        y: 2,
        horizontalAlignment: "right",
        position: {
            horizontal: "right",
            vertical: "top"
        },
        verticalAlignment: "top"
    }, "layout options");
    assert.equal(this.renderer.g.getCall(1).returnValue.getBBox.callCount, 1, "getBBox is called");
});

QUnit.test("Draw", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.draw(100, 60, { width: 30, height: 30, left: 50 });

    //assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.getCall(0).args, [110, 12], "group moving");
});

QUnit.test("Shift", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    this.renderer.g.getCall(0).returnValue.attr.reset();

    //act
    exportMenu.shift(10, 20);

    //assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.attr.getCall(1).args[0], { translateY: 20 }, "y shifting");
});

QUnit.test("Hide", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.hide();

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1, "link is removed");
});

QUnit.test("Show", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.show();

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkAppend.callCount, 2, "link is appended");
});

QUnit.test("Set options", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    this.renderer.rect.reset();
    this.renderer.text.reset();
    this.renderer.path.reset();

    //act
    exportMenu.setOptions({
        enabled: true,
        formats: ["png", "abc"],
        printingEnabled: false,
        font: {
            size: 16,
            color: "#707070",
            cursor: "pointer",
            family: "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            weight: 200
        },
        button: {
            "default": {
                color: "#707070",
                borderColor: "#b6b6b6",
                backgroundColor: "#f5f5f5"
            },
            hover: {
                color: "#333",
                borderColor: "#bebebe",
                backgroundColor: "#e6e6e6"
            },
            focus: {
                color: "#000",
                borderColor: "#9d9d9d",
                backgroundColor: "#e6e6e6"
            },
            active: {
                color: "#333",
                borderColor: "#9d9d9d",
                backgroundColor: "#d4d4d4"
            }
        },
        backgroundColor: "#f5f5f5",
        menuButtonColor: "#f5f5f5",
        borderColor: "#b6b6b6"
    });

    //assert
    var listGroup = this.renderer.g.getCall(2).returnValue;

    assert.equal(listGroup.clear.callCount, 2, "clearing");
    assert.equal(this.renderer.rect.callCount, 1, "rect");
    assert.equal(this.renderer.path.callCount, 0, "path");
    assert.equal(this.renderer.text.callCount, 1, "text");

    assert.deepEqual(this.renderer.rect.getCall(0).args, [], "List rect");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        height: 30,
        width: 118,
        x: -84,
        y: 39
    }, "List rect attributes");

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.css.getCall(0).args[0], {
        "pointer-events": "all",
        cursor: "pointer"
    }, "List rect style");

    assert.deepEqual(this.renderer.text.getCall(0).args, ["PNG file"], "PNG text params");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        "x": -70,
        "y": 61,
        align: "left"
    }, "PNG text attributes");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        "font-size": 16,
        "font-family": "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        fill: "#707070",
        "pointer-events": "none",
        "font-weight": 200,
        cursor: "pointer"
    }, "PNG text style");
});

QUnit.test("Dispose", function(assert) {
    //assert
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.dispose();

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.dispose.callCount, 1, "Group dispose was called");
    assert.equal(this.renderer.shadowFilter.getCall(0).returnValue.dispose.callCount, 1, "Shadow filter dispose was called");
});

QUnit.module("Events", {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        sinon.stub(clientExporter, "export");

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ["JPEG"],
            font: {},
            backgroundColor: "#001122",
            button: {
                "default": {
                    color: "#707070",
                    borderColor: "#b6b6b6",
                    backgroundColor: "#123456"
                },
                hover: {
                    color: "#333",
                    borderColor: "#bebebe",
                    backgroundColor: "#e6e6e6"
                },
                focus: {
                    color: "#000",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#e6e6e6"
                },
                active: {
                    color: "#333",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#d4d4d4"
                }
            },
            exportOptions: {}
        };
    },
    afterEach: function() {
        clientExporter.export.restore();
    },
    createExportMenu: function() {
        var exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            svgMethod: this.svgMethod,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test("'On' subscribe", function(assert) {
    //assert, act
    this.createExportMenu();

    //assert
    assert.equal(this.renderer.root.on.callCount, 1, "one subscribe");
    assert.equal(this.renderer.root.on.getCall(0).args[0], "dxpointerup.export", "event name");
    assert.ok(this.renderer.root.on.getCall(0).args[1], "event handler");

    assert.equal(this.renderer.rect.getCall(2).returnValue.on.callCount, 2, "menu item subscribe count");
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(0).args[0], "dxhoverstart.export", "menu item subscribe hover start");
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(1).args[0], "dxhoverend.export", "menu item subscribe hover end");
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(1).args[0], "dxhoverend.export", "menu item subscribe hover end");
    assert.equal(this.renderer.g.getCall(1).returnValue.on.getCall(2).args[0], "dxpointerdown.export", "button subscribe mousedown end");

    assert.equal(this.renderer.g.getCall(2).returnValue.on.callCount, 1, "list subscribing");
    assert.equal(this.renderer.g.getCall(1).returnValue.on.callCount, 3, "button subscribing");
});

QUnit.test("'Off' unsubscribe", function(assert) {
    //assert
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.dispose();

    //assert
    assert.equal(this.renderer.root.off.callCount, 1, "one unsubscribe");
    assert.equal(this.renderer.root.off.getCall(0).args[0], ".export", "event name");
    assert.equal(this.renderer.g.getCall(1).returnValue.off.callCount, 1, "off for button");
    assert.equal(this.renderer.g.getCall(2).returnValue.off.callCount, 1, "off for list");
});

QUnit.test("Button hover", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.reset();

    //act
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#e6e6e6", stroke: "#bebebe" }, "hovered button");
});

QUnit.test("Button mousedown", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.reset();
    //act
    this.renderer.g.getCall(1).returnValue.on.getCall(2).args[1]({ target: { "export-element-type": "button" } });
    //assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#d4d4d4", stroke: "#9d9d9d" }, "Button set active state");
});

QUnit.test("Button unhover", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.reset();

    //act
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.g.getCall(1).returnValue.on.getCall(1).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(1).args[0], { fill: "#123456", stroke: "#b6b6b6" }, "unhovered button");
});

QUnit.test("menuItem hover", function(assert) {
    //assert
    this.createExportMenu();
    var menuItemRect = this.renderer.rect.getCall(2).returnValue;

    menuItemRect.attr.reset();

    //act
    menuItemRect.on.getCall(0).args[1]();

    //assert
    assert.deepEqual(menuItemRect.attr.getCall(0).args[0], { fill: "#e6e6e6" }, "Menu item hovered");
});

QUnit.test("menuItem unhover", function(assert) {
    //assert
    this.createExportMenu();
    var menuItemRect = this.renderer.rect.getCall(2).returnValue;

    menuItemRect.attr.reset();

    //act
    menuItemRect.on.getCall(0).args[1]();
    menuItemRect.on.getCall(1).args[1]();

    //assert
    assert.deepEqual(menuItemRect.attr.getCall(0).args[0], { fill: "#e6e6e6" }, "Menu item unhovered");
    assert.deepEqual(menuItemRect.attr.getCall(1).args[0], { fill: null }, "Menu item unhovered");
});

QUnit.test("Button hover when button is selected", function(assert) {
    //assert
    this.createExportMenu();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(1).returnValue.attr.reset();
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.equal(this.renderer.rect.getCall(1).returnValue.attr.callCount, 1, "non-hovered but selected button");
});

QUnit.test("Button unhover when button is selected", function(assert) {
    //assert
    this.createExportMenu();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(1).returnValue.attr.reset();
    this.renderer.g.getCall(1).returnValue.on.getCall(1).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.equal(this.renderer.rect.getCall(1).returnValue.attr.callCount, 1, "non-hovered but selected button");
});

QUnit.test("List opening", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.reset();
    this.renderer.rect.getCall(1).returnValue.attr.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.equal(this.renderer.g.getCall(2).returnValue.append.callCount, 2, "showing call count");
    assert.deepEqual(this.renderer.g.getCall(2).returnValue.append.getCall(0).args[0], this.renderer.g.getCall(2).returnValue.append.getCall(1).args[0], "visible list");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#e6e6e6", stroke: "#9d9d9d" }, "selected button has focused state style");
});

QUnit.test("List closing by menu button", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.reset();
    this.renderer.rect.getCall(1).returnValue.attr.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, "showing call count");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(1).args[0], { fill: "#123456", stroke: "#b6b6b6" }, "unselected button has default state style");
});

QUnit.test("List closing by any place", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(1).returnValue.attr.reset();
    this.renderer.root.on.getCall(0).args[1]({ target: {} });

    //assert
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, "showing call count");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#123456", stroke: "#b6b6b6" }, "unselected button");
});

QUnit.test("List isn't closing by click on list", function(assert) {
    //assert
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "list" } });

    //assert
    assert.equal(this.renderer.g.getCall(2).returnValue.append.callCount, 2, "Appending call count");
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 1, "Removing call count");
});

QUnit.test("Exporting by click on format text", function(assert) {
    //assert
    this.svgMethod = sinon.stub(),
    this.svgMethod.returns("svgMarkup");

    var exportMenu = this.createExportMenu();
    exportMenu.draw(50, 50, { width: 15, height: 25 });

    this.renderer.g.getCall(2).returnValue.attr.reset();
    this.renderer.g.getCall(0).returnValue.linkAppend.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(1).returnValue.attr.reset();
    this.renderer.root.on.getCall(0).args[1]({
        target: {
            "export-element-type": "exporting",
            "export-element-format": "JPEG"
        }
    });

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1, "common group was removed");
    assert.equal(this.renderer.g.getCall(0).returnValue.linkAppend.callCount, 1, "common group was appended");

    assert.equal(this.svgMethod.callCount, 1, "svg method was called");

    assert.equal(clientExporter.export.callCount, 1, "export was called");
    assert.equal(clientExporter.export.getCall(0).args[0], "svgMarkup", "export svg data");
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: "JPEG",
        width: 15,
        height: 25
    }, "export args");
    assert.ok(clientExporter.export.getCall(0).args[2], "export getBlob method");

    assert.deepEqual(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, "list is closed");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#123456", stroke: "#b6b6b6" }, "unselected button");
});

QUnit.test("Hide menu on export before getting markup", function(assert) {
    //assert
    this.svgMethod = sinon.stub(),
    this.svgMethod.returns("svgMarkup");

    var exportMenu = this.createExportMenu();
    exportMenu.draw(50, 50, { width: 15, height: 25 });

    this.renderer.g.getCall(2).returnValue.attr.reset();
    this.renderer.g.getCall(0).returnValue.linkAppend.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(0).returnValue.attr.reset();
    this.renderer.root.on.getCall(0).args[1]({
        target: {
            "export-element-type": "exporting",
            "export-element-format": "JPEG"
        }
    });

    //assert
    assert.ok(this.svgMethod.lastCall.calledAfter(this.renderer.g.getCall(0).returnValue.linkRemove.lastCall));
    assert.ok(this.svgMethod.lastCall.calledBefore(this.renderer.g.getCall(0).returnValue.linkAppend.lastCall));
});

QUnit.test("Open list after exporting - previously clicked item is unhovered. T511729", function(assert) {
    //assert
    this.svgMethod = sinon.stub(),
    this.svgMethod.returns("svgMarkup");

    var exportMenu = this.createExportMenu();
    exportMenu.draw(50, 50, { width: 15, height: 25 });

    var menuItemRect = this.renderer.rect.getCall(2).returnValue;
    menuItemRect.attr.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    menuItemRect.on.getCall(0).args[1]();
    this.renderer.root.on.getCall(0).args[1]({
        target: {
            "export-element-type": "exporting",
            "export-element-format": "JPEG"
        }
    });
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });

    //assert
    assert.deepEqual(menuItemRect.attr.callCount, 2);
    assert.deepEqual(menuItemRect.attr.lastCall.args[0], { fill: null }, "Menu item unhovered");
});

QUnit.test("Printing by menu", function(assert) {
    //assert
    var exportMenu,
        svgNode = { style: {} },
        docStub = {
            open: sinon.stub(),
            write: sinon.stub(),
            close: sinon.stub(),
            body: { getElementsByTagName: sinon.stub().withArgs("svg").returns([svgNode]) }
        },
        printStub = sinon.stub(),
        closeStub = sinon.stub();

    this.svgMethod = sinon.stub();
    this.svgMethod.returns("svgMarkup");
    sinon.stub(window, "open", function() {
        return {
            document: docStub,
            print: printStub,
            close: closeStub
        };
    });

    exportMenu = this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.reset();
    this.renderer.g.getCall(0).returnValue.linkAppend.reset();

    //act
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "button" } });
    this.renderer.rect.getCall(1).returnValue.attr.reset();
    this.renderer.root.on.getCall(0).args[1]({ target: { "export-element-type": "printing" } });

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1, "common group was removed");
    assert.equal(this.renderer.g.getCall(0).returnValue.linkAppend.callCount, 1, "common group was appended");

    assert.equal(this.svgMethod.callCount, 1, "svg method was called");

    assert.deepEqual(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, "list is closed");
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#123456", stroke: "#b6b6b6" }, "unselected button");

    assert.equal(docStub.open.callCount, 1, "open doc");
    assert.equal(docStub.write.callCount, 1, "write doc");
    assert.equal(docStub.write.getCall(0).args[0], "svgMarkup", "write doc args");
    assert.deepEqual(svgNode.style, { backgroundColor: "#001122" });
    assert.equal(printStub.callCount, 1, "print doc");
    assert.equal(closeStub.callCount, 1, "close doc");

    window.open.restore();
});

// T397838
QUnit.test("Localization", function(assert) {
    //assert
    var exportMenu,
        localization = require("localization");

    localization.loadMessages({
        it: {
            "vizExport-printingButtonText": "Stampa",
            "vizExport-exportButtonText": "{0} formato",
            "vizExport-titleMenuText": "Esportazione / stampa"
        }
    });

    this.options.formats = ["PNG"];

    localization.locale('it');
    exportMenu = this.createExportMenu();

    assert.deepEqual(this.renderer.text.getCall(0).args, ["Stampa"], "Printing button text");
    assert.deepEqual(this.renderer.text.getCall(1).args, ["PNG formato"], "Export button text");
    assert.deepEqual(this.renderer.g.getCall(1).returnValue.setTitle.getCall(0).args, ["Esportazione / stampa"], "Export menu button title text");

});

QUnit.module("Layout", {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.incidentOccurred = sinon.spy();

        sinon.stub(clientExporter, "export");

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ["JPEG"],
            font: {},
            button: {
                "default": {
                    color: "#707070",
                    borderColor: "#b6b6b6",
                    backgroundColor: "#123456"
                },
                hover: {
                    color: "#333",
                    borderColor: "#bebebe",
                    backgroundColor: "#e6e6e6"
                },
                focus: {
                    color: "#000",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#e6e6e6"
                },
                active: {
                    color: "#333",
                    borderColor: "#9d9d9d",
                    backgroundColor: "#d4d4d4"
                }
            },
            exportOptions: {}
        };
    },
    afterEach: function() {
        clientExporter.export.restore();
    },
    createExportMenu: function() {
        var exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            svgMethod: this.svgMethod,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test("Menu is hidden if there is no enough space", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.attr.lastCall.args[0].visibility, "hidden");
});

QUnit.test("freeSpace", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();
    exportMenu.draw(100, 200, { width: 30, height: 30 });

    //act
    exportMenu.freeSpace();

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue.attr.lastCall.args[0].visibility, "hidden");
});

QUnit.test("Return empty layout options if was hidden due to small container", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    //act
    var layout = exportMenu.getLayoutOptions();

    //assert
    assert.deepEqual(layout, { width: 0, height: 0 });
});

QUnit.test("Send warning message if was hidden due to small container", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();

    //act
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    //assert
    assert.ok(this.incidentOccurred.calledWith("W2107"));
});

QUnit.test("Menu is hidden first time and shown if container gets bigger", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    //act
    exportMenu.probeDraw(100, 60, { width: 30, height: 30 });
    exportMenu.draw(100, 60, { width: 30, height: 30 });

    //assert
    assert.equal(this.renderer.g.getCall(0).returnValue._stored_settings.visibility, null);
});

QUnit.test("Return real layout options if container gets bigger", function(assert) {
    //arrange
    var exportMenu = this.createExportMenu();
    exportMenu.draw(10, 20, { width: 30, height: 30 });
    exportMenu.probeDraw(100, 60, { width: 30, height: 30 });
    exportMenu.draw(100, 60, { width: 30, height: 30 });

    //act
    var layout = exportMenu.getLayoutOptions();

    //assert
    assert.deepEqual(layout, {
        cutLayoutSide: "top",
        cutSide: "vertical",
        height: 20,
        width: 20,
        x: 1,
        y: 2,
        horizontalAlignment: "right",
        position: {
            horizontal: "right",
            vertical: "top"
        },
        verticalAlignment: "top"
    });
});
