import $ from 'jquery';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="component"></div>';

    $('#qunit-fixture').html(markup);
});

import './chatParts/header.tests.js';
import './chatParts/avatar.tests.js';
import './chatParts/messageBox.tests.js';
import './chatParts/messageBubble.tests.js';
import './chatParts/messageGroup.tests.js';
import './chatParts/messageList.tests.js';
import './chatParts/chat.tests.js';
