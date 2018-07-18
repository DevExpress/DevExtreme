"use strict";

var $ = require("jquery"),
    devices = require("core/devices"),
    fx = require("animation/fx"),
    viewPort = require("core/utils/view_port").value,
    pointerMock = require("../../helpers/pointerMock.js"),
    config = require("core/config"),
    isRenderer = require("core/utils/type").isRenderer,
    executeAsyncMock = require("../../helpers/executeAsyncMock.js");

require("common.css!");
require("ui/popup");

QUnit.testStart(function() {
    var markup =
        '<style>\
            html, body {\
                height: 100%;\
                margin: 0;\
            }\
            \
            #qunit-fixture {\
                width: 100%;\
                height: 100%;\
            }\
        </style>\
        \
        <div id="popup"></div>\
        \
        <div id="popupWithAnonymousTmpl">\
            <div class="testContent">TestContent</div>\
        </div>\
        \
        <div id="popupWithContentTmpl">\
            <div data-options="dxTemplate: { name: \'content\'}">\
                <div class="testContent">testContent</div>\
            </div>\
        </div>\
        \
        <div id="popupWithTitleAndContentTmpl">\
            <div data-options="dxTemplate: { name: \'title\'}">\
                <div class="testTitle">testTitle</div>\
            </div>\
            <div data-options="dxTemplate: { name: \'content\'}">\
                <div class="testContent">testContent</div>\
            </div>\
        </div>\
        \
        <div id="popupWithTitleTemplate">\
            <div data-options="dxTemplate: { name: \'customTitle\' }">testTitle</div>\
            <div data-options="dxTemplate: { name: \'content\' }"></div>\
        </div>\
        \
        <div id="popupWithCustomAndContentTemplate">\
            <div data-options="dxTemplate: { name: \'custom\' }">\
                TestContent\
            </div>\
            <div data-options="dxTemplate: { name: \'content\' }">\
                WrongContent\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

viewPort($("#qunit-fixture").addClass("dx-viewport"));

executeAsyncMock.setup();

var POPUP_CLASS = "dx-popup",
    POPUP_WRAPPER_CLASS = "dx-popup-wrapper",
    POPUP_CONTENT_CLASS = "dx-popup-content",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    POPUP_BOTTOM_CLASS = "dx-popup-bottom",
    POPUP_FULL_SCREEN_CLASS = "dx-popup-fullscreen",
    POPUP_TITLE_CLASS = "dx-popup-title",
    POPUP_TITLE_CLOSEBUTTON_CLASS = "dx-closebutton",
    POPUP_NORMAL_CLASS = "dx-popup-normal",

    POPUP_DRAGGABLE_CLASS = "dx-popup-draggable",

    viewport = function() { return $(".dx-viewport"); };

var toSelector = function(cssClass) {
    return "." + cssClass;
};


QUnit.module("basic");

QUnit.test("markup init", function(assert) {
    var $element = $("#popup").dxPopup();
    assert.ok($element.hasClass(POPUP_CLASS));

    $element.dxPopup("show");

    var $container = viewport().find(toSelector(POPUP_WRAPPER_CLASS)).children();
    assert.ok($container.hasClass(OVERLAY_CONTENT_CLASS));
    assert.ok($container.children(':eq(0)').hasClass(POPUP_TITLE_CLASS));
    assert.ok($container.children(':eq(1)').hasClass(POPUP_CONTENT_CLASS));
});

QUnit.test("content", function(assert) {
    var instance = $("#popup").dxPopup({
        visible: true
    }).dxPopup("instance");

    assert.equal(instance.$content().get(0), viewport().find(toSelector(POPUP_WRAPPER_CLASS)).find(toSelector(POPUP_CONTENT_CLASS)).get(0));
});

QUnit.test("popup wrapper should have 'fixed' or 'absolute' position in fullscreen", function(assert) {
    $("#popup").dxPopup({ fullScreen: true, visible: true });

    var $wrapper = $("." + POPUP_WRAPPER_CLASS);

    assert.ok(($wrapper.css("position") === "fixed") || ($wrapper.css("position") === "absolute"), "popup wrapper position type is correct");
});

QUnit.test("shading has width and height if enabled", function(assert) {
    $("#popup").dxPopup({ visible: true });

    var $wrapper = $("." + POPUP_WRAPPER_CLASS);

    assert.notEqual($wrapper[0].style.height, "", "height is set");
    assert.notEqual($wrapper[0].style.width, "", "width is set");
});

QUnit.test("default options", function(assert) {
    var $popup = $("#popup").dxPopup({ title: 'Any header', visible: true }),
        instance = $popup.dxPopup("instance"),
        $overlayContent = instance.$content().parent();

    assert.equal(instance.option("title"), 'Any header');
    assert.equal(instance.option("title"), $overlayContent.children().eq(0).text());

    instance.option("title", 'Other header');
    assert.equal($overlayContent.children().eq(0).text(), 'Other header');
});

QUnit.test("content template", function(assert) {
    var $popup = $("#popupWithContentTmpl").dxPopup({ visible: true }),
        instance = $popup.dxPopup("instance"),
        $content = instance.$content();

    instance.show();

    assert.equal($content.children().length, 1);
    assert.ok($content.find(".testContent").length);
    assert.equal($.trim($content.text()), "testContent");
});

QUnit.test("title and content template", function(assert) {
    var $popup = $("#popupWithTitleAndContentTmpl").dxPopup({ visible: true }),
        instance = $popup.dxPopup("instance"),
        $title = $(toSelector(POPUP_TITLE_CLASS), viewport()),
        $content = instance.$content();

    assert.equal($title.children().length, 1);
    assert.ok($title.find(".testTitle").length);
    assert.equal($.trim($title.text()), "testTitle");

    assert.equal($content.children().length, 1);
    assert.ok($content.find(".testContent").length);
    assert.equal($.trim($content.text()), "testContent");
});

QUnit.test("custom titleTemplate option", function(assert) {
    $("#popupWithTitleTemplate").dxPopup({ titleTemplate: 'customTitle', visible: true });

    var $title = $(toSelector(POPUP_TITLE_CLASS), viewport());
    assert.equal($.trim($title.text()), "testTitle", "title text is correct");
});

QUnit.test("done button is located after cancel button in non-win8 device", function(assert) {
    devices.current("androidPhone");

    var $popup = $("#popup").dxPopup({
            toolbarItems: [{ shortcut: "done" }, { shortcut: "cancel" }],
            animation: null,
            visible: true
        }),
        instance = $popup.dxPopup("instance"),
        $popupBottom = instance.$content().parent().find(".dx-popup-bottom");

    assert.equal($popupBottom.text(), "CancelDone", "buttons order is correct");

    instance.option("toolbarItems", [{ shortcut: "cancel" }, { shortcut: "done" }]);
    $popupBottom = instance.$content().parent().find(".dx-popup-bottom");
    assert.equal($popupBottom.text(), "CancelDone", "buttons order is correct");
});

QUnit.test("done button is located before cancel button in win10", function(assert) {
    devices.current("win10");

    var $popup = $("#popup").dxPopup({
            toolbarItems: [{ shortcut: "cancel" }, { shortcut: "done" }],
            animation: null,
            visible: true
        }),
        instance = $popup.dxPopup("instance"),
        $popupBottom = instance.$content().parent().find(".dx-popup-bottom");

    assert.equal($popupBottom.text(), "DoneCancel", "buttons order is correct");

    instance.option("toolbarItems", [{ shortcut: "done" }, { shortcut: "cancel" }]);
    $popupBottom = instance.$content().parent().find(".dx-popup-bottom");
    assert.equal($popupBottom.text(), "DoneCancel", "buttons order is correct");
});

QUnit.test("buttons should be rendered correctly after toolbar was repainted", function(assert) {
    var $popup = $("#popup").dxPopup({
            visible: true,
            toolbarItems: [
            { 'widget': 'dxButton', 'toolbar': 'bottom', 'location': 'before', 'options': { 'text': 'Today', 'type': 'today' } },
            { 'shortcut': 'done', 'options': { 'text': 'OK' }, 'toolbar': 'bottom', 'location': 'after' },
            { 'shortcut': 'cancel', 'options': { 'text': 'Cancel' }, 'toolbar': 'bottom', 'location': 'after' }]

        }),
        instance = $popup.dxPopup("instance"),
        $popupBottom = instance.$content().parent().find(".dx-popup-bottom");

    $popupBottom.dxToolbarBase("repaint");
    assert.equal($popupBottom.text(), "TodayOKCancel", "buttons order is correct");
});

QUnit.test("Check that title do not render twice or more, Q553652", function(assert) {
    var $popup = $("#popup").dxPopup({ visible: true, title: "test" }),
        instance = $popup.dxPopup("instance");

    assert.equal(instance.option("title"), "test", "title is test");
    assert.equal($(toSelector(POPUP_TITLE_CLASS), viewport()).length, 1, "there can be only one title");

    instance.option("visible", false);
    instance.option("title", "test2");
    instance.option("visible", true);

    assert.equal(instance.option("title"), "test2", "title is test2");
    assert.equal($(toSelector(POPUP_TITLE_CLASS), viewport()).length, 1, "there can be only one title");
});

QUnit.test("close button is not shown when title is not displayed", function(assert) {
    var $popup = $("#popup").dxPopup({ visible: true, closeButton: true, showTitle: false }),
        $closeButton = $('.' + POPUP_TITLE_CLOSEBUTTON_CLASS, $popup);

    assert.equal($closeButton.length, 0, "close button element");
});

QUnit.test("close button is shown when title changes", function(assert) {
    var popup = $("#popup").dxPopup({ visible: true, showTitle: true, showCloseButton: true }).dxPopup("instance");
    popup.option("title", "new title");
    assert.ok($('.' + POPUP_TITLE_CLOSEBUTTON_CLASS, popup._$title).length);
});

QUnit.test("popup top toolbar rendering", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        toolbarItems: [{ text: "top text", toolbar: "top", location: "center" }]
    });

    var $popupWrapper = $("." + POPUP_WRAPPER_CLASS),
        $titleToolbar = $popupWrapper.find("." + POPUP_TITLE_CLASS);

    assert.ok($titleToolbar.hasClass("dx-toolbar"), "top toolbar is present");
    assert.equal($titleToolbar.text(), "top text", "top toolbar has correct content");
});

QUnit.test("popup bottom toolbar rendering", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        toolbarItems: [{ text: "bottom text", toolbar: "bottom", location: "center" }]
    });

    var $popupWrapper = $("." + POPUP_WRAPPER_CLASS),
        $bottomToolbar = $popupWrapper.find("." + POPUP_BOTTOM_CLASS);

    assert.ok($bottomToolbar.hasClass("dx-toolbar"), "bottom toolbar is present");
    assert.equal($bottomToolbar.text(), "bottom text", "bottom toolbar has correct content");
});

QUnit.test("buttons rendering when aliases are specified", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        showCloseButton: false,
        toolbarItems: [{ shortcut: "cancel" }, { shortcut: "done" }, { shortcut: "clear" }]
    });

    var $popupWrapper = $("." + POPUP_WRAPPER_CLASS);

    assert.equal($popupWrapper.find(".dx-button").length, 3, "all buttons are rendered");
});

QUnit.test("shortcut buttons are placed in specified location", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        toolbarItems: [{ shortcut: "done", location: "after" }]
    });

    var $button = $("." + POPUP_BOTTOM_CLASS).find(".dx-toolbar-after").find(".dx-popup-done");

    assert.equal($button.length, 1, "done button is at correct location");
});

QUnit.test("items should be rendered with toolbarItems.toolbar='top' as default", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        toolbarItems: [{ text: "sample", location: "center" }]
    });

    var $popupWrapper = $("." + POPUP_WRAPPER_CLASS),
        $titleToolbar = $popupWrapper.find("." + POPUP_TITLE_CLASS);

    var instance = $("#popup").dxPopup("instance");

    assert.equal(instance.option("toolbarItems")[0].toolbar, "top", "toolbar property was set correctly");
    assert.equal($titleToolbar.text(), "sample", "top toolbar has correct content");
});

QUnit.test("toolbar must receive 'rtlEnabled' option from dxPopup", function(assert) {
    var $popup = $("#popup").dxPopup({
            visible: true,
            rtlEnabled: true,
            toolbarItems: [
            { 'widget': 'dxButton', 'toolbar': 'bottom', 'location': 'before', 'options': { 'text': 'Today', 'type': 'today' } },
            { 'shortcut': 'done', 'options': { 'text': 'OK' }, 'toolbar': 'bottom', 'location': 'after' },
            { 'shortcut': 'cancel', 'options': { 'text': 'Cancel' }, 'toolbar': 'bottom', 'location': 'after' }]

        }),
        instance = $popup.dxPopup("instance"),
        toolbarInstance = instance.$content().parent().find(".dx-popup-bottom").dxToolbarBase("instance");

    assert.ok(toolbarInstance.option("rtlEnabled"), "toolbar's 'rtlEnabled' option is true");
});

QUnit.test("toolbar must receive 'rtlEnabled' from dxPopup after optionChanged", function(assert) {
    var $popup = $("#popup").dxPopup({
            visible: true,
            rtlEnabled: true,
            deferRendering: false,
            toolbarItems: [
            { 'widget': 'dxButton', 'toolbar': 'bottom', 'location': 'before', 'options': { 'text': 'Today', 'type': 'today' } },
            { 'shortcut': 'done', 'options': { 'text': 'OK' }, 'toolbar': 'bottom', 'location': 'after' },
            { 'shortcut': 'cancel', 'options': { 'text': 'Cancel' }, 'toolbar': 'bottom', 'location': 'after' }]

        }),
        instance = $popup.dxPopup("instance");

    instance.option("rtlEnabled", false);
    var toolbarInstance = instance.$content().parent().find(".dx-popup-bottom").dxToolbarBase("instance");

    assert.notOk(toolbarInstance.option("rtlEnabled"), "toolbar's 'rtlEnabled' option is false");
});

QUnit.test("toolbar must render 'default' type buttons if 'useDefaultToolbarButtons' is set", function(assert) {
    var popupInstance = $("#popup").dxPopup({
        visible: true,
        useDefaultToolbarButtons: true,
        deferRendering: false,
        toolbarItems: [{
            toolbar: "bottom",
            widget: "dxButton",
            options: { text: "Retry", type: "danger" }
        }, {
            toolbar: "bottom",
            widget: "dxButton",
            options: { text: "Ok" }
        }]
    }).dxPopup("instance");

    var toolbarButtons = popupInstance.$content().parent().find(".dx-popup-bottom .dx-button");

    assert.ok(toolbarButtons.eq(0).hasClass("dx-button-danger"), "button has custom class");
    assert.ok(toolbarButtons.eq(1).hasClass("dx-button-default"), "button default class is 'default', not normal");
});

QUnit.test("toolbar must render flat buttons and shortcuts if 'useFlatToolbarButtons' is set", function(assert) {
    var popupInstance = $("#popup").dxPopup({
        visible: true,
        useFlatToolbarButtons: true,
        deferRendering: false,
        toolbarItems: [{
            shortcut: "done",
            options: { text: "Retry" }
        }, {
            toolbar: "bottom",
            widget: "dxButton",
            options: { text: "Ok" }
        }]
    }).dxPopup("instance");

    var toolbarButtons = popupInstance.$content().parent().find(".dx-popup-bottom .dx-button");

    assert.ok(toolbarButtons.eq(0).hasClass("dx-button-flat"), "shortcut has dx-button-flat class");
    assert.ok(toolbarButtons.eq(1).hasClass("dx-button-flat"), "button has dx-button-flat class");
});


QUnit.module("dimensions");

QUnit.test("content must not overlap bottom buttons", function(assert) {
    var $popup = $("#popup").dxPopup({
            toolbarItems: [{ shortcut: "cancel" }, { shortcut: "done" }, { shortcut: "clear" }],
            showCloseButton: true,
            visible: true
        }),
        instance = $popup.dxPopup("instance"),
        $popupContent = instance.$content(),
        $popupBottom = $popupContent.parent().find(".dx-popup-bottom");

    assert.equal($popupContent.outerHeight() + $popupBottom.outerHeight(true), $popupContent.outerHeight(true), "content doesn't overlap bottom buttons");
});

QUnit.test("dimensions should be shrunk correctly with height = auto specified", function(assert) {
    var $content = $("#popup").dxPopup({
        visible: true,
        width: "auto",
        height: "auto",
        contentTemplate: function() {
            return $("<div>").width(200).height(200);
        }
    }).dxPopup("instance").$content();

    var popupContentHeight = $content.height();
    var addedContent = $("<div>").width(200).height(200);
    $content.append(addedContent);

    assert.equal($content.height(), popupContentHeight + addedContent.height());
});

QUnit.test("dxPopup should render custom template with render function that returns dom node", function(assert) {
    var $content = $("#popup").dxPopup({
        visible: true,
        width: "auto",
        height: "auto",
        integrationOptions: {
            templates: {
                "title": {
                    render: function(args) {
                        var $element = $("<span>")
                            .addClass("dx-template-wrapper")
                            .text("text");

                        return $element.get(0);
                    }
                }
            }
        }
    });


    assert.equal($content.text(), "text", "container is correct");
});

QUnit.test("dimensions should be shrunk correctly with floating heights", function(assert) {
    var floatingTemplate = function() {
        var $result = $("<div>").width(20);
        $result.get(0).style.height = '20.2px';
        return $result;
    };
    var $content = $("<div>").appendTo("#qunit-fixture").dxPopup({
        visible: true,
        width: "auto",
        height: "auto",
        minHeight: 10,
        animation: null,
        toolbarItems: [{ toolbar: "bottom" }],
        titleTemplate: floatingTemplate,
        contentTemplate: floatingTemplate,
        bottomTemplate: floatingTemplate
    }).dxPopup("instance").$content();

    var contentPaddings = $content.outerHeight() - $content.height(),
        computedContentHeight = $content.get(0).getBoundingClientRect().height - contentPaddings;

    var realContentHeight = floatingTemplate().appendTo("#qunit-fixture").get(0).getBoundingClientRect().height;
    assert.ok(Math.abs(computedContentHeight - realContentHeight) < 0.02, computedContentHeight + " " + realContentHeight);
});

QUnit.test("content height change should be correctly handled", function(assert) {
    var instance = $("#popup").dxPopup({
        "height": 100,
        "visible": true
    }).dxPopup("instance");

    var $popupContent = instance.$content(),
        $overlayContent = $popupContent.parent(),
        $contentElement = $("<div>").height(50);

    $popupContent.append($contentElement);
    instance.option("height", "auto");
    assert.notEqual($overlayContent.height(), 100, "auto height option");
});

QUnit.test("minHeight should affect popup content height correctly", function(assert) {
    var $popup = $("#popup").dxPopup({
            visible: true,
            width: "auto",
            height: "auto",
            minHeight: 400,
            toolbarItems: [{ text: "text", toolbar: "top", location: "center" }, { text: "text", toolbar: "bottom", location: "center" }],
            titleTemplate: function() { return $("<div>").width("100%").height(100); },
            bottomTemplate: function() { return $("<div>").width("100%").height(100); },
            contentTemplate: function() { return $("<div>").width(1000).height(0); }
        }),
        instance = $popup.dxPopup("instance"),
        $popupContent = instance.$content(),
        $overlayContent = $popupContent.parent(),
        $popupTitle = $overlayContent.find(".dx-popup-title"),
        $popupBottom = $overlayContent.find(".dx-popup-bottom");

    assert.equal(
        $popupContent.outerHeight(true) + $popupTitle.outerHeight(true) + $popupBottom.outerHeight(true),
        $overlayContent.height()
    );
});

QUnit.test("maxHeight should affect popup content height correctly", function(assert) {
    var $popup = $("#popup").dxPopup({
            visible: true,
            width: "auto",
            height: "auto",
            maxHeight: 400,
            toolbarItems: [{ text: "text", toolbar: "top", location: "center" }, { text: "text", toolbar: "bottom", location: "center" }],
            titleTemplate: function() { return $("<div>").width("100%").height(100); },
            bottomTemplate: function() { return $("<div>").width("100%").height(100); },
            contentTemplate: function() { return $("<div>").width(1000).height(1000); }
        }),
        instance = $popup.dxPopup("instance"),
        $popupContent = instance.$content(),
        $overlayContent = $popupContent.parent(),
        $popupTitle = $overlayContent.find(".dx-popup-title"),
        $popupBottom = $overlayContent.find(".dx-popup-bottom");

    assert.equal(
        $popupContent.outerHeight(true) + $popupTitle.outerHeight(true) + $popupBottom.outerHeight(true),
        $overlayContent.height()
    );
});


QUnit.module("options changed callbacks", {
    beforeEach: function() {
        this.element = $("#popup").dxPopup();
        this.instance = this.element.dxPopup("instance");
        devices.current("desktop");
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("width/height", function(assert) {
    var instance = this.instance;

    instance.show();

    var $overlayContent = instance.$content().parent();

    instance.option("width", 345);
    assert.equal($overlayContent.outerWidth(), 345);

    instance.option("height", 567);
    assert.equal($overlayContent.outerHeight(), 567);
});

QUnit.test("fullScreen", function(assert) {
    this.instance.option({
        fullScreen: true,
        width: 345,
        height: 567,
        visible: true
    });

    var $overlayContent = this.instance.$content().parent();

    assert.equal($overlayContent.parent().get(0).style.width, "100%", "wrappers width specified");
    assert.equal($overlayContent.parent().get(0).style.height, "100%", "wrappers height specified");
    assert.equal($overlayContent.get(0).style.width, "100%");
    assert.equal($overlayContent.get(0).style.height, "100%");

    assert.ok($overlayContent.hasClass(POPUP_FULL_SCREEN_CLASS), "fullscreen class added");
    assert.ok(!$overlayContent.hasClass(POPUP_NORMAL_CLASS), "normal class is removed");

    this.instance.option("fullScreen", false);
    assert.equal($overlayContent.outerWidth(), 345);
    assert.equal($overlayContent.outerHeight(), 567);
    assert.ok(!$overlayContent.hasClass(POPUP_FULL_SCREEN_CLASS), "fullscreen class deleted");
    assert.ok($overlayContent.hasClass(POPUP_NORMAL_CLASS), "normal class is added");
});

QUnit.test("PopupContent doesn't disappear while fullScreen option changing", function(assert) {
    this.instance.option({
        fullScreen: false,
        width: 345,
        height: 567,
        visible: true
    });

    var popupContent = this.instance.$content();

    $("<iframe>").attr("src", "about:blank").appendTo(popupContent);

    var iFrame = document.getElementsByTagName('iframe')[0],
        iFrameDoc = iFrame.contentWindow.document,
        element = document.createElement('div');

    if(iFrameDoc.body === null || iFrameDoc.body === undefined) {
        iFrameDoc.write("<body></body>");
    }

    var body = iFrameDoc.getElementsByTagName('body')[0];

    body.appendChild(element);
    this.instance.option("fullScreen", true);
    body = iFrameDoc.getElementsByTagName('body')[0];

    assert.equal(body.children.length, 1, "Content doesn't disappear");
});

QUnit.test("fullScreen with disabled shading", function(assert) {
    this.instance.option({
        fullScreen: true,
        shading: false,
        width: 345,
        height: 567,
        visible: true
    });

    var $overlayContent = this.instance.$content().parent();

    assert.equal($overlayContent.parent().get(0).style.width, "100%", "wrappers width specified");
    assert.equal($overlayContent.parent().get(0).style.height, "100%", "wrappers height specified");
});

QUnit.test("shading should be synchronized with the option when popup goes from fullscreen to normal mode", function(assert) {
    this.instance.option({
        fullScreen: true,
        shading: false,
        width: 10,
        height: 10,
        visible: true
    });

    this.instance.option("fullScreen", false);

    var $popupWrapper = this.instance.$content().closest("." + POPUP_WRAPPER_CLASS);

    assert.equal($popupWrapper.prop('style').width, "", "wrapper is collapsed by width");
    assert.equal($popupWrapper.prop('style').height, "", "wrapper is collapsed by height");
});

QUnit.test("title", function(assert) {
    this.instance.option("visible", "true");
    this.instance.option("title", "new title");
    assert.equal($(toSelector(POPUP_WRAPPER_CLASS), viewport()).text(), "new title");
});

QUnit.test("showTitle option", function(assert) {
    this.instance.option({
        title: "Title",
        showCloseButton: false,
        opened: true
    });

    var $title = $(toSelector(POPUP_TITLE_CLASS), viewport());
    assert.ok(!!$title.length, "show title by default");

    this.instance.option("showTitle", false);
    $title = $(toSelector(POPUP_TITLE_CLASS), viewport());

    assert.ok(!$title.length, "hide title");
});

QUnit.test("title toolbar should not show with showCloseButton option", function(assert) {
    this.instance.option({
        showCloseButton: true,
        title: "Test",
        showTitle: false
    });

    assert.ok(!$(".dx-popup-title").length, "title is hidden");
});

$.each(["cancel", "clear", "done"], function(_, buttonType) {
    QUnit.test(buttonType + " button rendering", function(assert) {
        this.instance.option("toolbarItems", [{ shortcut: buttonType }]);
        this.instance.show();

        var $bottomBar = $(toSelector(POPUP_WRAPPER_CLASS), viewport()).find("." + POPUP_BOTTOM_CLASS),
            $button = $(toSelector(POPUP_WRAPPER_CLASS), viewport()).find(".dx-button.dx-popup-" + buttonType);

        assert.equal($bottomBar.length, 1, "Bottom bar rendered");
        assert.ok($(toSelector(POPUP_WRAPPER_CLASS), viewport()).hasClass("dx-popup-" + buttonType + "-visible"), "popup has according class");
        assert.ok($bottomBar.hasClass("dx-popup-" + buttonType), "Bottom bar has class 'dx-popup-" + buttonType + "'");
        assert.equal($button.length, 1, buttonType + " button rendered");
    });
});

QUnit.test("buttons close button", function(assert) {
    var $popup = $("#popup").dxPopup({ visible: true, showCloseButton: true }),
        instance = $popup.dxPopup("instance"),
        $title = $(toSelector(POPUP_TITLE_CLASS), viewport()),
        $closeButton = $(toSelector(POPUP_TITLE_CLOSEBUTTON_CLASS), viewport());

    assert.equal($title.find(".dx-button").length, 1, "title has close button");
    assert.equal($closeButton.length, 1, "close button element");

    instance.option("toolbarItems", []);
    assert.equal($title.find(".dx-button").length, 0, "close button is removed");
});

QUnit.test("showCloseButton option", function(assert) {
    var $popup = $("#popup").dxPopup({ visible: true, toolbarItems: [] }),
        instance = $popup.dxPopup("instance"),
        $closeButton = $popup.find("." + POPUP_TITLE_CLOSEBUTTON_CLASS);
    assert.ok($closeButton.length, "Need to show close button by default");

    instance.option("showCloseButton", true);
    $closeButton = $popup.find("." + POPUP_TITLE_CLOSEBUTTON_CLASS);
    assert.ok($closeButton.length, "Close button appears when we set option to the true through api");

    instance.option("toolbarItems", [{ shortcut: "close" }]);
    instance.option("showCloseButton", false);
    $closeButton = $popup.find("." + POPUP_TITLE_CLOSEBUTTON_CLASS);
    assert.ok(!$closeButton.length, "Close button is independent from the 'buttons' option");
});

QUnit.test("hide popup when close button is clicked", function(assert) {
    this.instance.option("visible", "true");
    this.instance.option("showCloseButton", true);

    var $closeButton = $(toSelector(POPUP_WRAPPER_CLASS), viewport()).find('.' + POPUP_TITLE_CLOSEBUTTON_CLASS),
        isHideCalled = 0;

    this.instance.hide = function() {
        isHideCalled++;
    };
    $closeButton.triggerHandler("dxclick");

    assert.equal(isHideCalled, 1, "hide is called");
});

$.each(["cancel", "clear", "done"], function(_, buttonType) {
    QUnit.test("fire specific action and hide popup" + buttonType + " button is clicked", function(assert) {
        var buttonClickFired = 0,
            popupHideFired = 0;

        this.instance.option("toolbarItems", [{ shortcut: buttonType, onClick: function() { buttonClickFired++; } }]);
        this.instance.hide = function() {
            popupHideFired++;
        };
        this.instance.show();

        var $button = $(toSelector(POPUP_WRAPPER_CLASS), viewport()).find(".dx-button.dx-popup-" + buttonType);

        $button.trigger("dxclick");
        assert.equal(buttonClickFired, 1, "button click action fired");
        assert.equal(popupHideFired, 1, "popup is hidden");
    });
});

QUnit.test("buttons", function(assert) {
    this.instance.option("visible", true);

    var $container = this.instance.$content().parent();
    var $popupTitle = $container.find("." + POPUP_TITLE_CLASS),
        $popupBottom = $container.find("." + POPUP_BOTTOM_CLASS);

    assert.ok(!$popupTitle.hasClass(".dx-toolbar"), "top toolbar is not initialized when buttons is empty");
    assert.equal($popupBottom.length, 0, "bottom toolbar is not rendered when buttons is empty");

    this.instance.option("toolbarItems", [
        { text: "test 1 top", toolbar: "top", location: "before" },
        { text: "test 1 bottom", toolbar: "bottom", location: "before" }]
    );
    $popupTitle = $container.find("." + POPUP_TITLE_CLASS);
    $popupBottom = $container.find("." + POPUP_BOTTOM_CLASS);

    assert.ok($popupTitle.hasClass("dx-toolbar"), "top toolbar is rendered after buttons option was set");
    assert.equal($popupTitle.text(), "test 1 top", "top toolbar value is correct");
    assert.ok($popupBottom.hasClass("dx-toolbar"), "bottom toolbar is  rendered after buttons option was set");
    assert.equal($popupBottom.text(), "test 1 bottom", "bottom toolbar value is correct");

    this.instance.option("toolbarItems", [
        { widget: "dxButton", options: { text: "test 2 top" }, toolbar: "top", location: "before" },
        { widget: "dxButton", options: { text: "test 2 bottom" }, toolbar: "bottom", location: "before" }]
    );
    $popupTitle = $container.find("." + POPUP_TITLE_CLASS);
    $popupBottom = $container.find("." + POPUP_BOTTOM_CLASS);

    assert.equal($popupTitle.text(), "test 2 top", "top toolbar value is correct after buttons option is changed");
    assert.equal($popupBottom.text(), "test 2 bottom", "bottom toolbar value is correct after buttons option is changed");
});

QUnit.test("buttons aliases change affects container classes", function(assert) {
    var popup = $("#popup").dxPopup({
        visible: true,
        toolbarItems: [{ shortcut: "cancel" }]
    }).dxPopup("instance");

    var $popupBottom = this.instance.$content().parent().find("." + POPUP_BOTTOM_CLASS);
    assert.ok($popupBottom.hasClass("dx-popup-cancel"), "popup bottom has cancel class");

    popup.option("toolbarItems", [{ shortcut: "done" }]);
    $popupBottom = this.instance.$content().parent().find(".dx-popup-bottom");
    assert.ok($popupBottom.hasClass("dx-popup-done"), "popup bottom has done class");
    assert.ok(!$popupBottom.hasClass("dx-popup-cancel"), "popup bottom has not cancel class");
});

QUnit.test("empty item should not be rendered in top toolbar", function(assert) {
    $("#popup").dxPopup({
        visible: true,
        showTitle: true,
        showCloseButton: false
    });

    var $toolbarItems = $("." + POPUP_TITLE_CLASS).find(".dx-item");

    assert.equal($toolbarItems.length, 0, "no items are rendered inside top toolbar");
});

QUnit.test("toolBar should not update geometry after partial update of its items", function(assert) {
    this.instance.option({
        visible: true,
        toolbarItems: [{ widget: "dxButton", options: { text: "test 2 top" }, toolbar: "bottom", location: "after" }]
    });

    var renderGeometrySpy = sinon.spy(this.instance, "_renderGeometry");

    this.instance.option("toolbarItems[0].options", { text: "test", disabled: true });
    assert.ok(renderGeometrySpy.notCalled, "renderGeometry is not called on partial update of a widget");

    this.instance.option("toolbarItems[0].toolbar", "top");
    assert.ok(renderGeometrySpy.calledOnce, "renderGeometry is called on item location changing");
});


QUnit.module("resize", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("popup content should update height after resize", function(assert) {
    var $popup = $("#popup").dxPopup({
            resizeEnabled: true,
            showTitle: false,
            visible: true,
            showCloseButton: false,
            toolbarItems: []
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent(),
        $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle).start();

    pointer.dragStart().drag(-100, -100);
    assert.equal(popup.$content().outerHeight(), $overlayContent.height(), "size of popup and overlay is equal");
});

QUnit.test("popup content position should be reset after show/hide", function(assert) {
    var $popup = $("#popup").dxPopup({
            resizeEnabled: true,
            height: "auto"
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent();

    popup.$content().append($("<div>").height(10));
    popup.show();
    var $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle),
        position = $overlayContent.offset();
    pointer.start().dragStart().drag(-100, -100).dragEnd();

    popup.hide();
    popup.show();
    assert.deepEqual($overlayContent.offset(), position, "position is same");
});

QUnit.test("resize callbacks", function(assert) {
    var onResizeStartFired = 0,
        onResizeFired = 0,
        onResizeEndFired = 0,

        instance = $("#popup").dxPopup({
            resizeEnabled: true,
            visible: true,
            onResizeStart: function() { onResizeStartFired++; },
            onResize: function() { onResizeFired++; },
            onResizeEnd: function() { onResizeEndFired++; }
        }).dxPopup("instance"),

        $content = instance.overlayContent(),
        $handle = $content.find(".dx-resizable-handle-top"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(0, 50).dragEnd();

    assert.equal(onResizeStartFired, 1, "onResizeStart fired");
    assert.equal(onResizeFired, 1, "onResize fired");
    assert.equal(onResizeEndFired, 1, "onResizeEnd fired");
});


QUnit.module("drag popup by title", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("class should be added if drag is enabled", function(assert) {
    var $popup = $("#popup").dxPopup({
            dragEnabled: true,
            visible: true
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent();

    assert.ok($overlayContent.hasClass(POPUP_DRAGGABLE_CLASS), "class was added");

    popup.option("dragEnabled", false);
    assert.ok(!$overlayContent.hasClass(POPUP_DRAGGABLE_CLASS), "class was added");
});

QUnit.test("popup should be dragged by title", function(assert) {
    var $popup = $("#popup").dxPopup({
            dragEnabled: true,
            visible: true
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent(),
        $title = $overlayContent.children(toSelector(POPUP_TITLE_CLASS)),
        pointer = pointerMock($title),
        position = $overlayContent.position();

    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top + 50,
        left: position.left + 50
    }, "popup was moved");
});

QUnit.test("popup shouldn't be dragged by content", function(assert) {
    var $popup = $("#popup").dxPopup({
            dragEnabled: true,
            visible: true
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent(),
        pointer = pointerMock(popup.$content()),
        position = $overlayContent.position();

    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top,
        left: position.left
    }, "popup was not moved");
});

QUnit.test("popup should be dragged if title was changed", function(assert) {
    var $popup = $("#popup").dxPopup({
            dragEnabled: true,
            visible: true
        }),
        popup = $popup.dxPopup("instance"),
        $overlayContent = popup.$content().parent(),
        position = $overlayContent.position();

    popup.option("title", "newTitle");

    var $title = $overlayContent.children(toSelector(POPUP_TITLE_CLASS)),
        pointer = pointerMock($title);

    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top + 50,
        left: position.left + 50
    }, "popup was moved");
});


QUnit.module("rendering", {
    beforeEach: function() {
        this.element = $("#popup").dxPopup();
        this.instance = this.element.dxPopup("instance");
        devices.current("desktop");
    }
});

var POPUP_TOOLBAR_COMPACT_CLASS = "dx-popup-toolbar-compact",
    POPUP_BOTTOM_CLASS = "dx-popup-bottom";

QUnit.test("anonymous content template rendering", function(assert) {
    var $popup = $("#popupWithAnonymousTmpl").dxPopup({
        visible: true
    });

    var $content = $popup.dxPopup("$content");

    assert.equal($.trim($content.text()), "TestContent", "content rendered");
});

QUnit.test("custom content template is applied even if there is 'content' template in popup", function(assert) {
    var $popup = $("#popupWithCustomAndContentTemplate").dxPopup({
        contentTemplate: 'custom',
        visible: true
    });

    var $content = $popup.dxPopup("$content");

    assert.equal($.trim($content.text()), "TestContent", "content is correct");
});

QUnit.test("title toolbar with buttons when 'showTitle' is false", function(assert) {
    this.instance.option({
        showTitle: false,
        title: "Hidden title",
        toolbarItems: [
            {
                shortcut: "done",
                toolbar: "top",
                location: "after"
            }
        ],
        showCloseButton: false,
        opened: true
    });

    var $title = $(toSelector(POPUP_TITLE_CLASS), viewport());

    assert.equal($title.length, 1, "title toolbar is rendered");
    assert.equal($title.find(".dx-toolbar-button").length, 1, "button is rendered in title toolbar");
    assert.equal($title.find(".dx-toolbar-label").length, 0, "toolbar has no text");
});

QUnit.test("container argument of toolbarItems.template option is correct", function(assert) {
    this.instance.option({
        toolbarItems: [
            {
                template: function(e, index, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, "container is correct");
                }
            }
        ]
    });
});


QUnit.test("dx-popup-fullscreen-width class should be attached when width is equal to screen width", function(assert) {
    this.instance.option("width", function() { return $(window).width(); });
    this.instance.show();
    assert.ok(this.instance.overlayContent().hasClass("dx-popup-fullscreen-width"), "fullscreen width class is attached");

    this.instance.option("width", function() { return $(window).width() - 1; });
    assert.ok(!this.instance.overlayContent().hasClass("dx-popup-fullscreen-width"), "fullscreen width class is detached");
});

QUnit.test("popup with toolbarCompactMode should have a compact class for small widget width", function(assert) {
    var popup = $("#popup").dxPopup({
        toolbarItems: [
            {
                shortcut: "done",
                toolbar: "bottom",
                location: "after"
            }
        ],
        width: 10,
        toolbarCompactMode: true
    }).dxPopup("instance");

    popup.show();

    assert.ok($("." + POPUP_BOTTOM_CLASS + "." + POPUP_TOOLBAR_COMPACT_CLASS).length === 1, "compact class has been added");
});


QUnit.module("templates");

QUnit.test("titleTemplate test", function(assert) {
    assert.expect(6);

    var $element = $("#popup").dxPopup({
            visible: true,
            titleTemplate: function(titleElement) {
                var result = "<div class='test-title-renderer'>";
                result += "<h1>Title</h1>";
                result += "</div>";

                assert.equal(isRenderer(titleElement), !!config().useJQuery, "titleElement is correct");

                return result;
            }
        }),
        instance = $element.dxPopup("instance"),
        $popupContent = instance.$content().parent();

    assert.equal($popupContent.find(toSelector("test-title-renderer")).length, 1, "option 'titleTemplate'  was set successfully");

    instance.option("onTitleRendered", function(e) {
        assert.equal(e.element, e.component.element(), "element is correct");
        assert.ok(true, "option 'onTitleRendered' successfully passed to the popup widget raised on titleTemplate");
    });

    instance.option("titleTemplate", function(titleElement) {
        assert.equal($(titleElement).get(0), $popupContent.find("." + POPUP_TITLE_CLASS).get(0));

        var result = "<div class='changed-test-title-renderer'>";
        result += "<h1>Title</h1>";
        result += "</div>";

        return result;
    });

    assert.equal($popupContent.find(toSelector("changed-test-title-renderer")).length, 1, "option 'titleTemplate' successfully passed to the popup widget");
});

QUnit.test("'bottomTemplate' options test", function(assert) {
    var $element = $("#popup").dxPopup({
            visible: true,
            toolbarItems: [{ text: "bottom text", toolbar: "bottom", location: "center" }],
            bottomTemplate: function(titleElement) {
                var result = "<div class='test-bottom-renderer'>";
                result += "<h1>bottom</h1>";
                result += "</div>";

                return result;
            }
        }),
        instance = $element.dxPopup("instance"),
        $popupContent = instance.$content().parent();

    assert.equal($popupContent.find(toSelector("test-bottom-renderer")).length, 1, "option 'bottomTemplate'  was set successfully");

    instance.option("bottomTemplate", function(titleElement) {
        assert.equal($(titleElement).get(0), $popupContent.find("." + POPUP_BOTTOM_CLASS).get(0));

        var result = "<div class='changed-test-bottom-renderer'>";
        result += "<h1>bottom</h1>";
        result += "</div>";

        return result;
    });

    assert.equal($popupContent.find(toSelector("changed-test-bottom-renderer")).length, 1, "option 'bottomTemplate' successfully passed to the popup widget");
});

QUnit.test("title should be rendered if custom 'titleTemplate' is specified and 'title' is not set", function(assert) {
    $("#popupWithTitleTemplate").dxPopup({
        visible: true,
        titleTemplate: "customTitle",
        toolbarItems: [],
        showCloseButton: false
    });

    var $title = $(toSelector(POPUP_TITLE_CLASS), viewport());
    assert.equal($title.length, 1, "title is rendered");
    assert.equal($title.text(), "testTitle", "title template is rendered correctly");
});
