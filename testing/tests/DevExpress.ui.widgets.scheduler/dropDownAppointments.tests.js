"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    DropDownAppointments = require("ui/scheduler/ui.scheduler.appointments.drop_down"),
    Widget = require("ui/widget/ui.widget"),
    Color = require("color"),
    fx = require("animation/fx");

require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="ddAppointments"></div>');
});

QUnit.module("Common", {
    beforeEach: function() {
        var that = this;
        fx.off = true;

        this.editing = true;
        this.rtlEnabled = false;
        this.buttonWidth = 200;
        this.color;

        this.widgetMock = new (Widget.inherit({
            option: function(options) {
                if(options === "editing") {
                    return that.editing;
                }
                if(options === "rtlEnabled") {
                    return that.rtlEnabled;
                }
                return this.callBase(options);
            },
            fire: noop,
            deleteAppointment: noop,
            showAppointmentPopup: noop
        }))($("<div>"));

        this.renderDropDownAppointmentsContainer = function(items) {
            items = items || { data: [{ text: "a", startDate: new Date(2015, 1, 1) }], colors: [] };
            return $(new DropDownAppointments().render({
                $container: $("#ddAppointments"),
                coordinates: { top: 0, left: 0 },
                items: items,
                buttonWidth: this.buttonWidth,
                buttonColor: this.color
            }, this.widgetMock));
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("DropDown menu should be rendered with right class", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer();

    assert.ok($dropDownMenu.hasClass("dx-scheduler-dropdown-appointments"), "Container is rendered");
    assert.ok($dropDownMenu.data("dxButton"), "Container is button");
    assert.ok($dropDownMenu.hasClass("dx-dropdownmenu"), "DropDown menu is initialized");
});

QUnit.test("DropDown menu should be painted", function(assert) {
    this.color = "#0000ff";
    var $dropDownMenu = this.renderDropDownAppointmentsContainer();

    assert.equal(new Color($dropDownMenu.css("background-color")).toHex(), this.color, "Color is OK");
});

QUnit.test("DropDown menu should not be painted if items have different colors", function(assert) {
    this.color = "#0000ff";
    var $dropDownMenu = this.renderDropDownAppointmentsContainer({
        data: [
            { text: "a", startDate: new Date(2015, 1, 1) },
            { text: "b", startDate: new Date(2015, 1, 1) }
        ],
        colors: ["#fff000", "#000fff"]
    });

    assert.notEqual(new Color($dropDownMenu.css("background-color")).toHex(), this.color, "Color is OK");
});

QUnit.test("DropDown menu should have a correct markup", function(assert) {
    var $button = this.renderDropDownAppointmentsContainer(),
        $dropDownAppointmentsContent = $button.dxButton("instance").option("template");

    assert.equal($dropDownAppointmentsContent.length, 1, "Content is OK");
    assert.equal($dropDownAppointmentsContent.html().toLowerCase(), "<span>1</span><span>...</span>", "Markup is OK");
});

QUnit.test("DropDown menu should be rendered on dxclick", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer(),
        menu;

    $($dropDownMenu).trigger("dxclick");
    menu = $dropDownMenu.dxDropDownMenu("instance");

    assert.ok($dropDownMenu.hasClass("dx-dropdownmenu"), "DropDown menu is rendered");
    assert.ok(menu.option("opened"), "Menu is opened");
});

QUnit.test("DropDown menu should have a correct button template", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer(),
        menu,
        $buttonTemplate;

    $($dropDownMenu).trigger("dxclick");
    menu = $dropDownMenu.dxDropDownMenu("instance"),
    $buttonTemplate = menu.option("buttonTemplate");

    assert.ok($buttonTemplate.hasClass("dx-scheduler-dropdown-appointments-content"), "Template is OK");
    assert.equal($buttonTemplate.html().toLowerCase(), "<span>1</span><span>...</span>", "Button template is OK");
});


QUnit.test("DropDown menu button should have a correct width", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer(),
        menu;

    $($dropDownMenu).trigger("dxclick");
    menu = $dropDownMenu.dxDropDownMenu("instance");

    assert.equal(menu.option("buttonWidth"), this.buttonWidth, "DropDown menu button has a correct width");
});

QUnit.test("DropDown menu should be rendered only once", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer();
    $($dropDownMenu).trigger("dxclick");
    $($dropDownMenu).trigger("dxclick");

    assert.equal($(".dx-dropdownmenu").length, 1, "DropDown menu is rendered once");
});

QUnit.test("DropDown appointments should have a correct template", function(assert) {
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $infoBlock = $dropDownAppointment.find(".dx-scheduler-dropdown-appointment-info-block"),
        $buttonsBlock = $dropDownAppointment.find(".dx-scheduler-dropdown-appointment-buttons-block");

    dropDownMenu.open();

    assert.equal($infoBlock.find(".dx-scheduler-dropdown-appointment-title").length, 1, "Appointment title is OK");
    assert.equal($infoBlock.find(".dx-scheduler-dropdown-appointment-date").length, 1, "Appointment date is OK");
    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button").length, 1, "Remove button is rendered");
    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button").length, 1, "Edit button is rendered");
});

QUnit.test("DropDown appointments should have a left border", function(assert) {
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        borderWidth = parseInt($dropDownAppointment.css("border-left-width"), 10);

    assert.equal(borderWidth, 3, "Border is OK");
});

QUnit.test("DropDown appointments should have a right border in rtl mode", function(assert) {
    this.rtlEnabled = true;

    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        borderWidth = parseInt($dropDownAppointment.css("border-right-width"), 10);

    assert.equal(borderWidth, 3, "Border is OK");
});

QUnit.test("Grouped appointments should not have edit/remove buttons in the readonly mode", function(assert) {

    this.editing = false;

    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $buttonsBlock = $dropDownAppointment.find(".dx-scheduler-dropdown-appointment-buttons-block");

    dropDownMenu.open();

    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button").length, 0, "Remove button isn't rendered");
    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button").length, 0, "Edit button isn't rendered");
});

QUnit.test("Grouped appointments should not have edit button if editing is not allowed", function(assert) {

    this.editing = {
        allowUpdating: false,
        allowDeleting: true
    };

    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $buttonsBlock = $dropDownAppointment.find(".dx-scheduler-dropdown-appointment-buttons-block");

    dropDownMenu.open();

    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button").length, 1, "Remove button is rendered");
    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button").length, 0, "Edit button isn't rendered");
});

QUnit.test("Grouped appointments should not have delete button if deleting is not allowed", function(assert) {

    this.editing = {
        allowDeleting: false,
        allowUpdating: true
    };

    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $buttonsBlock = $dropDownAppointment.find(".dx-scheduler-dropdown-appointment-buttons-block");

    dropDownMenu.open();

    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button").length, 0, "Remove button isn't rendered");
    assert.equal($buttonsBlock.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button").length, 1, "Edit button is rendered");
});

QUnit.test("Propagation should be stopped after click on remove/edit button", function(assert) {
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $removeButton = $dropDownAppointment.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button"),
        $editButton = $dropDownAppointment.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button");

    dropDownMenu.open();

    $($removeButton).on("dxclick", function(e) {
        assert.ok(e.isPropagationStopped(), "Propagation is stopped");
    }).trigger("dxclick");

    $($editButton).on("dxclick", function(e) {
        assert.ok(e.isPropagationStopped(), "Propagation is stopped");
    }).trigger("dxclick");
});

QUnit.test("Click on the remove button should trigger the 'deleteAppointment' method", function(assert) {
    var deleteStub = sinon.stub(this.widgetMock, "deleteAppointment");
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $removeButton = $dropDownAppointment.find(".dx-button.dx-scheduler-dropdown-appointment-remove-button");

    dropDownMenu.open();

    $($removeButton).trigger("dxclick");

    assert.ok(deleteStub.calledOnce, "The 'deleteAppointment' method was called");
    assert.deepEqual(deleteStub.getCall(0).args[0], {
        text: "a",
        startDate: new Date(2015, 1, 1)
    }, "The 'deleteAppointment' method was called with correct args");

});

QUnit.test("Click on the edit button should trigger the 'showEditAppointmentPopup' method", function(assert) {
    var notifyObserverStub = sinon.stub(this.widgetMock, "fire");
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        $dropDownAppointment = $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first(),
        $editButton = $dropDownAppointment.find(".dx-button.dx-scheduler-dropdown-appointment-edit-button");

    dropDownMenu.open();

    $($editButton).trigger("dxclick");

    assert.ok(notifyObserverStub.called, "Observer was notified");
    assert.equal(notifyObserverStub.getCall(4).args[0], "showEditAppointmentPopup", "The 'showAppointmentPopup' method was called");
    assert.deepEqual(notifyObserverStub.getCall(4).args[1], {
        "data": {
            text: "a",
            startDate: new Date(2015, 1, 1)
        }
    }, "The 'showAppointmentPopup' method was called with correct args");
});

QUnit.test("Click on list item should not close menu", function(assert) {
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    $(".dx-dropdownmenu-list .dx-scheduler-dropdown-appointment").first().trigger("dxclick");

    assert.ok(dropDownMenu.option("opened"), "Menu is opened");
});

QUnit.test("List items should not have active and focused state", function(assert) {
    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    assert.strictEqual(dropDownMenu._list.option("activeStateEnabled"), false, "Active state isn't enabled");
    assert.strictEqual(dropDownMenu._list.option("focusStateEnabled"), false, "Focus state isn't enabled");
});


QUnit.test("the 'repaintExisting' should repaint dropdown menus", function(assert) {
    sinon.stub(this.widgetMock, "fire");

    this.renderDropDownAppointmentsContainer().trigger("dxclick");

    var dropDownMenu = $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance"),
        repaintStub = sinon.stub(dropDownMenu, "repaint");

    new DropDownAppointments().repaintExisting($("#ddAppointments"));

    assert.ok(repaintStub.calledOnce, "Menu is repainted");
});
