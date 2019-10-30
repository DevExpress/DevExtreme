import $ from "jquery";
import TabPanel from "ui/tab_panel";
import { isDefined } from "core/utils/type";

QUnit.testStart(() => {
    const markup =
        '<div id="tabPanel">\
            <div data-options="dxTemplate: { name: \'title\' }">\
                <div data-bind="text: $data.text"></div>\
            </div>\
            \
            <div data-options="dxTemplate: { name: \'item\' }">\
                <p>First Name: <i data-bind="text: $data.firstName"></i></p>\
                <p>Last Name: <i data-bind="text: $data.lastName"></i></p>\
                <p>Birth Year: <i data-bind="text: $data.birthYear"></i></p>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const TABPANEL_CLASS = "dx-tabpanel",
    MULTIVIEW_CLASS = "dx-multiview",
    TABS_CLASS = "dx-tabs",
    MULTIVIEW_ITEM_CLASS = "dx-multiview-item",
    TABS_ITEM_CLASS = "dx-tab",
    MUTIVIEW_WRAPPER_CLASS = "dx-multiview-wrapper";

const toSelector = cssClass => "." + cssClass;

const nestedElementsCount = function($element, cssClass) {
    return $element.find(toSelector(cssClass)).length;
};

QUnit.module("TabPanel markup", () => {
    QUnit.test("tabPanel should have correct class", (assert) => {
        const $tabPanel = $("#tabPanel").dxTabPanel();
        assert.ok($tabPanel.hasClass(TABPANEL_CLASS), "widget class added");
    });

    QUnit.test("rendering tabs widget test", (assert) => {
        const $tabPanel = $("#tabPanel").dxTabPanel();
        assert.ok($tabPanel.find("." + TABS_CLASS), "tabs widget added");
    });

    QUnit.test("rendering multiview widget test", (assert) => {
        const $tabPanel = $("#tabPanel").dxTabPanel();
        assert.ok($tabPanel.hasClass(MULTIVIEW_CLASS), "multiview widget added");
    });

    QUnit.test("count of nested widget elements test", (assert) => {
        assert.expect(1);

        const items = [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
            { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }];

        const $tabPanel = $("#tabPanel").dxTabPanel({
            dataSource: items
        });

        var tabsCount = nestedElementsCount($tabPanel.find("." + TABS_CLASS), TABS_ITEM_CLASS);
        var multiViewItemsCount = nestedElementsCount($tabPanel.find("." + MUTIVIEW_WRAPPER_CLASS), MULTIVIEW_ITEM_CLASS);

        assert.equal(tabsCount, multiViewItemsCount, "tab widget items count and multiview widget items count is equal");
    });
});

QUnit.module("TabPanel items", () => {
    QUnit.test("items option test - changing a single item at runtime", (assert) => {
        const items = [
            { text: "Greg", title: "Name" }
        ];

        const $tabPanel = $("<div>").appendTo("#qunit-fixture");

        const tabPanel = $tabPanel.dxTabPanel({
            items: items
        }).dxTabPanel("instance");

        tabPanel.option("items[0].title", "test");

        assert.equal($tabPanel.find(toSelector(TABS_ITEM_CLASS)).eq(0).text(),
            "test", "option <items> of nested tabs widget successfully changed - tabs were rerendered");
    });

    QUnit.test("itemTitleTemplate rendering test", (assert) => {
        assert.expect(2);

        const items = [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
            { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }];

        const $tabPanel = $("#tabPanel").dxTabPanel({
            items: items,
            itemTitleTemplate: $("<span>Template</span>")
        });
        const tabPanelInstance = $tabPanel.dxTabPanel("instance");
        const tabWidgetInstance = $tabPanel.find(toSelector(TABS_CLASS)).dxTabs("instance");

        assert.deepEqual(tabWidgetInstance.itemElements().eq(0).text(),
            "Template",
            "option <itemTitleTemplate> successfully passed to nested tabs widget");

        tabPanelInstance.option("itemTitleTemplate", $("<span>Changed template</span>"));

        assert.deepEqual(tabWidgetInstance.itemElements().eq(0).text(),
            "Changed template",
            "option <itemTitleTemplate> of nested tabs widget successfully changed");
    });

    QUnit.test("disabled item should be rendered correctly", (assert) => {
        const items = [
            { text: "Greg", title: "Name" },
            { text: "Albert", title: "Name" }
        ];

        const tabPanel = $("#tabPanel").dxTabPanel({
            items: items,
            itemTitleTemplate: $("<span>Template</span>")
        }).dxTabPanel("instance");

        tabPanel.option("items[1].disabled", true);

        const $disabledItem = tabPanel.itemElements().eq(1),
            $tabs = tabPanel.$element().find("." + TABS_ITEM_CLASS);

        assert.ok($disabledItem.hasClass("dx-state-disabled"), "Item is disabled");
        assert.notEqual($tabs.length, 0, "Tabs are rendered");
    });

    ["titleValue", null, undefined, "", 0, 1, new Date(), { value: "title" }].forEach((title) => {
        QUnit.test(`DefaultTemplate: title template property - ${title}`, (assert) => {
            const items = [
                { text: "Tab text 1", icon: "comment", title: title },
                { text: "", icon: "", title: title }
            ];
            const $element = $("<div>").appendTo("#qunit-fixture");

            new TabPanel($element, { items: items });

            const $itemElements = $element.find(toSelector(TABS_CLASS)).dxTabs("instance").itemElements();
            const expectedTitleValue = isDefined(title) ? String(title) : "[object Object]";

            assert.strictEqual($itemElements.eq(0).find(".dx-tab-text").text(), expectedTitleValue, "item.title");
            assert.strictEqual($itemElements.eq(1).find(".dx-tab-text").text(), expectedTitleValue, "item.title");

            assert.strictEqual($itemElements.eq(0).find(".dx-icon-comment").length, 1, "item.icon");
            assert.strictEqual($itemElements.eq(1).find(".dx-icon").length, 0, "item.icon");
        });

        QUnit.test(`DefaultTemplate: items["${title}"] as primitive`, (assert) => {
            const items = [ title ];
            const $element = $("<div>").appendTo("#qunit-fixture");

            new TabPanel($element, { items: items });

            const $itemElements = $element.find(toSelector(TABS_CLASS)).dxTabs("instance").itemElements();

            assert.strictEqual($itemElements.eq(0).find(".dx-tab-text").text(), String(title), "item.title");
            assert.strictEqual($itemElements.eq(1).find(".dx-icon").length, 0, "item.icon");
        });
    });
});

QUnit.module("aria accessibility", () => {
    QUnit.test("aria role", (assert) => {
        const $element = $("#tabPanel").dxTabPanel();
        assert.equal($element.attr("role"), "tabpanel");
    });

    QUnit.test("tabpanel should NOT have aria-activedescendant", (assert) => {
        const $element = $("#tabPanel").dxTabPanel({ items: [1, 2] }),
            instance = $element.dxTabPanel("instance");

        assert.equal($element.attr("aria-activedescendant"), undefined, "aria-activedescendant does not exist");

        instance.option("focusedElement", $element.find(".dx-item:eq(1)"));
        assert.equal($element.attr("aria-activedescendant"), undefined, "aria-activedescendant does not exist after selection update");
    });
});
