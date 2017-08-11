"use strict";

var renderer = require("core/renderer");

QUnit.module("HTML main");

QUnit.test("base", function(assert) {
    assert.equal(renderer("<div>").html("<div></div>").html(), "<div></div>");
    assert.equal(renderer("<div>").html("<div><p>test</p></div>").html(), "<div><p>test</p></div>");
});

QUnit.test("Nearby tags", function(assert) {
    assert.equal(renderer("<div>").html("<div>1</div><div>2</div>").html(), "<div>1</div><div>2</div>");
});

QUnit.module("HTML table");

QUnit.test("Insert tbody tag", function(assert) {
    assert.equal(
        renderer("<table>").html("<tbody><tr><th></th></tr></tbody>").html(),
        "<tbody><tr><th></th></tr></tbody>");
});

QUnit.test("Insert colgroup tag", function(assert) {
    assert.equal(
        renderer("<table>").html("<colgroup></colgroup>").html(),
        "<colgroup></colgroup>");
});

QUnit.test("Insert caption tag", function(assert) {
    assert.equal(
        renderer("<table>").html("<caption></caption>").html(),
        "<caption></caption>");
});

QUnit.test("Insert thead tag", function(assert) {
    assert.equal(
        renderer("<table>").html("<thead></thead>").html(),
        "<thead></thead>");
});

QUnit.test("Insert tfoot tag", function(assert) {
    assert.equal(
        renderer("<table>").html("<tfoot></tfoot>").html(),
        "<tfoot></tfoot>");
});

QUnit.test("Insert tr tag", function(assert) {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    assert.equal(
        renderer(tbody).html("<tr><th></th></tr>").html(),
        "<tr><th></th></tr>");
});

QUnit.test("Insert into table tag", function(assert) {
    var table = document.createElement("table");
    var colgroup = document.createElement("colgroup");
    table.appendChild(colgroup);

    assert.equal(
        renderer(colgroup).html("<col>").html(),
        "<col>");
});

QUnit.test("Insert th tag", function(assert) {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    table.appendChild(tbody);
    tbody.appendChild(tr);

    assert.equal(
        renderer(tr).html("<th></th>").html(),
        "<th></th>");
});
QUnit.test("Insert td tag", function(assert) {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    table.appendChild(tbody);
    tbody.appendChild(tr);

    assert.equal(
        renderer(tr).html("<td></td>").html(),
        "<td></td>");
});

QUnit.test("Insert thead tag", function(assert) {
    assert.equal(
        renderer("<div>").html("<thead></thead>").html(),
        "<thead></thead>");
});

QUnit.module("CSS method");

QUnit.test("Get value", function(assert) {
    var element = renderer("<div>");

    document.body.appendChild(element[0]);

    element[0].style.width = "5px";
    element[0].style.boxSizing = "border-box";
    element[0].style.border = "1px solid red";
    element[0].style.padding = "1px";
    element[0].style.margin = "100px";
    element[0].style.color = "red";

    assert.equal(element.css("width"), "5px");
    assert.equal(element.css("color"), "rgb(255, 0, 0)");
});

QUnit.test("Set value", function(assert) {
    var element = renderer("<div>");

    document.body.appendChild(element[0]);

    element.css("width", 5);
    element.css("color", "red");

    assert.equal(window.getComputedStyle(element[0])["width"], "5px");
    assert.equal(window.getComputedStyle(element[0])["color"], "rgb(255, 0, 0)");
});
