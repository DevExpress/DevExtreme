import $ from 'jquery';

class FormLayoutTestWrapper {
    constructor(colCount, options, items) {
        const wrapperOptions = $.extend({}, options, {
            width: 1000,
            screenByWidth: () => {
                return 'md';
            },
            colCountByScreen: {
                md: colCount
            },
            items
        });

        const $form = $('#form').dxForm(wrapperOptions);
        $form.find('*').css('font-family', 'Helvetica');

        this.epsilon = 3.5;
        this.$form = $form;
    }

    checkFormSize(expectedWidth, expectedHeight) {
        const elementRect = this.$form.get(0).getBoundingClientRect();
        QUnit.assert.roughEqual(elementRect.width, expectedWidth, this.epsilon, 'form width');
        QUnit.assert.roughEqual(elementRect.height, expectedHeight, this.epsilon, 'form height');
    }

    checkElementPosition($element, expectedTop, expectedLeft, expectedWidth, expectedHeight) {
        const elementRect = $element.get(0).getBoundingClientRect();
        const containerRect = this.$form.get(0).getBoundingClientRect();

        QUnit.assert.roughEqual(elementRect.top - containerRect.top, expectedTop, this.epsilon, 'top element offset');
        QUnit.assert.roughEqual(elementRect.left - containerRect.left, expectedLeft, this.epsilon, 'left element offset');

        QUnit.assert.roughEqual(elementRect.width, expectedWidth, this.epsilon, 'element width');
        QUnit.assert.roughEqual(elementRect.height, expectedHeight, this.epsilon, 'element height');
    }
}

export default FormLayoutTestWrapper;
