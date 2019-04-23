import $ from "jquery";
import { noop } from "core/utils/common";
import Widget from "ui/widget/ui.widget";
import Color from "color";
import fx from "animation/fx";
import { CompactAppointmentsHelper } from "ui/scheduler/compactAppointmentsHelper";
import "common.css!";
import "generic_light.css!";

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

        var subscribes = {
            mapAppointmentFields: function(config) {
                var result = {
                    appointmentData: config.itemData,
                    appointmentElement: config.itemElement
                };

                return result;
            },
            showEditAppointmentPopup: function(args) {
                this.showAppointmentPopup(args);
            },
            appendSingleAppointmentData: function(args) {
                return args.appointmentData;
            }
        };

        this.widgetMock = new (Widget.inherit({
            option: function(options) {
                if(options === "editing") {
                    return that.editing;
                }
                if(options === "rtlEnabled") {
                    return that.rtlEnabled;
                }
                if(options === "dropDownAppointmentTemplate") {
                    return "dropDownAppointment";
                }
                if(options === "appointmentCollectorTemplate") {
                    return "appointmentCollector";
                }
                return this.callBase(options);
            },
            _getAppointmentTemplate: function(template) {
                return this._getTemplateByOption(template);
            },
            _allowDragging: function() {
                return true;
            },
            fire: function(subject) {
                var callback = subscribes[subject],
                    args = Array.prototype.slice.call(arguments);

                return callback && callback.apply(this, args.slice(1));
            },
            deleteAppointment: noop,
            showAppointmentPopup: noop
        }))($("<div>"));

        this.renderDropDownAppointmentsContainer = function(items, options) {
            const helper = new CompactAppointmentsHelper(this.widgetMock);
            items = items || { data: [{ text: "a", startDate: new Date(2015, 1, 1) }], colors: [] };
            return helper.render($.extend(options, {
                $container: $("#ddAppointments"),
                coordinates: { top: 0, left: 0 },
                items: items,
                buttonWidth: this.buttonWidth,
                buttonColor: $.Deferred().resolve(this.color)
            }));

            // return $(new CompactAppointmentsDesktopStrategy().render($.extend(options, {
            //     $container: $("#ddAppointments"),
            //     coordinates: { top: 0, left: 0 },
            //     items: items,
            //     buttonWidth: this.buttonWidth,
            //     buttonColor: $.Deferred().resolve(this.color)
            // }), this.widgetMock));
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("DropDown menu should be rendered with right class", function(assert) {
    var $dropDownMenu = this.renderDropDownAppointmentsContainer();
    assert.ok($dropDownMenu.hasClass("dx-scheduler-appointment-collector"), "Container is rendered");
    assert.ok($dropDownMenu.dxButton("instance"), "Container is button");
});

QUnit.test("DropDown menu should be painted", function(assert) {
    this.color = "#0000ff";
    var $dropDownMenu = this.renderDropDownAppointmentsContainer();

    assert.equal(new Color($dropDownMenu.css("backgroundColor")).toHex(), this.color, "Color is OK");
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

    assert.notEqual(new Color($dropDownMenu.css("backgroundColor")).toHex(), this.color, "Color is OK");
});

QUnit.test("DropDown menu should have a correct markup", function(assert) {
    var $button = this.renderDropDownAppointmentsContainer(),
        $dropDownAppointmentsContent = $button.find(".dx-scheduler-appointment-collector-content");

    assert.equal($dropDownAppointmentsContent.length, 1, "Content is OK");
    assert.equal($dropDownAppointmentsContent.html().toLowerCase(), "<span>1 more</span>", "Markup is OK");
});
