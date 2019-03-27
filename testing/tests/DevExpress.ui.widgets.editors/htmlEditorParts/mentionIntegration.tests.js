import $ from "jquery";

import "ui/html_editor";

const { test, module, skip } = QUnit;

const SUGGESTION_LIST_CLASS = "dx-suggestion-list";
const LIST_ITEM_CLASS = "dx-list-item";
const OVERLAY_CONTENT_CLASS = "dx-overlay-content";
const HTML_EDITOR_CONTENT = "dx-htmleditor-content";
const FOCUSED_STATE_CLASS = "dx-state-focused";

module("Mentions integration", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#htmlEditor");
        this.options = {
            mentions: [{
                dataSource: ["Alex", "John", "Freddy", "Sam"]
            }]
        };

        this.createWidget = () => {
            this.instance = this.$element
                .dxHtmlEditor(this.options)
                .dxHtmlEditor("instance");
        };

        this.getItems = () => $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    test("insert mention after click on item", (assert) => {
        const done = assert.async();
        const expectedMention = `<span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John"><span contenteditable="false"><span>@</span>John</span></span>`;
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                assert.strictEqual(value, "@", "marker has been added");
                this.getItems().eq(1).trigger("dxclick");
                this.clock.tick();
            } else {
                assert.strictEqual(value.replace(/\uFEFF/g, ""), expectedMention, "mention has been added");
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("popup position", (assert) => {
        const done = assert.async();
        const $fixture = $("#qunit-fixture");
        const fixtureLeft = $fixture.css("left");
        const valueChangeSpy = sinon.spy(() => {
            this.instance.setSelection(0, 1);
            this.clock.tick();
            const { bottom, left } = getSelection().getRangeAt(0).getBoundingClientRect();
            const overlayRect = $(`.${SUGGESTION_LIST_CLASS}`).closest(`.${OVERLAY_CONTENT_CLASS}`).get(0).getBoundingClientRect();

            assert.roughEqual(overlayRect.top, bottom, 1.2, "popup top position equals to bottom position of marker");
            assert.strictEqual(overlayRect.left, left, "popup left position equals to left position of marker");

            $fixture.css("left", fixtureLeft);
            done();
        });

        $fixture.css("left", "0px");
        this.options = {
            onValueChanged: valueChangeSpy,
            mentions: [{
                dataSource: [1, 2, 3, 4]
            }]
        };
        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("set up mentions for existed editor", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, "there're three items");
            assert.strictEqual($items.text(), "AlexJohnSam", "correct data");
            done();
        });

        this.options = { onValueChanged: valueChangeSpy };
        this.createWidget();

        this.instance.option("mentions", [{
            dataSource: ["Alex", "John", "Sam"]
        }]);

        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("reset mentions option for existed editor", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(":visible"), "list isn't visible");
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option("mentions", null);

        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("change mentions marker", (assert) => {
        const done = assert.async();
        const expectedMention = `<span class="dx-mention" spellcheck="false" data-marker="#" data-mention-value="Freddy"><span contenteditable="false"><span>#</span>Freddy</span></span>`;
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                assert.strictEqual(value, "#", "marker has been added");
                this.getItems().eq(2).trigger("dxclick");
                this.clock.tick();
            } else {
                assert.strictEqual(value.replace(/\uFEFF/g, ""), expectedMention, "mention has been added");
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option("mentions[0].marker", "#");

        this.instance.focus();
        this.$element.find("p").first().text("#");
        this.clock.tick();
    });

    test("list isn't shown for wrong marker", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(":visible"), "list isn't visible");
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option("mentions[0].marker", "#");

        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("several mention markers: first mention", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, "there're three items");
            assert.strictEqual($items.text(), "AlexJohnSam", "correct data");
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option("mentions", [{
            dataSource: ["Alex", "John", "Sam"]
        }, {
            dataSource: [1, 2],
            marker: "#"
        }]);

        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("several mention markers: second mention", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 2, "there're three items");
            assert.strictEqual($items.text(), "12", "correct data");
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option("mentions", [{
            dataSource: ["Alex", "John", "Sam"]
        }, {
            dataSource: [1, 2],
            marker: "#"
        }]);

        this.instance.focus();
        this.$element.find("p").first().text("#");
        this.clock.tick();
    });

    test("reduce mention markers", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, "there're three items");
            assert.strictEqual($items.text(), "abc", "correct data");
            done();
        });

        this.options = {
            mentions: [{
                dataSource: ["Alex", "John", "Sam"]
            }, {
                dataSource: [1, 2],
                marker: "#"
            }],
            onValueChanged: valueChangeSpy
        };
        this.createWidget();

        this.instance.option("mentions", [{
            dataSource: ["a", "b", "c"],
            marker: "*"
        }]);

        this.instance.focus();
        this.$element.find("p").first().text("*");
        this.clock.tick();
    });

    test("old marker doesn't work after reduce mention markers", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(":visible"), "list isn't visible");
            done();
        });

        this.options = {
            mentions: [{
                dataSource: ["Alex", "John", "Sam"]
            }, {
                dataSource: [1, 2],
                marker: "#"
            }],
            onValueChanged: valueChangeSpy
        };
        this.createWidget();

        this.instance.option("mentions", [{
            dataSource: ["a", "b", "c"],
            marker: "*"
        }]);

        this.instance.focus();
        this.$element.find("p").first().text("#");
        this.clock.tick();
    });

    skip("new mention should be selected after press 'enter' key", (assert) => {
        const done = assert.async();
        const expectedMention = `<span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John"><span contenteditable="false"><span>@</span>John</span></span>`;
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                const $content = this.$element.find(`.${HTML_EDITOR_CONTENT}`);

                $content.trigger($.Event("keydown", { key: "ArrowDown", which: 40 }));
                this.clock.tick();
                $content.trigger($.Event("keydown", { key: "Enter", which: 13 }));
                this.clock.tick();
            } else {
                assert.strictEqual(value.replace(/\uFEFF/g, ""), expectedMention, "mention has been added");
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    skip("arrowLeft/arrowRight keys doesn't change a caret position", () => {
        // TODO
    });

    test("list should show relevant items on typing text", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(({ component }) => {
            if(valueChangeSpy.calledOnce) {
                this.$element.find("p").get(0).innerText += "F";
                this.clock.tick(500);

                const $items = this.getItems();
                assert.strictEqual(component.option("value"), "@F", "correct value");
                assert.strictEqual($items.length, 1, "there is one relevant item");
                assert.strictEqual($items.text(), "Freddy", "correct item");
            } else {
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("first list item should be focused on filtering", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            if(valueChangeSpy.calledOnce) {
                this.$element.find("p").get(0).innerText += "F";
                this.clock.tick();
            } else {
                const $items = this.getItems();
                const isFirstListItemFocused = $items.first().hasClass(FOCUSED_STATE_CLASS);

                assert.ok(isFirstListItemFocused);
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("input text should be removed after item select", (assert) => {
        const done = assert.async();
        const expectedMention = `<span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="Freddy"><span contenteditable="false"><span>@</span>Freddy</span></span>`;
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                this.$element.find("p").get(0).innerText += "F";
                this.clock.tick();
            } else {
                const $items = this.getItems();
                $items.first().trigger("dxclick");
                this.clock.tick();
                assert.strictEqual(value.replace(/\uFEFF/g, ""), expectedMention, "mention has been added");
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("search timeout", (assert) => {
        const done = assert.async();
        const TIMEOUT = 500;
        const valueChangeSpy = sinon.spy(({ value, component }) => {
            if(valueChangeSpy.calledOnce) {
                this.$element.find("p").get(0).innerText += "F";
                this.clock.tick();

                const $items = this.getItems();
                assert.strictEqual(component.option("value"), "@", "correct value");
                assert.strictEqual($items.length, 4, "dataSource isn't filtered");

                this.clock.tick(TIMEOUT);
            } else {
                const $items = this.getItems();
                assert.strictEqual(value, "@F", "correct value");
                assert.strictEqual($items.length, 1, "there is one relevant item");
                assert.strictEqual($items.text(), "Freddy", "correct item");
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions.searchTimeout = TIMEOUT;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("minimal search length", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(({ component }) => {
            if(valueChangeSpy.calledOnce) {
                const element = this.$element.find("p").get(0);

                element.innerText += "F";
                this.clock.tick();
                let $items = this.getItems();
                assert.strictEqual($items.length, 4, "dataSource isn't filtered");

                element.innerText += "r";
                this.clock.tick();
                $items = this.getItems();

                assert.strictEqual(component.option("value"), "@Fr", "correct value");
                assert.strictEqual($items.length, 1, "there is one relevant item");
                assert.strictEqual($items.text(), "Freddy", "correct item");
            }

            if(valueChangeSpy.callCount === 2) {
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions.minSearchLength = 2;

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });

    test("search expression", (assert) => {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(({ component }) => {
            if(valueChangeSpy.calledOnce) {
                this.$element.find("p").get(0).innerText += "A";
                this.clock.tick();

                const $items = this.getItems();
                assert.strictEqual(component.option("value"), "@A", "correct value");
                assert.strictEqual($items.length, 1, "there is one relevant item");
                assert.strictEqual($items.text(), "London", "correct item");
            } else {
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions = [{
            dataSource: [
                { name: "Alex", city: "London" },
                { name: "John", city: "New York" },
                { name: "Freddy", city: "Paris" }
            ],
            searchExpr: "name",
            displayExpr: "city"
        }];

        this.createWidget();
        this.instance.focus();
        this.$element.find("p").first().text("@");
        this.clock.tick();
    });
});
