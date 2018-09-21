import "common.css!";

QUnit.testStart(() => {
    let element = document.createElement("div");
    element.setAttribute("id", "richTextEditor");

    document.getElementById("qunit-fixture").appendChild(element);
});

import "../DevExpress.ui.widgets.editors/richTextEditorParts/markup.tests.js";
