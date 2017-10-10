"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");

require("./integrationParts/base.tests.js");
require("./integrationParts/appointments.tests.js");
require("./integrationParts/multiWeekAppointments.tests.js");
require("./integrationParts/allDayAppointments.tests.js");
require("./integrationParts/recurringAppointments.tests.js");
require("./integrationParts/appointmentTooltip.tests.js");
require("./integrationParts/dateNavigator.tests.js");
require("./integrationParts/resources.tests.js");
require("./integrationParts/RTL.tests.js");
require("./integrationParts/viewSwitcher.tests.js");
require("./integrationParts/workSpace.tests.js");
require("./integrationParts/recurrenceRuleValidation.tests.js");
require("./integrationParts/timeline.tests.js");
require("./integrationParts/agenda.tests.js");
require("./integrationParts/draggingFromTooltip.tests.js");
