/* eslint-disable no-undef */
const testCafe = require('testcafe');

module.exports = {
    clearTestPage: async function() {
        await testCafe.ClientFunction(() => {
            const body = document.querySelector('body');

            $('#container').remove();
            $('#otherContainer').remove();

            const containerElement = document.createElement('div');
            containerElement.setAttribute('id', 'container');

            const otherContainerElement = document.createElement('div');
            otherContainerElement.setAttribute('id', 'otherContainer');

            body.prepend(otherContainerElement);
            body.prepend(containerElement);

            $('#stylesheetRules').remove();
        })();
    }
};
