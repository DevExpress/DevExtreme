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
const DIAGRAM_FULLSCREEN_CLASS = "dx-diagram-fullscreen";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#diagram").dxDiagram();
        this.instance = this.$element.dxDiagram("instance");
    }
};

function getToolbarIcon(button) {
    return button.find(".dx-dropdowneditor-field-template-wrapper").find(".dx-diagram-i, .dx-icon");
}

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
    test("selectboxes with icon items should be replaced with select buttons", (assert) => {
        const $selectButtonTemplates = this.$element.find(TOOLBAR_SELECTOR).find(".dx-diagram-select-b").find(".dx-dropdowneditor-field-template-wrapper");
        assert.ok($selectButtonTemplates.length > 0, "select buttons are rendered");
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find(".dx-diagram-i").length, selectButtonsCount, "icons are rendered");
        assert.equal($selectButtonTemplates.find(".dx-textbox")[0].offsetWidth, 0, "textbox is hidden");
    });
    test("colorboxes should be replaced with color buttons", (assert) => {
        const $selectButtonTemplates = this.$element.find(TOOLBAR_SELECTOR).find(".dx-diagram-color-b").find(".dx-dropdowneditor-field-template-wrapper");
        assert.ok($selectButtonTemplates.length > 0, "color buttons are rendered");
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find(".dx-diagram-i, .dx-icon").length, selectButtonsCount, "icons are rendered");
        assert.equal($selectButtonTemplates.find(".dx-textbox")[0].offsetWidth, 0, "textbox is hidden");
    });
    test("colorbuttons should show an active color", (assert) => {
        const colorButton = this.$element.find(TOOLBAR_SELECTOR).find(".dx-diagram-color-b").first();
        assert.equal(getToolbarIcon(colorButton).css("borderBottomColor"), "rgb(0, 0, 0)");
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontColor).execute("rgb(255, 0, 0)");
        assert.equal(getToolbarIcon(colorButton).css("borderBottomColor"), "rgb(255, 0, 0)", "button changed via command");
        colorButton.find(".dx-dropdowneditor-button").trigger("dxclick");
        const $overlayContent = $(".dx-colorbox-overlay");
        $overlayContent.find(".dx-colorview-label-hex").find(".dx-textbox").dxTextBox("instance").option("value", "00ff00");
        $overlayContent.find(".dx-colorview-buttons-container .dx-colorview-apply-button").trigger("dxclick");
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontColor).getState().value, "#00ff00", "color changed by color button");
        assert.equal(getToolbarIcon(colorButton).css("borderBottomColor"), "rgb(0, 255, 0)", "button changed via coloredit");
    });
    test("colorbutton should show dropdown on icon click", (assert) => {
        const colorButton = this.$element.find(TOOLBAR_SELECTOR).find(".dx-diagram-color-b").first();
        const colorBox = colorButton.find(".dx-colorbox").dxColorBox("instance");
        getToolbarIcon(colorButton).trigger("dxclick");
        assert.ok(colorBox.option("opened"), true);
    });
    test("call .update() after accordion item collapsing/expanding", (assert) => {
        const clock = sinon.useFakeTimers();
        const $leftPanel = this.$element.find(".dx-diagram-left-panel");
        const scrollView = $leftPanel.find(".dx-scrollview").dxScrollView("instance");
        const updateSpy = sinon.spy(scrollView, "update");
        $leftPanel.find(".dx-accordion-item-title").first().trigger("dxclick");
        clock.tick(2000);
        assert.equal(updateSpy.callCount, 1, "scrollView.update() called once");
        clock.restore();
    });
    test("should toggle fullscreen class name on button click", (assert) => {
        assert.notOk(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
        let fullscreenButton = findToolbarItem(this.$element, "fullscreen");
        fullscreenButton.trigger("dxclick");
        assert.ok(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
        fullscreenButton.trigger("dxclick");
        assert.notOk(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
    });
    test("diagram should be focused after change font family", (assert) => {
        const fontSelectBox = this.$element.find(TOOLBAR_SELECTOR).find(".dx-selectbox").eq(0).dxSelectBox("instance");
        fontSelectBox.focus();
        fontSelectBox.open();
        const item = $(document).find(".dx-list-item-content").filter(function() {
            return $(this).text().toLowerCase().indexOf("arial black") >= 0;
        });
        assert.notOk(this.instance._diagramInstance.isFocused());
        item.trigger("dxclick");
        assert.ok(this.instance._diagramInstance.isFocused());
    });
    test("diagram should be focused after set font bold", (assert) => {
        const boldButton = findToolbarItem(this.$element, "bold");
        assert.notOk(this.instance._diagramInstance.isFocused());
        boldButton.trigger("dxclick");
        assert.ok(this.instance._diagramInstance.isFocused());
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
        return $(this).text().toLowerCase().indexOf(label) >= 0;
    });
}
