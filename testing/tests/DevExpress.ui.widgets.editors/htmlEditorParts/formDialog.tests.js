import $ from "jquery";

import FormDialog from "ui/html_editor/ui/formDialog";
import { isPromise } from "core/utils/type";
import keyboardMock from "../../../helpers/keyboardMock.js";

const DIALOG_CLASS = "dx-formdialog";
const FORM_CLASS = "dx-formdialog-form";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#htmlEditor");
        this.componentMock = {
            _createComponent: ($container, Widget, options) => {
                return new Widget($container, options);
            },
            $element: () => {
                return this.$element;
            }
        };
    }
};

const { test } = QUnit;

QUnit.module("FormDialog", moduleConfig, () => {
    test("render FormDialog", (assert) => {
        const formDialog = new FormDialog(this.componentMock);
        const $dialog = this.$element.find(`.${DIALOG_CLASS}`);
        const $form = $dialog.find(`.${FORM_CLASS}`);

        assert.ok(formDialog, "constructor return an instance");
        assert.equal($dialog.length, 1, "There is element with the FormDialog class");
        assert.equal($form.length, 1, "There is element with the Form class inside FormDialog");
    });

    test("render FormDialog with popup options", (assert) => {
        const formDialog = new FormDialog(this.componentMock, { width: 155 });

        assert.equal(formDialog.popupOption("width"), 155, "Custom width should apply");
    });

    test("show dialog", (assert) => {
        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name", "age"] });
        const formItemsCount = this.$element.find(`.${FORM_CLASS} .dx-field-item`).length;

        assert.ok(isPromise(promise), "show returns a promise");
        assert.equal(formItemsCount, 2, "2 form items are rendered");
    });

    test("confirm dialog by api", (assert) => {
        assert.expect(1);

        const EXPECTED_DATA = { name: "Test", age: 20 };
        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name", "age"] });

        promise.done((formData) => {
            assert.deepEqual(formData, EXPECTED_DATA, "new data is correct");
        });

        formDialog.hide(EXPECTED_DATA);
    });

    test("confirm dialog by Enter key press", (assert) => {
        assert.expect(1);

        const EXPECTED_DATA = { name: "Test" };
        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name"] });
        const $input = $(`.${FORM_CLASS} .dx-texteditor-input`);

        promise.done((formData) => {
            assert.deepEqual(formData, EXPECTED_DATA, "new data is correct");
        });

        keyboardMock($input).type("Test").change().press("enter");
    });

    test("confirm dialog by button", (assert) => {
        assert.expect(1);

        const EXPECTED_DATA = { name: "Test" };
        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name"] });
        const $input = $(`.${FORM_CLASS} .dx-texteditor-input`);

        promise.done((formData) => {
            assert.deepEqual(formData, EXPECTED_DATA, "new data is correct");
        });

        keyboardMock($input).type("Test").change();

        $(`.${DIALOG_CLASS} .dx-button-has-text`)
            .first()
            .trigger("dxclick");
    });

    test("decline dialog by button click", (assert) => {
        assert.expect(1);

        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name"] });
        const $input = $(`.${FORM_CLASS} .dx-texteditor-input`);

        promise.fail((formData) => {
            assert.notOk(formData, "There is no data");
        });

        keyboardMock($input).type("Test").change();

        $(`.${DIALOG_CLASS} .dx-button-has-text`)
            .last()
            .trigger("dxclick");
    });

    test("decline dialog on hiding", (assert) => {
        assert.expect(1);

        const formDialog = new FormDialog(this.componentMock, { container: this.$element });
        const promise = formDialog.show({ items: ["name"] });
        const $input = $(`.${FORM_CLASS} .dx-texteditor-input`);

        promise.fail((formData) => {
            assert.notOk(formData, "There is no data");
        });

        keyboardMock($input).type("Test").change();

        formDialog._popup.hide();
    });
});
