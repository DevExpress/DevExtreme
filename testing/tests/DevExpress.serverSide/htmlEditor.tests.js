import 'common.css!';

QUnit.testStart(() => {
    const element = document.createElement('div');
    element.setAttribute('id', 'htmlEditor');

    document.getElementById('qunit-fixture').appendChild(element);
});

import '../DevExpress.ui.widgets.editors/htmlEditorParts/markup.tests.js';
