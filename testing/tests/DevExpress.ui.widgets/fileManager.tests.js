import $ from "jquery";
import "common.css!";

QUnit.testStart(() => {
    const markup = '<div id="fileManager"></div>';
    $("#qunit-fixture").html(markup);
});

import "./fileManagerParts/markup.tests.js";
import "./fileManagerParts/contextMenu.tests.js";
import "./fileManagerParts/detailsView.tests.js";
import "./fileManagerParts/toolbar.tests.js";
import "./fileManagerParts/navigation.tests.js";
import "./fileManagerParts/editing.tests.js";
import "./fileManagerParts/adaptivity.tests.js";
import "./fileManagerParts/editingProgress.tests.js";
import "./fileManagerParts/progressPanel.tests.js";
import "./fileManagerParts/fileItemsController.tests.js";

import "./fileManagerParts/common.tests.js";

import "./fileManagerParts/ajaxProvider.tests.js";
import "./fileManagerParts/arrayProvider.tests.js";
import "./fileManagerParts/remoteProvider.tests.js";
import "./fileManagerParts/customProvider.tests.js";
