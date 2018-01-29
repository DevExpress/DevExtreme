"use strict";
var fixture = document.getElementById("qunit-fixture");
fixture.className = "dx-viewport";
window.includeThemesLinks();

var themes = require("ui/themes");

QUnit.test("theme changing", function(assert) {
    var originalTheme = themes.current();
    themes.current("android5.light");

    assert.equal(themes.current(), "android5.light");
    assert.equal(fixture.classList.toString(), [
        "dx-viewport",
        "dx-device-desktop",
        "dx-device-generic",
        "dx-theme-android5",
        "dx-theme-android5-typography",
        "dx-color-scheme-light"
    ].join(" "));

    themes.current(originalTheme);
});
