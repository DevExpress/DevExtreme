import $ from "jquery";
import devices from "core/devices";
import { value as viewPort } from "core/utils/view_port";

viewPort($("#qunit-fixture").addClass("dx-viewport"));
devices.current("iPhone");

QUnit.testStart(function() {
    var markup = '\
        <div id="scrollable" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2"></div>\
        </div>\
        <div id="scrollableVary" style="height: auto">\
            <div class="content3" style="height: 100px; width: 100px;"></div>\
        </div>\
        <div id="scrollableNeighbour"></div>\
        <div id="scrollable1" style="height: 100px;">\
            <div id="scrollable2" style="height: 50px;">\
                    <div class="innerContent"></div>\
            </div>\
            <div style="height: 100px;"></div>\
        </div>\
        <div id="scaledContainer" style="transform:scale(0.2, 0.5)">\
            <div style="height: 500px; width: 500px;">\
                <div id="scaledScrollable">\
                    <div id="scaledContent" style="height: 1000px; width: 1000px;"></div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

import "./scrollableParts/scrollable.main.tests.js";

import "./scrollableParts/scrollable.actions.tests.js";
import "./scrollableParts/scrollable.api.tests.js";
import "./scrollableParts/scrollable.constants.js";
import "./scrollableParts/scrollable.dynamic.tests.js";
import "./scrollableParts/scrollable.keyboard.tests.js";
import "./scrollableParts/scrollable.mouseWheel.tests.js";
import "./scrollableParts/scrollable.rtl.tests.js";
import "./scrollableParts/scrollable.scrollbar.tests.js";
import "./scrollableParts/scrollable.scrollingByThumb.tests.js";
import "./scrollableParts/scrollable.useNative.tests.js";
