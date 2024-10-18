import $ from 'jquery';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="component"></div>';

    $('#qunit-fixture').html(markup);
});

import './chatParts/header.markup.tests.js';
import './chatParts/avatar.markup.tests.js';
import './chatParts/messageBox.markup.tests.js';
import './chatParts/messageBubble.markup.tests.js';
import './chatParts/messageGroup.markup.tests.js';
import './chatParts/messageList.markup.tests.js';
import './chatParts/errorList.markup.tests.js';
import './chatParts/chat.markup.tests.js';
