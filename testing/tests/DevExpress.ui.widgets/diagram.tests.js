import $ from "jquery";
const { test } = QUnit;
import "common.css!";
import "ui/diagram";
import { DiagramCommand } from "devexpress-diagram";

QUnit.testStart(() => {
    const markup = '<div id="diagram"></div>';
    $("#qunit-fixture").html(markup);
});

const TOOLBAR_SELECTOR = ".dx-diagram-toolbar";
const CONTEXT_MENU_SELECTOR = ".dx-has-context-menu:last";
const TOOLBAR_ITEM_ACTIVE_CLASS = "dx-format-active";
const MAIN_ELEMENT_SELECTOR = ".dxdi-control";
const SIMPLE_DIAGRAM = '{ "shapes": [{ "key":"107", "type":19, "text":"A new ticket", "x":1440, "y":1080, "width":1440, "height":720, "zIndex":0 }] }';
const DX_MENU_ITEM_SELECTOR = ".dx-menu-item";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#diagram").dxDiagram();
        this.instance = this.$element.dxDiagram("instance");
    }
};

QUnit.module("Diagram Toolbar", moduleConfig, () => {
    test("should fill toolbar with default items", (assert) => {
        let toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar("instance");
        assert.ok(toolbar.option("dataSource").length > 10);
    });
    test("should enable items on diagram request", (assert) => {
        let undoButton = findToolbarItem(this.$element, "undo").dxButton("instance");
        assert.ok(undoButton.option("disabled"));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option("disabled"));
    });
    test("should activate items on diagram request", (assert) => {
        assert.ok(findToolbarItem(this.$element, "center").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findToolbarItem(this.$element, "left").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findToolbarItem(this.$element, "center").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findToolbarItem(this.$element, "left").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test("button should raise diagram commands", (assert) => {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findToolbarItem(this.$element, "left").trigger("dxclick");
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test("selectBox should raise diagram commands", (assert) => {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, "Arial");
        const fontSelectBox = this.$element.find(TOOLBAR_SELECTOR).find(".dx-selectbox").eq(0).dxSelectBox("instance");
        fontSelectBox.option("value", "Arial Black");
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, "Arial Black");
    });
});
QUnit.module("Context Menu", moduleConfig, () => {
    test("should load default items", (assert) => {
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu("instance");
        assert.ok(contextMenu.option("items").length > 1);
    });
    test("should update items on showing", (assert) => {
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu("instance");
        assert.notOk(contextMenu.option("visible"));
        assert.notOk(contextMenu.option("items")[0].disabled);
        $(this.$element.find(MAIN_ELEMENT_SELECTOR).eq(0)).trigger("dxcontextmenu");
        assert.ok(contextMenu.option("visible"));
        assert.ok(contextMenu.option("items")[0].disabled);
    });
    test("should execute commands on click", (assert) => {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu("instance");
        $(this.$element.find(MAIN_ELEMENT_SELECTOR).eq(0)).trigger("dxcontextmenu");
        assert.ok(this.instance._diagramInstance.selection.isEmpty());
        $(contextMenu.itemsContainer().find(DX_MENU_ITEM_SELECTOR).eq(3)).trigger("dxclick");
        assert.notOk(this.instance._diagramInstance.selection.isEmpty());
    });
});

function findToolbarItem($diagram, label) {
    return $diagram.find(TOOLBAR_SELECTOR).find(".dx-widget").filter(function() {
        return $(this).text().toLowerCase().includes(label);
    });
}
