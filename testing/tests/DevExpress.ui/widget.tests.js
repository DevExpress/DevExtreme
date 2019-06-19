import $ from "jquery";
import Widget from "ui/widget/ui.widget";
import registerComponent from "core/component_registrator";
import devices from "core/devices";
import { extend } from "core/utils/extend";
import TemplateBase from "ui/widget/ui.template_base";
import Template from "ui/widget/template";
import DataHelperMixin from "data_helper";
import { DataSource } from "data/data_source/data_source";
import keyboardMock from "../../helpers/keyboardMock.js";
import pointerMock from "../../helpers/pointerMock.js";
import config from "core/config";
import dataUtils from "core/element_data";
import { deferUpdate } from "core/utils/common";
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';

import "common.css!";

const ACTIVE_STATE_CLASS = "dx-state-active";
const DISABLED_STATE_CLASS = "dx-state-disabled";
const HOVER_STATE_CLASS = "dx-state-hover";
const FOCUSED_STATE_CLASS = "dx-state-focused";
const FEEDBACK_SHOW_TIMEOUT = 30;
const FEEDBACK_HIDE_TIMEOUT = 400;
const RTL_CLASS = "dx-rtl";

const DxWidget = Widget.inherit({});
registerComponent("dxWidget", DxWidget);

QUnit.testStart(() => {
    const markup = `
    <div id="widget"></div>
    <div id="another"></div>
    <div id="parentWrapper">
        <div id="wrappedWidget"></div>
    </div>
    <div id="widthRootStyle" style="width: 300px;"></div>
    <div id="widthRootStylePercent" style="width: 50%;"></div>

    <div id="container">
        <div data-options="dxTemplate: { name: 'item' }">item template content</div>
        <div data-options="dxTemplate: { name: 'group' }">group template content</div>
        <table data-options="dxTemplate: { name: 'rowItem' }"><tr><td>item template content</td></tr></table>
    </div>

    <div id="container2">
        <div data-options="dxTemplate: { name: 'item' }">item template content</div>
        <div data-options="dxTemplate: { name: 'group' }">group template content</div>
    </div>

    <div id="container-custom-config">
        <div data-options='{ "dxTemplate": { "name": "item" } }'>item template content</div>
        <div data-options='{ "dxTemplate": { "name": "group" } }'>group template content</div>
    </div>

    <div id="externalContainer">
        <div data-options="dxTemplate: { name: 'item1' }">template content</div>
        <div data-options="dxTemplate: { name: 'group2' }">template content</div>
    </div>

    <div id="jQueryContainerWidget">
        <div id="innerWidget"></div>
    </div>

    <div id="platformSpecificContainer">
        <div data-options="dxTemplate: { name: 'item', platform: 'generic' }">generic</div>
        <div data-options="dxTemplate: { name: 'item', platform: 'ios' }">ios</div>
        <div data-options="dxTemplate: { name: 'item' }">common</div>
    </div>

    <div id="platformSpecificContainer2">
        <div data-options="dxTemplate: { name: 'item', platform: 'ios' }">ios</div>
        <div data-options="dxTemplate: { name: 'item', platform: 'ios' }">ios2</div>
    </div>

    <script type="text/html" id="scriptTemplate">
        <div class="myTemplate"></div>
    </script>

    <div id="widgetWithScriptInTemplate">
        Text
        <script></script>
    </div>`;

    $("#qunit-fixture").html(markup);
});

QUnit.module("render", {}, () => {
    QUnit.test("visibility change handling works optimally", (assert) => {
        let hidingFired = 0;
        let shownFired = 0;

        const visibilityChanged = visible => {
            visible ? shownFired++ : hidingFired++;
        };

        const TestWidget = Widget.inherit({
            NAME: "TestWidget1",
            _visibilityChanged: visibilityChanged
        });

        const $element = $("#widget");
        const component = new TestWidget($element, { visible: false });

        assert.equal(hidingFired, 0, "hidden is not fired initially");
        assert.equal(shownFired, 0, "shown is not fired initially");

        $element.triggerHandler("dxhiding");
        $element.triggerHandler("dxshown");

        assert.equal(hidingFired, 0, "hidden is not fired if visible option is false");
        assert.equal(shownFired, 0, "shown is not fired if visible option is false");

        component.option("visible", true);

        assert.equal(hidingFired, 0, "hidden is not fired if visible option is changed to true");
        assert.equal(shownFired, 1, "shown is fired if visible option is changed to true");

        $element.triggerHandler("dxshown");
        $element.triggerHandler("dxshown");

        assert.equal(shownFired, 1, "shown is not fired if dxshown is fired after visible was changed to true");

        $element.triggerHandler("dxhiding");
        $element.triggerHandler("dxhiding");

        assert.equal(hidingFired, 1, "hidden is fired only once if dxhiding is fired when widget is visible");

        component.option("visible", false);

        assert.equal(hidingFired, 1, "hidden is not fired if visible was changed after hiding");
    });

    QUnit.test("option 'hoverStateEnabled' - default", (assert) => {
        const element = $("#widget").dxWidget();
        const instance = element.dxWidget("instance");

        element.trigger("dxhoverstart");
        assert.ok(!instance.option("hoverStateEnabled"));
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        instance.option("hoverStateEnabled", true);
        element.trigger("dxhoverstart");
        assert.ok(element.hasClass(HOVER_STATE_CLASS));
    });

    QUnit.test("option 'hoverStateEnabled' when disabled", (assert) => {
        const element = $("#widget").dxWidget({ hoverStateEnabled: true, disabled: true });
        const instance = element.dxWidget("instance");

        element.trigger("dxhoverstart");
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        instance.option("disabled", false);
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        element.trigger("dxhoverstart");
        assert.ok(element.hasClass(HOVER_STATE_CLASS));

        instance.option("disabled", true);
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        element.trigger("dxhoverend");
        instance.option("disabled", false);
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));
    });

    QUnit.test("option onFocusIn/onFocusOut", (assert) => {
        let focusInHandled = false;
        let focusOutHandled = false;

        const $element = $("#widget").dxWidget({
            focusStateEnabled: true,
            onFocusIn() {
                focusInHandled = true;
            },
            onFocusOut() {
                focusOutHandled = true;
            }
        });

        $element.focusin();
        assert.ok(focusInHandled, "focusIn action was fired");

        $element.focusout();
        assert.ok(focusOutHandled, "focusOut action was fired");
    });

    QUnit.test("focusout should fired even in disabled container", (assert) => {
        let focusOutHandled = false;
        const $container = $("<div>").appendTo("#qunit-fixture");

        const $element = $("<div>").appendTo($container).dxWidget({
            focusStateEnabled: true,
            onFocusOut() {
                focusOutHandled = true;
            }
        });

        $element.focusin();
        $container.addClass("dx-state-disabled");
        $element.focusout();
        assert.ok(focusOutHandled, "focusOut action was fired");
    });

    QUnit.test("widget has class dx-state-hover when child widget lose cursor", (assert) => {
        const parentElement = $("#jQueryContainerWidget").dxWidget();
        const parentInstance = parentElement.dxWidget("instance");
        parentInstance.option("hoverStateEnabled", true);

        const childElement = $("<div>").appendTo($("#jQueryContainerWidget")).dxWidget();
        const childInstance = childElement.dxWidget("instance");
        childInstance.option("hoverStateEnabled", true);

        parentElement.trigger("dxhoverstart");
        assert.ok(parentElement.hasClass(HOVER_STATE_CLASS));

        childElement.trigger("dxhoverstart");
        assert.ok(childElement.hasClass(HOVER_STATE_CLASS));

        childElement.trigger("dxhoverend");
        assert.ok(!childElement.hasClass(HOVER_STATE_CLASS));
        assert.ok(parentElement.hasClass(HOVER_STATE_CLASS));
    });

    QUnit.test("options 'width'&'height'", (assert) => {
        const element = $("#widget").dxWidget();
        const instance = element.dxWidget("instance");

        assert.strictEqual(instance.option("width"), undefined);
        assert.strictEqual(instance.option("height"), undefined);

        instance.option({
            width: 50,
            height: 50
        });

        assert.equal(element.width(), 50);
        assert.equal(element.height(), 50);
    });

    QUnit.test("set dimensions on create", (assert) => {
        const element = $("#widget").dxWidget({
            width: 50,
            height: 50
        });

        assert.equal(element.width(), 50);
        assert.equal(element.height(), 50);
    });

    QUnit.test("check that width include borders, paddings", (assert) => {
        const element = $("#widget")
            .css({
                border: "1px solid red",
                padding: "3px"
            })
            .dxWidget();

        const instance = element.dxWidget("instance");

        instance.option("width", 100);
        instance.option("height", 150);
        assert.equal(element.outerWidth(), 100);
        assert.equal(element.outerHeight(), 150);
    });

    QUnit.test("set dimensions in percent, parent element have dimensions", (assert) => {
        $("#parentWrapper").css({
            width: 400,
            height: 200
        });

        const element = $("#wrappedWidget").dxWidget();
        const instance = element.dxWidget("instance");
        const $parentElement = $("#parentWrapper");

        instance.option("width", "50%");
        instance.option("height", "40%");
        assert.equal(element.outerWidth(), $parentElement.width() * 0.5);
        assert.equal(element.outerHeight(), $parentElement.height() * 0.4);
    });

    QUnit.test("set dimensions as function", (assert) => {
        const element = $("#widget").dxWidget();
        const instance = element.dxWidget("instance");

        instance.option("width", () => {
            return 50;
        });
        instance.option("height", () => {
            return 100;
        });
        assert.equal(element.outerWidth(), 50);
        assert.equal(element.outerHeight(), 100);
    });

    QUnit.test("'disabled' option has 'false' value by default", (assert) => {
        const instance = $("#widget").dxWidget().dxWidget("instance");
        assert.strictEqual(instance.option("disabled"), false);
    });

    QUnit.test("accessKey option", (assert) => {
        const $widget = $("#widget").dxWidget({
            focusStateEnabled: true,
            accessKey: "y"
        });

        assert.equal($widget.attr("accesskey"), "y", "widget element has accesskey attribute");
    });

    QUnit.test("accessKey option changed", (assert) => {
        const $widget = $("#widget").dxWidget({
            focusStateEnabled: true,
            accessKey: "y"
        });

        const instance = $widget.dxWidget("instance");

        instance.option("accessKey", "g");
        assert.equal($widget.attr("accesskey"), "g", "widget option has been changed successfully");
    });

    QUnit.testInActiveWindow("widget focusing when accessKey pressed", (assert) => {
        const $widget = $("#widget").dxWidget({
            focusStateEnabled: true,
            accessKey: "y"
        });

        $widget.trigger($.Event("dxclick", { screenX: 0, offsetX: 0, pageX: 0 }));
        assert.ok($widget.hasClass("dx-state-focused"), "widget has been focused");
    });

    QUnit.test("press on accessKey does not fire click event", (assert) => {
        const $widget = $("#widget").dxWidget({
            focusStateEnabled: true,
            accessKey: "y"
        });

        let isImmediatePropagationStopped = true;

        $widget.on("dxclick", e => {
            isImmediatePropagationStopped = false;
        });

        $widget.trigger($.Event("dxclick", { screenX: 0, offsetX: 0, pageX: 0 }));

        assert.ok(isImmediatePropagationStopped, "click event's immediate propagation stopped on accessKey");
    });

    QUnit.test("dxWidget on a custom node is a block DOM node", (assert) => {
        const $element = $("<custom-node/>").appendTo("#qunit-fixture");
        new DxWidget($element);

        assert.equal($element.css("display"), "block");
    });

    QUnit.test("option 'rtl'", (assert) => {
        const $element = $("#widget").dxWidget();
        const instance = $element.dxWidget("instance");

        assert.ok(!$element.hasClass(RTL_CLASS));

        instance.option("rtlEnabled", true);
        assert.ok($element.hasClass(RTL_CLASS));
    });

    QUnit.test("init option 'rtl' is true", (assert) => {
        const $element = $("#widget").dxWidget({ rtlEnabled: true });
        const instance = $element.dxWidget("instance");

        assert.ok($element.hasClass(RTL_CLASS));

        instance.option("rtlEnabled", false);
        assert.ok(!$element.hasClass(RTL_CLASS));
    });

    QUnit.test("'hint' option has 'undefined' value by default", (assert) => {
        const instance = $("#widget").dxWidget().dxWidget("instance");
        assert.equal(instance.option("hint"), undefined);
    });
});

QUnit.module("API", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test("'repaint' method refreshes widget by default", (assert) => {
        const NewWidget = Widget.inherit({
            NAME: "Widget",

            _render() {
                this.$element().append("<div></div>");
            }
        });

        const element = $("#widget");
        const instance = new NewWidget("#widget");

        assert.ok($.isFunction(instance.repaint));

        const children = element.children();

        instance.repaint();
        assert.ok(!children.is(element.children()));
    });

    QUnit.testInActiveWindow("'focus' method focus widget", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true });
        const instance = $element.dxWidget("instance");
        const $anotherElement = $("#another").dxWidget({ focusStateEnabled: true });
        const anotherInstance = $anotherElement.dxWidget("instance");

        assert.ok($.isFunction(instance.focus), "focus method exist");

        anotherInstance.focus();
        assert.ok($anotherElement.hasClass(FOCUSED_STATE_CLASS), "'focus' method focus the widget");

        instance.focus();
        assert.ok($element.hasClass(FOCUSED_STATE_CLASS), "'focus' method focus another widget");
        assert.ok(!$anotherElement.hasClass(FOCUSED_STATE_CLASS), "'focus' blur focus from another widget");
    });
});

QUnit.module("actions", {}, () => {
    QUnit.test("onOptionChanged should be triggered when widget is disabled", (assert) => {
        const $element = $("#widget").dxWidget({
            disabled: true,
            onOptionChanged() {
                assert.ok(true);
            }
        });

        const instance = $element.dxWidget("instance");

        instance.option("option1", true);
    });

    QUnit.test("onDisposing should be triggered when widget is disabled", (assert) => {
        const $element = $("#widget").dxWidget({
            disabled: true,
            onDisposing() {
                assert.ok(true);
            }
        });

        $element.remove();
    });
});

QUnit.module("ui feedback", {
    beforeEach: () => {
        this.element = $("#widget");
        this.mouse = pointerMock(this.element);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test("option activeStateEnabled", (assert) => {
        const element = this.element.dxWidget({ activeStateEnabled: true });
        const instance = element.dxWidget("instance");
        assert.ok(!element.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.active();
        assert.ok(element.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(!element.hasClass(ACTIVE_STATE_CLASS));

        instance.option("activeStateEnabled", true);
        assert.ok(!element.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.active();
        assert.ok(element.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(!element.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test("active state should be cleared after repaint", (assert) => {
        const element = this.element.dxWidget({ activeStateEnabled: true });
        const instance = element.dxWidget("instance");

        this.mouse.active();

        instance.repaint();

        assert.notOk(element.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test("widget with ui feedback support, disabled state", (assert) => {
        const el = this.element.dxWidget({
            activeStateEnabled: true,
            disabled: true
        });

        assert.ok(el.hasClass(DISABLED_STATE_CLASS));

        this.mouse.active();
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test("widget with ui feedback support, disabled option changing", (assert) => {
        const el = this.element.dxWidget({
            activeStateEnabled: true,
            disabled: true
        });

        const instance = el.dxWidget("instance");

        instance.option("disabled", false);
        assert.ok(!el.hasClass(DISABLED_STATE_CLASS));

        this.mouse.active();
        assert.ok(!el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(el.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(!el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));

        instance.option("disabled", true);
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));

        this.mouse.active();
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test("widget with ui feedback support, disabled option changing after mousedown", (assert) => {
        const el = this.element.dxWidget({ activeStateEnabled: true });
        const instance = el.dxWidget("instance");

        this.mouse.start("touch").down();
        instance.option("disabled", true);
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));

        this.mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.start("touch").down();
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        instance.option("disabled", false);

        assert.ok(!el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));

        this.mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!el.hasClass(DISABLED_STATE_CLASS));
        assert.ok(!el.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test("remove hover state on mouse down", (assert) => {
        const element = this.element.dxWidget({ hoverStateEnabled: true, activeStateEnabled: true });
        const instance = element.dxWidget("instance");

        element.trigger("dxhoverstart");
        this.mouse.active();
        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(element.hasClass(HOVER_STATE_CLASS));

        instance.option("disabled", false);

        this.mouse.active();
        assert.ok(!element.hasClass(DISABLED_STATE_CLASS));

        this.mouse.inactive();
        assert.ok(!element.hasClass(DISABLED_STATE_CLASS));
    });

    QUnit.test("activeElement should be reset after widget dispose", (assert) => {
        assert.expect(0);

        let el = this.element.dxWidget({ activeStateEnabled: true });
        this.mouse.start().down();
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        el.remove();

        el = $("<div />")
            .appendTo("#qunit-fixture")
            .dxWidget({ activeStateEnabled: true });
        pointerMock(el).start("touch").down().up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
    });

    QUnit.test("set disabled of one widget doesn't turn off the feedback of another active element", (assert) => {
        const activeEl = this.element.dxWidget({ activeStateEnabled: true });

        const disablingEl = $("<div />")
            .appendTo("#qunit-fixture")
            .dxWidget({ activeStateEnabled: true });

        this.mouse.active();
        assert.equal(activeEl.hasClass(ACTIVE_STATE_CLASS), true);

        disablingEl.dxWidget("instance").option("disabled", true);
        assert.equal(activeEl.hasClass(ACTIVE_STATE_CLASS), true);

        this.mouse.inactive();
        assert.equal(activeEl.hasClass(ACTIVE_STATE_CLASS), false);
    });

    QUnit.test("disabled state does not works correctly during click (B233180)", (assert) => {
        let clicked = 0;

        const element = $("#slider").dxWidget({
            disabled: true,
            clickAction() {
                clicked++;
            }
        });

        pointerMock(element).start().click();
        assert.equal(clicked, 0);
    });

    QUnit.test("hover state on dxhoverstart/dxhoverend", (assert) => {
        const element = $("#widget").dxWidget({ hoverStateEnabled: true });

        assert.ok(!element.hasClass(HOVER_STATE_CLASS), "element has not class dx-hover-state");

        element.trigger("dxhoverstart");
        assert.ok(element.hasClass(HOVER_STATE_CLASS), "element has class dx-hover-state after dxhoverstart");

        element.trigger("dxhoverend");
        assert.ok(!element.hasClass(HOVER_STATE_CLASS), "element has not class dx-hover-state after dxhoverend");
    });

    QUnit.test("hover state with option hoverStateEnabled - false", (assert) => {
        const element = $("#widget").dxWidget({ hoverStateEnabled: false });

        assert.ok(!element.hasClass(HOVER_STATE_CLASS), "element has not hover class");

        element.trigger("dxhoverstart");
        assert.ok(!element.hasClass(HOVER_STATE_CLASS), "element has not hover class after hover");
    });

    QUnit.test("hover state with option hoverStateEnabled - true/false", (assert) => {
        const element = $("#widget").dxWidget({ hoverStateEnabled: true });
        const instance = element.dxWidget("instance");

        assert.ok(!element.hasClass(HOVER_STATE_CLASS));

        element.trigger("dxhoverstart");
        assert.ok(element.hasClass(HOVER_STATE_CLASS), "element has hover after dxhoverstart");

        instance.option("hoverStateEnabled", false);
        assert.ok(!element.hasClass(HOVER_STATE_CLASS), "element has not hover after change hoverStateEnabled to false");
    });

    QUnit.test("hover state on dxhoverstart/dxhoverend on nested elements by _activeStateUnit", (assert) => {
        if(!devices.real().generic) {
            assert.ok(true, "hover, triggered by dxpointerenter, does not work on mobile devices");
            return;
        }

        const element = $("#widget").dxWidget({ hoverStateEnabled: false });
        const instance = element.dxWidget("instance");
        const item1 = $("<div>").addClass("widget-item-hover");
        const item2 = $("<div>").addClass("widget-item-hover");

        instance.$element()
            .append(item1)
            .append(item2);

        instance._activeStateUnit = ".widget-item-hover";
        instance.option("hoverStateEnabled", true);

        element.trigger({ target: item1.get(0), type: "dxpointerenter", pointerType: "mouse" });

        assert.equal(item1.hasClass(HOVER_STATE_CLASS), true, "first element has hovered class after hover");
        assert.equal(item2.hasClass(HOVER_STATE_CLASS), false, "second element has not hovered class after hover on first");

        element.trigger({ target: item2.get(0), type: "dxpointerenter", pointerType: "mouse" });

        assert.equal(item1.hasClass(HOVER_STATE_CLASS), false, "first element has not hovered class after hover on second");
        assert.equal(item2.hasClass(HOVER_STATE_CLASS), true, "second element has hovered class after hover");
    });

    QUnit.test("allow to use widget CSS classes (T145015)", (assert) => {
        assert.expect(0);

        const element = $("#widget").addClass("dx-test");
        element
            .trigger("dxpointerdown")
            .trigger("dxpointerup")
            .trigger("dxclick");
    });
});

QUnit.module("widget sizing render", {}, () => {
    QUnit.test("constructor", (assert) => {
        const $element = $("#widget").dxWidget({ width: 1234 });
        const instance = $element.dxWidget("instance");

        assert.strictEqual(instance.option("width"), 1234);
        assert.strictEqual($element.outerWidth(), 1234, "outer width of the element must be equal to custom width");
    });

    QUnit.test("root with custom percent width and option", (assert) => {
        const $element = $("#widthRootStylePercent").dxWidget({ width: "70%" });

        assert.strictEqual($element[0].style.width, "70%");
    });

    QUnit.test("change width", (assert) => {
        const $element = $("#widget").dxWidget();
        const instance = $element.dxWidget("instance");
        const customWidth = 1234;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });
});

QUnit.module("templates support", {}, () => {
    const TestContainer = Widget.inherit({
        NAME: "TestContainer",

        _renderContentImpl() {
            if(this.option("integrationOptions.templates").template) {
                this.option("integrationOptions.templates").template.render({ container: this.$element() });
            }
        }
    });

    registerComponent("TestContainer", TestContainer);

    QUnit.test("internal template collection", (assert) => {
        const testContainer = new TestContainer("#container", {});
        const templateCollection = testContainer.option("integrationOptions.templates");

        assert.ok(templateCollection["item"] instanceof Template);
        assert.ok(templateCollection["group"] instanceof Template);
    });

    QUnit.test("internal template as name (string)", (assert) => {
        const testContainer = new TestContainer("#container", { template1: "item", template2: "group" });
        const templateCollection = testContainer.option("integrationOptions.templates");

        assert.strictEqual(testContainer._getTemplateByOption("template1"), templateCollection["item"]);
        assert.strictEqual(testContainer._getTemplateByOption("template2"), templateCollection["group"]);
    });

    // T312012
    QUnit.test("internal row template as name (string)", (assert) => {
        const testContainer = new TestContainer("#container", { rowTemplate: "rowItem" });

        const $row = testContainer._getTemplateByOption("rowTemplate").render();
        assert.strictEqual($row.length, 1, "one element is rendered");
        assert.strictEqual($row[0].tagName, "TR", "tr is rendered"); // T484419
        assert.strictEqual($row.html(), "<td>item template content</td>", "tr contains td with content");
    });

    QUnit.test("internal template as function returning name", (assert) => {
        const testContainer = new TestContainer("#container", {
            template1() {
                return "item";
            },
            template2() {
                return "group";
            }
        });

        assert.strictEqual(testContainer._getTemplateByOption("template1").render().text(), "item template content");
        assert.strictEqual(testContainer._getTemplateByOption("template2").render().text(), "group template content");
    });

    QUnit.test("external template as DOM Element", (assert) => {
        const testContainer = new TestContainer("#container", {
            template: $("[data-options*=dxTemplate]").get(0)
        });

        assert.ok(testContainer._getTemplateByOption("template") instanceof Template);
    });

    QUnit.test("external template as jQuery", (assert) => {
        const testContainer = new TestContainer("#container", {
            template: $("[data-options*=dxTemplate]")
        });

        assert.ok(testContainer._getTemplateByOption("template") instanceof Template);
    });

    QUnit.test("external template as script element", (assert) => {
        const testContainer = new TestContainer("#container", {
            template: $("#scriptTemplate")
        });

        const template = testContainer._getTemplateByOption("template");

        assert.ok(template instanceof Template);
        assert.ok(template.render().is(".myTemplate"));
    });

    QUnit.test("external custom template should call onRendered method without templatesRenderAsynchronously", (assert) => {
        const templateRenderer = function() {
            return this.name;
        };

        const onRenderedHandler = sinon.spy();

        const testContainer = new TestContainer("#container", {
            templatesRenderAsynchronously: false,
            integrationOptions: {
                templates: {
                    "testTemplate": {
                        name: "TestTemplate",
                        render: templateRenderer
                    }
                }
            },
            template: "testTemplate"
        });

        const template = testContainer._getTemplateByOption("template");

        const renderResult = template.render({ onRendered: onRenderedHandler });

        assert.equal(template.name, "TestTemplate", "template is correct");
        assert.equal(renderResult, "TestTemplate", "render method should have correct context");
        assert.equal(onRenderedHandler.callCount, 1, "onRendered has been called");

        assert.equal(testContainer.option("integrationOptions.templates").testTemplate.render, templateRenderer, "template renderer is preserved");
    });

    QUnit.test("external custom template should call onRendered method without templatesRenderAsynchronously (template.render exists)", (assert) => {
        const onRenderedHandler = sinon.spy();

        const testContainer = new TestContainer("#container", {
            templatesRenderAsynchronously: false,
            template: {
                render() {
                    return 'template result';
                }
            }
        });

        const template = testContainer._getTemplateByOption("template");

        const renderResult = template.render({ onRendered: onRenderedHandler });

        assert.equal(renderResult, "template result", "render method should have correct context");
        assert.equal(onRenderedHandler.callCount, 1, "onRendered has been called");
    });

    QUnit.test("shared external template as script element", (assert) => {
        const testContainer1 = new TestContainer("#container", {
            template: $("#scriptTemplate")
        });

        const template1 = testContainer1._getTemplateByOption("template");

        assert.ok(template1 instanceof Template);
        assert.ok(template1.render().is(".myTemplate"));

        const testContainer2 = new TestContainer("#container2", {
            template: $("#scriptTemplate")
        });

        const template2 = testContainer2._getTemplateByOption("template");

        assert.ok(template2 instanceof Template);
        assert.ok(template2.render().is(".myTemplate"));
    });

    QUnit.test("external template as function returning element", (assert) => {
        const testContainer = new TestContainer("#container", {
            template() {
                return $("#scriptTemplate");
            }
        });

        const template = testContainer._getTemplateByOption("template");

        assert.ok(template instanceof TemplateBase);
        assert.ok(template.render().is(".myTemplate"));
    });

    QUnit.test("named template should be cut", (assert) => {
        new TestContainer("#container", {});

        assert.equal($("#container").contents().filter((_, el) => {
            return el.nodeType === 1;
        }).length, 0);
    });

    QUnit.test("anonymous template should be cut even if it contain script tag", (assert) => {
        new TestContainer("#widgetWithScriptInTemplate", {});

        assert.equal($("#widgetWithScriptInTemplate").contents().filter((_, el) => {
            return el.nodeType === 1;
        }).length, 1);
    });

    QUnit.test("shared template as Template instance", (assert) => {
        const template = new Template();
        const testContainer = new TestContainer("#container", { myTemplate: template });
        assert.strictEqual(testContainer._getTemplateByOption("myTemplate"), template);
    });

    QUnit.test("shared template as Template interface", (assert) => {
        const renderHandler = sinon.spy();

        const template = {
            render: renderHandler
        };

        const fakeTemplate = {
            fakeRender() {
            }
        };

        let testContainer;

        testContainer = new TestContainer("#container", { myTemplate: template });
        testContainer._getTemplateByOption("myTemplate").render();
        assert.deepEqual(renderHandler.callCount, 1, "object with render function acquired as template");

        testContainer = new TestContainer("#container", { myTemplate: fakeTemplate });
        assert.notDeepEqual(testContainer._getTemplateByOption("myTemplate"), fakeTemplate);
    });

    QUnit.test("template should not be rendered if function return null or undefined", (assert) => {
        const testContainer = new TestContainer("#container", {
            nullTemplate() {
                return null;
            },
            undefinedTemplate() {
                return;
            }
        });

        const nullTemplate = testContainer._getTemplateByOption("nullTemplate");
        const undefinedTemplate = testContainer._getTemplateByOption("undefinedTemplate");

        assert.equal(nullTemplate.render().length, 0, "null template not rendered");
        assert.equal(undefinedTemplate.render().length, 0, "undefined template not rendered");
    });

    QUnit.test("dynamically created with function template should be removed after rendering", (assert) => {
        try {
            const text = "some text template";
            let disposed = false;

            Template.prototype.dispose = function() {
                if($.trim(this.render({ model: {}, container: $("<div>") }).text()) === text) {
                    disposed = true;
                }
            };

            const testContainer = new TestContainer("#container", {
                template() {
                    return text;
                }
            });

            const template = testContainer._getTemplateByOption("template");

            template.render({ model: {}, container: $("<div>") });

            assert.ok(disposed, "template was disposed");
        } finally {
            delete Template.prototype.dispose;
        }
    });

    QUnit.test("dynamically created with function template should not be removed after rendering if it has another owner", (assert) => {
        try {
            const text = "some text template";
            let disposed = false;

            Template.prototype.dispose = () => {
                if($.trim(this.render({ model: {}, container: $("<div>") }).text()) === text) {
                    disposed = true;
                }
            };

            const testContainer = new TestContainer("#container", {
                ownedTemplate: text,
                template() {
                    return testContainer._getTemplateByOption("ownedTemplate");
                }
            });

            const template = testContainer._getTemplateByOption("template");

            template.render({ model: {}, container: $("<div>") });

            assert.ok(!disposed, "template won't disposed");
        } finally {
            delete Template.prototype.dispose;
        }
    });

    $.each({ string: "custom text", element: $("<span>") }, (name, data) => {
        QUnit.test("dynamically created from " + name + " template should be removed after rendering", (assert) => {
            let disposed = false;

            const testContainer = new TestContainer("#container", {
                template: data
            });

            const template = testContainer._getTemplateByOption("template");

            template.dispose = () => {
                disposed = true;
            };

            testContainer.$element().remove();

            assert.ok(disposed, "template disposed");
        });
    });

    $.each({ node: document.createElement("span"), jquery: $("<span>") }, (name, element) => {
        if(name === "jquery") {
            element = element.get(0);
        }

        QUnit.test("dynamically created " + name + " template should save data associated with it", (assert) => {
            dataUtils.data(element, "key", "value");

            const testContainer = new TestContainer("#container", {
                template() {
                    return element;
                }
            });

            const template = testContainer._getTemplateByOption("template");

            assert.equal(template.render().data("key"), "value", "data was not removed");
        });
    });

    QUnit.test("custom config parser", (assert) => {
        const originalParser = config().optionsParser;
        config({ optionsParser: JSON.parse });

        let testContainer;
        try {
            testContainer = new TestContainer("#container-custom-config", {});
        } finally {
            config({ optionsParser: originalParser });
        }
        const templateCollection = testContainer.option("integrationOptions.templates");

        assert.ok(templateCollection["item"] instanceof Template);
        assert.ok(templateCollection["group"] instanceof Template);
    });
});

QUnit.module("templates caching", {
    beforeEach: () => {
        this.compileCalled = 0;
        this.integrationOptions = {
            createTemplate: source => {
                this.compileCalled++;
                return {
                    render() {
                        return source.contents();
                    }
                };
            }
        };
        this.TestContainer = Widget.inherit({
            NAME: "TestContainer",

            _renderContentImpl() {
                this._getTemplateByOption("template")
                    .render({ container: this.$element() });
            }
        });

        $("<script id='external-template' type='text/html'>template string</script>")
            .appendTo("#qunit-fixture");
    }
}, () => {
    QUnit.test("template defined by jquery should be cached", (assert) => {
        const testContainer = new this.TestContainer($("<div>").appendTo("#qunit-fixture"), {
            integrationOptions: this.integrationOptions,
            template: $("#external-template")
        });
        testContainer.repaint();

        assert.equal(this.compileCalled, 1);
    });

    QUnit.test("template defined by string should be cached", (assert) => {
        const testContainer = new this.TestContainer($("<div>").appendTo("#qunit-fixture"), {
            integrationOptions: this.integrationOptions,
            template: "#external-template"
        });
        testContainer.repaint();

        assert.equal(this.compileCalled, 1);
    });
});

QUnit.module("platform specific templates", {
    beforeEach: () => {
        const TestContainerWidget = Widget.inherit({
            NAME: "TestContainerWidget",

            _renderContentImpl() {
                if(this.option("integrationOptions.templates")["item"]) {
                    this.option("integrationOptions.templates")["item"].render({ container: this.$element() });
                }
            }
        });

        registerComponent("TestContainerWidget", TestContainerWidget);
        this.currentDevice = devices.current();
    },

    afterEach: () => {
        delete $.fn["TestContainerWidget"];
        devices.current(this.currentDevice);
    }
}, () => {
    QUnit.test("init template depends on platform", (assert) => {
        devices.current({ platform: "ios" });
        const $testContainer = $("#platformSpecificContainer").TestContainerWidget();
        assert.equal($testContainer.children().eq(0).text(), "ios", "correct template was chosen");
    });

    QUnit.test("search best template", (assert) => {
        devices.current({ platform: "win" });
        const $testContainer = $("#platformSpecificContainer").TestContainerWidget();
        assert.equal($testContainer.children().eq(0).text(), "common", "best template was chosen");
    });

    QUnit.test("container widget without best template", (assert) => {
        devices.current({ platform: "win" });
        const $testContainer = $("#platformSpecificContainer2").TestContainerWidget();
        const instance = $testContainer.TestContainerWidget("instance");

        assert.equal(instance.option("integrationOptions.templates")["item"], undefined, "could not find template for selected platform");
    });

    QUnit.test("several best templates for widget", (assert) => {
        devices.current({ platform: "ios" });
        const $testContainer = $("#platformSpecificContainer2").TestContainerWidget();
        assert.equal($testContainer.children().eq(0).text(), "ios", "choose first best template");
    });
});

QUnit.module("template support regressions", {
    beforeEach: () => {
        const TestContainer = Widget.inherit({
            NAME: "TestContainer",

            _renderContentImpl() {
                if(this.option("integrationOptions.templates").template) {
                    this.option("integrationOptions.templates").template.render({ container: this.$element() });
                }
            }
        });

        const TestWidget = Widget.inherit({
            NAME: "TestWidget",

            _render() {
                this.callBase();
                this.$element().text("test");
            }
        });

        registerComponent("TestContainer", TestContainer);
        registerComponent("TestWidget", TestWidget);
    },

    afterEach: () => {
        delete $.fn["TestContainer"];
        delete $.fn["TestWidget"];
    }
}, () => {
    QUnit.test("B235090 - Unable to render container widget content (jQuery plug-in scenario)", (assert) => {
        assert.expect(2);

        const $testContainer = $("#jQueryContainerWidget");
        $testContainer.TestContainer({
            onContentReady() {
                $("#innerWidget").TestWidget({});
                assert.equal($testContainer.children().length, 1);
                assert.equal($testContainer.children().eq(0).text(), "test");
            }
        });
    });

    QUnit.test("container widget should ignore unknown data-options params (B253554)", (assert) => {
        assert.expect(0);

        $.each([
            "<div data-options=\"dxTest : { title: 'View2' }\" >123</div>",
            "<div data-options=\"dxTest : { title: 'View2' }, dxTemplate: { name: 'content' } \" >123</div>",
            "<div data-options=\"dxTemplate:{name:'content'}, dxTest : { title: 'View2' } \" >123</div>",
            "<div data-options=\"dxTest: { title: 'View2' },dxTemplate: { name: 'content' }, dxTest123: true \">123</div>",
            "<div data-options=\"dxTest : {title: 'View2' },dxTemplate: { name: 'content' }, dxTest123: true \" >123</div>",
            "<div data-options=\"dxTest : {title: 'View2' }, dxTemplate:  {  name:  'content'}\" >123</div>",
            "<div data-options=\"dxTest : {title: 'View2' }, dxtemplate:  {  name:  'content'}\" >123</div>",
            "<div data-options=\"dxTest : {title: 'View2', dxTemplate:  {  name:  'content'} } \" >123</div>"
        ], () => {
            let $element;
            try {
                $element = $("<div></div>")
                    .append(this)
                    .appendTo("#qunit-fixture")
                    .TestContainer({});
            } finally {
                $element.remove();
            }
        });
    });
});

QUnit.module("keyboard navigation", {}, () => {
    QUnit.test("widget obtaining focus after click on its inner element (T242395)", (assert) => {
        assert.expect(1);

        const $element = $("#widget").dxWidget({ focusStateEnabled: true });
        let isPrevented = false;

        $element.append($("<div>", { style: "width: 10px; height: 10px;" }));

        if(document["onbeforeactivate"] !== undefined) {
            const $inner = $element.find("div").eq(0);
            $element.on("beforeactivate", e => {
                isPrevented = e.isDefaultPrevented();
            });
            $inner.trigger("beforeactivate");

            assert.ok(isPrevented, "native focus set to widget");
        } else {
            assert.notOk(isPrevented, "native focus set to widget");
        }
    });

    QUnit.test("supported keys should have an event as a parameter", (assert) => {
        const supportedKeysHandler = sinon.stub().returns({
            "a": () => {
            }
        });

        const TestWidget = Widget.inherit({
            NAME: "TestWidget",
            _supportedKeys: supportedKeysHandler
        });

        const $element = $("#widget");

        new TestWidget($element, { focusStateEnabled: true });

        const kb = keyboardMock($element);
        kb.press("a");

        assert.equal(supportedKeysHandler.callCount, 1, "supportedKeys was called");
        assert.equal(supportedKeysHandler.getCall(0).args[0].type, "keydown", "event is correct");
    });

    QUnit.test("focus state", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true });

        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), false, "element has not dx-state-focus class");
        assert.equal($element.attr("tabindex"), 0, "element has tabindex after focus");

        $element.trigger("focusin");
        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), true, "element has dx-state-focus class after focus");
    });

    QUnit.test("tabIndex option", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true, tabIndex: 3 });
        const instance = $element.dxWidget("instance");

        assert.equal($element.attr("tabindex"), 3, "element has right tabindex");
        instance.option("tabIndex", -1);

        assert.equal($element.attr("tabindex"), -1, "element has right tabindex after change");
    });

    QUnit.test("focus state option changed", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true });
        const instance = $element.dxWidget("instance");

        $element.trigger("focusin");
        instance.option("focusStateEnabled", false);
        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), false, "element has not dx-state-focus class after focus");

        instance.option("focusStateEnabled", true);
        $element.trigger("focusin");
        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), true, "element has not dx-state-focus class after focus");
    });

    QUnit.test("focus in disabled state", (assert) => {
        const $element = $("#widget").dxWidget({
            focusStateEnabled: true,
            disabled: true
        });

        const instance = $element.dxWidget("instance");

        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), false, "element has not dx-state-focus class");

        assert.equal($element.attr("tabindex"), null, "element has not tabindex after focus");

        $element.trigger("focusin");
        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), false, "element has not dx-state-focus class after focus in disabled state");

        instance.option("disabled", false);
        $element.trigger("focusin");
        assert.equal($element.hasClass(FOCUSED_STATE_CLASS), true, "element has dx-state-focus class after focus");
    });

    QUnit.test("registerKeyHandler function add key handler to widget", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true });
        const widget = $element.dxWidget("instance");
        const keyboard = keyboardMock($element);
        let handlerFired = 0;

        const handler = () => {
            handlerFired++;
        };

        widget.registerKeyHandler("tab", handler);
        keyboard.keyDown("tab");

        assert.equal(handlerFired, 1, "new handler fired");
    });

    QUnit.test("registerKeyHandler can attach a key handler to widget by a key code", (assert) => {
        const $element = $("#widget").dxWidget({ focusStateEnabled: true });
        const widget = $element.dxWidget("instance");
        const handler = sinon.stub();

        widget.registerKeyHandler("113", handler);

        const event = $.Event('keydown', { which: 113, key: "F2" });
        $element.trigger(event);

        assert.equal(handler.callCount, 1, "new handler fired");
    });

    QUnit.test("Call 'repaint' from 'onContentReady'", (assert) => {
        const keyHandler = sinon.stub();
        let firstCall = true;

        const $element = $("#widget").dxWidget({
            focusStateEnabled: true,
            onContentReady: function() {
                if(firstCall) {
                    firstCall = false;
                    this.repaint();
                }
            }
        });
        const widget = $("#widget").dxWidget("instance");
        widget.registerKeyHandler("A", keyHandler);

        keyboardMock($element).press("A");

        assert.strictEqual(keyHandler.callCount, 1, "keyHandler.callCount");
        assert.strictEqual(keyHandler.getCall(0).args[0].type, "keydown", "keyHandler.type");
    });
});

if(devices.current().deviceType === "desktop") {
    registerKeyHandlerTestHelper.runTests(QUnit, "dxWidget");
}

QUnit.module("isReady", {}, () => {
    QUnit.test("widget is ready after rendering", (assert) => {

        let isReadyOnInit;

        registerComponent("dxWidget", Widget.inherit({

            _init() {
                this.callBase();
                isReadyOnInit = this.isReady();
            }

        }));

        const $widget = $("#widget").dxWidget();

        assert.equal(isReadyOnInit, false, "widget is not ready on init");
        assert.equal($widget.dxWidget("isReady"), true, "widget is ready after render");

    });

    QUnit.test("widget doesn't throw if disposed before rendering (T717968)", (assert) => {

        deferUpdate(() => {
            new DxWidget("#widget").dispose();
        });

        assert.ok(true);
    });
});

QUnit.module("dataHelperMixin", {}, () => {
    QUnit.test("dataSource disposing should remove only widget handlers preserving existing handlers (T213769)", (assert) => {
        const TestWidget = Widget.inherit({
            NAME: "TestWidget",

            _setDefaultOptions() {
                this.callBase();

                this.option({
                    dataSource: null
                });
            },

            _init() {
                this.callBase();
                this._refreshDataSource();
            }

        }).include(DataHelperMixin);

        const dataSource = new DataSource({ store: [] });
        const changeHandler = () => {
        };
        const loadErrorHandler = () => {
        };
        const loadingChangedHandler = () => {
        };

        dataSource.on("changed", changeHandler);
        dataSource.on("loadError", loadErrorHandler);
        dataSource.on("loadingChanged", loadingChangedHandler);

        new TestWidget("#widget", {
            dataSource
        });

        $("#widget").remove();

        const events = dataSource._eventsStrategy._events;
        assert.ok(events.changed.has(changeHandler), "external 'change' handler still attached");
        assert.ok(events.loadError.has(loadErrorHandler), "external 'loadError' handler still attached");
        assert.ok(events.loadingChanged.has(loadingChangedHandler), "external 'loadingChanged' handler still attached");
    });
});

QUnit.module("aria accessibility", {}, () => {
    QUnit.test("aria-disabled", (assert) => {
        const $element = $("#widget").dxWidget({ disabled: true });
        const instance = $element.dxWidget("instance");

        assert.equal($element.attr("aria-disabled"), "true", "attribute test on init");

        instance.option("disabled", false);
        assert.equal($element.attr("aria-disabled"), undefined, "attribute test on option change");
    });

    QUnit.test("aria-hidden", (assert) => {
        const $element = $("#widget").dxWidget({ visible: false });
        const instance = $element.dxWidget("instance");

        assert.equal($element.attr("aria-hidden"), "true", "attribute test on init");

        instance.option("visible", true);
        assert.equal($element.attr("aria-hidden"), undefined, "attribute test on option change");
    });

    QUnit.test("setAria function", (assert) => {
        const $element = $("#widget").dxWidget();
        const instance = $element.dxWidget("instance");
        const $customTarget = $("<div>");

        instance.setAria("test", "test value 1");
        assert.equal($element.attr("aria-test"), "test value 1", "2 arguments should set aria-attribute to the aria target");

        instance.setAria("test", "test value 2", $customTarget);
        assert.equal($customTarget.attr("aria-test"), "test value 2", "3 arguments should set aria-attribute to the custom target");

        instance.setAria("role", "test role");
        assert.equal($element.attr("role"), "test role", "role should not add aria- prefix");

        instance.setAria("id", "test id");
        assert.equal($element.attr("id"), "test id", "id should not add aria- prefix");

        instance.setAria({
            role: "testing role",
            id: "testing id",
            label: "testing label"
        });
        assert.equal($element.attr("role"), "testing role", "multiple attribute role");
        assert.equal($element.attr("id"), "testing id", "multiple attribute id");
        assert.equal($element.attr("aria-label"), "testing label", "multiple attribute aria-label");

        instance.setAria({ "test": "test" }, $customTarget);
        assert.equal($customTarget.attr("aria-test"), "test", "custom target with object");
    });
});

QUnit.module("inner options cache", {}, () => {
    const TestWidget = Widget.inherit({
        NAME: "TestWidget",

        _init() {
            this.callBase();
            this._initInnerOptionCache("innerComponentOptions");
        },

        _renderInnerWidget() {
            return this._createComponent($("<div>"), Widget, extend({
                defaultOption: "Test"
            }, this._getInnerOptionsCache("innerComponentOptions")));
        },

        _render() {
            this.callBase();
            this.innerComponent = this._renderInnerWidget();
            this._bindInnerWidgetOptions(this.innerComponent, "innerComponentOptions");
        },

        _optionChanged(args) {
            switch(args.name) {
                case "innerComponentOptions":
                    this._innerOptionChanged(this.innerComponent, args);
                    break;
                default:
                    this.callBase(args);
            }
        }
    });

    QUnit.test("a user can redefine inner component options", (assert) => {
        const widget = new TestWidget("#widget", {
            innerComponentOptions: {
                someOption: "Test",
                defaultOption: "New"
            }
        });

        assert.strictEqual(widget.innerComponent.option("someOption"), "Test", "option has been passed");
        assert.strictEqual(widget.innerComponent.option("defaultOption"), "New", "default option has been redefined");
    });

    QUnit.test("two way binding should work with inner component options", (assert) => {
        const widget = new TestWidget("#widget", {});

        assert.strictEqual(widget.option("innerComponentOptions.defaultOption"), "Test", "inner component options has been loaded");

        widget.innerComponent.option("newOption", "Test");
        assert.strictEqual(widget.option("innerComponentOptions.newOption"), "Test", "option has been passed to the main widget");

        widget.option("innerComponentOptions", { newOption: "Test 2" });
        assert.strictEqual(widget.innerComponent.option("newOption"), "Test 2", "option has been passed to the inner widget");
        assert.strictEqual(widget.innerComponent.option("defaultOption"), "Test", "default option should not be redefined");
    });

    QUnit.test("inner component options should not be losed on dispose", (assert) => {
        const widget = new TestWidget("#widget", {
            innerComponentOptions: {
                someOption: "Test",
                defaultOption: "New"
            }
        });

        widget.repaint();

        assert.strictEqual(widget.innerComponent.option("someOption"), "Test", "option has been passed");
        assert.strictEqual(widget.innerComponent.option("defaultOption"), "New", "default option has been redefined");
    });

    QUnit.test("the exception should not be shown when the inner component is not exist yet", (assert) => {
        const widget = new TestWidget("#widget", {
            innerComponentOptions: {
                someOption: "Test",
                defaultOption: "New"
            }
        });

        delete widget.innerComponent;
        widget.option("innerComponentOptions.someOption", "Test2");
        widget.repaint();

        assert.strictEqual(widget.innerComponent.option("someOption"), "Test2", "option is correct");
    });
});
