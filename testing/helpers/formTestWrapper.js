import $ from 'jquery';

class FormTestWrapper {
    constructor(colCount, items) {
        const $form = $('#form').dxForm({
            width: 1000,
            screenByWidth: () => {
                return 'md';
            },
            colCountByScreen: {
                md: colCount
            },
            items
        });

        $form.find('*').css('font-family', 'Arial');

        this.epsilon = 0.1;
        this.$form = $form;
    }

    checkFormSize(expected) {
        const elementRect = this.$form.get(0).getBoundingClientRect();
        QUnit.assert.roughEqual(elementRect.width, expected.width, this.epsilon, 'form width');
        QUnit.assert.roughEqual(elementRect.height, expected.height, this.epsilon, 'form height');
    }

    checkElementPosition($element, expected) {
        const elementRect = $element.get(0).getBoundingClientRect();
        const containerRect = this.$form.get(0).getBoundingClientRect();

        QUnit.assert.roughEqual(elementRect.top - containerRect.top, expected.top, this.epsilon, 'top element offset');
        QUnit.assert.roughEqual(elementRect.left - containerRect.left, expected.left, this.epsilon, 'left element offset');

        QUnit.assert.roughEqual(elementRect.width, expected.width, this.epsilon, 'element width');
        QUnit.assert.roughEqual(elementRect.height, expected.height, this.epsilon, 'element height');
    }
}

export default FormTestWrapper;
