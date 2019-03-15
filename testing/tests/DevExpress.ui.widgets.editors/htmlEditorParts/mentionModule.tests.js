import $ from "jquery";

import MentionFormat from "ui/html_editor/formats/mention";
import Mention from "ui/html_editor/modules/mention";
import { noop } from "core/utils/common";

const SUGGESTION_LIST_CLASS = "dx-suggestion-list";

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#htmlEditor");

        this.log = [];

        this.quillMock = {
            insertEmbed: (position, format, value) => {
                this.log.push({ position, format, value });
            },
            getLength: () => 0,
            getBounds: () => { return { left: 0, bottom: 0 }; },
            root: this.$element.get(0),
            getModule: noop,
            getSelection: noop,
            setSelection: (index) => { this.log.push({ operation: "setSelection", index }); },
            getFormat: noop,
            on: noop,
            deleteText: (index, length) => { this.log.push({ operation: "deleteText", index, length }); },

        };

        this.options = {
            dataSource: ["Alex", "John", "Freddy", "Sam"],
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };

        this.complexDataOption = {
            dataSource: [{
                name: "Alex",
                position: "manager"
            }, {
                name: "John",
                position: "it"
            }],
            valueExpr: "name",
            displayExpr: ({ name, position }) => {
                return `${name} ${position}`;
            },
            editorInstance: this.options.editorInstance
        };
    },
    afterEach: () => {
        this.clock.reset();
    }
};

const { test } = QUnit;

QUnit.module("Mention format", () => {
    test("Create an element by data", (assert) => {
        const data = {
            value: "John Smith",
            marker: "@"
        };
        const element = MentionFormat.create(data);

        assert.equal(element.dataset.marker, "@", "correct marker");
        assert.equal(element.dataset.mentionValue, "John Smith", "correct value");
        assert.equal(element.innerText, "@John Smith", "correct inner text");
    });

    test("Get data from element", (assert) => {
        const markup = "<span class='dx-mention' data-marker=@ data-mention-value='John Smith'><span>@</span>John Smith</span>";
        const element = $(markup).get(0);
        const data = MentionFormat.value(element);

        assert.deepEqual(data, { value: "John Smith", marker: "@" }, "Correct data");
    });

    test("Change default marker", (assert) => {
        const data = {
            value: "John Smith",
            marker: "#"
        };

        const element = MentionFormat.create(data);
        assert.equal(element.innerText, "#John Smith", "correct inner text");
    });
});

QUnit.module("Mention module", moduleConfig, () => {
    test("insert mention after click on item", (assert) => {
        const mention = new Mention(this.quillMock, this.options);

        mention.savePosition(0);
        mention.showPopup();
        $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().trigger("dxclick");

        this.clock.tick();

        assert.deepEqual(this.log[1], {
            format: "mention",
            position: 0,
            value: {
                marker: "@",
                id: "Alex",
                value: "Alex"
            }
        }, "Correct formatting");
    });

    test("Display and value expression with complex data", (assert) => {
        const mention = new Mention(this.quillMock, this.complexDataOption);

        mention.savePosition(0);
        mention.showPopup();
        $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().trigger("dxclick");

        this.clock.tick();

        assert.deepEqual(this.log[1], {
            format: "mention",
            position: 0,
            value: {
                marker: "@",
                id: "Alex",
                value: "Alex manager"
            }
        }, "Correct formatting");
    });

    test("Insert embed content should remove marker before insert a mention and restore the selection", (assert) => {
        const mention = new Mention(this.quillMock, this.complexDataOption);

        mention.savePosition(2);
        mention.showPopup();
        $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().trigger("dxclick");
        this.clock.tick();

        assert.deepEqual(this.log, [{
            index: 1, // go to start of typing and remove the marker
            length: 1,
            operation: "deleteText"
        }, {
            format: "mention", // insert the mention to the current position
            position: 1,
            value: {
                marker: "@",
                id: "Alex",
                value: "Alex manager"
            }
        }, {
            index: 2, // restore selection
            operation: "setSelection"
        }]);
    });

    test("changing text by user should trigger checkMentionRequest", (assert) => {
        this.quillMock.getSelection = () => { return { index: 1, length: 0 }; };

        const insertMentionDelta = { ops: [{ insert: "@" }] };
        const insertTextDelta = { ops: [{ insert: "Text" }] };
        const mention = new Mention(this.quillMock, this.complexDataOption);
        const mentionRequestSpy = sinon.spy(mention, "checkMentionRequest");
        const showPopupSpy = sinon.spy(mention._popup, "show");


        mention.onTextChange(insertMentionDelta, {}, "API");

        assert.ok(mentionRequestSpy.notCalled, "Ignore changing text by API");
        assert.ok(showPopupSpy.notCalled, "Popup isn't shown");

        mention.onTextChange(insertTextDelta, {}, "user");

        assert.ok(mentionRequestSpy.calledOnce, "trigger mention request");
        assert.ok(showPopupSpy.notCalled, "Popup isn't shown because text doesn't contain a marker");

        mention.onTextChange(insertMentionDelta, {}, "user");

        assert.ok(mentionRequestSpy.calledTwice, "trigger mention request");
        assert.ok(showPopupSpy.calledOnce, "Show popup with suggestion list");
    });

    test("display expression should be used in the suggestion list", (assert) => {
        const mention = new Mention(this.quillMock, this.complexDataOption);

        mention.savePosition(2);
        mention.showPopup();

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().text();

        assert.strictEqual(itemText, "Alex manager");
    });

    test("item template", (assert) => {
        this.complexDataOption.itemTemplate = (item, index, element) => {
            $(element).text(`${item.name}@`);
        };

        const mention = new Mention(this.quillMock, this.complexDataOption);
        mention.savePosition(2);
        mention.showPopup();

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().text();
        assert.strictEqual(itemText, "Alex@");
    });
});
