import markupTests from '../DevExpress.ui.widgets.htmlEditor/htmlEditorParts/markup.tests.js';

QUnit.testStart(() => {
    const element = document.createElement('div');
    element.setAttribute('id', 'htmlEditor');

    document.getElementById('qunit-fixture').appendChild(element);
});

markupTests();
