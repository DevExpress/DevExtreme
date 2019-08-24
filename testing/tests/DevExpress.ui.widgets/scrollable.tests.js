import $ from "jquery";
import devices from "core/devices";
import { value as viewPort } from "core/utils/view_port";

viewPort($("#qunit-fixture").addClass("dx-viewport"));
devices.current("iPhone");

import "./scrollableParts/scrollable.main.tests.js";
import "./scrollableParts/scrollable.actions.tests.js";
import "./scrollableParts/scrollable.api.tests.js";
import "./scrollableParts/scrollable.constants.js";
import "./scrollableParts/scrollable.dynamic.tests.js";
import "./scrollableParts/scrollable.size.tests.js";
import "./scrollableParts/scrollable.keyboard.tests.js";
import "./scrollableParts/scrollable.mouseWheel.tests.js";
import "./scrollableParts/scrollable.rtl.tests.js";
import "./scrollableParts/scrollable.scrollbar.tests.js";
import "./scrollableParts/scrollable.scrollingByThumb.tests.js";
import "./scrollableParts/scrollable.useNative.tests.js";
