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
const TOOLBAR_ITEM_ACTIVE_CLASS = "dx-format-active";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#diagram").dxDiagram();
        this.instance = this.$element.dxDiagram("instance");
    }
};

QUnit.module("Diagram Toolbar", moduleConfig, () => {
    test("should fill toolbar with default items", (assert) => {
        let toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar("instance");
        assert.equal(toolbar.option("dataSource").length, 17);
    });
    test("should enable items on diagram request", (assert) => {
        let undoButton = findToolbarItem(this.$element, "undo").dxButton("instance");
        assert.ok(undoButton.option("disabled"));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option("disabled"));
    });
    test("should activate items on diagram request", (assert) => {
        assert.ok(findToolbarItem(this.$element, "aligncenter").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findToolbarItem(this.$element, "alignleft").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findToolbarItem(this.$element, "aligncenter").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findToolbarItem(this.$element, "alignleft").hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test("button should raise diagram commands", (assert) => {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findToolbarItem(this.$element, "alignleft").trigger("dxclick");
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test("selectBox should raise diagram commands", (assert) => {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, "Arial");
        const fontSelectBox = this.$element.find(TOOLBAR_SELECTOR).find(".dx-selectbox").eq(0).dxSelectBox("instance");
        fontSelectBox.option("value", "Arial Black");
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, "Arial Black");
    });
});

function findToolbarItem($diagram, label) {
    return $diagram.find(TOOLBAR_SELECTOR).find(`[aria-label='${label}']`);
}
