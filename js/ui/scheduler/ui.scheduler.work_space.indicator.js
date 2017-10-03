"use strict";

var SchedulerWorkSpace = require("./ui.scheduler.work_space"),
    registerComponent = require("../../core/component_registrator");


var SchedulerWorkSpaceIndicator = SchedulerWorkSpace.inherit({

});
registerComponent("dxSchedulerWorkSpace", SchedulerWorkSpaceIndicator);
module.exports = SchedulerWorkSpaceIndicator;
