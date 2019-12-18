import $ from "jquery";

import "ui/html_editor";

const MS_BULLET_LIST = "<p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;mso-list:l1 level1 lfo1'><![if !supportLists]><span" +
"><span style='mso-list:Ignore'>·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
"</span></span></span><![endif]><span lang=EN-US style='mso-ansi-language:EN-US'>1</span><o:p></o:p></p>" +
"<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;mso-add-space:" +
"auto;text-indent:-18.0pt;mso-list:l1 level2 lfo1'><![if !supportLists]><span><span" +
"style='mso-list:Ignore'>o<span>&nbsp;&nbsp;</span></span></span><![endif]><span lang=EN-US style='mso-ansi-language:EN-US'>2</span><o:p></o:p></p>" +
"<p class=MsoListParagraphCxSpMiddle style='margin-left:108.0pt;mso-add-space:" +
"auto;text-indent:-18.0pt;mso-list:l1 level3 lfo1'><![if !supportLists]><span" +
"><span style='mso-list:Ignore'>§<span>&nbsp;" +
"</span></span></span><![endif]><span lang=EN-US style='mso-ansi-language:EN-US'>3</span><o:p></o:p></p>";

const MS_ORDERED_LIST = "<p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;mso-list:l0 level1 lfo2'><![if !supportLists]><span" +
"lang=EN-US style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;" +
"mso-ansi-language:EN-US'><span style='mso-list:Ignore'>1.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span" +
"lang=EN-US style='mso-ansi-language:EN-US'>1<o:p></o:p></span></p>" +
"<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;mso-add-space:" +
"auto;text-indent:-18.0pt;mso-list:l0 level2 lfo2'><![if !supportLists]><span" +
"lang=EN-US style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;" +
"mso-ansi-language:EN-US'><span style='mso-list:Ignore'>a.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span" +
"lang=EN-US style='mso-ansi-language:EN-US'>2<o:p></o:p></span></p>" +
"<p class=MsoListParagraphCxSpLast style='margin-left:108.0pt;mso-add-space:" +
"auto;text-indent:-108.0pt;mso-text-indent-alt:-9.0pt;mso-list:l0 level3 lfo2'><![if !supportLists]><span" +
"lang=EN-US style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;" +
"mso-ansi-language:EN-US'><span style='mso-list:Ignore'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
"</span>i.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
"</span></span></span><![endif]><span lang=EN-US style='mso-ansi-language:EN-US'>3<o:p></o:p></span></p>";

const TEXT_WITH_DECORATION = "<span style='text-decoration: underline;'>test1</span>" +
    "<span style='text-decoration: line-through;'>test2</span>" +
    "<span style='text-decoration: underline line-through;'>test3</span>";

const MS_INVALID_LIST_PARAGRAPH = "<p class='MsoListParagraphCxSpFirst'><span>test<o:p></o:p></span></p>";

const { module: testModule, test } = QUnit;

testModule("Paste from MS Word", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    test("paste bullet list with indent", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: ({ value }) => {
                    assert.equal(value, "<ul><li>1<ul><li>2<ul><li>3</li></ul></li></ul></li></ul>");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        const newDelta = instance._quillInstance.clipboard.convert(MS_BULLET_LIST);
        instance._quillInstance.setContents(newDelta);
    });

    test("paste ordered list with indent", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: ({ value }) => {
                    assert.equal(value, "<ol><li>1<ol><li>2<ol><li>3</li></ol></li></ol></li></ol>");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        const newDelta = instance._quillInstance.clipboard.convert(MS_ORDERED_LIST);
        instance._quillInstance.setContents(newDelta);
    });

    test("paste list paragraph without styles", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: ({ value }) => {
                    assert.equal(value, "<p>test</p>");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        const newDelta = instance._quillInstance.clipboard.convert(MS_INVALID_LIST_PARAGRAPH);
        instance._quillInstance.setContents(newDelta);
    });
});

testModule("Text with decoration", () => {
    test("paste text with text-decoration style", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: ({ value }) => {
                    assert.equal(value, "<p><u>test1</u><s>test2<u>test3</u></s></p>", "correct value");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        const newDelta = instance._quillInstance.clipboard.convert(TEXT_WITH_DECORATION);
        instance._quillInstance.setContents(newDelta);
    });
});
