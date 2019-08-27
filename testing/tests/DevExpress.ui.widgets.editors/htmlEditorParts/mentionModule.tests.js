import $ from "jquery";

import MentionFormat from "ui/html_editor/formats/mention";
import Mentions from "ui/html_editor/modules/mentions";

import { noop } from "core/utils/common";
import devices from "core/devices";
import browser from "core/utils/browser";
import { Event as dxEvent } from "events";

const SUGGESTION_LIST_CLASS = "dx-suggestion-list";
const LIST_ITEM_CLASS = "dx-list-item";
const FOCUSED_STATE_CLASS = "dx-state-focused";

const KEY_CODES = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32
};

const POPUP_HIDING_TIMEOUT = 500;
const IS_EDGE_BROWSER = browser.msie && parseInt(browser.version) > 11;

const APPLY_VALUE_KEYS = [{ key: "Enter", code: KEY_CODES.ENTER }, { key: "Space", code: KEY_CODES.SPACE }];

const INSERT_DEFAULT_MENTION_DELTA = { ops: [{ insert: "@" }] };
const INSERT_HASH_MENTION_DELTA = { ops: [{ insert: "#" }] };
const INSERT_TEXT_DELTA = { ops: [{ insert: "Text" }] };

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#htmlEditor");

        this.log = [];

        this.$element.on("keydown", ({ which }) => {
            const handlers = this.quillMock.keyboard.bindings[which];
            if(handlers) {
                handlers.forEach((handler) => {
                    handler();
                });
            }
        });

        this.quillMock = {
            insertEmbed: (position, format, value) => {
                this.log.push({ position, format, value });
            },
            getContents: () => { return { ops: [{ insert: " " }] }; },
            getLength: () => 0,
            getBounds: () => { return { left: 0, bottom: 0 }; },
            root: this.$element.get(0),
            getModule: noop,
            getSelection: () => { return { index: 1, length: 0 }; },
            setSelection: (index) => { this.log.push({ operation: "setSelection", index }); },
            getFormat: noop,
            on: noop,
            deleteText: (index, length) => { this.log.push({ operation: "deleteText", index, length }); },
            insertText: (index, text, source) => { this.log.push({ operation: "insertText", index, text, source }); },
            keyboard: {
                addBinding: ({ key }, handler) => {

                    if(!this.quillMock.keyboard.bindings[key]) {
                        this.quillMock.keyboard.bindings[key] = [];
                    }

                    this.quillMock.keyboard.bindings[key].push(handler);
                },
                bindings: {
                    13: [noop]
                }
            }
        };

        this.options = {
            mentions: [{
                dataSource: ["Alex", "John", "Freddy", "Sam"]
            }],
            editorInstance: {
                addCleanCallback: noop,
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };

        this.complexDataOptions = {
            mentions: [{
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
                }
            }],
            editorInstance: this.options.editorInstance
        };

        this.severalMarkerOptions = {
            mentions: [{
                dataSource: ["Alex", "John", "Stew", "Lola", "Nancy"]
            }, {
                dataSource: [4421, 5422, 2245, 6632],
                marker: "#"
            }],
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
            marker: "@",
            id: "JohnSm"
        };
        const element = MentionFormat.create(data);

        assert.strictEqual(element.dataset.marker, "@", "correct marker");
        assert.strictEqual(element.dataset.mentionValue, "John Smith", "correct value");
        assert.strictEqual(element.dataset.id, "JohnSm", "correct id");
        assert.strictEqual(element.innerText, "@John Smith", "correct inner text");
    });

    test("Get data from element", (assert) => {
        const markup = "<span class='dx-mention' data-marker=@ data-mention-value='John Smith' data-id='JohnSm'><span>@</span>John Smith</span>";
        const element = $(markup).get(0);
        const data = MentionFormat.value(element);

        assert.deepEqual(data, { value: "John Smith", marker: "@", id: "JohnSm" }, "Correct data");
    });

    test("Change default marker", (assert) => {
        const data = {
            value: "John Smith",
            marker: "#",
            id: "JohnSm"
        };

        const element = MentionFormat.create(data);
        assert.strictEqual(element.innerText, "#John Smith", "correct inner text");
    });

    test("Change default content renderer", (assert) => {
        const data = {
            value: "John Smith",
            marker: "@",
            id: "JohnSm"
        };

        MentionFormat.addTemplate("@", {
            render: ({ container, model: mentionData }) => {
                container.innerText = "test";
                assert.deepEqual(mentionData, data);
            }
        });

        let element = MentionFormat.create(data);

        assert.strictEqual(element.innerText, "test");

        MentionFormat.removeTemplate("@");
        element = MentionFormat.create(data);

        assert.strictEqual(element.innerText, "@John Smith");
    });
});

QUnit.module("Mentions module", moduleConfig, () => {
    test("insert mention after click on item", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger("dxclick");

        this.clock.tick(POPUP_HIDING_TIMEOUT);

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
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");
        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger("dxclick");

        this.clock.tick(POPUP_HIDING_TIMEOUT);

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
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");
        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger("dxclick");
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.deepEqual(this.log, [{
            index: 0, // go to start of typing and remove the marker
            length: 1,
            operation: "deleteText"
        }, {
            format: "mention", // insert the mention to the current position
            position: 0,
            value: {
                marker: "@",
                id: "Alex",
                value: "Alex manager"
            }
        }, {
            index: 1, // insert space after the mention
            text: " ",
            operation: "insertText",
            source: "silent"
        }, {
            index: 2, // restore selection
            operation: "setSelection"
        }]);
    });

    test("changing text by user should trigger checkMentionRequest", (assert) => {
        this.quillMock.getSelection = () => { return { index: 1, length: 0 }; };

        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const mentionRequestSpy = sinon.spy(mention, "checkMentionRequest");
        const showPopupSpy = sinon.spy(mention._popup, "show");


        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "API");

        assert.ok(mentionRequestSpy.notCalled, "Ignore changing text by API");
        assert.ok(showPopupSpy.notCalled, "Popup isn't shown");

        mention.onTextChange(INSERT_TEXT_DELTA, {}, "user");

        assert.ok(mentionRequestSpy.calledOnce, "trigger mention request");
        assert.ok(showPopupSpy.notCalled, "Popup isn't shown because text doesn't contain a marker");

        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        assert.ok(mentionRequestSpy.calledTwice, "trigger mention request");
        assert.ok(showPopupSpy.calledOnce, "Show popup with suggestion list");
    });

    test("Should appear after type a marker that replaces a selected text (T730303)", (assert) => {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const showPopupSpy = sinon.spy(mention._popup, "show");

        const replaceAllDelta = { ops: [{ insert: "@" }, { delete: 2 }] };
        const replaceLastWordDelta = { ops: [{ retain: 5 }, { insert: "@" }, { delete: 1 }] };

        mention.onTextChange(replaceLastWordDelta, {}, "user");
        assert.ok(showPopupSpy.calledOnce);

        mention.onTextChange(replaceAllDelta, {}, "user");
        assert.ok(showPopupSpy.calledTwice);
    });

    test("display expression should be used in the suggestion list", (assert) => {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().text();

        assert.strictEqual(itemText, "Alex manager");
    });

    test("item template", (assert) => {
        this.complexDataOptions.mentions[0].itemTemplate = (item, index, element) => {
            $(element).text(`${item.name}@`);
        };

        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().text();
        assert.strictEqual(itemText, "Alex@");
    });

    test("several markers using", (assert) => {
        const usersCount = this.severalMarkerOptions.mentions[0].dataSource.length;
        const issueCount = this.severalMarkerOptions.mentions[1].dataSource.length;
        const mention = new Mentions(this.quillMock, this.severalMarkerOptions);

        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        let $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);

        assert.strictEqual($items.length, usersCount, "List of users");

        $items.first().trigger("dxclick");
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.deepEqual(this.log[1], {
            format: "mention",
            position: 0,
            value: {
                marker: "@",
                id: "Alex",
                value: "Alex"
            }
        }, "insert user mention");

        mention.onTextChange(INSERT_HASH_MENTION_DELTA, {}, "user");

        $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);

        assert.strictEqual($items.length, issueCount, "List of issues");

        $items.first().trigger("dxclick");
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.deepEqual(this.log[5], {
            format: "mention",
            position: 0,
            value: {
                marker: "#",
                id: 4421,
                value: 4421
            }
        }, "insert issue mention");
    });

    test("list shouldn't be focused on text input", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        this.clock.tick();
        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isFirstListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).first().hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isFirstListItemFocused);
    });

    test("trigger 'arrow down' should focus next list item", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        this.clock.tick();

        this.$element.trigger($.Event("keydown", { key: "ArrowDown", which: KEY_CODES.ARROW_DOWN }));

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isSecondListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).eq(1).hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isSecondListItemFocused);
    });

    test("list should load next page on reach end of current page", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "desktop specific test");
            return;
        }

        const items = [];
        for(let i = 0; i < 60; i++) {
            items.push(i);
        }

        if(IS_EDGE_BROWSER) {
            this.$element.css({
                fontSize: "14px"
            });
        } else {
            this.$element.css({
                fontSize: "14px",
                lineHeight: 1.35715
            });
        }

        this.options.mentions = [{
            dataSource: {
                store: items,
                pageSize: 50,
                paginate: true
            },
        }];

        const mention = new Mentions(this.quillMock, this.options);

        mention._popup.option("container", this.$element);
        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        this.clock.tick();

        let $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
        assert.strictEqual($items.length, 50);

        this.$element.trigger($.Event("keydown", { key: "ArrowUp", which: KEY_CODES.ARROW_UP }));
        $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
        const isLastItemOnPageFocused = $items.eq(49).hasClass(FOCUSED_STATE_CLASS);

        assert.ok(isLastItemOnPageFocused);
        assert.strictEqual($items.length, 60, "next page has loaded");
    });

    test("trigger 'arrow up' should focus previous list item", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        this.clock.tick();

        this.$element.trigger($.Event("keydown", { key: "ArrowUp", which: KEY_CODES.ARROW_UP }));

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isLastListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).last().hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isLastListItemFocused);
    });

    APPLY_VALUE_KEYS.forEach(({ key, code }) => {
        test(`trigger '${key}' key should select focused list item`, (assert) => {
            const mention = new Mentions(this.quillMock, this.options);

            mention.savePosition(0);
            mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");
            this.clock.tick();

            this.$element.trigger($.Event("keydown", { key, which: code }));
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
    });

    test("trigger 'escape' should close list", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");

        this.clock.tick();

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);

        this.$element.trigger($.Event("keydown", { key: "Escape", which: KEY_CODES.ESCAPE }));
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.notOk($list.is(":visible"));
    });

    test("mention char shouldn't be a part of string (e.g. e-mail)", (assert) => {
        let content = "d";

        this.quillMock.getContents = (index, length) => {
            this.log.push({ operation: "getContents", index, length });
            return { ops: [{ insert: content }] };
        };
        const mention = new Mentions(this.quillMock, this.options);
        const $list = $(`.${SUGGESTION_LIST_CLASS}`);

        mention.savePosition(0);

        mention.onTextChange({ ops: [{ insert: "@", retain: 2 }] }, {}, "user");
        assert.notOk($list.is(":visible"));
        assert.deepEqual(this.log[0], { operation: "getContents", index: 1, length: 1 });

        content = "\n";
        mention.onTextChange({ ops: [{ insert: "@", retain: 50 }] }, {}, "user");
        assert.ok($list.is(":visible"));
        assert.deepEqual(this.log[1], { operation: "getContents", index: 49, length: 1 });

        mention._popup.hide();
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        content = " ";
        mention.onTextChange({ ops: [{ insert: "@", retain: 1 }] }, {}, "user");
        assert.ok($list.is(":visible"));
        assert.deepEqual(this.log[2], { operation: "getContents", index: 0, length: 1 });
    });

    test("popup position config", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);
        mention.savePosition(0);
        const { collision, offset, of: positionTarget } = mention._popupPosition;

        assert.deepEqual(collision, {
            x: "flipfit",
            y: "flip"
        }, "Check popup position collision resolve strategy");
        assert.ok(positionTarget instanceof dxEvent, "mention positioned by event's pageX and pageY");
        assert.notOk(Object.prototype.hasOwnProperty.call(offset, "h"), "it hasn't a horizontal offset");
        assert.ok(Object.prototype.hasOwnProperty.call(offset, "v"), "it has a vertical offset");
    });

    test("popup shouldn't close on target scroll", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);
        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");
        this.clock.tick();

        $("#qunit-fixture").triggerHandler("scroll");

        assert.ok(mention._popup.option("visible"), "popup is visible after scrolling");
    });

    test("popup should update position after search", (assert) => {
        const mention = new Mentions(this.quillMock, this.options);
        const popupRepaintSpy = sinon.spy(mention._popup, "repaint");

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, "user");
        this.clock.tick();
        mention.onTextChange({ ops: [{ insert: "A" }] }, {}, "user");
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.ok(popupRepaintSpy.calledOnce, "popup has been repainted after search");
    });
});
